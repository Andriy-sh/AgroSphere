import type { MapZone } from '@@agrosphere/shared';

interface VegetationZone {
  zone_area: number;
  zone_p: number;
  fertilizer: number;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  kmean?: number[];
}

interface VegetationMapData {
  field_id: number;
  zmap_id: string;
  type_zmap: string;
  vegetation_index: string;
  date: string;
  zones: Array<{
    [key: string]: VegetationZone;
  }>;
  total_fertilizer_consumption: number;
  image_link?: string;
}

export async function loadVegetationMapByFieldId(
  fieldId: string | null | undefined
): Promise<VegetationMapData | null> {
  if (!fieldId) {
    return null;
  }

  try {
    const data = await import(`@/data/json/vegetation-map-${fieldId}.json`);
    return data.default as VegetationMapData;
  } catch {
    return null;
  }
}

export function convertVegetationMapToMapZones(
  vegetationMapData: VegetationMapData,
  parcelId?: string,
  parcelName?: string
): MapZone[] {
  const zones: MapZone[] = [];
  const totalZones = vegetationMapData.zones.length;

  vegetationMapData.zones.forEach((zoneObj) => {
    const zoneKey = Object.keys(zoneObj)[0];
    const zone = zoneObj[zoneKey];
    const zoneNumber = parseInt(zoneKey.replace('zone_', ''), 10);

    if (zone.geometry && zone.geometry.coordinates) {
      const coordinates = zone.geometry.coordinates;
      let multiPolygon: MapZone['coordinates'] | null = null;

      try {
        if (!coordinates || coordinates.length === 0) {
          throw new Error('Empty coordinates');
        }

        const firstRing = coordinates[0];
        if (!Array.isArray(firstRing) || firstRing.length === 0) {
          throw new Error('Invalid first ring structure');
        }

        const firstCoord = firstRing[0];

        if (
          Array.isArray(firstCoord) &&
          firstCoord.length >= 2 &&
          typeof firstCoord[0] === 'number'
        ) {
          const polygon: [number, number][][] = (coordinates as number[][][])
            .map((ring: number[][]) => {
              if (!Array.isArray(ring) || ring.length < 3) {
                return null;
              }

              const convertedRing: [number, number][] = ring
                .filter(
                  (coord) =>
                    Array.isArray(coord) &&
                    coord.length >= 2 &&
                    typeof coord[0] === 'number' &&
                    typeof coord[1] === 'number' &&
                    !isNaN(coord[0]) &&
                    !isNaN(coord[1])
                )
                .map(
                  (coord: number[]) => [coord[0], coord[1]] as [number, number]
                );

              return convertedRing.length >= 3 ? convertedRing : null;
            })
            .filter((ring): ring is [number, number][] => ring !== null);

          if (polygon.length > 0) {
            multiPolygon = [polygon];
          } else {
            multiPolygon = null;
          }
        } else if (Array.isArray(firstCoord) && Array.isArray(firstCoord[0])) {
          multiPolygon = (coordinates as number[][][][])
            .map((polygon: number[][][]) => {
              if (!Array.isArray(polygon) || polygon.length === 0) {
                return null;
              }

              const convertedPolygon: [number, number][][] = polygon
                .map((ring: number[][]) => {
                  if (!Array.isArray(ring) || ring.length < 3) {
                    return null;
                  }

                  const convertedRing: [number, number][] = ring
                    .filter(
                      (coord) =>
                        Array.isArray(coord) &&
                        coord.length >= 2 &&
                        typeof coord[0] === 'number' &&
                        typeof coord[1] === 'number' &&
                        !isNaN(coord[0]) &&
                        !isNaN(coord[1])
                    )
                    .map(
                      (coord: number[]) =>
                        [coord[0], coord[1]] as [number, number]
                    );
                  return convertedRing.length >= 3 ? convertedRing : null;
                })
                .filter((ring): ring is [number, number][] => ring !== null);

              return convertedPolygon.length > 0 ? convertedPolygon : null;
            })
            .filter(
              (polygon): polygon is [number, number][][] => polygon !== null
            );
        } else {
          throw new Error(
            `Unexpected structure: firstCoord type is ${typeof firstCoord}, isArray: ${Array.isArray(
              firstCoord
            )}`
          );
        }
      } catch {
        // Ignore parsing errors for coordinates
      }

      if (
        multiPolygon &&
        multiPolygon.length > 0 &&
        multiPolygon[0] &&
        multiPolygon[0].length > 0
      ) {
        const fillColor = getZoneColor(zoneNumber, totalZones, zone.kmean?.[0]);

        zones.push({
          id: `vegetation-zone-${zoneNumber}`,
          name: `Zone ${zoneNumber}`,
          area: zone.zone_area,
          coordinates: multiPolygon,
          fillColor: fillColor,
          borderColor: fillColor,
          fillOpacity: 0.7,
          borderWidth: 2,
          visible: true,
          zIndex: 10 + zoneNumber,
          parcelId: parcelId,
          parcelName: parcelName,
        });
      }
    }
  });

  return zones;

  return zones;
}

export function getZoneColor(
  zoneNumber: number,
  totalZones: number,
  kmean?: number
): string {
  let gradientPosition: number;

  if (totalZones > 1) {
    gradientPosition = (zoneNumber - 1) / (totalZones - 1);
  } else {
    gradientPosition = 0.5;
  }

  const hue = gradientPosition * 120;

  const saturation = 80;
  const lightness = 50;

  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
}
