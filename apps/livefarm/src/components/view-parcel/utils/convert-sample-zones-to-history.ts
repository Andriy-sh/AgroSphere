import type { ParcelWithZones } from '@@agrosphere/shared';
import type { ViewParcelHistoryEntry } from '../types';

/**
 * Sample zone type from API response
 */
interface SampleZone {
  id: string;
  item_id: number;
  name: string;
  field_no: number | null;
  crop: string;
  soil_type: string;
  acre: number;
  hectare: string | number;
  boundaries: number[][];
  boundaries_xy: number[][];
  created_at: string;
  parcel_item_id?: unknown[] | string | null;
  is_merged?: boolean;
  is_split?: boolean;
  show_default_plan?: boolean;
  sample_plan?: number;
  lab_tests?: unknown;
}

export function convertSampleZonesToHistory(
  sampleZones: SampleZone[] | undefined,
  parcelId: string,
  parcelCoordinates: number[][]
): ViewParcelHistoryEntry[] {
  if (!sampleZones || !Array.isArray(sampleZones) || sampleZones.length === 0) {
    return [];
  }

  const zones = sampleZones.map((zone) => {
    const coordinates = (zone.boundaries || []).map((coord) => {
      if (Array.isArray(coord) && coord.length >= 2) {
        return [coord[1], coord[0]] as [number, number];
      }
      return [0, 0] as [number, number];
    });

    const hectareValue =
      typeof zone.hectare === 'string'
        ? parseFloat(zone.hectare)
        : zone.hectare || 0;
    const area = isNaN(hectareValue) ? undefined : hectareValue;

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      coordinates: coordinates as number[][],
      area: area,
    };
  });

  const parcelWithZones: ParcelWithZones = {
    parcelId: parcelId,
    parcelCoordinates: parcelCoordinates,
    zones: zones,
    splitLines: [],
    area: undefined,
  };

  const dates = sampleZones
    .map((zone) => {
      if (!zone.created_at) return null;
      const parts = zone.created_at.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return new Date(zone.created_at);
    })
    .filter((date): date is Date => date !== null);

  const createdAt =
    dates.length > 0
      ? dates.sort((a, b) => b.getTime() - a.getTime())[0]
      : new Date();

  const historyEntry: ViewParcelHistoryEntry = {
    id: `sample-zones-${parcelId}`,
    createdAt: createdAt,
    zonesCount: zones.length,
    method: 'manual',
    parcelWithZones: parcelWithZones,
  };

  return [historyEntry];
}
