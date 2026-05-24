import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ParcelsService {
  constructor(private prisma: PrismaService) {}

  async createParcel(farmId: string, data: any) {
    const parcel = await this.prisma.parcel.create({
      data: {
        farmId,
        itemId: data.itemId || Math.floor(Math.random() * 100000),
        name: data.name,
        fieldNo: data.fieldNo,
        crop: data.crop || '',
        soilType: data.soilType || '',
        soilTypeFormatted: data.soilType || '',
        acre: data.acre,
        hectare: data.hectare?.toString() || '0',
        boundariesX: data.boundaries?.[0] || [],
        boundariesY: data.boundaries?.[1] || [],
        boundariesXyX: data.boundaries_xy?.[0] || [],
        boundariesXyY: data.boundaries_xy?.[1] || [],
      },
      include: { zones: true },
    });

    return {
      id: parcel.id,
      item_id: parcel.itemId,
      name: parcel.name,
      field_no: parcel.fieldNo,
      crop: parcel.crop,
      soil_type: parcel.soilType,
      soil_type_formatted: parcel.soilTypeFormatted,
      acre: parcel.acre,
      hectare: parcel.hectare,
      boundaries: [parcel.boundariesX, parcel.boundariesY],
      boundaries_xy: [parcel.boundariesXyX, parcel.boundariesXyY],
      sample_zones: parcel.zones || [],
      created_at: parcel.createdAt,
    };
  }

  async getParcel(farmId: string, parcelId: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
      include: { zones: true },
    });

    return {
      data: parcel ? {
        id: parcel.id,
        item_id: parcel.itemId,
        name: parcel.name,
        field_no: parcel.fieldNo,
        crop: parcel.crop,
        soil_type: parcel.soilType,
        soil_type_formatted: parcel.soilTypeFormatted,
        acre: parcel.acre,
        hectare: parcel.hectare,
        boundaries: [parcel.boundariesX, parcel.boundariesY],
        boundaries_xy: [parcel.boundariesXyX, parcel.boundariesXyY],
        sample_zones: parcel.zones || [],
        created_at: parcel.createdAt,
      } : null,
    };
  }

  async updateParcel(farmId: string, parcelId: string, data: any) {
    const parcel = await this.prisma.parcel.update({
      where: { id: parcelId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.crop && { crop: data.crop }),
        ...(data.soilType && { soilType: data.soilType }),
        ...(data.acre && { acre: data.acre }),
        ...(data.hectare && { hectare: data.hectare?.toString() }),
        ...(data.boundaries && {
          boundariesX: data.boundaries[0],
          boundariesY: data.boundaries[1],
        }),
        ...(data.boundaries_xy && {
          boundariesXyX: data.boundaries_xy[0],
          boundariesXyY: data.boundaries_xy[1],
        }),
      },
      include: { zones: true },
    });

    return {
      message: 'Parcel updated successfully',
      data: {
        id: parcel.id,
        item_id: parcel.itemId,
        name: parcel.name,
        field_no: parcel.fieldNo,
        crop: parcel.crop,
        soil_type: parcel.soilType,
        soil_type_formatted: parcel.soilTypeFormatted,
        acre: parcel.acre,
        hectare: parcel.hectare,
        boundaries: [parcel.boundariesX, parcel.boundariesY],
        boundaries_xy: [parcel.boundariesXyX, parcel.boundariesXyY],
        sample_zones: parcel.zones || [],
        created_at: parcel.createdAt,
      },
    };
  }

  async deleteParcel(farmId: string, parcelId: string) {
    await this.prisma.parcel.delete({
      where: { id: parcelId },
    });

    return {
      data: {
        id: parcelId,
        deleted: true,
      },
    };
  }
}
