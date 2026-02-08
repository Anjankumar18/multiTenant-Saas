import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsageFlushService } from './usage-flush.service';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  providers: [
    UsageFlushService,
  ],
})
export class UsageModule {}
