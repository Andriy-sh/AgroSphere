import type { Feature as GeoJsonFeature } from 'geojson';
import type { MapCoordinates } from '../types';
import { ensureClosedRing, normalizePosition } from './coordinate-helpers';

export const convertFeatureToMultiPolygon = (
  feature: GeoJsonFeature
): MapCoordinates => {
  const geometry = feature.geometry;

  if (!geometry) {
    return [];
  }

  if (geometry.type === 'Polygon') {
    const polygons = (geometry.coordinates as number[][][]).map((ring) =>
      ensureClosedRing(
        ring.map((position) => normalizePosition(position as number[]))
      )
    );

    return [polygons];
  }

  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates as number[][][][]).map((polygon) =>
      polygon.map((ring) =>
        ensureClosedRing(
          ring.map((position) => normalizePosition(position as number[]))
        )
      )
    );
  }

  return [];
};

export const mergeFeaturePolygons = (
  features: GeoJsonFeature[] | undefined
): MapCoordinates => {
  if (!features || features.length === 0) {
    return [];
  }

  return features.reduce<MapCoordinates>((accumulator, feature) => {
    const polygons = convertFeatureToMultiPolygon(feature);
    if (polygons.length > 0) {
      polygons.forEach((polygon) => {
        accumulator.push(polygon);
      });
    }
    return accumulator;
  }, []);
};

