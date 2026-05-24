import type { CreateFieldDto } from '@@agrosphere/shared';
import type { Feature as GeoJsonFeature } from 'geojson';

export function convertGeoJsonToCreateFieldDto(
  feature: GeoJsonFeature,
  parcelName: string
): CreateFieldDto | null {
  if (!feature.geometry) {
    return null;
  }

  const geometry = feature.geometry;
  if (geometry.type !== 'Polygon') {
    console.error('Only Polygon geometry is supported');
    return null;
  }

  return {
    type: 'Feature',
    properties: {
      name: parcelName,
      group: null,
      years_data: [],
    },
    geometry: {
      type: 'Polygon',
      coordinates: geometry.coordinates as number[][][],
    },
  };
}

