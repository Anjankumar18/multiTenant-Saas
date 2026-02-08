import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { RedisModule } from './redis/redis.module';
import { UsageModule } from './usage/usage.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { BillingModule } from "./billing/billing.module"
import { UsageGuard } from './common/guards/usage.guard';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ProjectsModule,
    RedisModule,
    UsageModule,
    BillingModule
  ],
  providers: [RateLimitGuard,UsageGuard],
})
export class AppModule {}
