import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async getClients(@Query() filters?: any) {
    return this.clientsService.getClients(filters);
  }

  @Get(':id')
  async getClientDetails(@Param('id') id: string) {
    return this.clientsService.getClientById(id);
  }

  @Post('create')
  async createClient(@Body() data: any) {
    return this.clientsService.createClient(data);
  }

  @Put(':id')
  async updateClient(@Param('id') id: string, @Body() data: any) {
    return this.clientsService.updateClient(id, data);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    return this.clientsService.deleteClient(id);
  }
}
