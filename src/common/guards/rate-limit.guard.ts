import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
private readonly LIMIT = 100; // requests
  private readonly WINDOW = 60; // seconds

  constructor(private redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Public routes (signup/login) → skip
    if (!user || !user.tenantId) {
      return true;
    }

    const tenantId = user.tenantId;
    const route = request.route?.path || 'unknown';

    const key = `ratelimit:${tenantId}:${route}`;

    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.expire(key, this.WINDOW);
    }

    if (current > this.LIMIT) {
      throw new HttpException(
        `Rate limit exceeded. Max ${this.LIMIT} req/min`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
