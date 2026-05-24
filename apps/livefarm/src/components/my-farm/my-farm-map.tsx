'use client';

import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Map,
  FarmsLayer,
  ImageOverlayLayer,
  SceneTimelineLayer,
  ZonesLayer,
  ParcelsLayer,
  type SceneTimelineItem,
} from '@@agrosphere/shared';
import type {
  FarmItem,
  FarmMarker,
  MapParcel,
  MapZone,
} from '@@agrosphere/shared';
import { useMapStore } from '@/stores/use-map-store';
import {
  useMyFarmSceneTimeline,
  type BandType,
} from './hooks/useMyFarmSceneTimeline';
import {
  transformFarmItemsToMarkers,
  transformFarmItemsToMapParcels,
  transformParcelsFromFarmData,
  transformZonesFromFarmData,
} from './utils/farm-map-transformers';
import { useFarms } from '@@agrosphere/shared';
import mapboxgl from 'mapbox-gl';

interface MyFarmMapProps {
  showFilters: boolean;
  farmItems: FarmItem[];
  selectedFarmId?: string | null;
  onZoomToFarm?: (farmId: string) => void;
  onMapSizeChange?: (size: number) => void;
  locationSelectionFarmId?: string | null;
  onLocationSelected?: (event: {
    farmId: string;
    latitude: number;
    longitude: number;
  }) => void;
  onCancelLocationSelection?: () => void;
  showSceneTimeline?: boolean;
  onSceneTimelineSceneSelect?: (scene: SceneTimelineItem) => void;
}

