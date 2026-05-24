import { Controller, Post, Body, Query } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  async createOrganisation(@Body() body: any, @Query() data?: any) {
    return this.organisationsService.createOrganisation(data || body);
  }
}
