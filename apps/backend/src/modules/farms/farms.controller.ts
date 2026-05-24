import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FarmsService } from './farms.service';

@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Get()
  async getFarms() {
    return this.farmsService.getFarms();
  }

  @Get(':id')
  async getFarm(@Param('id') id: string) {
    return this.farmsService.getFarmById(id);
  }

  @Post('create')
  async createFarm(@Body() data: any) {
    return this.farmsService.createFarm(data);
  }

  @Put(':id')
  async updateFarm(@Param('id') id: string, @Body() data: any) {
    return this.farmsService.updateFarm(id, data);
  }

  @Delete(':id')
  async deleteFarm(@Param('id') id: string) {
    return this.farmsService.deleteFarm(id);
  }
}