export const MyFarmMap = React.memo(function MyFarmMap({
  showFilters,
  farmItems,
  selectedFarmId = null,
  onZoomToFarm,
  onMapSizeChange,
  locationSelectionFarmId = null,
  onLocationSelected,
  onCancelLocationSelection,
  showSceneTimeline = false,
  onSceneTimelineSceneSelect,
}: MyFarmMapProps) {
  const { mapSize, setMapSize } = useMapStore();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const clearMarkerRef = useRef<(() => void) | null>(null);
  const zoomToFarmRef = useRef<((farmId: string) => void) | null>(null);
  useEffect(() => {
    if (!locationSelectionFarmId && clearMarkerRef.current) {
      clearMarkerRef.current();
    }
  }, [locationSelectionFarmId]);

  const handleMapClick = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      if (!locationSelectionFarmId || !onLocationSelected) {
        return;
      }
      onLocationSelected({
        farmId: locationSelectionFarmId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    },
    [locationSelectionFarmId, onLocationSelected]
  );

  const { data: farmsResponse } = useFarms();

  const farmMarkers: FarmMarker[] = useMemo(
    () => transformFarmItemsToMarkers(farmItems),
    [farmItems]
  );

  const apiParcels: MapParcel[] = useMemo(() => {
    if (!farmsResponse?.farms) {
      return [];
    }
    return transformParcelsFromFarmData(farmsResponse.farms);
  }, [farmsResponse]);

  const apiZones: MapZone[] = useMemo(() => {
    if (!farmsResponse?.farms) {
      return [];
    }
    return transformZonesFromFarmData(farmsResponse.farms);
  }, [farmsResponse]);

  const initialMapParcels: MapParcel[] = useMemo(() => {
    const farmItemsParcels = transformFarmItemsToMapParcels(farmItems);
    const allParcels = [...apiParcels];
    farmItemsParcels.forEach((parcel) => {
      if (!allParcels.find((p) => p.id === parcel.id)) {
        allParcels.push(parcel);
      }
    });
    return allParcels;
  }, [farmItems, apiParcels]);

  const {
    mapParcels,
    imageryGeometry,
    imageryUrl,
    selectedSceneId,
    shouldLoadTimeline,
    sceneTimelineItems,
    sceneTimelineLoading,
    handleParcelSelect,
    handleSceneTimelineSelect,
    bandType,
    bandOptions,
    onBandTypeSelect,
    onImageOverlayReady,
    onLoadingOverlayReady,
    isImageLoading,
    isImageryOverlayReady,
  } = useMyFarmSceneTimeline({
    showSceneTimeline,
    mapParcels: initialMapParcels,
    onSceneTimelineSceneSelect,
  });

  const handleBandChange = useCallback(
    (band: string) => {
      onBandTypeSelect(band as BandType);
    },
    [onBandTypeSelect]
  );

  useEffect(() => {
    if (selectedFarmId && zoomToFarmRef.current) {
      zoomToFarmRef.current(selectedFarmId);
    }
  }, [selectedFarmId]);

  const selectionActive = Boolean(locationSelectionFarmId);

  const locationSelectionSteps = useMemo(
    () => [
      {
        id: 'select-location',
        title: 'Click on the map to set farm location',
        description:
          'Select the exact location by clicking on the map. Press Esc or Cancel to exit.',
        completed: false,
      },
    ],
    []
  );

  type ParcelZoneMode = 'parcels' | 'zones';

  const [layerVisibility, setLayerVisibility] = React.useState({
    farmLocations: true,
    parcelZoneMode: 'parcels' as ParcelZoneMode,
  });

  const handleLayerVisibilityChange = React.useCallback(
    (layer: string, visible: boolean) => {
      setLayerVisibility((prev) => {
        if (layer === 'parcelZoneMode:parcels' && visible) {
          return { ...prev, parcelZoneMode: 'parcels' };
        }

        if (layer === 'parcelZoneMode:zones' && visible) {
          return { ...prev, parcelZoneMode: 'zones' };
        }

        if (layer === 'farmLocations') {
          return { ...prev, farmLocations: visible };
        }

        return prev;
      });
    },
    []
  );

  const mapComponent = useMemo(() => {
    return (
      <Map
        ref={mapRef}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialCenter={[-6.7893373321256805, 52.803046419691846]}
        initialZoom={12}
        maxZoom={18}
        minZoom={6}
        showMapboxControls={false}
        showLayerSelector={true}
        showSizeControls={true}
        panelSide="left"
        layerVisibility={{
          farmLocations: layerVisibility.farmLocations,
          farmParcels: layerVisibility.parcelZoneMode === 'parcels',
          farmZones: layerVisibility.parcelZoneMode === 'zones',
          parcelZoneMode: layerVisibility.parcelZoneMode,
        }}
        onLayerVisibilityChange={handleLayerVisibilityChange}
        parcelZoneMode={layerVisibility.parcelZoneMode}
        parcels={[]}
        zones={[]}
        onParcelClick={handleParcelSelect}
        initialMapSize={mapSize}
        currentMapSize={mapSize}
        onMapSizeChange={setMapSize}
        isTasksPage={false}
        showFilters={showFilters}
        className="w-full h-full"
        onMapClick={locationSelectionFarmId ? handleMapClick : undefined}
        showCustomMarker={Boolean(locationSelectionFarmId)}
        onClearMarkerRef={clearMarkerRef}
        showProgressBar={selectionActive}
        progressSteps={selectionActive ? locationSelectionSteps : []}
        currentProgressStep={0}
        onProgressBarClose={
          selectionActive ? onCancelLocationSelection : undefined
        }
        hasBottomTimeline={Boolean(shouldLoadTimeline)}
      >
        <FarmsLayer
          farms={farmMarkers}
          onZoomToFarmRef={zoomToFarmRef}
          visible={layerVisibility.farmLocations}
        />
        <ImageOverlayLayer
          imageUrl={imageryUrl}
          savedGeometry={imageryGeometry}
          imageLoading={isImageLoading}
          isImageReady={isImageryOverlayReady}
          onImageOverlayReady={onImageOverlayReady}
          onLoadingOverlayReady={onLoadingOverlayReady}
        />
        <SceneTimelineLayer
          showSceneTimeline={Boolean(shouldLoadTimeline)}
          sceneTimelineItems={sceneTimelineItems}
          sceneTimelineSelectedId={selectedSceneId ?? undefined}
          onSceneTimelineSelect={handleSceneTimelineSelect}
          sceneTimelineLoading={sceneTimelineLoading}
          showBandSelector={Boolean(
            shouldLoadTimeline && bandOptions.length > 0 && bandType
          )}
          bandOptions={bandOptions}
          selectedBand={bandType}
          onBandChange={handleBandChange}
        />
        <ParcelsLayer
          parcels={mapParcels}
          visible={layerVisibility.parcelZoneMode === 'parcels'}
          showLabels
          onParcelClick={handleParcelSelect}
        />
        <ZonesLayer
          zones={apiZones}
          visible={layerVisibility.parcelZoneMode === 'zones'}
          showZoneLabels
        />
      </Map>
    );
  }, [
    farmMarkers,
    mapParcels,
    apiZones,
    mapSize,
    setMapSize,
    showFilters,
    locationSelectionFarmId,
    handleMapClick,
    selectionActive,
    locationSelectionSteps,
    onCancelLocationSelection,
    shouldLoadTimeline,
    sceneTimelineItems,
    imageryUrl,
    imageryGeometry,
    selectedSceneId,
    handleSceneTimelineSelect,
    sceneTimelineLoading,
    handleParcelSelect,
    bandOptions,
    bandType,
    handleBandChange,
    onImageOverlayReady,
    onLoadingOverlayReady,
    isImageLoading,
    isImageryOverlayReady,
    layerVisibility,
    handleLayerVisibilityChange,
  ]);

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
      <div
        className={`flex-1 min-h-0 relative ${
          selectionActive ? 'cursor-crosshair' : ''
        }`}
      >
        {mapComponent}
      </div>
    </div>
  );
});
