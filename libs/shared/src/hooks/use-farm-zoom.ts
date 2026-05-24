'use client';
import { useCallback, useRef, useEffect } from 'react';
import { FarmMarker, MapZone } from '../types/map';
import { Sample } from '../mock/mock-samples';

interface Client {
  id: string;
  farms: Array<{
    id: string;
    longitude: number;
    latitude: number;
    fields: Array<{
      zones: Array<{
        id: string;
      }>;
    }>;
  }>;
}

interface UseFarmZoomProps {
  clients: Client[];
  farmMarkers: FarmMarker[];
  mapZones: MapZone[];
  selectedClientId?: string;
}

interface UseFarmZoomReturn {
  mapRef: React.MutableRefObject<any>;
  handleZoomToFarm: (farmId: string) => void;
  handleZoomToSample: (sample: Sample) => void;
  zoomToClientBbox: () => void;
}

export function useFarmZoom({
  clients,
  farmMarkers,
  mapZones,
  selectedClientId,
}: UseFarmZoomProps): UseFarmZoomReturn {
  const mapRef = useRef<any>(null);

  const handleZoomToFarm = useCallback(
    (farmId: string) => {
      if (!mapRef.current) return;

      const farm = farmMarkers.find((f) => f.id === farmId);
      if (!farm) return;

      const farmZones = mapZones.filter((zone) => {
        if (zone.clientId !== farm.clientId) return false;
        if (!zone.visible) return false;

        const client = clients.find((c) => c.id === farm.clientId);
        if (!client) return false;

        const clientFarm = client.farms.find((f: any) => f.id === farmId);
        if (!clientFarm) return false;

        const zoneBelongsToFarm = clientFarm.fields.some((field: any) =>
          field.zones.some((fieldZone: any) => fieldZone.id === zone.id)
        );

        return zoneBelongsToFarm;
      });

      if (farmZones.length > 0) {
        try {
          const turf = require('@turf/turf');
          const featureCollection = turf.featureCollection(
            farmZones.map((zone) => turf.multiPolygon(zone.coordinates))
          );
          const bbox = turf.bbox(featureCollection);

          mapRef.current.fitBounds(bbox as mapboxgl.LngLatBoundsLike, {
            padding: 50,
            duration: 1500,
            essential: true,
          });
        } catch (error) {
          mapRef.current.flyTo({
            center: [farm.longitude, farm.latitude],
            zoom: 14,
            duration: 1500,
            essential: true,
          });
        }
      } else {
        mapRef.current.flyTo({
          center: [farm.longitude, farm.latitude],
          zoom: 14,
          duration: 1500,
          essential: true,
        });
      }
    },
    [farmMarkers, mapZones, clients]
  );

  const handleZoomToSample = useCallback((sample: Sample) => {
    if (!mapRef.current) return;

    const { getSamplePathBySampleId } = require('../mock/mock-samples');
    const samplePath = getSamplePathBySampleId(sample.sampleId);

    if (
      samplePath &&
      samplePath.coordinates &&
      samplePath.coordinates.length > 0
    ) {
      try {
        const turf = require('@turf/turf');

        const lineString = turf.lineString(samplePath.coordinates);

        const bbox = turf.bbox(lineString);

        mapRef.current.fitBounds(bbox as mapboxgl.LngLatBoundsLike, {
          padding: 50,
          duration: 1500,
          essential: true,
        });
      } catch (error) {
        const latitude = parseFloat(sample.latitude || '0');
        const longitude = parseFloat(sample.longitude || '0');

        if (isNaN(latitude) || isNaN(longitude)) return;

        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          duration: 1500,
          essential: true,
        });
      }
    } else {
      const latitude = parseFloat(sample.latitude || '0');
      const longitude = parseFloat(sample.longitude || '0');

      if (isNaN(latitude) || isNaN(longitude)) return;

      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        duration: 1500,
        essential: true,
      });
    }
  }, []);

  const zoomToClientBbox = useCallback(() => {
    if (!selectedClientId || !mapRef.current) return;

    const client = clients.find((c) => c.id === selectedClientId);
    if (!client || client.farms.length === 0) return;

    const clientZones = mapZones.filter(
      (zone) => zone.visible && zone.clientId === selectedClientId
    );

    if (clientZones.length > 0) {
      try {
        const turf = require('@turf/turf');
        const featureCollection = turf.featureCollection(
          clientZones.map((zone) => turf.multiPolygon(zone.coordinates))
        );
        const bbox = turf.bbox(featureCollection);

        mapRef.current.fitBounds(bbox as mapboxgl.LngLatBoundsLike, {
          padding: 50,
          duration: 1000,
          essential: true,
        });
      } catch (error) {
        const firstFarm = client.farms[0];
        mapRef.current.flyTo({
          center: [firstFarm.longitude, firstFarm.latitude],
          zoom: 12,
          duration: 1000,
        });
      }
    } else {
      const firstFarm = client.farms[0];
      mapRef.current.flyTo({
        center: [firstFarm.longitude, firstFarm.latitude],
        zoom: 12,
        duration: 1000,
      });
    }
  }, [selectedClientId, clients, mapZones]);

  useEffect(() => {
    if (selectedClientId && mapRef.current) {
      zoomToClientBbox();
    } else if (!selectedClientId && mapRef.current) {
      mapRef.current.flyTo({
        center: [-8.2, 53.4],
        zoom: 6,
        duration: 1000,
        essential: true,
      });
    }
  }, [selectedClientId, zoomToClientBbox]);

  return {
    mapRef,
    handleZoomToFarm,
    handleZoomToSample,
    zoomToClientBbox,
  };
}
