import type { ZoningMapResponse, ParcelWithZones } from '@@agrosphere/shared';

export function convertZoningMapToParcelWithZones(
  zoningMap: ZoningMapResponse,
  parcelId: string,
  parcelCoordinates: number[][],
  drawnArea: number
): ParcelWithZones {
  const zones = zoningMap.features.map((feature, index) => {
    let coordinates: number[][] = [];

    if (feature.geometry.type === 'Polygon') {
      coordinates = (feature.geometry.coordinates as number[][][])[0];
    } else if (feature.geometry.type === 'MultiPolygon') {
      const multiPolygon = feature.geometry.coordinates as number[][][][];
      if (multiPolygon.length > 0 && multiPolygon[0].length > 0) {
        coordinates = multiPolygon[0][0];
      }
    }

    return {
      zoneId: feature.properties.zone_id || `zone-${index + 1}`,
      zoneName: feature.properties.zone_name || `Zone ${index + 1}`,
      coordinates,
      area: undefined, 
    };
  });

  return {
    parcelId,
    parcelCoordinates,
    zones,
    splitLines: [],
    area: drawnArea,
  };
}

