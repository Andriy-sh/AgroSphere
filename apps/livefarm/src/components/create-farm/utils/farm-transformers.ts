import type { FarmMarker, FarmItem } from '@@agrosphere/shared';

export function transformFarmItemsToMarkers(farmItems: FarmItem[]): FarmMarker[] {
  return farmItems
    .map((farm: FarmItem) => {
      const latitude =
        typeof farm.lat === 'string' ? parseFloat(farm.lat) : farm.lat;
      const longitude =
        typeof farm.lng === 'string' ? parseFloat(farm.lng) : farm.lng;

      if (
        latitude === undefined ||
        longitude === undefined ||
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        return null;
      }

      return {
        id: farm.id,
        longitude,
        latitude,
        title: farm.name,
        status: 'active',
        type: 'farm' as const,
        name: farm.name,
        visible: true,
      } as FarmMarker;
    })
    .filter((marker): marker is FarmMarker => marker !== null);
}
