import type { MapZone, MapMultiPolygon, MapCoordinate } from '@@agrosphere/shared';

interface SampleZone {
  id: string;
  item_id: number;
  name: string;
  field_no: number;
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

function getZoneColor(zoneIndex: number): string {
  // const colors = [
  //   '#F44336',
  //   '#FF9800',
  //   '#FFEB3B',
  //   '#8BC34A',
  //   '#2E7D32',
  //   '#2196F3',
  //   '#9C27B0',
  //   '#00BCD4',
  // ];

  // return colors[zoneIndex % colors.length];
  return '#FFFFFF';
}

function convertBoundariesToMultiPolygon(
  boundaries: number[][]
): MapMultiPolygon {
  if (!boundaries || boundaries.length === 0) {
    return [];
  }

  const coordinates = boundaries.map(
    (coord) => [coord[1], coord[0]] as MapCoordinate
  );

  const firstCoord = coordinates[0];
  const lastCoord = coordinates[coordinates.length - 1];
  const closedCoordinates =
    firstCoord &&
    lastCoord &&
    firstCoord[0] === lastCoord[0] &&
    firstCoord[1] === lastCoord[1]
      ? coordinates
      : firstCoord
      ? [...coordinates, firstCoord]
      : coordinates;

  return [[closedCoordinates]];
}

export function convertSampleZonesToMapZones(
  sampleZones: SampleZone[] | undefined,
  parcelId: string,
  parcelName: string,
  farmName?: string
): MapZone[] {
  if (!sampleZones || !Array.isArray(sampleZones) || sampleZones.length === 0) {
    return [];
  }

  return sampleZones.map((zone, index) => {
    const multiPolygon = convertBoundariesToMultiPolygon(zone.boundaries || []);
    const fillColor = getZoneColor(index);

    const hectareValue =
      typeof zone.hectare === 'string'
        ? parseFloat(zone.hectare)
        : zone.hectare || 0;
    const area = isNaN(hectareValue) ? undefined : hectareValue;

    return {
      id: zone.id,
      name: zone.name,
      area: area,
      coordinates: multiPolygon,
      fillColor: fillColor,
      borderColor: fillColor,
      fillOpacity: 0.3,
      borderWidth: 1,
      visible: true,
      parcelId: parcelId,
      parcelName: parcelName,
      farmName: farmName,
      zIndex: 5,
    } as MapZone;
  });
}
