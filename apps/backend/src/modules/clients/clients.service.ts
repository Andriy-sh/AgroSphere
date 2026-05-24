import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async getClients(filters?: any) {
    const clients = await this.prisma.client.findMany({
      where: filters,
    });

    return {
      data: clients,
      links: {
        first: '/clients?page=1',
        last: '/clients?page=1',
        prev: null,
        next: null,
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [],
        path: '/clients',
        per_page: 50,
        to: clients.length,
        total: clients.length,
      },
      search: null,
      paginate: '50',
    };
  }

  async getClientById(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    return {
      data: client,
      meta: {
        resource: 'clients',
        version: '1',
      },
    };
  }

  async createClient(data: any) {
    const client = await this.prisma.client.create({
      data: {
        businessName: data.business_name || data.businessName,
        businessType: data.business_type || data.businessType,
        firstName: data.first_name || data.firstName,
        lastName: data.last_name || data.lastName,
        fullName: data.full_name || data.fullName,
        mobile: data.mobile,
        email: data.email,
        addressLine1: data.address_line_1 || data.addressLine1,
        addressLine2: data.address_line_2 || data.addressLine2,
        city: data.city,
        country: data.country,
        eircode: data.eircode,
        county: data.county,
        fullAddress: data.full_address || data.fullAddress,
        contactName: data.contact_name || data.contactName,
        contactRole: data.contact_role || data.contactRole,
        accountNumber: data.account_number || data.accountNumber,
        derogation: data.derogation || false,
        farmType: data.farm_type || data.farmType,
        herdNo: data.herd_no || data.herdNo,
        organic: data.organic,
        status: data.status || 'active',
      },
    });

    return { data: client };
  }

  async updateClient(id: string, data: any) {
    const client = await this.prisma.client.update({
      where: { id },
      data: {
        ...(data.business_name && { businessName: data.business_name }),
        ...(data.businessName && { businessName: data.businessName }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.mobile && { mobile: data.mobile }),
        ...(data.email && { email: data.email }),
        ...(data.city && { city: data.city }),
      },
    });

    return { client };
  }

  async deleteClient(id: string) {
    await this.prisma.client.delete({
      where: { id },
    });

    return { success: true };
  }
}
