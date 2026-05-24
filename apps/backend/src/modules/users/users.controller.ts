import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('roles')
  async getUserRoles(@Query() filters?: any) {
    return this.usersService.getUserRoles(filters);
  }
}
