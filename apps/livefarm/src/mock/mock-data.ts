export interface MockField {
  value: string;
  label: string;
  area: number;
  coordinates: [number, number][][];
}

export interface MockFarm {
  name: string;
  area: number;
  clientId: string;
  coordinates: [number, number];
  fields: Array<{
    value: string;
    label: string;
    area: number;
    coordinates: [number, number][][];
  }>;
}

export interface MockClient {
  value: string;
  label: string;
}

export const mockClients: MockClient[] = [
  { value: 'client1', label: 'John Smith' },
  { value: 'client2', label: 'Jane Doe' },
];

export const mockClientFarms: Record<string, MockFarm[]> = {
  client1: [
    {
      name: 'Smith Family Farm',
      area: 42.7,
      clientId: 'client1',
      coordinates: [-8.225, 53.415],
      fields: [
        {
          value: 'field1-1',
          label: 'Field A',
          area: 12.5,
          coordinates: [
            [
              [-8.23, 53.42],
              [-8.22, 53.42],
              [-8.22, 53.41],
              [-8.23, 53.41],
              [-8.23, 53.42],
            ],
          ],
        },
        {
          value: 'field1-2',
          label: 'Field B',
          area: 15.2,
          coordinates: [
            [
              [-8.22, 53.42],
              [-8.21, 53.42],
              [-8.21, 53.41],
              [-8.22, 53.41],
              [-8.22, 53.42],
            ],
          ],
        },
        {
          value: 'field1-3',
          label: 'Field C',
          area: 15.0,
          coordinates: [
            [
              [-8.23, 53.41],
              [-8.22, 53.41],
              [-8.22, 53.4],
              [-8.23, 53.4],
              [-8.23, 53.41],
            ],
          ],
        },
      ],
    },
  ],
  client2: [
    {
      name: 'Sunset Meadows',
      area: 38.5,
      clientId: 'client2',
      coordinates: [-8.36, 53.51],
      fields: [
        {
          value: 'field2-1',
          label: 'Field D',
          area: 12.0,
          coordinates: [
            [
              [-8.365, 53.515],
              [-8.355, 53.515],
              [-8.355, 53.505],
              [-8.365, 53.505],
              [-8.365, 53.515],
            ],
          ],
        },
        {
          value: 'field2-2',
          label: 'Field E',
          area: 13.5,
          coordinates: [
            [
              [-8.355, 53.515],
              [-8.345, 53.515],
              [-8.345, 53.505],
              [-8.355, 53.505],
              [-8.355, 53.515],
            ],
          ],
        },
        {
          value: 'field2-3',
          label: 'Field F',
          area: 13.0,
          coordinates: [
            [
              [-8.365, 53.505],
              [-8.355, 53.505],
              [-8.355, 53.495],
              [-8.365, 53.495],
              [-8.365, 53.505],
            ],
          ],
        },
      ],
    },
  ],
};
