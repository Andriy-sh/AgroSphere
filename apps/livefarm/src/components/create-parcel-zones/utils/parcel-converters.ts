import type { MapParcel, MapZone, ParcelSplitLine } from '@@agrosphere/shared';
import type { Feature as GeoJsonFeature } from 'geojson';
import type { ParcelData, ZonesHistoryEntry } from '../types';
import type { MapCoordinates } from '../types';
import { ensureClosedRing, normalizePosition } from './coordinate-helpers';
import { mergeFeaturePolygons } from './geojson-converters';

export const findLatestZonesEntry = (
  history: ZonesHistoryEntry[],
  parcelId: string
): ZonesHistoryEntry | null => {
  const filtered = history.filter(
    (entry) => entry.parcelWithZones.parcelId === parcelId
  );

  if (filtered.length === 0) {
    return null;
  }

  return filtered.reduce<ZonesHistoryEntry | null>((latest, entry) => {
    if (!latest) {
      return entry;
    }

    const latestTime = new Date(latest.createdAt).getTime();
    const entryTime = new Date(entry.createdAt).getTime();

    return entryTime > latestTime ? entry : latest;
  }, filtered[0]);
};

export const buildZonesFromHistory = (
  latestHistory: ZonesHistoryEntry | null,
  parcel: ParcelData
): MapZone[] => {
  if (!latestHistory) {
    return [];
  }

  return latestHistory.parcelWithZones.zones.map((zone) => {
    const ring = ensureClosedRing(
      zone.coordinates.map((position) => normalizePosition(position))
    );

    return {
      id: zone.zoneId,
      name: zone.zoneName || zone.zoneId,
      area: zone.area,
      coordinates: [[ring]],
      fillColor: '#FFFFFF',
      borderColor: '#FFFFFF',
      fillOpacity: 0.12,
      borderWidth: 1,
      visible: true,
      parcelId: parcel.id,
      parcelName: parcel.name,
      farmId: parcel.farmData?.id,
      farmName: parcel.farmData?.label,
    };
  });
};

export const buildSplitLinesFromHistory = (
  latestHistory: ZonesHistoryEntry | null,
  parcel: ParcelData
): ParcelSplitLine[] => {
  if (!latestHistory?.parcelWithZones.splitLines) {
    return [];
  }

  return latestHistory.parcelWithZones.splitLines.map((line, index) => ({
    id: `${parcel.id}-split-${index + 1}`,
    coordinates: line.coordinates.map((position) =>
      normalizePosition(position)
    ),
  }));
};

export const buildCoordinatesFromParcel = (parcel: ParcelData): MapCoordinates => {
  const features = (parcel.drawnFeatures || []) as GeoJsonFeature[];
  const polygons = mergeFeaturePolygons(features);

  if (polygons.length > 0) {
    return polygons;
  }

  return [];
};

export const fallbackCoordinatesFromHistory = (
  latestHistory: ZonesHistoryEntry | null
): MapCoordinates => {
  if (
    !latestHistory ||
    latestHistory.parcelWithZones.parcelCoordinates.length === 0
  ) {
    return [];
  }

  const ring = ensureClosedRing(
    latestHistory.parcelWithZones.parcelCoordinates.map((position) =>
      normalizePosition(position)
    )
  );

  return [[ring]];
};

export const convertParcelDataToMapParcel = (
  parcel: ParcelData,
  zonesHistory: ZonesHistoryEntry[]
): MapParcel => {
  const latestHistory = findLatestZonesEntry(zonesHistory, parcel.id);

  let coordinates = buildCoordinatesFromParcel(parcel);

  if (coordinates.length === 0) {
    coordinates = fallbackCoordinatesFromHistory(latestHistory);
  }

  const areaString = parcel.area?.replace(/≈/g, '').trim() || '';
  const areaHa = parseFloat(areaString);
  const areaM2 = Number.isFinite(areaHa) ? areaHa * 10000 : undefined;

  let zones = buildZonesFromHistory(latestHistory, parcel);
  if (zones.length === 0 && coordinates.length > 0) {
    zones = [
      {
        id: `${parcel.id}-default-zone`,
        name: parcel.name || parcel.id,
        area: Number.isFinite(areaHa) ? areaHa : undefined,
        coordinates,
        fillColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        fillOpacity: 0.12,
        borderWidth: 1,
        visible: true,
        parcelId: parcel.id,
        parcelName: parcel.name,
        farmId: parcel.farmData?.id,
        farmName: parcel.farmData?.label,
      },
    ];
  }
  const splitLines = buildSplitLinesFromHistory(latestHistory, parcel);

  return {
    id: parcel.id,
    name: parcel.name,
    area: areaM2,
    coordinates,
    zones,
    splitLines,
    drawnFeatures: (parcel.drawnFeatures || []) as GeoJsonFeature[],
    createdAt: parcel.createdAt,
    visible: parcel.farmData ? true : false,
    farmId: parcel.farmData?.id,
  };
};

