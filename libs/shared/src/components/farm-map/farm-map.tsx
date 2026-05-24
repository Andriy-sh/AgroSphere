'use client';

import React, { useMemo, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Map } from '../map/map';
import { FarmsLayer } from '../map/layers/farms-layer';
import { SamplePathsLayer } from '../map/layers/sample-paths-layer';
import { ParcelsLayer } from '../map/layers/parcels-layer';
import { buildParcelsFromZones } from '../../utils/map-parcel-helpers';
import { FarmMarker } from '../../types/map';
import { useFarmMapData } from '../../hooks/use-farm-map-data';
import { useFarmZoom } from '../../hooks/use-farm-zoom';

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

interface FarmMapProps {
  clients: Client[];
  selectedClientId?: string;
  selectedFarms?: Record<string, string[]>;
  onFarmClick?: (farm: FarmMarker) => void;
  onZoneClick?: (zone: any) => void;
  onZoomToFarmRef?: React.MutableRefObject<((farmId: string) => void) | null>;
  onZoomToClientRef?: React.MutableRefObject<
    ((clientId: string) => void) | null
  >;
  onZoomToSampleRef?: React.MutableRefObject<((sample: any) => void) | null>;
  showSizeControls?: boolean;
  panelSide?: 'left' | 'right';
  initialMapSize?: number;
  onMapSizeChange?: (size: number) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  layerVisibility?: {
    farmLocations?: boolean;
    farmParcels?: boolean;
    farmZones?: boolean;
    showTasks?: boolean;
  };
  onLayerVisibilityChange?: (layer: string, visible: boolean) => void;
  samplePaths?: any[];
  onSamplePathClick?: (samplePath: any) => void;
  showSamplePaths?: boolean;
  isTaskDetail?: boolean;
  className?: string;
  key?: string;
}

