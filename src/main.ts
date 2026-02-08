import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { UsageGuard } from './common/guards/usage.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalGuards(
  app.get(JwtAuthGuard),
  app.get(RateLimitGuard),
  app.get(UsageGuard),
  new RolesGuard(reflector),
);


  await app.listen(3000);
}
bootstrap();
