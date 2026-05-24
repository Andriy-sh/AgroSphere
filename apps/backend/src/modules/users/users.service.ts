import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserRoles(filters?: any) {
    const users = await this.prisma.user.findMany({
      where: filters?.tenantId ? { tenantId: filters.tenantId } : {},
    });

    return {
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        tenant: {
          id: user.tenantId || 'default',
          name: 'Default Tenant',
        },
      })),
    };
  }
}
