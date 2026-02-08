import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Body('name') name: string,
    @CurrentUser() user: any,
  ) {
    return this.service.create(name, user.tenantId, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user.tenantId);
  }
}
