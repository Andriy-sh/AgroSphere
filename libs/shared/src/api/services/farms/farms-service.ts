import { apiClient } from '../../client/axios-client';
import {
  CreateFarmRequest,
  CreateFarmResponse,
  GetFarmsResponse,
  GetFarmResponse,
  UpdateFarmRequest,
  UpdateFarmResponse,
} from './farms-types';
import { MOCK_FARMS } from '../../mocks/mock-data';

export class FarmsService {
  private static readonly BASE_PATH = '/farms';
  private static readonly USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  static async getFarms(): Promise<GetFarmsResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: MOCK_FARMS.data } as any;
    }
    const response = await apiClient.instance.get(this.BASE_PATH);
    return response.data;
  }

  static async getFarm(farmId: string): Promise<GetFarmResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const farm = MOCK_FARMS.data.find(f => f.id === farmId);
      return { data: farm } as any;
    }
    const response = await apiClient.instance.get(
      `${this.BASE_PATH}/${farmId}`
    );
    return response.data;
  }

  static async createFarm(
    data: CreateFarmRequest
  ): Promise<CreateFarmResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: 'new-farm-' + Date.now(), ...data } as any };
    }
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/create`,
      data
    );

    return response.data;
  }

  static async updateFarm(
    farmId: string,
    data: UpdateFarmRequest
  ): Promise<UpdateFarmResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: farmId, ...data } as any };
    }
    const response = await apiClient.instance.put(
      `${this.BASE_PATH}/${farmId}`,
      data
    );

    return response.data;
  }

  static async deleteFarm(farmId: string): Promise<void> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    await apiClient.instance.delete(`${this.BASE_PATH}/${farmId}`);
  }
}
