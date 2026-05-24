import { Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('subscriptions')
  async getSubscriptions() {
    return this.settingsService.getSubscriptions();
  }

  @Post('subscriptions/create-intent')
  async createCustomerSecret() {
    return this.settingsService.createCustomerSecret();
  }
}
