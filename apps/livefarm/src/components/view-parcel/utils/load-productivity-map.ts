import type { ParcelWithZones } from '@@agrosphere/shared';

interface ProductivityZone {
  zone_area: number;
  zone_p: number;
  fertilizer: number;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

interface ProductivityMapData {
  field_id: number;
  zmap_id: string;
  type_zmap: string;
  vegetation_index: string;
  date: string;
  zones: Array<{
    [key: string]: ProductivityZone;
  }>;
  total_fertilizer_consumption: number;
  image_link?: string;
}


export async function loadProductivityMapByFieldId(
  fieldId: string | null | undefined
): Promise<ProductivityMapData | null> {
  if (!fieldId) {
    return null;
  }

  try {
    const data = await import(`@/data/json/productivity-map-${fieldId}.json`);
    return data.default as ProductivityMapData;
  } catch (error) {
    console.warn(`Productivity map not found for field ${fieldId}:`, error);
    return null;
  }
}

export function convertProductivityMapToParcelWithZones(
  productivityMapData: ProductivityMapData,
  parcelId: string,
  parcelCoordinates: number[][],
  zonesCount?: number
): ParcelWithZones {
  const zones: ParcelWithZones['zones'] = [];

  productivityMapData.zones.forEach((zoneObj, index) => {
    if (zonesCount !== undefined && index >= zonesCount) {
      return;
    }

    const zoneKey = Object.keys(zoneObj)[0];
    const zone = zoneObj[zoneKey];
    const zoneNumber = parseInt(zoneKey.replace('zone_', ''), 10);

    if (zone.geometry && zone.geometry.coordinates) {

      const polygons: number[][][] = [];

      zone.geometry.coordinates.forEach((polygon) => {
        if (polygon.length > 0) {
          const exteriorRing = polygon[0];
          if (exteriorRing && exteriorRing.length > 0) {
            const ringCoordinates: number[][] = exteriorRing.map((coord) => {
              if (Array.isArray(coord) && coord.length >= 2) {
                return [coord[0], coord[1]];
              }
              return [0, 0];
            });
            if (ringCoordinates.length > 0) {
              polygons.push(ringCoordinates);
            }
          }
        }
      });

      if (polygons.length > 0) {
        const allCoordinates: number[][] = [];

        polygons.forEach((polygon, polyIndex) => {
          if (polyIndex > 0) {
            allCoordinates.push([Infinity, Infinity]);
          }
          allCoordinates.push(...polygon);
        });

        zones.push({
          zoneId: `zone-${zoneNumber}`,
          zoneName: `Zone ${zoneNumber + 1}`,
          coordinates: allCoordinates,
          area: zone.zone_area,
        });
      }
    }
  });

  return {
    parcelId,
    parcelCoordinates,
    zones,
    splitLines: [],
    area: undefined,
  };
}
