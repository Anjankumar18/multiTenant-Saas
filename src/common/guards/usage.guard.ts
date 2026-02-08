import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { BillingService } from '../../billing/billing.service';
import { RedisService } from '../../redis/redis.service';
import { PLAN_LIMITS } from '../../billing/plan.config';

@Injectable()
export class UsageGuard implements CanActivate {
  constructor(
    private billing: BillingService,
    private redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.tenantId) return true;

    const tenantId = user.tenantId;

    // Get subscription
    const sub = await this.billing.getSubscription(tenantId);

    if (!sub) return true;

    const plan = sub.plan;

    // Current month
    const month = new Date().toISOString().slice(0, 7);

    const key = `usage:${tenantId}:${month}`;

    const current = await this.redis.incrUsage(key);

    const limit = PLAN_LIMITS[plan].api;

    if (current > limit) {
      throw new ForbiddenException(
        `API limit exceeded. Upgrade to PRO.`,
      );
    }

    return true;
  }
}
