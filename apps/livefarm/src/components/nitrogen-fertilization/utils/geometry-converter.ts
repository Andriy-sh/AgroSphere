import type { CreateFieldDto } from '@@agrosphere/shared';

export function convertParcelGeometryToCreateFieldDto(
  geometry: number[][],
  parcelName: string
): CreateFieldDto | null {
  if (!geometry || geometry.length < 3) {
    console.error('Invalid geometry: must have at least 3 coordinates');
    return null;
  }

  const polygonCoordinates: number[][][] = [geometry];

  return {
    type: 'Feature',
    properties: {
      name: parcelName,
      group: null,
      years_data: [],
    },
    geometry: {
      type: 'Polygon',
      coordinates: polygonCoordinates,
    },
  };
}

