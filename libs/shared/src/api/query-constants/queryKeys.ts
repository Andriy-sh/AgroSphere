export const ORGANISATION_KEYS = {
  all: ['organisations'] as const,
  list: () => [...ORGANISATION_KEYS.all, 'list'] as const,
  details: (id: string | number) =>
    [...ORGANISATION_KEYS.all, 'detail', id] as const,
};

export const USER_KEYS = {
  all: ['users'] as const,
  roles: (filters?: { tenantId?: string }) =>
    [...USER_KEYS.all, 'roles', filters] as const,
};

export const FARMS_KEYS = {
  all: ['farms'] as const,
  lists: () => [...FARMS_KEYS.all, 'list'] as const,
  details: (id: string | number) => [...FARMS_KEYS.all, 'detail', id] as const,
};

export const PARCELS_KEYS = {
  all: ['parcels'] as const,
  details: (farmId: string | number, parcelId: string | number) =>
    [...PARCELS_KEYS.all, 'detail', farmId, parcelId] as const,
};

export const ZONES_KEYS = {
  all: ['zones'] as const,
  details: (
    farmId: string | number,
    parcelId: string | number,
    zoneId: string | number
  ) => [...ZONES_KEYS.all, 'detail', farmId, parcelId, zoneId] as const,
  list: (farmId: string | number, parcelId: string | number) =>
    [...ZONES_KEYS.all, 'list', farmId, parcelId] as const,
};
