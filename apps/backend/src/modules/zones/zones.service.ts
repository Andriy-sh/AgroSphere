import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  async createZone(farmId: string, parcelId: string, data: any) {
    const zone = await this.prisma.zone.create({
      data: {
        farmId,
        parcelId,
        itemId: data.itemId || Math.floor(Math.random() * 100000),
        name: data.name,
        fieldNo: data.fieldNo,
        crop: data.crop || '',
        soilType: data.soilType || '',
        acre: data.acre || 0,
        hectare: data.hectare?.toString() || '0',
        boundariesX: data.boundaries?.[0] || [],
        boundariesY: data.boundaries?.[1] || [],
        boundariesXyX: data.boundaries_xy?.[0] || [],
        boundariesXyY: data.boundaries_xy?.[1] || [],
      },
    });

    return {
      data: {
        id: zone.id,
        item_id: zone.itemId,
        name: zone.name,
        field_no: zone.fieldNo,
        crop: zone.crop,
        soil_type: zone.soilType,
        acre: zone.acre,
        hectare: zone.hectare,
        boundaries: [zone.boundariesX, zone.boundariesY],
        boundaries_xy: [zone.boundariesXyX, zone.boundariesXyY],
        created_at: zone.createdAt,
      },
    };
  }

  async deleteZone(farmId: string, parcelId: string, zoneId: string) {
    await this.prisma.zone.delete({
      where: { id: zoneId },
    });

    return {
      data: {
        id: zoneId,
        deleted: true,
      },
    };
  }
}
