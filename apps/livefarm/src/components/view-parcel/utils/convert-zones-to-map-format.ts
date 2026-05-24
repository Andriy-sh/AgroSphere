import type { ParcelWithZones } from '@@agrosphere/shared';
import type { MapZone, MapCoordinate, MapPolygon, MapMultiPolygon } from '@@agrosphere/shared';


const POLYGON_SEPARATOR: MapCoordinate = [Infinity, Infinity];


function isSeparator(coord: number[]): boolean {
  return (
    coord.length === 2 &&
    coord[0] === Infinity &&
    coord[1] === Infinity
  );
}


function convertCoordinatesToMultiPolygon(
  coordinates: number[][]
): MapMultiPolygon {
  if (!coordinates || coordinates.length === 0) {
    return [];
  }

  const polygons: MapPolygon[] = [];
  let currentPolygon: MapCoordinate[] = [];

  for (const coord of coordinates) {
    if (isSeparator(coord)) {
      if (currentPolygon.length > 0) {
        polygons.push([currentPolygon]);
        currentPolygon = [];
      }
    } else if (coord.length >= 2) {
      currentPolygon.push([coord[0], coord[1]] as MapCoordinate);
    }
  }

  if (currentPolygon.length > 0) {
    polygons.push([currentPolygon]);
  }

  return polygons;
}


function getZoneColor(zoneIndex: number): string {
  const colors = [
    '#F44336',  
    '#FF9800', 
    '#FFEB3B',
    '#8BC34A', 
    '#2E7D32',
  ];

  return colors[zoneIndex % colors.length];
}

export function convertZonesToMapZones(
  parcelWithZones: ParcelWithZones,
  parcelId: string,
  parcelName: string,
  farmName?: string
): MapZone[] {
  if (!parcelWithZones || !parcelWithZones.zones || parcelWithZones.zones.length === 0) {
    return [];
  }

  return parcelWithZones.zones.map((zone, index) => {
    const multiPolygon = convertCoordinatesToMultiPolygon(zone.coordinates);
    
    let zoneNumber = index;
    if (zone.zoneId) {
      const match = zone.zoneId.match(/zone-(\d+)/);
      if (match) {
        zoneNumber = parseInt(match[1], 10);
      }
    }
    
    const fillColor = getZoneColor(zoneNumber);

    return {
      id: zone.zoneId || `zone-${index}`,
      name: zone.zoneName || `Zone ${index + 1}`,
      area: zone.area,
      coordinates: multiPolygon,
      fillColor: fillColor,
      borderColor: fillColor,
      fillOpacity: 0.3,
      borderWidth: 2,
      visible: true,
      parcelId: parcelId,
      parcelName: parcelName,
      farmName: farmName,
      zIndex: 5,
    } as MapZone;
  });
}
