import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ParcelsService } from './parcels.service';

@Controller('farms/:farmId/parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Post()
  async createParcel(@Param('farmId') farmId: string, @Body() data: any) {
    return this.parcelsService.createParcel(farmId, data);
  }

  @Get(':parcelId')
  async getParcel(
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string
  ) {
    return this.parcelsService.getParcel(farmId, parcelId);
  }

  @Put(':parcelId')
  async updateParcel(
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string,
    @Body() data: any
  ) {
    return this.parcelsService.updateParcel(farmId, parcelId, data);
  }

  @Delete(':parcelId')
  async deleteParcel(
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string
  ) {
    return this.parcelsService.deleteParcel(farmId, parcelId);
  }
}
