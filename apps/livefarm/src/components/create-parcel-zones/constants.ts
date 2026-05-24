import type { ParcelData, SelectedFarm, ZonesHistoryEntry } from './types';

export interface FarmOption {
  value: string;
  label: string;
  id?: string;
  latitude?: number;
  longitude?: number;
}

export interface SoilTypeOption {
  value: string;
  label: string;
}

export const farmOptions: FarmOption[] = [
  { value: '', label: 'Select farm' },
  {
    value: 'farm1',
    label: 'Green Valley Farm',
    id: 'farm1',
    latitude: 53.37217297055554,
    longitude: -7.945306511494124,
  },
  {
    value: 'farm2',
    label: 'Sunrise Agriculture',
    id: 'farm2',
    latitude: 53.36989042937111,
    longitude: -7.947680228482852,
  },
];

export const soilTypeOptions: SoilTypeOption[] = [
  { value: 'mineral_soil', label: 'Mineral' },
  { value: 'peat', label: 'Peat' },
];

export interface CropOption {
  value: string;
  label: string;
}

export const cropOptions: CropOption[] = [
  { value: 'grassland', label: 'Grassland' },
  { value: 'arable', label: 'Arable' },
  { value: 'other', label: 'Other' },
];

export const mockFarmsData: Record<
  string,
  { parcels: ParcelData[]; zonesHistory: ZonesHistoryEntry[] }
> = {
  farm1: {
    parcels: [
      {
        id: 'parcel-farm1-1',
        farm: 'farm1',
        farmData: {
          id: 'farm1',
          label: 'Green Valley Farm',
          latitude: 53.37217297055554,
          longitude: -7.945306511494124,
        },
        name: 'Parcel 1',
        parcelId: 'P1',
        area: '12.45',
        effectiveArea: '11.20',
        soilType: 'mineral_soil',
        drawnFeatures: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-7.945298905334937, 53.37179058252599],
                  [-7.945514317216464, 53.37184520308759],
                  [-7.945471234839829, 53.371967295854006],
                  [-7.945681261423658, 53.372092601224495],
                  [-7.9455681701860215, 53.372375340193486],
                  [-7.945627408453248, 53.37246208927368],
                  [-7.946042076324062, 53.372523134817015],
                  [-7.9462897999868005, 53.37279944512795],
                  [-7.946849870877344, 53.371681341192186],
                  [-7.945729729097167, 53.37127650322003],
                  [-7.945298905334937, 53.37179058252599],
                ],
              ],
            },
          },
        ],
        drawnArea: 12.45,
        createdAt: new Date('2024-01-15').toISOString(),
      },
    ],
    zonesHistory: [],
  },
  farm2: {
    parcels: [
      {
        id: 'parcel-farm2-1',
        farm: 'farm2',
        farmData: {
          id: 'farm2',
          label: 'Sunrise Agriculture',
          latitude: 53.36989042937111,
          longitude: -7.947680228482852,
        },
        name: 'Parcel 1',
        parcelId: 'P1',
        area: '15.30',
        effectiveArea: '14.50',
        soilType: 'peat',
        drawnFeatures: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-7.948257986938955, 53.36941490522696],
                  [-7.946970399730816, 53.36785830557443],
                  [-7.944773927433317, 53.369746302970185],
                  [-7.946709516047463, 53.37060491240382],
                  [-7.9472986082349735, 53.370102803725075],
                  [-7.946945152922154, 53.369977275630646],
                  [-7.947130296181001, 53.36978145106468],
                  [-7.947475335890061, 53.36986681060151],
                  [-7.948257986938955, 53.36941490522696],
                ],
              ],
            },
          },
        ],
        drawnArea: 15.3,
        createdAt: new Date('2024-01-20').toISOString(),
      },
    ],
    zonesHistory: [],
  },
};

