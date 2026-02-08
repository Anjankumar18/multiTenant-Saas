import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(tenantId: string) {
    return this.prisma.subscription.findUnique({
      where: { tenantId },
    });
  }

  async upgradeToPro(tenantId: string) {
    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        plan: 'PRO',
        status: 'ACTIVE',
        startDate: new Date(),
      },
    });
  }

  async downgradeToFree(tenantId: string) {
    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        plan: 'FREE',
      },
    });
  }
}
