import farmData from '@/data/json/farm-data.json';

export interface MockField {
  value: string;
  label: string;
  area: number;
  coordinates: [number, number][][];
}

export interface MockFarm {
  name: string;
  area: number;
  fields: MockField[];
  clientId: string;
  coordinates: [number, number];
}

export interface MockClient {
  value: string;
  label: string;
}

function transformFarmDataToMockFarms(
  farms: typeof farmData,
  clientId: string
): MockFarm[] {
  return farms.map((farm) => ({
    name: farm.name,
    area: farm.area,
    clientId,
    coordinates: [farm.lng, farm.lat],
    fields: farm.children.map((parcel) => ({
      value: parcel.id,
      label: parcel.name,
      area: parcel.area,
      coordinates: [
        parcel.geometry.map(
          (coord) => [coord[0], coord[1]] as [number, number]
        ),
      ],
    })),
  }));
}

export const mockClients: MockClient[] = [
  { value: 'client1', label: 'Client 1' },
  { value: 'client2', label: 'Client 2' },
];

export const mockClientFarms: Record<string, MockFarm[]> = {
  client1: transformFarmDataToMockFarms(farmData, 'client1'),
  client2: transformFarmDataToMockFarms(farmData, 'client2'),
};
