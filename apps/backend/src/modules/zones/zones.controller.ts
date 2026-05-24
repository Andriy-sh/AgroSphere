import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ZonesService } from './zones.service';

@Controller('farms/:farmId/parcels/:parcelId/zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  async createZone(
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string,
    @Body() data: any
  ) {
    return this.zonesService.createZone(farmId, parcelId, data);
  }

  @Delete(':zoneId')
  async deleteZone(
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string,
    @Param('zoneId') zoneId: string
  ) {
    return this.zonesService.deleteZone(farmId, parcelId, zoneId);
  }
}
