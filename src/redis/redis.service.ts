import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));

    this.client.on('error', (err) => this.logger.error('Redis error', err));
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async get(key: string): Promise<number> {
    const val = await this.client.get(key);
    return val ? Number(val) : 0;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async incrUsage(key: string) {
    return this.client.incr(key);
  }

  async getUsage(key: string) {
    const val = await this.client.get(key);
    return Number(val || 0);
  }
}
