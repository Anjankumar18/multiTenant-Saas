import { SetMetadata } from '@nestjs/common';

export const Roles = (role: 'ADMIN' | 'USER') =>
  SetMetadata('role', role);
