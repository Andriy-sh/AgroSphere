'use client';
import { useMemo } from 'react';
import { FarmMarker, MapZone } from '../types/map';

interface Client {
  id: string;
  name: string;
  farms: Array<{
    id: string;
    name: string;
    longitude: number;
    latitude: number;
    address: string;
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
}

interface UseFarmMapDataProps {
  clients: Client[];
  selectedClientId?: string;
  defaultZoneStyle?: {
    fillColor: string;
    borderColor: string;
    fillOpacity: number;
    borderWidth: number;
  };
}

interface UseFarmMapDataReturn {
  farmMarkers: FarmMarker[];
  mapZones: MapZone[];
  selectedClientCenter: { longitude: number; latitude: number } | null;
}

export function useFarmMapData({
  clients,
  selectedClientId,
  defaultZoneStyle = {
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.12,
    borderWidth: 1,
  },
}: UseFarmMapDataProps): UseFarmMapDataReturn {
  const farmMarkers = useMemo((): FarmMarker[] => {
    return clients.flatMap((client) =>
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
        last_visit: '2024-12-01',
        visible: selectedClientId ? client.id === selectedClientId : false,
        clientId: client.id,
      }))
    );
  }, [clients, selectedClientId]);

  const mapZones = useMemo((): MapZone[] => {
    return clients.flatMap((client) =>
      client.farms.flatMap((farm) =>
        farm.fields.flatMap((field) =>
          field.zones.map((zone) => ({
            id: zone.id,
            name: zone.name,
            area: field.area,
            cropType: field.cropType,
            coordinates: zone.coordinates,
            fillColor: defaultZoneStyle.fillColor,
            borderColor: defaultZoneStyle.borderColor,
            fillOpacity: defaultZoneStyle.fillOpacity,
            borderWidth: defaultZoneStyle.borderWidth,
            visible: selectedClientId ? client.id === selectedClientId : false,
            clientId: client.id,
            farmId: farm.id,
            farmName: farm.name,
            zIndex: 5,
          }))
        )
      )
    );
  }, [clients, selectedClientId, defaultZoneStyle]);

  const selectedClientCenter = useMemo(() => {
    if (!selectedClientId) return null;

    const client = clients.find((c) => c.id === selectedClientId);
    if (!client || client.farms.length === 0) return null;

    const firstFarm = client.farms[0];
    return {
      longitude: firstFarm.longitude,
      latitude: firstFarm.latitude,
    };
  }, [clients, selectedClientId]);

  return {
    farmMarkers,
    mapZones,
    selectedClientCenter,
  };
}
