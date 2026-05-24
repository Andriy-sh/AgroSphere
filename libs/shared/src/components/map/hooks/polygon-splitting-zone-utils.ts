import * as turf from '@turf/turf';
import {
  type ParcelWithZones,
  type PolygonProperties,
} from './polygon-splitting-constants';

export function extractZoneNumber(zoneName?: string): number | null {
  if (!zoneName) {
    return null;
  }

  const match = zoneName.match(/(\d+)/);
  if (!match) {
    return null;
  }

  const parsed = parseInt(match[1], 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getNextZoneName(
  parcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>,
  zoneNameCounterRef: React.MutableRefObject<number>,
  extractZoneNumberFn: (zoneName?: string) => number | null
): string {
  const parcel = parcelWithZonesRef.current;

  if (parcel && parcel.zones.length > 0) {
    const maxExisting = parcel.zones.reduce((max, zone) => {
      const num = extractZoneNumberFn(zone.zoneName);
      if (num === null) {
        return max;
      }
      return Math.max(max, num);
    }, 0);

    if (maxExisting > zoneNameCounterRef.current) {
      zoneNameCounterRef.current = maxExisting;
    }
  }

  zoneNameCounterRef.current += 1;
  return `Zone ${zoneNameCounterRef.current}`;
}

export function updateParcelArea(
  parcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>,
  setParcelArea: (area: number) => void
): void {
  const parcel = parcelWithZonesRef.current;

  if (parcel && parcel.zones && parcel.zones.length > 0) {
    const totalArea = parcel.zones.reduce((sum, zone) => {
      return sum + (zone.area || 0);
    }, 0);
    setParcelArea(totalArea / 10000);
    return;
  }

  if (parcel && parcel.area) {
    setParcelArea(parcel.area / 10000);
    return;
  }

  setParcelArea(0);
}

export function getSelectedZoneInfo(
  selectedZoneId: string | null,
  zonesDataRef: React.MutableRefObject<GeoJSON.FeatureCollection>
): {
  zone_name: string;
  area: string;
  zone_id: string;
} | null {
  const selectedFeature = zonesDataRef.current.features.find(
    (f) => (f.properties as PolygonProperties).zone_id === selectedZoneId
  );

  if (!selectedFeature) return null;

  const props = selectedFeature.properties as PolygonProperties;

  return {
    zone_name: props.zone_name || '',
    area: props.area ? (props.area / 10000).toFixed(2) : '0.00',
    zone_id: props.zone_id || '',
  };
}
