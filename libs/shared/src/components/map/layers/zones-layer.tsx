'use client';

import React, { useMemo } from 'react';
import { useMapInstance, useMapLoaded, useMapStyleLoaded } from '../context/map-context';
import { MapZonesTurf } from '../markers/map-zones-turf';
import type { MapZone, MapParcel } from '../../../types/map';

interface ZonesLayerProps {
  zones?: MapZone[];
  parcels?: MapParcel[];
  onZoneClick?: (zone: MapZone) => void;
  visible?: boolean;
  showZoneLabels?: boolean;
}

const normalizeToMultiPolygon = (
  coordinates: MapZone['coordinates']
): MapZone['coordinates'] => {
  if (!coordinates || coordinates.length === 0) {
    return [[[[0, 0]]]];
  }

  if (Array.isArray(coordinates[0][0][0])) {
    return coordinates as MapZone['coordinates'];
  }

  // coordinates is a MapPolygon, wrap it to make it a MapMultiPolygon
  return [coordinates] as unknown as MapZone['coordinates'];
};

export const ZonesLayer: React.FC<ZonesLayerProps> = ({
  zones = [],
  parcels = [],
  onZoneClick,
  visible = true,
  showZoneLabels = true,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const styleLoaded = useMapStyleLoaded();

  const parcelZones = useMemo<MapZone[]>(() => {
    if (parcels && parcels.length > 0) {
      return parcels
        .filter((parcel) => parcel.visible !== false)
        .flatMap((parcel) =>
          (parcel.zones || []).map((zone) => ({
            ...zone,
            coordinates: normalizeToMultiPolygon(zone.coordinates),
            parcelName: zone.parcelName ?? parcel.name,
            clientId: zone.clientId ?? parcel.clientId,
            farmId: zone.farmId ?? parcel.farmId,
          }))
        );
    }

    if (zones && zones.length > 0) {
      return zones
        .filter((zone) => zone.visible !== false)
        .map((zone) => ({
          ...zone,
          coordinates: normalizeToMultiPolygon(zone.coordinates),
        }));
    }

    return [];
  }, [parcels, zones]);

  if (!visible || !mapLoaded || !styleLoaded || parcelZones.length === 0) {
    return null;
  }

  return (
    <MapZonesTurf
      map={map}
      zones={parcelZones}
      onZoneClick={onZoneClick}
      styleLoaded={styleLoaded}
      showArea={true}
      showLabels={showZoneLabels}
      minZoomForLabels={14.5}
      layerVisible={visible}
    />
  );
};

