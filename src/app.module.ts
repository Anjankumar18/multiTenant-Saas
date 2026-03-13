import { Module,MiddlewareConsumer,NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { RedisModule } from './redis/redis.module';
import { UsageModule } from './usage/usage.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { BillingModule } from "./billing/billing.module"
import { UsageGuard } from './common/guards/usage.guard';
import { MetricsMiddleware } from './middleware/metrics.middleware';
import { MetricsModule } from './metrics/metrics.module';
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ProjectsModule,
    RedisModule,
    UsageModule,
    BillingModule,
    MetricsModule
  ],
  providers: [RateLimitGuard,UsageGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}