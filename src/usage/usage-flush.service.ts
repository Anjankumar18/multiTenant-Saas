import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsageFlushService {
  constructor(
    private redis: RedisService,
    private prisma: PrismaService,
  ) {}

  @Cron('*/5 * * * *') // every 5 minutes
  async flushUsage() {
    const keys = await this.redis.keys('usage:*');

    for (const key of keys) {
      const [, tenantId, action] = key.split(':');
      const count = await this.redis.get(key);

      if (count === 0) continue;

      await this.prisma.usage.upsert({
        where: {
          tenantId_action: { tenantId, action },
        },
        update: {
          count: { increment: count },
        },
        create: {
          tenantId,
          action,
          count,
        },
      });

      await this.redis.del(key);
    }
  }
}
