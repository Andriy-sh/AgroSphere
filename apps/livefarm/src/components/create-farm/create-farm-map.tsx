'use client';

import React, { useCallback, useMemo } from 'react';
import { Map, FarmsLayer } from '@@agrosphere/shared';
import type { FarmMarker } from '@@agrosphere/shared';

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface CreateFarmMapProps {
  onLocationSelect?: (coords: {
    latitude: number;
    longitude: number;
    location_xy?: [number, number];
  }) => void;
  selectedLocation?: { latitude: number; longitude: number } | null;
  onMapSizeChange?: (size: number) => void;
  mapSize?: number;
  farmMarkers?: FarmMarker[];
  progressSteps?: ProgressStep[];
  currentProgressStep?: number;
  showProgressBar?: boolean;
  onProgressBarClose?: () => void;
  isFarmMarker?: boolean;
}

const MAP_SIZE_CLASSES = {
  [40]: 'w-[40%] min-w-[40vw]',
  [100]: 'w-full',
} as const;

export const CreateFarmMap = React.memo(function CreateFarmMap({
  onLocationSelect,
  selectedLocation,
  onMapSizeChange,
  mapSize = 40,
  farmMarkers = [],
  progressSteps = [],
  currentProgressStep = 0,
  showProgressBar = false,
  onProgressBarClose,
  isFarmMarker = true,
}: CreateFarmMapProps) {
  const handleMapClick = useCallback(
    (coords: {
      latitude: number;
      longitude: number;
      location_xy?: [number, number];
    }) => {
      onLocationSelect?.(coords);
    },
    [onLocationSelect]
  );

  const handleMapSizeChange = useCallback(
    (size: number) => {
      onMapSizeChange?.(size);
    },
    [onMapSizeChange]
  );

  const selectedLocationMarker: FarmMarker[] = useMemo(
    () =>
      selectedLocation && isFarmMarker
        ? [
            {
              id: 'selected-farm-location',
              longitude: selectedLocation.longitude,
              latitude: selectedLocation.latitude,
              title: 'Farm Location',
              status: 'active',
              type: 'farm' as const,
              name: 'Farm Location',
              visible: true,
              color: '#29B54C',
            },
          ]
        : [],
    [selectedLocation, isFarmMarker]
  );

  const allFarmMarkers: FarmMarker[] = useMemo(
    () => [...farmMarkers, ...selectedLocationMarker],
    [farmMarkers, selectedLocationMarker]
  );

  const mapSizeClass =
    MAP_SIZE_CLASSES[mapSize as keyof typeof MAP_SIZE_CLASSES] || 'w-[40%]';

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-sm overflow-hidden h-full ${mapSizeClass}`}
    >
      <div className="flex-1 min-h-0 relative">
        <Map
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          initialCenter={[-8.2, 53.4]}
          initialZoom={12}
          maxZoom={18}
          minZoom={6}
          showMapboxControls={false}
          showLayerSelector={false}
          showSizeControls={true}
          panelSide="left"
          initialMapSize={mapSize}
          currentMapSize={mapSize}
          onMapSizeChange={handleMapSizeChange}
          className="w-full h-full"
          onMapClick={handleMapClick}
          showSearch={true}
          searchPlaceholder="Find address or places..."
          layerVisibility={{
            farmLocations: isFarmMarker,
            farmParcels: false,
            farmZones: false,
            showTasks: false,
          }}
          isTaskDetail={true}
          progressSteps={progressSteps}
          currentProgressStep={currentProgressStep}
          showProgressBar={showProgressBar}
          onProgressBarClose={onProgressBarClose}
          showCustomMarker={false}
        >
          <FarmsLayer farms={allFarmMarkers} visible={isFarmMarker} />
        </Map>
      </div>
    </div>
  );
});
