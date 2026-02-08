import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService,
      private redis: RedisService,
  ) {}

 async create(name: string, tenantId: string, userId: string) {
    // 1️⃣ Validate tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { projects: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // 2️⃣ Enforce plan limits
    if (tenant.plan === 'FREE' && tenant.projects.length >= 3) {
      throw new ForbiddenException(
        'Project limit reached. Upgrade your plan.',
      );
    }

    // 3️⃣ Create project
    const project = await this.prisma.project.create({
      data: { name, tenantId },
    });

    // 4️⃣ AUDIT LOG (what happened)
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: 'PROJECT_CREATED',
      },
    });

    // 5️⃣ USAGE COUNTER (how many times)
    await this.prisma.usage.upsert({
      where: {
        tenantId_action: {
          tenantId,
          action: 'PROJECT_CREATED',
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        tenantId,
        action: 'PROJECT_CREATED',
        count: 1,
      },
    });

    const usageKey = `usage:${tenantId}:PROJECT_CREATED`;
    await this.redis.incr(usageKey);

    return project;
  }



  findAll(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId },
    });
  }
}
