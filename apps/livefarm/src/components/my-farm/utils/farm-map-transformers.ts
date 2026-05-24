import type {
  FarmItem,
  FarmMarker,
  MapParcel,
  MapZone,
  Parcel,
  SampleZone,
  ParcelItem,
} from '@@agrosphere/shared';
import {
  isValidCoord,
  normalizePolygonToMapMultiPolygon,
} from './coordinate-utils';

export const transformFarmItemsToMarkers = (
  farmItems: FarmItem[]
): FarmMarker[] =>
  farmItems
    .filter(
      (farm): farm is FarmItem & { lat: number; lng: number } =>
        isValidCoord(farm.lat) && isValidCoord(farm.lng)
    )
    .map((farm) => ({
      id: farm.id,
      longitude: farm.lng,
      latitude: farm.lat,
      title: farm.name,
      status: 'active' as const,
      type: 'farm' as const,
      name: farm.name,
      visible: true,
    }));

const hasValidGeometry = (
  parcel: ParcelItem | { type?: string; geometry?: [number, number][] }
): parcel is ParcelItem & { geometry: [number, number][] } => {
  return (
    'geometry' in parcel &&
    'type' in parcel &&
    parcel.type !== 'group' &&
    Array.isArray(parcel.geometry) &&
    parcel.geometry.length > 0 &&
    parcel.geometry.every(
      (coord) =>
        Array.isArray(coord) &&
        coord.length >= 2 &&
        isValidCoord(coord[0]) &&
        isValidCoord(coord[1])
    )
  );
};

export const transformFarmItemsToMapParcels = (
  farmItems: FarmItem[]
): MapParcel[] =>
  farmItems.flatMap((farm) =>
    (farm.children || []).filter(hasValidGeometry).map((parcel) => ({
      id: parcel.id,
      name: parcel.name,
      area: parcel.area,
      coordinates: normalizePolygonToMapMultiPolygon(parcel.geometry),
      farmId: farm.id,
      visible: true,
      ...('eosdaFieldId' in parcel && parcel.eosdaFieldId
        ? { eosdaFieldId: parcel.eosdaFieldId as string }
        : {}),
    }))
  );

const hasValidBoundaries = (
  parcel: Parcel
): parcel is Parcel & { boundaries: [number, number][] } => {
  return (
    Array.isArray(parcel.boundaries) &&
    parcel.boundaries.length > 0 &&
    parcel.boundaries.every(
      (coord) =>
        Array.isArray(coord) &&
        coord.length >= 2 &&
        isValidCoord(coord[0]) &&
        isValidCoord(coord[1])
    )
  );
};

export const transformParcelsFromFarmData = (
  farms: Array<{ id: string; name: string; parcels?: Parcel[] }>
): MapParcel[] =>
  farms.flatMap((farm) =>
    (farm.parcels || []).filter(hasValidBoundaries).map((parcel) => {
      const hectareValue =
        typeof parcel.hectare === 'string'
          ? parseFloat(parcel.hectare)
          : parcel.hectare;
      const area =
        typeof hectareValue === 'number' && !isNaN(hectareValue)
          ? hectareValue
          : undefined;

      return {
        id: parcel.id,
        name: parcel.name,
        area: area,
        coordinates: normalizePolygonToMapMultiPolygon(parcel.boundaries),
        farmId: farm.id,
        visible: true,
      };
    })
  );

const hasValidZoneBoundaries = (
  zone: NonNullable<Parcel['sample_zones']>[number]
): zone is NonNullable<Parcel['sample_zones']>[number] & {
  boundaries: [number, number][];
} => {
  return (
    Array.isArray(zone.boundaries) &&
    zone.boundaries.length > 0 &&
    zone.boundaries.every(
      (coord) =>
        Array.isArray(coord) &&
        coord.length >= 2 &&
        isValidCoord(coord[0]) &&
        isValidCoord(coord[1])
    )
  );
};

export const transformZonesFromFarmData = (
  farms: Array<{ id: string; name: string; parcels?: Parcel[] }>
): MapZone[] =>
  farms.flatMap((farm) =>
    (farm.parcels || []).flatMap((parcel) =>
      (parcel.sample_zones || []).filter(hasValidZoneBoundaries).map((zone) => {
        const hectareValue =
          typeof zone.hectare === 'string'
            ? parseFloat(zone.hectare)
            : zone.hectare;
        const area =
          typeof hectareValue === 'number' && !isNaN(hectareValue)
            ? hectareValue
            : 0;

        return {
          id: zone.id,
          name: zone.name,
          area: area,
          cropType: zone.crop || undefined,
          coordinates: normalizePolygonToMapMultiPolygon(zone.boundaries),
          visible: true,
          farmId: farm.id,
          farmName: farm.name,
          parcelId: parcel.id,
          parcelName: parcel.name,
          zIndex: 5,
        };
      })
    )
  );
