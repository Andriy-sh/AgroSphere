import type { FarmItem, ParcelItem } from '@@agrosphere/shared';

function normalizeCoordinate(value: string | number | undefined): number {
  if (value === undefined) {
    return 0;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return value;
}

export function normalizeParcelGeometry(
  geometry: number[][] | undefined
): [number, number][] | null {
  if (!geometry || geometry.length === 0) {
    return null;
  }

  return geometry.map(([lng, lat]) => [
    normalizeCoordinate(lng),
    normalizeCoordinate(lat),
  ]) as [number, number][];
}

export function normalizeFarmCoordinates(
  lat: string | number | undefined,
  lng: string | number | undefined
): { latitude: number; longitude: number } | null {
  const latitude = normalizeCoordinate(lat);
  const longitude = normalizeCoordinate(lng);

  if (latitude === 0 && longitude === 0) {
    return null;
  }

  return { latitude, longitude };
}

export function normalizeFarmItemsGeometry(farmItems: FarmItem[]): FarmItem[] {
  return farmItems.map((farm) => {
    const coords = normalizeFarmCoordinates(farm.lat, farm.lng);
    const normalizedFarm: FarmItem = {
      ...farm,
      lat: coords?.latitude,
      lng: coords?.longitude,
    };

    if (farm.children) {
      normalizedFarm.children = farm.children.map((parcel) => {
        if ('geometry' in parcel && parcel.geometry) {
          const normalizedGeometry = normalizeParcelGeometry(parcel.geometry);
          if (normalizedGeometry) {
            return {
              ...parcel,
              geometry: normalizedGeometry,
            } as ParcelItem;
          }
        }
        return parcel;
      });
    }

    return normalizedFarm;
  });
}
