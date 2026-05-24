import { SelectOption, OrganizationOption } from '@@agrosphere/shared';

export const taskTypes: SelectOption[] = [
  { value: 'soil_sampling', label: 'Soil sampling' },
  { value: 'pesticide_spraying', label: 'Pesticide spraying' },
  { value: 'fertilizer_application', label: 'Fertilizer application' },
  { value: 'drainage_inspection', label: 'Drainage inspection' },
  { value: 'soil_preparation', label: 'Soil preparation' },
];

export const organizations: OrganizationOption[] = [
  {
    value: 'EfhxLZ9ck8',
    label: 'LifeFarm',
    own: true,
    distance: 2.1,
    tasks: 12,
    users: [
      {
        value: 'uw2YK1rnl0',
        label: 'Jenny Wilson',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
    ],
  },
];

export const priorities: SelectOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
];

export const labs = [
  {
    id: 1,
    hashid: null,
    name: 'FBA Labs',
    address: null,
    country: null,
    is_active: '1',
    created_at: null,
    updated_at: null,
    value: '1',
    label: 'FBA Labs',
  },
  {
    id: 2,
    hashid: null,
    name: 'Dairygold',
    address: null,
    country: null,
    is_active: '1',
    created_at: null,
    updated_at: null,
    value: '2',
    label: 'Dairygold',
  },
  {
    id: 3,
    hashid: null,
    name: 'Southern Scientific',
    address: null,
    country: null,
    is_active: '1',
    created_at: null,
    updated_at: null,
    value: '3',
    label: 'Southern Scientific',
  },
  {
    id: 4,
    hashid: null,
    name: 'IAS',
    address: null,
    country: null,
    is_active: '1',
    created_at: null,
    updated_at: null,
    value: '4',
    label: 'IAS',
  },
];

