import type { Client as ApiClient } from '@@agrosphere/shared';
import farmData from '@/data/json/farm-data.json';

export type Zone = {
  id: string;
  name: string;
  coordinates: [number, number][][][];
};

export type Field = {
  id: string;
  name: string;
  cropType: string;
  area: number;
  zones: Zone[];
};

export type Farm = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  size: number;
  cropType: string;
  fields: Field[];
};

export type CreateTaskClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tags?: string[];
  farms: Farm[];
};
function transformFarmDataToFarm(
  farmDataItem: (typeof farmData)[0],
  farmIndex: number,
  clientId: string
): Farm {
  return {
    id: `farm-${clientId}-${farmIndex}`,
    name: farmDataItem.name,
    address: '',
    latitude: farmDataItem.lat,
    longitude: farmDataItem.lng,
    size: farmDataItem.area,
    cropType: 'Mixed Crops',
    fields: farmDataItem.children.map((parcel) => ({
      id: parcel.id,
      name: parcel.name,
      cropType: 'Mixed Crops',
      area: parcel.area,
      zones: [
        {
          id: `${parcel.id}-zone`,
          name: `${parcel.name} Zone`,
          coordinates: [
            [
              parcel.geometry.map(
                (coord) => [coord[0], coord[1]] as [number, number]
              ),
            ],
          ],
        },
      ],
    })),
  };
}

export function transformClientsForCreateTask(
  apiClients: ApiClient[]
): CreateTaskClient[] {
  return apiClients.map((apiClient, clientIndex) => {
    const farmIndex = clientIndex % farmData.length;
    const farmDataItem = farmData[farmIndex];

    const farm = transformFarmDataToFarm(farmDataItem, farmIndex, apiClient.id);

    if (apiClient.full_address || apiClient.address_line_1) {
      farm.address = apiClient.full_address || apiClient.address_line_1 || '';
    }

    const createTaskClient: CreateTaskClient = {
      id: apiClient.id,
      name: apiClient.name || apiClient.business_name || apiClient.full_name,
      email: apiClient.email,
      phone: apiClient.phone || apiClient.mobile,
      address: apiClient.address || apiClient.full_address || '',
      tags: apiClient.tags || [],
      farms: [farm],
    };

    return createTaskClient;
  });
}
