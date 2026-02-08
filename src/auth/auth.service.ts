import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: {
    tenantName: string;
    email: string;
    password: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const tenant = await this.prisma.tenant.create({
      data: { name: data.tenantName },
    });

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    await this.prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        plan: 'FREE',
        status: 'ACTIVE',
        startDate: new Date(),
      },
    });


    return this.signToken(user.id, tenant.id, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.tenantId, user.role);
  }

  private signToken(userId: string, tenantId: string, role: string) {
    return {
      accessToken: this.jwtService.sign({
        sub: userId,
        tenantId,
        role,
      }),
    };
  }
}
