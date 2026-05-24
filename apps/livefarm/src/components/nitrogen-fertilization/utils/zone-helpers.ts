import type { ZonePrescription } from '../types/form-types';
import { getZoneColor as getZoneColorFromMap } from './load-vegetation-map';

export function getZoneColor(
  zone: ZonePrescription,
  allZones: ZonePrescription[]
): string {
  const sortedZones = [...allZones].sort((a, b) => a.zoneId - b.zoneId);
  const zoneIndex = sortedZones.findIndex((z) => z.zoneId === zone.zoneId);
  const totalZones = sortedZones.length;

  const hslColor = getZoneColorFromMap(zone.zoneId, totalZones, zone.kmean);

  return hslColor;
}

export function getZoneLabel(
  zone: ZonePrescription,
  allZones: ZonePrescription[]
): string {
  if (zone.kmean === undefined) return `Zone ${zone.zoneId}`;

  const zonesWithNdvi = allZones.filter((z) => z.kmean !== undefined);
  if (zonesWithNdvi.length === 0) return `Zone ${zone.zoneId}`;

  const ndviValues = zonesWithNdvi.map((z) => z.kmean!);
  const minNdvi = Math.min(...ndviValues);
  const maxNdvi = Math.max(...ndviValues);

  if (minNdvi === maxNdvi) return `Zone ${zone.zoneId}`;

  const currentNdvi = zone.kmean!;

  if (currentNdvi === minNdvi) return 'Lower vegetation';
  if (currentNdvi === maxNdvi) return 'Higher vegetation';
  return `Zone ${zone.zoneId}`;
}
