import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsageResetService {
  constructor(private redis: RedisService) {}

  // 1st of every month
  @Cron('0 0 1 * *')
  async resetUsage() {
    const keys = await this.redis.keys('usage:*');

    for (const key of keys) {
      await this.redis.del(key);
    }
  }
}
