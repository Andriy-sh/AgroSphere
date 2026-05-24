export const mockCreateTaskClients = [
  {
    id: 'VqXmZF31wY',
    name: 'John Smith',
    email: 'john.smith@farm.com',
    phone: '+353 86 000 0001',
    address: '123 Farm Road, Rural County, ST 12345',
    farms: [
      {
        id: 'UkLWZg9DAJ',
        name: 'Smith Family Farm',
        address: '123 Farm Road, Rural County, ST 12345',
        size: 42.7,
        cropType: 'Mixed Crops',
        longitude: -8.225,
        latitude: 53.415,
        fields: [
          {
            id: 'field-1',
            name: 'Field A',
            area: 12.5,
            cropType: 'Wheat',
            zones: [
              {
                id: 'zone-1',
                name: 'Wheat Zone A',
                coordinates: [
                  [
                    [
                      [-8.23, 53.42],
                      [-8.22, 53.42],
                      [-8.22, 53.41],
                      [-8.23, 53.41],
                      [-8.23, 53.42],
                    ],
                  ],
                ],
              },
            ],
          },
          {
            id: 'field-2',
            name: 'Field B',
            area: 15.2,
            cropType: 'Corn',
            zones: [
              {
                id: 'zone-2',
                name: 'Corn Zone B',
                coordinates: [
                  [
                    [
                      [-8.22, 53.42],
                      [-8.21, 53.42],
                      [-8.21, 53.41],
                      [-8.22, 53.41],
                      [-8.22, 53.42],
                    ],
                  ],
                ],
              },
            ],
          },
          {
            id: 'field-3',
            name: 'Field C',
            area: 15.0,
            cropType: 'Barley',
            zones: [
              {
                id: 'zone-3',
                name: 'Barley Zone C',
                coordinates: [
                  [
                    [
                      [-8.23, 53.41],
                      [-8.22, 53.41],
                      [-8.22, 53.4],
                      [-8.23, 53.4],
                      [-8.23, 53.41],
                    ],
                  ],
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'client-2',
    name: 'Jane Doe',
    email: 'jane.doe@farm.com',
    phone: '+353 86 000 0002',
    address: '456 Meadow Lane, Rural County, ST 12346',
    farms: [
      {
        id: 'farm-2',
        name: 'Sunset Meadows',
        address: '456 Meadow Lane, Rural County, ST 12346',
        size: 38.5,
        cropType: 'Mixed Crops',
        longitude: -8.36,
        latitude: 53.51,
        fields: [
          {
            id: 'field-4',
            name: 'Field D',
            area: 12.0,
            cropType: 'Oats',
            zones: [
              {
                id: 'zone-1',
                name: 'Oats Zone D',
                coordinates: [
                  [
                    [
                      [-8.365, 53.515],
                      [-8.355, 53.515],
                      [-8.355, 53.505],
                      [-8.365, 53.505],
                      [-8.365, 53.515],
                    ],
                  ],
                ],
              },
            ],
          },
          {
            id: 'field-5',
            name: 'Field E',
            area: 13.5,
            cropType: 'Rye',
            zones: [
              {
                id: 'zone-2',
                name: 'Rye Zone E',
                coordinates: [
                  [
                    [
                      [-8.355, 53.515],
                      [-8.345, 53.515],
                      [-8.345, 53.505],
                      [-8.355, 53.505],
                      [-8.355, 53.515],
                    ],
                  ],
                ],
              },
            ],
          },
          {
            id: 'field-6',
            name: 'Field F',
            area: 13.0,
            cropType: 'Triticale',
            zones: [
              {
                id: 'zone-3',
                name: 'Triticale Zone F',
                coordinates: [
                  [
                    [
                      [-8.365, 53.505],
                      [-8.355, 53.505],
                      [-8.355, 53.495],
                      [-8.365, 53.495],
                      [-8.365, 53.505],
                    ],
                  ],
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export interface CreateTaskClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  farms: CreateTaskFarm[];
}

export interface CreateTaskFarm {
  id: string;
  name: string;
  address: string;
  size: number;
  cropType: string;
  longitude: number;
  latitude: number;
  fields: CreateTaskField[];
}

export interface CreateTaskField {
  id: string;
  name: string;
  area: number;
  cropType: string;
  zones: CreateTaskZone[];
}

export interface CreateTaskZone {
  id: string;
  name: string;
  coordinates: [number, number][][][];
}

export interface FormFarm {
  id: string;
  name: string;
  area: number;
  fields: Array<{
    value: string;
    label: string;
    area: number;
    children?: Array<{
      value: string;
      label: string;
    }>;
  }>;
  selectedFields: Array<{ label: string; value: string }>;
  remainingCount: number;
  total: number;
  isActive: boolean;
  clientId: string;
}