export function FarmMap({
  clients,
  selectedClientId,
  selectedFarms = {},
  onFarmClick,
  onZoneClick,
  onZoomToFarmRef,
  onZoomToClientRef,
  onZoomToSampleRef,
  showSizeControls = true,
  panelSide = 'right',
  initialMapSize = 100,
  onMapSizeChange,
  showSearch = true,
  searchPlaceholder = 'Search for farms or locations...',
  layerVisibility = {
    farmLocations: true,
    farmParcels: true,
    farmZones: true,
    showTasks: false,
  },
  onLayerVisibilityChange,
  samplePaths = [],
  onSamplePathClick,
  showSamplePaths = false,
  isTaskDetail = false,
  className = 'w-full h-full',
  key = 'farm-map',
}: FarmMapProps) {
  const { farmMarkers, mapZones, selectedClientCenter } = useFarmMapData({
    clients,
    selectedClientId,
  });

  const { mapRef, handleZoomToFarm, handleZoomToSample, zoomToClientBbox } =
    useFarmZoom({
      clients,
      farmMarkers,
      mapZones,
      selectedClientId,
    });

  const mapParcels = useMemo(() => buildParcelsFromZones(mapZones), [mapZones]);

  const styledMapParcels = useMemo(() => {
    return mapParcels.map((parcel) => {
      const isSelectedForTask = parcel.zones?.some((zone) => {
        const farmName = zone.farmName;
        return (
          farmName &&
          selectedFarms[farmName] &&
          selectedFarms[farmName].includes(zone.id)
        );
      });

      if (isSelectedForTask) {
        return {
          ...parcel,
          fillColor: '#29b54c',
          borderColor: '#29b54c',
          fillOpacity: 0.3,
          borderWidth: 2,
        };
      }

      return {
        ...parcel,
        fillColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        fillOpacity: 0.12,
        borderWidth: 1,
      };
    });
  }, [selectedFarms, mapParcels]);

  const styledMapZones = useMemo(() => {
    return mapZones.map((zone) => {
      const farmName = zone.farmName;
      const isSelectedForTask =
        farmName &&
        selectedFarms[farmName] &&
        selectedFarms[farmName].includes(zone.id);

      if (zone.visible === false || !(layerVisibility.farmZones ?? true)) {
        return {
          ...zone,
          fillColor: '#cccccc',
          borderColor: '#999999',
          fillOpacity: 0.1,
          borderWidth: 1,
        };
      }

      if (isSelectedForTask) {
        return {
          ...zone,
          fillColor: '#29b54c',
          borderColor: '#29b54c',
          fillOpacity: 0.3,
          borderWidth: 2,
        };
      }

      return {
        ...zone,
        fillColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        fillOpacity: 0.12,
        borderWidth: 1,
      };
    });
  }, [selectedFarms, mapZones, layerVisibility.farmZones]);

  useEffect(() => {
    if (onZoomToFarmRef) {
      onZoomToFarmRef.current = handleZoomToFarm;
    }
  }, [handleZoomToFarm, onZoomToFarmRef]);

  useEffect(() => {
    if (onZoomToSampleRef) {
      onZoomToSampleRef.current = handleZoomToSample;
    }
  }, [handleZoomToSample, onZoomToSampleRef]);

  useEffect(() => {
    if (onZoomToClientRef) {
      onZoomToClientRef.current = (clientId: string) => {
        // Use zoomToClientBbox if it's the selected client, otherwise find and zoom to that client
        if (clientId === selectedClientId) {
          zoomToClientBbox();
        } else {
          // Find client farms and zones, then zoom
          const clientFarms = farmMarkers.filter(
            (f) => f.clientId === clientId
          );
          const clientZones = styledMapZones.filter(
            (z) => z.clientId === clientId
          );

          if (mapRef.current) {
            if (clientZones.length > 0) {
              try {
                const turf = require('@turf/turf');
                const featureCollection = turf.featureCollection(
                  clientZones.map((zone) => turf.multiPolygon(zone.coordinates))
                );
                const bbox = turf.bbox(featureCollection);
                mapRef.current.fitBounds(bbox as mapboxgl.LngLatBoundsLike, {
                  padding: 50,
                  duration: 1500,
                  essential: true,
                });
              } catch {
                if (clientFarms.length > 0) {
                  const firstFarm = clientFarms[0];
                  mapRef.current.flyTo({
                    center: [firstFarm.longitude, firstFarm.latitude],
                    zoom: 12,
                    duration: 1500,
                  });
                }
              }
            } else if (clientFarms.length > 0) {
              const firstFarm = clientFarms[0];
              mapRef.current.flyTo({
                center: [firstFarm.longitude, firstFarm.latitude],
                zoom: 12,
                duration: 1500,
              });
            }
          }
        }
      };
    }
  }, [
    onZoomToClientRef,
    selectedClientId,
    zoomToClientBbox,
    farmMarkers,
    styledMapZones,
    mapRef,
  ]);

  const StableMap = useMemo(() => {
    const initialCenter: [number, number] = selectedClientCenter
      ? [selectedClientCenter.longitude, selectedClientCenter.latitude]
      : [-8.2, 53.4];

    const initialZoom = selectedClientCenter ? 1 : 1;

    return (
      <Map
        ref={mapRef}
        key={key}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        className={className}
        showMapboxControls={false}
        showSizeControls={showSizeControls}
        panelSide={panelSide}
        initialMapSize={initialMapSize}
        currentMapSize={initialMapSize}
        onMapSizeChange={onMapSizeChange}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        layerVisibility={layerVisibility}
        onLayerVisibilityChange={onLayerVisibilityChange}
        isTaskDetail={isTaskDetail}
        showLayerSelector={true}
        zones={styledMapZones}
        onZoneClick={onZoneClick}
      >
        <FarmsLayer
          farms={farmMarkers}
          onFarmClick={onFarmClick}
          onZoomToFarmRef={onZoomToFarmRef}
          visible={layerVisibility.farmLocations !== false}
        />
        <ParcelsLayer
          parcels={styledMapParcels}
          onParcelClick={undefined}
          visible={layerVisibility.farmParcels ?? true}
          showPhColors={false}
          onlyBorder={false}
          showLabels={true}
        />
        {showSamplePaths && (
          <SamplePathsLayer
            samplePaths={samplePaths}
            onSamplePathClick={onSamplePathClick}
            visible={showSamplePaths}
          />
        )}
      </Map>
    );
  }, [
    mapRef,
    key,
    selectedClientCenter,
    farmMarkers,
    styledMapZones,
    styledMapParcels,
    onFarmClick,
    onZoneClick,
    className,
    showSizeControls,
    panelSide,
    initialMapSize,
    onMapSizeChange,
    showSearch,
    searchPlaceholder,
    layerVisibility,
    onLayerVisibilityChange,
    onZoomToFarmRef,
    samplePaths,
    onSamplePathClick,
    showSamplePaths,
    isTaskDetail,
  ]);

  return (
    <div className="w-full h-full overflow-hidden flex-1">{StableMap}</div>
  );
}
