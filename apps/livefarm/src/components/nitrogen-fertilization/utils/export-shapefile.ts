import * as shpwrite from '@mapbox/shp-write';
import type { ZonePrescription } from '../types/form-types';

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
  zones: Array<{
    [key: string]: VegetationZone;
  }>;
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
  properties: {
    zone_name: string;
    zone_area: number;
    zone_p: number;
    fertilizer: number;
    rate: number;
    kmean: number;
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

function convertToGeoJSON(
  data: VegetationMapData,
  zonePrescriptions?: ZonePrescription[]
): GeoJSONFeatureCollection {
  const features: GeoJSONFeature[] = [];

  const rateMap = new Map<string, number>();
  if (zonePrescriptions) {
    zonePrescriptions.forEach((prescription) => {
      const rate = parseFloat(prescription.rateKgHa || '0');
      rateMap.set(prescription.zoneKey, rate);
    });
  }

  data.zones.forEach((zoneObj) => {
    Object.keys(zoneObj).forEach((zoneKey) => {
      const zone = zoneObj[zoneKey] as VegetationZone;

      const coordinates = zone.geometry.coordinates as number[][][][];

      const rate = rateMap.has(zoneKey) ? rateMap.get(zoneKey) ?? 0 : 0;

      features.push({
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: coordinates,
        },
        properties: {
          zone_name: zoneKey,
          zone_area: zone.zone_area,
          zone_p: zone.zone_p,
          fertilizer: zone.fertilizer,
          rate: rate,
          kmean: zone.kmean?.[0] ?? 0,
        },
      });
    });
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}

export async function exportShapefile(
  vegetationMapData: VegetationMapData | null,
  parcelName?: string | null,
  parcelId?: string | null,
  zonePrescriptions?: ZonePrescription[]
): Promise<void> {
  if (
    !vegetationMapData ||
    !vegetationMapData.zones ||
    vegetationMapData.zones.length === 0
  ) {
    alert(
      'No vegetation map data available to export. Please calculate zones first.'
    );
    return;
  }

  try {
    const geoJSON = convertToGeoJSON(vegetationMapData, zonePrescriptions);

    const zipData = (await shpwrite.zip(geoJSON, {
      outputType: 'arraybuffer',
      compression: 'STORE',
    })) as ArrayBuffer;

    const filename =
      parcelName || parcelId
        ? `vegetation-map-${parcelName || parcelId}.zip`
        : `vegetation-map-${Date.now()}.zip`;

    const blob = new Blob([zipData], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating shapefile:', error);
    alert('Error generating shapefile. Please check the console for details.');
  }
}
