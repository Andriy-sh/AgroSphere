import type { FarmMarker, MapParcel } from '@@agrosphere/shared';
import type { FarmData, FarmDataItem } from '../types/farm-data';

export function buildParcelsFromFarmData(farmData: FarmData): MapParcel[] {
  return farmData.flatMap((farm) =>
    farm.children.map((parcel) => ({
      id: parcel.id,
      name: parcel.name,
      area: parcel.area,
      farmId: farm.id,
      coordinates: [
        [
          parcel.geometry.map(
            (point) => [point[0], point[1]] as [number, number]
          ),
        ],
      ],
      eosdaFieldId: parcel.eosdaFieldId,
    }))
  );
}

export function buildFarmsFromFarmData(farmData: FarmData): FarmMarker[] {
  return farmData
    .filter((farm): farm is FarmDataItem & { lat: number; lng: number } => {
      return typeof farm.lat === 'number' && typeof farm.lng === 'number';
    })
    .map((farm) => ({
      id: farm.id,
      latitude: farm.lat,
      longitude: farm.lng,
      title: farm.name,
      status: 'active',
      type: 'farm',
      name: farm.name,
    }));
}
