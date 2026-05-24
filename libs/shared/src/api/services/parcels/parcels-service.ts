import { apiClient } from '../../client/axios-client';
import {
  CreateParcelRequest,
  CreateParcelResponse,
  GetParcelResponse,
  UpdateParcelRequest,
  UpdateParcelResponse,
  DeleteParcelResponse,
} from './parcels-types';
import { MOCK_PARCELS } from '../../mocks/mock-data';

export class ParcelsService {
  private static readonly BASE_PATH = '/farms';
  private static readonly USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  static async createParcel(
    farmId: string,
    data: CreateParcelRequest
  ): Promise<CreateParcelResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: 'new-parcel-' + Date.now(), farm_id: farmId, ...data } as any };
    }
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/${farmId}/parcels`,
      data
    );

    return response.data;
  }

  static async getParcel(
    farmId: string,
    parcelId: string
  ): Promise<GetParcelResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const parcel = MOCK_PARCELS.data.find(p => p.id === parcelId && p.farm_id === farmId);
      return { data: parcel } as any;
    }
    const response = await apiClient.instance.get(
      `${this.BASE_PATH}/${farmId}/parcels/${parcelId}`
    );

    return response.data;
  }

  static async updateParcel(
    farmId: string,
    parcelId: string,
    data: UpdateParcelRequest
  ): Promise<UpdateParcelResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: parcelId, farm_id: farmId, ...data } as any };
    }
    const response = await apiClient.instance.put(
      `${this.BASE_PATH}/${farmId}/parcels/${parcelId}`,
      data
    );

    return response.data;
  }

  static async deleteParcel(
    farmId: string,
    parcelId: string
  ): Promise<DeleteParcelResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: parcelId, deleted: true } } as any;
    }
    const response = await apiClient.instance.delete(
      `${this.BASE_PATH}/${farmId}/parcels/${parcelId}`
    );

    return response.data;
  }
}
