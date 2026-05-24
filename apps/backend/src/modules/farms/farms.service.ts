import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async getFarms() {
    const farms = await this.prisma.farm.findMany({
      include: { parcels: true },
    });

    return {
      farms: farms.map(farm => ({
        ...farm,
        location: [farm.locationX, farm.locationY],
        location_xy: [farm.locationXyX, farm.locationXyY],
        item_id: farm.itemId,
        created_at: farm.createdAt,
      })),
    };
  }

  async getFarmById(id: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: { parcels: true },
    });

    return {
      farm: farm ? {
        ...farm,
        location: [farm.locationX, farm.locationY],
        location_xy: [farm.locationXyX, farm.locationXyY],
        item_id: farm.itemId,
        created_at: farm.createdAt,
      } : null,
    };
  }

  async createFarm(data: any) {
    const farm = await this.prisma.farm.create({
      data: {
        name: data.name,
        locationX: data.farmLocation?.location[0] || 0,
        locationY: data.farmLocation?.location[1] || 0,
        locationXyX: data.farmLocation?.location_xy[0] || 0,
        locationXyY: data.farmLocation?.location_xy[1] || 0,
        itemId: data.itemId || `farm-${Date.now()}`,
      },
      include: { parcels: true },
    });

    return {
      message: 'Farm created successfully',
      farm: {
        ...farm,
        location: [farm.locationX, farm.locationY],
        location_xy: [farm.locationXyX, farm.locationXyY],
        item_id: farm.itemId,
        created_at: farm.createdAt,
      },
    };
  }

  async updateFarm(id: string, data: any) {
    const farm = await this.prisma.farm.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.farmLocation && {
          locationX: data.farmLocation.location[0],
          locationY: data.farmLocation.location[1],
          locationXyX: data.farmLocation.location_xy[0],
          locationXyY: data.farmLocation.location_xy[1],
        }),
        ...(data.item_id && { itemId: data.item_id }),
      },
      include: { parcels: true },
    });

    return {
      message: 'Farm updated successfully',
      farm: {
        ...farm,
        location: [farm.locationX, farm.locationY],
        location_xy: [farm.locationXyX, farm.locationXyY],
        item_id: farm.itemId,
        created_at: farm.createdAt,
      },
    };
  }

  async deleteFarm(id: string) {
    await this.prisma.farm.delete({
      where: { id },
    });

    return undefined;
  }
}
