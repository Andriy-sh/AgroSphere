import { apiClient } from '../../client/axios-client';
import { CustomerSecretResponse, SubscriptionListResponse } from './settings-types';

export class SettingsService {
  private static readonly BASE_PATH = '/settings';

    static async getSubscriptions(): Promise<SubscriptionListResponse> {
      const response = await apiClient.instance.get(
        `${this.BASE_PATH}/subscriptions`,
      );
      return response.data;
    }

    static async createCustomerSecret(): Promise<CustomerSecretResponse> {
      const response = await apiClient.instance.post(
        `${this.BASE_PATH}/subscriptions/create-intent`,
      );
      return response.data;
    }
  
}