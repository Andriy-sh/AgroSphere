import { apiClient } from '../../client/axios-client';
import {
  CreateZoneRequest,
  CreateZoneResponse,
  DeleteZoneResponse,
} from './zones-types';
import { MOCK_ZONES } from '../../mocks/mock-data';

export class ZonesService {
  private static readonly BASE_PATH = '/farms';
  private static readonly USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  static async createZone(
    farmId: string,
    parcelId: string,
    data: CreateZoneRequest
  ): Promise<CreateZoneResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: 'new-zone-' + Date.now(), farm_id: farmId, parcel_id: parcelId, ...data } as any };
    }
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/${farmId}/parcels/${parcelId}/zones`,
      data
    );

    return response.data;
  }

  static async deleteZone(
    farmId: string,
    parcelId: string,
    zoneId: string
  ): Promise<DeleteZoneResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: zoneId, deleted: true } } as any;
    }
    const response = await apiClient.instance.delete(
      `${this.BASE_PATH}/${farmId}/parcels/${parcelId}/zones/${zoneId}`
    );

    return response.data;
  }
}
