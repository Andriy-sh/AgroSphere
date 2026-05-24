export type FieldZone = {
  value: string;
  label: string;
  area?: number;
  children?: FieldZone[];
  coordinates?: [number, number][][][];
};

export type CreateTaskFarm = {
  id: string;
  name: string;
  fields: FieldZone[];
  area?: number;
  coordinates?: [number, number];
};

export type LabOption = { value: string; label: string };

export const clientFarms: Record<string, CreateTaskFarm[]> = {
  irish_farmer: [
    {
      id: 'farm1',
      name: 'Smith Family Farm',
      area: 42.7,
      coordinates: [-8.225, 53.415],
      fields: [
        {
          value: 'field_north',
          label: 'Field A',
          area: 12.5,
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
          children: [
            {
              value: 'zone_north_east',
              label: 'Zone 1',
              area: 6.25,
              coordinates: [
                [
                  [
                    [-8.225, 53.415],
                    [-8.22, 53.415],
                    [-8.22, 53.41],
                    [-8.225, 53.41],
                    [-8.225, 53.415],
                  ],
                ],
              ],
            },
            {
              value: 'zone_north_west',
              label: 'Zone 2',
              area: 6.25,
              coordinates: [
                [
                  [
                    [-8.23, 53.415],
                    [-8.225, 53.415],
                    [-8.225, 53.41],
                    [-8.23, 53.41],
                    [-8.23, 53.415],
                  ],
                ],
              ],
            },
          ],
        },
        {
          value: 'field_south',
          label: 'Field B',
          area: 15.2,
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
          children: [
            {
              value: 'zone_south_east',
              label: 'Zone 3',
              area: 7.6,
              coordinates: [
                [
                  [
                    [-8.215, 53.415],
                    [-8.21, 53.415],
                    [-8.21, 53.41],
                    [-8.215, 53.41],
                    [-8.215, 53.415],
                  ],
                ],
              ],
            },
            {
              value: 'zone_south_west',
              label: 'Zone 4',
              area: 7.6,
              coordinates: [
                [
                  [
                    [-8.22, 53.415],
                    [-8.215, 53.415],
                    [-8.215, 53.41],
                    [-8.22, 53.41],
                    [-8.22, 53.415],
                  ],
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'farm2',
      name: 'Sunset Meadows',
      area: 38.5,
      coordinates: [-8.36, 53.51],
      fields: [
        {
          value: 'field_east',
          label: 'Field D',
          area: 12.0,
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
          children: [
            {
              value: 'zone_east_north',
              label: 'Zone 1',
              area: 6.0,
              coordinates: [
                [
                  [
                    [-8.36, 53.51],
                    [-8.355, 53.51],
                    [-8.355, 53.505],
                    [-8.36, 53.505],
                    [-8.36, 53.51],
                  ],
                ],
              ],
            },
            {
              value: 'zone_east_south',
              label: 'Zone 2',
              area: 6.0,
              coordinates: [
                [
                  [
                    [-8.365, 53.51],
                    [-8.36, 53.51],
                    [-8.36, 53.505],
                    [-8.365, 53.505],
                    [-8.365, 53.51],
                  ],
                ],
              ],
            },
          ],
        },
        {
          value: 'field_west',
          label: 'Field E',
          area: 13.5,
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
          children: [
            {
              value: 'zone_west_north',
              label: 'Zone 3',
              area: 6.75,
              coordinates: [
                [
                  [
                    [-8.35, 53.51],
                    [-8.345, 53.51],
                    [-8.345, 53.505],
                    [-8.35, 53.505],
                    [-8.35, 53.51],
                  ],
                ],
              ],
            },
            {
              value: 'zone_west_south',
              label: 'Zone 4',
              area: 6.75,
              coordinates: [
                [
                  [
                    [-8.355, 53.51],
                    [-8.35, 53.51],
                    [-8.35, 53.505],
                    [-8.355, 53.505],
                    [-8.355, 53.51],
                  ],
                ],
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const labs: LabOption[] = [
  { value: 'lab1', label: 'Lab№1' },
  { value: 'lab2', label: 'Lab№2' },
  { value: 'lab3', label: 'Lab№3' },
];

export const clients = [
  { value: 'irish_farmer', label: "Patrick O'Connor - Irish Farmer" },
];

export const taskTypes = [
  { value: 'soil', label: 'Soil sampling' },
  { value: 'spraying', label: 'Pesticide spraying' },
  { value: 'fertilization', label: 'Fertilizer application' },
  { value: 'inspection', label: 'Drainage inspection' },
  { value: 'soilPreparation', label: 'Soil preparation' },
];

export const organizations = [
  {
    value: 'life',
    label: 'LifeFarm',
    own: true,
    distance: 2.1,
    tasks: 12,
    users: [
      {
        value: 'life-jenny',
        label: 'Jenny Wilson',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        value: 'life-alex',
        label: 'Alex Smith',
        photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
      {
        value: 'life-david',
        label: 'David Miller',
        photo: 'https://randomuser.me/api/portraits/men/9.jpg',
      },
    ],
  },
  {
    value: 'boyer',
    label: 'Boyer Inc',
    distance: 5.5,
    tasks: 5,
    users: [
      {
        value: 'boyer-bob',
        label: 'Bob Brown',
        photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        value: 'boyer-anna',
        label: 'Anna White',
        photo: 'https://randomuser.me/api/portraits/women/10.jpg',
      },
    ],
  },
  {
    value: 'barrows',
    label: 'Barrows, Jast and DuBuque',
    distance: 8,
    tasks: 16,
    users: [
      {
        value: 'barrows-jenny',
        label: 'Jenny Wilson',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        value: 'barrows-alex',
        label: 'Alex Smith',
        photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
      {
        value: 'barrows-emma',
        label: 'Emma Thompson',
        photo: 'https://randomuser.me/api/portraits/women/7.jpg',
      },
    ],
  },
  {
    value: 'blackberry',
    label: 'Blackberry Advisors',
    distance: 8.6,
    tasks: 12,
    users: [
      {
        value: 'blackberry-jenny',
        label: 'Jenny Wilson',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        value: 'blackberry-alex',
        label: 'Alex Smith',
        photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
      {
        value: 'blackberry-lisa',
        label: 'Lisa Anderson',
        photo: 'https://randomuser.me/api/portraits/women/8.jpg',
      },
    ],
  },
  {
    value: 'connelly',
    label: 'Connelly LLC',
    distance: 9.0,
    tasks: 8,
    users: [
      {
        value: 'connelly-jenny',
        label: 'Jenny Wilson',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        value: 'connelly-mike',
        label: 'Mike Johnson',
        photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    ],
  },
  {
    value: 'corwin',
    label: 'Corwin-Prosacco',
    distance: 12.4,
    tasks: 8,
    users: [
      {
        value: 'corwin-sarah',
        label: 'Sarah Davis',
        photo: 'https://randomuser.me/api/portraits/women/4.jpg',
      },
      {
        value: 'corwin-tom',
        label: 'Tom Wilson',
        photo: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
    ],
  },
];

export const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
