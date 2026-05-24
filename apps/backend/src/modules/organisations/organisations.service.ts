import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganisationsService {
  constructor(private prisma: PrismaService) {}

  async createOrganisation(data: any) {
    const organisation = await this.prisma.organisation.create({
      data: {
        name: data.name || 'New Organisation',
      },
    });

    return {
      data: {
        id: organisation.id,
        name: organisation.name,
        created_at: organisation.createdAt,
      },
      meta: {
        version: '1',
      },
    };
  }
}
