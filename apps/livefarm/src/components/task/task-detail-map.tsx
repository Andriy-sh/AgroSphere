'use client';
import React, { useMemo } from 'react';
import { FarmMarker, Map, MapZone, FarmsLayer, ZonesLayer } from '@@agrosphere/shared';

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tags?: string[];
  farms: Array<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    size: number;
    cropType: string;
    fields: Array<{
      id: string;
      name: string;
      area: number;
      cropType: string;
      zones: Array<{
        id: string;
        name: string;
        coordinates: [number, number][][][];
      }>;
    }>;
  }>;
};

interface TaskDetailMapProps {
  selectedClient?: string;
  selectedFarms?: Record<string, string[]>;
  selectedClientCenter?: { longitude: number; latitude: number } | null;
  onFarmClick?: (farm: FarmMarker) => void;
  onZoneClick?: (zone: MapZone) => void;
  onZoomToFarmRef?: React.MutableRefObject<((farmId: string) => void) | null>;
}

export function TaskDetailMap({
  selectedClient,
  selectedFarms = {},
  selectedClientCenter,
  onFarmClick,
  onZoneClick,
  onZoomToFarmRef,
}: TaskDetailMapProps) {
  const clients: Client[] = [];

  const farmMarkers: FarmMarker[] = useMemo(() => {
    const farms = clients.flatMap((client) =>
      client.farms.map((farm) => ({
        id: farm.id,
        longitude: farm.longitude,
        latitude: farm.latitude,
        title: farm.name,
        status: 'active',
        color: '#29b54c',
        name: farm.name,
        client_name: client.name,
        address: farm.address,
        size: farm.size,
        crop_type: farm.cropType,
        last_visit: '',
        visible: true,
        clientId: client.id,
      }))
    );

    const filteredFarms = selectedClient
      ? farms.filter((farm) => farm.clientId === selectedClient)
      : farms;

    return filteredFarms;
  }, [clients, selectedClient]);

  const mapZones: MapZone[] = useMemo(() => {
    const zones = clients.flatMap((client) =>
      client.farms.flatMap((farm) =>
        farm.fields.flatMap((field) =>
          field.zones.map((zone) => ({
            id: zone.id,
            name: zone.name,
            area: field.area,
            cropType: field.cropType,
            coordinates: zone.coordinates as [number, number][][][],
            fillColor: '#FFFFFF12',
            borderColor: '#FFFFFF',
            fillOpacity: 0.1,
            borderWidth: 1,
            visible: true,
            clientId: client.id,
          }))
        )
      )
    );

    const filteredZones = selectedClient
      ? zones.filter((zone) => zone.clientId === selectedClient)
      : zones;

    return filteredZones;
  }, [clients, selectedClient]);

  const StableMap = useMemo(() => {
    const initialCenter: [number, number] = selectedClientCenter
      ? [selectedClientCenter.longitude, selectedClientCenter.latitude]
      : [-8.2, 53.4];

    const mapKey = selectedClientCenter
      ? `map-${selectedClientCenter.longitude}-${selectedClientCenter.latitude}`
      : 'map-default';

    return (
      <Map
        key={mapKey}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialCenter={initialCenter}
        initialZoom={selectedClientCenter ? 12 : 8}
        zones={mapZones}
        onZoneClick={onZoneClick}
        showSizeControls={false}
        className="w-full h-full"
      >
        <FarmsLayer
          farms={farmMarkers}
          onFarmClick={onFarmClick}
          onZoomToFarmRef={onZoomToFarmRef}
          visible={true}
        />
        <ZonesLayer
          zones={mapZones}
          onZoneClick={onZoneClick}
          visible={true}
        />
      </Map>
    );
  }, [
    farmMarkers,
    mapZones,
    onFarmClick,
    onZoneClick,
    onZoomToFarmRef,
    selectedClientCenter,
  ]);

  return <div className="w-full h-full overflow-hidden">{StableMap}</div>;
}
