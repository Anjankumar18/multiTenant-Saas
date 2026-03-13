import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('/metrics')
  @Public()
  metrics() {
    return this.metricsService.getMetrics();
  }
}
