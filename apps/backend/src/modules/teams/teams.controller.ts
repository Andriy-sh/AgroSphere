import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('users')
  async getTeamUsers(@Query() filters?: any) {
    return this.teamsService.getTeamUsers(filters);
  }

  @Get('invitations')
  async getInvitations(@Query() filters?: any) {
    return this.teamsService.getInvitations(filters);
  }

  @Post('users/invite')
  async inviteUsers(@Body() data: any) {
    return this.teamsService.inviteUsers(data);
  }

  @Put('users/:userId/activate')
  async activateUser(@Param('userId') userId: string) {
    return this.teamsService.activateUser(userId);
  }

  @Put('users/:userId/deactivate')
  async deactivateUser(@Param('userId') userId: string) {
    return this.teamsService.deactivateUser(userId);
  }
}
