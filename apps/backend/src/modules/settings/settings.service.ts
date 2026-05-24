import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany();

    return {
      data: subscriptions.map(sub => ({
        id: sub.id,
        planId: sub.planId,
        planName: sub.planName,
        price: sub.price,
        period: sub.period,
        status: sub.status,
        createdAt: sub.createdAt,
      })),
    };
  }

  async createCustomerSecret() {
    const subscription = await this.prisma.subscription.create({
      data: {
        planId: 'plan-' + Date.now(),
        planName: 'Premium Plan',
        price: '99.99',
        period: 'monthly',
      },
    });

    return {
      data: {
        id: subscription.id,
        clientSecret: 'secret-' + subscription.id,
        status: 'success',
      },
    };
  }
}
