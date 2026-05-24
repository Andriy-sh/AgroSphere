import type {
  ParcelItem,
  FarmItem,
  FarmMarker,
  ParcelData,
} from '@@agrosphere/shared';
import type {
  ViewParcelFormParcelData,
  ViewParcelData,
  Coordinate,
} from '../types';
import { ensureClosedRing, calculateCentroid } from './parcel-geometry';
import { findItemInTree } from '../../my-farm/utils/farmTree';
import {
  deserializeHistory,
  type SerializedHistoryEntry,
} from './parcel-serialization';
import { convertSampleZonesToHistory } from './convert-sample-zones-to-history';


const convertSoilTypeFromApi = (soilType: string | undefined): string => {
  if (!soilType) return 'mineral';
  const normalized = soilType.toLowerCase().trim();
  if (normalized === 'mineral_soil') {
    return 'mineral';
  }
  if (normalized === 'peat') {
    return 'peat';
  }
  if (normalized === 'mineral') {
    return 'mineral';
  }
  return 'mineral';
};

export const cloneParcelData = (parcel: ViewParcelData): ViewParcelData => ({
  ...parcel,
  geometry: parcel.geometry.map(
    (coordinate) => [...coordinate] as [number, number]
  ),
  center: [...parcel.center] as [number, number],
  history: parcel.history.map((entry) => ({
    ...entry,
    createdAt: new Date(entry.createdAt),
    parcelWithZones: {
      ...entry.parcelWithZones,
      parcelCoordinates: entry.parcelWithZones.parcelCoordinates.map(
        (coordinate) => [...coordinate] as [number, number]
      ),
      zones: entry.parcelWithZones.zones.map((zone) => ({
        ...zone,
        coordinates: zone.coordinates.map(
          (coordinate) => [...coordinate] as [number, number]
        ),
      })),
      splitLines: entry.parcelWithZones.splitLines.map((line) => ({
        coordinates: line.coordinates.map(
          (coordinate) => [...coordinate] as [number, number]
        ),
      })),
    },
  })),
});

export const convertParcelItemToViewParcelData = (
  parcel: ParcelItem,
  farmName: string
): ViewParcelFormParcelData => {
  const geometry = parcel.geometry || [];
  const normalizedGeometry = ensureClosedRing(
    geometry.map((coord) => {
      if (Array.isArray(coord) && coord.length >= 2) {
        return [coord[0], coord[1]] as Coordinate;
      }
      return [0, 0] as Coordinate;
    })
  );
  const center = calculateCentroid(normalizedGeometry);

  const parcelWithHistory = parcel as ParcelItem & {
    history?: SerializedHistoryEntry[];
    item_id?: string | number;
    effectiveArea?: string | number | null;
    crop?: string;
    soilType?: string;
    soil_type?: string;
  };
  const history = parcelWithHistory.history
    ? deserializeHistory(parcelWithHistory.history)
    : [];

  const parcelCode = parcelWithHistory.item_id
    ? String(parcelWithHistory.item_id)
    : parcel.id;

  const effectiveAreaValue =
    parcelWithHistory.effectiveArea !== undefined &&
    parcelWithHistory.effectiveArea !== null
      ? typeof parcelWithHistory.effectiveArea === 'string'
        ? parcelWithHistory.effectiveArea
        : String(parcelWithHistory.effectiveArea)
      : '';

  const areaLabel =
    parcel.area !== undefined && parcel.area !== null
      ? `${parcel.area} ha`
      : '0 ha';

  const crop = parcelWithHistory.crop || 'not_set';

  const soilTypeFromParcel =
    parcelWithHistory.soilType || parcelWithHistory.soil_type;

  return {
    id: parcel.id,
    farmName: farmName,
    parcelCode: parcelCode,
    parcelName: parcel.name,
    areaLabel: areaLabel,
    effectiveArea: effectiveAreaValue,
    soilType: convertSoilTypeFromApi(soilTypeFromParcel),
    crop: crop,
    geometry: normalizedGeometry.map((coord) => [coord[0], coord[1]]),
    center: center,
    history: history,
    eosdaFieldId: (parcel as any).eosdaFieldId ?? null,
  };
};

export const findParcelInFarmItems = (
  farmItems: FarmItem[],
  parcelId: string
): { parcel: ParcelItem; farmName: string } | null => {
  for (const farm of farmItems) {
    const { item, parentFarm } = findItemInTree([farm], parcelId);
    if (item && 'type' in item && item.type !== 'group' && parentFarm) {
      return {
        parcel: item as ParcelItem,
        farmName: parentFarm.name,
      };
    }
  }
  return null;
};

export const findFarmIdByParcelId = (
  farmItems: FarmItem[],
  parcelId: string
): string | null => {
  for (const farm of farmItems) {
    const { item, parentFarm } = findItemInTree([farm], parcelId);
    if (item && 'type' in item && item.type !== 'group' && parentFarm) {
      return parentFarm.id;
    }
  }
  return null;
};

export const convertParcelDataToViewParcelData = (
  parcelData: ParcelData,
  farmName: string
): ViewParcelFormParcelData => {
  const geometry = (parcelData.boundaries || []).map((coord) => {
    if (Array.isArray(coord) && coord.length >= 2) {
      return [coord[1], coord[0]] as Coordinate;
    }
    return [0, 0] as Coordinate;
  });

  const normalizedGeometry = ensureClosedRing(geometry);
  const center = calculateCentroid(normalizedGeometry);

  const areaLabel =
    parcelData.hectare !== undefined && parcelData.hectare !== null
      ? `${parcelData.hectare} ha`
      : '0 ha';

  const parcelCode = String(parcelData.item_id);

  const parcelDataWithEffectiveArea = parcelData as ParcelData & {
    effective_area?: string | number | null;
  };
  const effectiveAreaValue =
    parcelDataWithEffectiveArea.effective_area !== undefined &&
    parcelDataWithEffectiveArea.effective_area !== null
      ? typeof parcelDataWithEffectiveArea.effective_area === 'string'
        ? parcelDataWithEffectiveArea.effective_area
        : String(parcelDataWithEffectiveArea.effective_area)
      : '';

  const crop =
    parcelData.crop && parcelData.crop.trim() !== ''
      ? parcelData.crop
      : 'not_set';

  const sampleZonesHistory = convertSampleZonesToHistory(
    parcelData.sample_zones,
    parcelData.id,
    normalizedGeometry
  );

  return {
    id: parcelData.id,
    farmName: farmName,
    parcelCode: parcelCode,
    parcelName: parcelData.name,
    areaLabel: areaLabel,
    effectiveArea: effectiveAreaValue,
    soilType: convertSoilTypeFromApi(parcelData.soil_type),
    crop: crop,
    geometry: normalizedGeometry,
    center: center,
    history: sampleZonesHistory,
    eosdaFieldId: null,
  };
};

export const convertFarmItemsToFarmMarkers = (
  farmItems: FarmItem[]
): FarmMarker[] => {
  const markers: FarmMarker[] = [];

  farmItems.forEach((farm) => {
    const latitude =
      typeof farm.lat === 'string' ? parseFloat(farm.lat) : farm.lat;
    const longitude =
      typeof farm.lng === 'string' ? parseFloat(farm.lng) : farm.lng;

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      !Number.isNaN(latitude) &&
      !Number.isNaN(longitude)
    ) {
      markers.push({
        id: farm.id,
        longitude,
        latitude,
        title: farm.name,
        status: 'active',
        type: 'farm',
        name: farm.name,
        visible: true,
      });
    }
  });

  return markers;
};
