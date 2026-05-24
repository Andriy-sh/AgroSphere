import { apiClient } from '../../client/axios-client';
import {
  ClientsResponse,
  ClientFilters,
  ClientDetailsResponse,
  CreateClientRequest,
  CreateClientResponse,
  Client,
} from './client-types';
import { MOCK_CLIENTS } from '../../mocks/mock-data';

export class ClientService {
  private static readonly BASE_PATH = '/clients';
  private static readonly USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  static async getClients(filters?: ClientFilters): Promise<ClientsResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: MOCK_CLIENTS.data as Client[] } as any;
    }
    const response = await apiClient.instance.get(this.BASE_PATH, {
      params: filters,
    });
    return response.data;
  }

  static async getClientDetails(
    clientId: string
  ): Promise<ClientDetailsResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const client = MOCK_CLIENTS.data.find(c => c.id === clientId);
      return { data: client as any };
    }
    const response = await apiClient.instance.get(
      `${this.BASE_PATH}/${clientId}`
    );
    return response.data;
  }

  static async createClient(
    clientData: CreateClientRequest
  ): Promise<CreateClientResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: 'new-client-' + Date.now(), ...clientData } as any };
    }
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/create`,
      clientData
    );
    return response.data;
  }

  static async updateClient(
    clientId: string,
    clientData: Partial<Client>
  ): Promise<{ client: Client }> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { client: { id: clientId, ...clientData } as Client };
    }
    const response = await apiClient.instance.put(
      `${this.BASE_PATH}/${clientId}`,
      clientData
    );
    return response.data;
  }

  static async deleteClient(clientId: string): Promise<{ success: boolean }> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    const response = await apiClient.instance.delete(
      `${this.BASE_PATH}/${clientId}`
    );
    return response.data;
  }
}
