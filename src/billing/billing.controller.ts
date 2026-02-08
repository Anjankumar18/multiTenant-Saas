import { Controller, Get, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('billing')
export class BillingController {
  constructor(private service: BillingService) {}

  @Get('subscription')
  getSubscription(@CurrentUser() user: any) {
    return this.service.getSubscription(user.tenantId);
  }

  @Post('upgrade')
  upgrade(@CurrentUser() user: any) {
    return this.service.upgradeToPro(user.tenantId);
  }

  @Post('downgrade')
  downgrade(@CurrentUser() user: any) {
    return this.service.downgradeToFree(user.tenantId);
  }
}
