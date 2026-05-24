import type { MapParcel, MapZone, MapMultiPolygon } from '../types/map';

const cloneCoordinates = (coordinates: MapMultiPolygon): MapMultiPolygon =>
  coordinates.map((polygon) =>
    polygon.map((ring) => [...ring])
  ) as MapMultiPolygon;

export const buildParcelsFromZones = (zones: MapZone[] = []): MapParcel[] => {
  const parcelsMap = new Map<string, MapParcel>();

  zones.forEach((zone) => {
    const parcelId = zone.parcelId ?? zone.id;
    const parcelName = zone.parcelName ?? zone.name;
    const parcelKey = parcelId || zone.id;
    const zoneCoordinates = cloneCoordinates(zone.coordinates);

    if (!parcelsMap.has(parcelKey)) {
      parcelsMap.set(parcelKey, {
        id: parcelKey,
        name: parcelName,
        area: zone.area,
        coordinates: cloneCoordinates(zone.coordinates),
        zones: [],
        clientId: zone.clientId,
        farmId: zone.farmId,
        visible: zone.visible,
        eosdaFieldId: zone.eosdaFieldId,
      });
    }

    const parcel = parcelsMap.get(parcelKey)!;

    parcel.zones = [
      ...(parcel.zones || []),
      {
        ...zone,
        parcelId: parcelKey,
        parcelName,
        coordinates: zoneCoordinates,
      },
    ];

    if (!parcel.area && zone.area) {
      parcel.area = zone.area;
    }

    if (!parcel.coordinates || parcel.coordinates.length === 0) {
      parcel.coordinates = cloneCoordinates(zone.coordinates);
    }

    if (zone.visible === false) {
      parcel.visible = false;
    }
  });

  return Array.from(parcelsMap.values());
};
