import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics, Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  private register = new Registry();

  public httpRequests = new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'],
  });

  constructor() {
    collectDefaultMetrics({ register: this.register });
    this.register.registerMetric(this.httpRequests);
  }

  getMetrics() {
    return this.register.metrics();
  }
}