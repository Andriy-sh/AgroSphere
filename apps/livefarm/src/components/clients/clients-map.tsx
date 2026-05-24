'use client';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { Map, FarmsLayer, ZonesLayer } from '@@agrosphere/shared';
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import { useMapStore } from '@/stores/use-map-store';
import { Client as ApiClient } from '@@agrosphere/shared';

type Zone = {
  id: string;
  name: string;
  coordinates: [number, number][][][];
};

type Field = {
  id: string;
  name: string;
  cropType: string;
  area: number;
  zones: Zone[];
};

type Farm = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  size: number;
  cropType: string;
  fields: Field[];
};

type Client = ApiClient & {
  farms?: Farm[];
};

interface ClientsMapProps {
  clients: Client[];
  selectedClientId: string | null;
  selectedFarmId: string | null;
  onClientSelect: (clientId: string) => void;
  onFarmSelect: (farmId: string, clientId: string) => void;
  onMapSizeChange: (size: number) => void;
  onZoomToClientRef?: React.MutableRefObject<
    ((clientId: string) => void) | null
  >;
}

const zoomToClientFarms = (
  clientId: string,
  clients: Client[],
  mapRef: React.RefObject<mapboxgl.Map | null>
) => {
  const client = clients.find((c) => c.id === clientId);
  if (
    !client ||
    !client.farms ||
    (Array.isArray(client.farms) && client.farms.length === 0)
  )
    return;

  const features: GeoJSON.Feature[] = [];

  // Only process farms if they are an array (not a number count)
  if (Array.isArray(client.farms)) {
    client.farms.forEach((farm) => {
      features.push(turf.point([farm.longitude, farm.latitude]));

      farm.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          if (zone.coordinates && zone.coordinates.length > 0) {
            const coordinates = zone.coordinates.map((polygon) =>
              polygon.map((ring) => ring.map((coord) => [coord[0], coord[1]]))
            );

            if (coordinates.length > 0) {
              features.push(turf.polygon(coordinates[0]));
            }
            if (coordinates.length > 1) {
              features.push(turf.multiPolygon(coordinates));
            }
          }
        });
      });
    });
  }

  if (features.length === 0) return;

  const featureCollection = turf.featureCollection(features);

  const bbox = turf.bbox(featureCollection);

  const padding = 0.01;
  const paddedBbox: [[number, number], [number, number]] = [
    [bbox[0] - padding, bbox[1] - padding],
    [bbox[2] + padding, bbox[3] + padding],
  ];

  if (mapRef.current) {
    mapRef.current.fitBounds(paddedBbox, {
      padding: 50,
      duration: 2000,
    });
  }
};

export function ClientsMap({
  clients,
  selectedClientId,
  selectedFarmId,
  onClientSelect,
  onFarmSelect,
  onMapSizeChange,
  onZoomToClientRef,
}: ClientsMapProps) {
  const { mapSize, setMapSize } = useMapStore();
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (onZoomToClientRef) {
      onZoomToClientRef.current = (clientId: string) => {
        zoomToClientFarms(clientId, clients, mapRef);
      };
    }
  }, [clients, onZoomToClientRef]);

  const farmMarkers = useMemo(() => {
    return clients
      .filter(
        (client) =>
          client.farms && Array.isArray(client.farms) && client.farms.length > 0
      )
      .flatMap(
        (client) =>
          client.farms?.map((farm) => {
            const isSelected = selectedClientId === client.id;
            return {
              id: farm.id,
              title: farm.name,
              latitude: farm.latitude,
              longitude: farm.longitude,
              size: farm.size,
              crop_type: farm.cropType,
              address: farm.address,
              clientId: client.id,
              client_name: client.full_name || client.business_name,
              status: 'active',
              color: isSelected ? '#22c55e' : '#818D99',
              type: 'farm' as const,
            };
          }) || []
      );
  }, [clients, selectedClientId]);

  const mapZones = useMemo(() => {
    return clients
      .filter(
        (client) =>
          client.farms && Array.isArray(client.farms) && client.farms.length > 0
      )
      .flatMap((client) => {
        const isSelected = selectedClientId === client.id;
        return (
          client.farms?.flatMap((farm) =>
            farm.fields.flatMap((field) =>
              field.zones.map((zone) => ({
                id: zone.id,
                name: zone.name,
                cropType: field.cropType,
                coordinates: zone.coordinates,
                fillColor: isSelected ? '#22c55e' : '#FFFFFF12',
                borderColor: isSelected ? '#16a34a' : '#FFFFFF',
                fillOpacity: isSelected ? 0.3 : 0.1,
                farmId: farm.id,
                farmName: farm.name,
                parcelName: field.name,
                clientId: client.id,
              }))
            )
          ) || []
        );
      });
  }, [clients, selectedClientId]);

  const handleFarmClick = (farm: { id?: string; clientId?: string }) => {
    if (farm.id && farm.clientId) {
      onFarmSelect(farm.id, farm.clientId);
    }
  };

  const handleZoneClick = (zone: { clientId?: string }) => {
    if (zone.clientId) {
      onClientSelect(zone.clientId);
    }
  };

  const handleMapSizeChange = useCallback(
    (size: number) => {
      setMapSize(size);
      onMapSizeChange?.(size);
    },
    [setMapSize, onMapSizeChange]
  );

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-sm overflow-hidden ${
        mapSize === 100 ? 'w-full h-full' : 'h-full'
      }`}
      style={{
        width:
          mapSize === 0
            ? '0%'
            : mapSize === 30
            ? '30%'
            : mapSize === 40
            ? '40%'
            : mapSize === 100
            ? '100%'
            : 'auto',
        minWidth:
          mapSize === 0
            ? '0px'
            : mapSize === 30
            ? '30vw'
            : mapSize === 40
            ? '40vw'
            : 'auto',
      }}
    >
      <div className="flex-1 min-h-0 relative">
        <Map
          ref={mapRef}
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          initialZoom={10}
          minZoom={6}
          zones={mapZones}
          onZoneClick={handleZoneClick}
          showMapboxControls={false}
          showLayerSelector={true}
          showSizeControls={true}
          panelSide="left"
          initialMapSize={mapSize}
          currentMapSize={mapSize}
          onMapSizeChange={handleMapSizeChange}
          isTasksPage={false}
        >
          <FarmsLayer
            farms={farmMarkers}
            onFarmClick={handleFarmClick}
            visible={true}
          />
          <ZonesLayer
            zones={mapZones}
            onZoneClick={handleZoneClick}
            visible={true}
          />
        </Map>
      </div>
    </div>
  );
}
