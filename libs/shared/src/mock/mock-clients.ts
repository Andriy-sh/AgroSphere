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

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tags?: string[];
  farms: Farm[];
};

export const mockClients: Client[] = [
  {
    id: 'VqXmZF31wY',
    name: 'John Smith',
    email: 'john.smith@farmco.ie',
    phone: '+353 1 234 5678',
    address: '123 Farm Road, County Cork, Ireland',
    tags: [
      'Farm',
      'Mixed Crops',
      'Dairy',
      'Beef',
      'Pig',
      'Sheep',
      'Goat',
      'Poultry',
      'Horse',
      'Other',
    ],
    farms: [
      {
        id: 'UkLWZg9DAJ',
        name: 'Test Farm',
        address: '123 Farm Road, County Cork, Ireland',
        latitude: 53.41,
        longitude: -8.215,
        size: 42.7,
        cropType: 'Mixed Crops',
        fields: [
          {
            id: 'field-1',
            name: 'Wheat Field A',
            cropType: 'Wheat',
            area: 12.5,
            zones: [
              {
                id: 'zone-1',
                name: 'Zone A1',
                coordinates: [
                  [
                    [
                      [-8.225, 53.415],
                      [-8.205, 53.415],
                      [-8.205, 53.405],
                      [-8.225, 53.405],
                      [-8.225, 53.415],
                    ],
                  ],
                ],
              },
              {
                id: 'zone-2',
                name: 'Zone A2',
                coordinates: [
                  [
                    [
                      [-8.195, 53.41],
                      [-8.19, 53.412],
                      [-8.185, 53.413],
                      [-8.18, 53.413],
                      [-8.175, 53.412],
                      [-8.17, 53.41],
                      [-8.17, 53.408],
                      [-8.175, 53.406],
                      [-8.18, 53.405],
                      [-8.185, 53.405],
                      [-8.19, 53.406],
                      [-8.195, 53.408],
                      [-8.195, 53.41],
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
