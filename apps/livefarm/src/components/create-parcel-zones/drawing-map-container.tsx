'use client';

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  Map,
  DrawingManagementLayer,
  FarmsLayer,
  ParcelsLayer,
  ZonesLayer,
  ParcelLabelLayer,
  zoomToParcelBbox,
  type ParcelWithZones,
  type DownloadVisualGeometry,
  type FarmMarker,
} from '@@agrosphere/shared';
import type {
  MapParcel,
  DrawingFeature,
  MapMultiPolygon,
  MapZone,
  ParcelSplitLine,
} from '@@agrosphere/shared';
import mapboxgl from 'mapbox-gl';
import type { Feature as GeoJsonFeature } from 'geojson';
import type { SelectedFarm } from './types';
import { DrawingMapButtons } from './components/drawing-map-buttons';

interface DrawingMapContainerProps {
  onParcelChange?: (parcel: MapParcel | null) => void;
  onAreaChange?: (area: number) => void;
  onDrawingChange?: (features: DrawingFeature[]) => void;
  onParcelWithZonesChange?: (parcel: ParcelWithZones | null) => void;
  drawnFeatures?: DrawingFeature[];
  parcelName?: string;
  drawingMode?: 'draw_polygon' | 'draw_line_string' | 'simple_select';
  selectedFarm?: SelectedFarm | null;
  farmMarkers?: FarmMarker[];
  apiParcels?: MapParcel[];
  apiZones?: MapZone[];
  onChangeModeRef?: React.MutableRefObject<((mode: string) => void) | null>;
  onClearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  onRestorePolygonRef?: React.MutableRefObject<
    | ((
        geometry: DownloadVisualGeometry,
        parcelName?: string,
        parcelArea?: number
      ) => void)
    | null
  >;
  enabled?: boolean;
  showOnlyLine?: boolean;
  activeParcelGeometry?: Array<[number, number]> | null;
  onZoomToParcelRef?: React.MutableRefObject<
    ((parcelId: string) => void) | null
  >;
  activeParcelId?: string;
}

export function DrawingMapContainer({
  onParcelChange,
  onAreaChange,
  onDrawingChange,
  onParcelWithZonesChange,
  drawnFeatures: drawnFeaturesProp,
  parcelName: parcelNameProp,
  drawingMode: drawingModeProp,
  selectedFarm,
  farmMarkers = [],
  apiParcels = [],
  apiZones = [],
  onChangeModeRef: onChangeModeRefProp,
  onClearDrawingRef: onClearDrawingRefProp,
  onRestorePolygonRef: onRestorePolygonRefProp,
  enabled: enabledProp,
  showOnlyLine = false,
  activeParcelGeometry,
  onZoomToParcelRef,
  activeParcelId,
}: DrawingMapContainerProps) {
  const [internalDrawnFeatures, setInternalDrawnFeatures] = useState<
    DrawingFeature[]
  >([]);

  const drawnFeatures = drawnFeaturesProp ?? internalDrawnFeatures;
  const [drawnArea, setDrawnArea] = useState<number>(0);
  const [internalParcelName, setInternalParcelName] = useState<string>('');
  const parcelName = parcelNameProp ?? internalParcelName;
  const [parcelArea, setParcelArea] = useState<number>(0);
  const [currentParcel, setCurrentParcel] = useState<MapParcel | null>(null);
  const [internalDrawingMode, setInternalDrawingMode] = useState<
    'draw_polygon' | 'draw_line_string' | 'simple_select'
  >('draw_polygon');

  const drawingMode = drawingModeProp ?? internalDrawingMode;

  const internalClearDrawingRef = useRef<(() => void) | null>(null);
  const internalChangeModeRef = useRef<((mode: string) => void) | null>(null);
  const internalRestorePolygonRef = useRef<
    | ((
        geometry: DownloadVisualGeometry,
        parcelName?: string,
        parcelArea?: number
      ) => void)
    | null
  >(null);

  const clearDrawingRef = onClearDrawingRefProp ?? internalClearDrawingRef;
  const changeModeRef = onChangeModeRefProp ?? internalChangeModeRef;
  const restorePolygonRef =
    onRestorePolygonRefProp ?? internalRestorePolygonRef;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const zoomToFarmRef = useRef<((farmId: string) => void) | null>(null);
  const [layerVisibility, setLayerVisibility] = useState({
    farmLocations: true,
    farmParcels: true,
    farmZones: false,
    showTasks: false,
    parcelZoneMode: 'parcels' as 'parcels' | 'zones',
  });

  const handleLayerVisibilityChange = useCallback(
    (layer: string, visible: boolean) => {
      setLayerVisibility((prev) => {
        if (layer.startsWith('parcelZoneMode:')) {
          const mode = layer.split(':')[1] as 'parcels' | 'zones';
          return {
            ...prev,
            parcelZoneMode: mode,
            farmParcels: mode === 'parcels',
            farmZones: mode === 'zones',
          };
        }
        return {
          ...prev,
          [layer]: visible,
        };
      });
    },
    []
  );

  const visibleParcels = useMemo(() => {
    if (layerVisibility.parcelZoneMode === 'zones') {
      return apiParcels.filter((parcel) => {
        const hasZones = apiZones.some((zone) => zone.parcelId === parcel.id);
        return !hasZones;
      });
    }
    return apiParcels;
  }, [apiParcels, apiZones, layerVisibility.parcelZoneMode]);

  useEffect(() => {
    if (onZoomToParcelRef) {
      onZoomToParcelRef.current = (parcelId: string) => {
        if (!mapRef.current) {
          return;
        }

        const parcel = apiParcels.find((p) => p.id === parcelId);
        if (!parcel || !parcel.coordinates) {
          return;
        }

        const firstPolygon = parcel.coordinates[0];
        if (!firstPolygon || firstPolygon.length === 0) {
          return;
        }

        const firstRing = firstPolygon[0];
        if (!firstRing || firstRing.length === 0) {
          return;
        }

        const flatCoordinates: number[][] = firstRing.map((coord) => [
          coord[0],
          coord[1],
        ]);

        const performZoom = () => {
          zoomToParcelBbox(mapRef, flatCoordinates, {
            padding: 60,
            duration: 1500,
            essential: true,
          });
        };

        if (!mapRef.current.isStyleLoaded()) {
          mapRef.current.once('style.load', () => {
            performZoom();
          });
        } else {
          performZoom();
        }
      };

      return () => {
        if (onZoomToParcelRef) {
          onZoomToParcelRef.current = null;
        }
      };
    }
    return undefined;
  }, [onZoomToParcelRef, apiParcels]);

  useEffect(() => {
    if (selectedFarm && mapRef.current && !activeParcelId) {
      const zoomToFarm = () => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
          mapRef.current.flyTo({
            center: [selectedFarm.longitude, selectedFarm.latitude],
            zoom: 15,
            duration: 1500,
            essential: true,
          });
        } else if (mapRef.current) {
          const checkMapReady = () => {
            if (mapRef.current && mapRef.current.isStyleLoaded()) {
              mapRef.current.flyTo({
                center: [selectedFarm.longitude, selectedFarm.latitude],
                zoom: 15,
                duration: 1500,
                essential: true,
              });
            } else {
              setTimeout(checkMapReady, 100);
            }
          };
          checkMapReady();
        }
      };
      zoomToFarm();
    }
  }, [selectedFarm, activeParcelId]);

  const handleDrawingChange = useCallback(
    (features: DrawingFeature[]) => {
      if (!drawnFeaturesProp) {
        setInternalDrawnFeatures(features);
      }
      onDrawingChange?.(features);
    },
    [onDrawingChange, drawnFeaturesProp]
  );

  const handleDrawingAreaChange = useCallback(
    (area: number) => {
      setDrawnArea(area);
      onAreaChange?.(area);
    },
    [onAreaChange]
  );

  useEffect(() => {
    if (!selectedFarm && clearDrawingRef?.current) {
      clearDrawingRef.current();
      handleDrawingChange([]);
      handleDrawingAreaChange(0);
    }
  }, [
    selectedFarm,
    clearDrawingRef,
    handleDrawingChange,
    handleDrawingAreaChange,
  ]);

  const handleParcelWithZonesChange = useCallback(
    (parcel: MapParcel | null) => {
      if (parcel) {
        if (!parcelNameProp && parcel.name) {
          setInternalParcelName(parcel.name);
        }
        setParcelArea(parcel.area ? parcel.area / 10000 : 0);
        setCurrentParcel(parcel);
        onParcelChange?.(parcel);
      } else {
        if (!parcelNameProp) {
          setInternalParcelName('');
        }
        setParcelArea(0);
        setCurrentParcel(null);
        onParcelChange?.(null);
      }
    },
    [onParcelChange, parcelNameProp]
  );

  useEffect(() => {
    if (!selectedFarm && clearDrawingRef?.current) {
      clearDrawingRef.current();
      handleDrawingChange([]);
      handleDrawingAreaChange(0);
    }
  }, [
    selectedFarm,
    clearDrawingRef,
    handleDrawingChange,
    handleDrawingAreaChange,
  ]);

  useEffect(() => {
    if (changeModeRef?.current && !onChangeModeRefProp) {
      const originalChangeMode = changeModeRef.current;
      changeModeRef.current = (mode: string) => {
        originalChangeMode(mode);
        setInternalDrawingMode(mode as typeof internalDrawingMode);
      };
      return () => {
        if (changeModeRef?.current) {
          changeModeRef.current = originalChangeMode;
        }
      };
    }
    return undefined;
  }, [changeModeRef, onChangeModeRefProp]);

  const convertParcelWithZonesToMapParcel = useCallback(
    (parcelWithZones: ParcelWithZones): MapParcel => {
      const extractCoordinates = (coords: number[][]): number[][][][] => {
        if (coords.length === 0) {
          return [];
        }
        const closedCoords = [...coords, coords[0]];
        return [[closedCoords]];
      };

      const zones = parcelWithZones.zones.map((zone) => ({
        id: zone.zoneId,
        name: zone.zoneName || '',
        area: zone.area,
        coordinates: extractCoordinates(zone.coordinates),
        // fillColor: '#FFFFFF',
        // borderColor: '#FFFFFF',
        // fillOpacity: 0.12,
        // borderWidth: 1,
        visible: true,
        parcelId: parcelWithZones.parcelId,
        parcelName: parcelName || '',
      }));

      const splitLines = parcelWithZones.splitLines.map((line, index) => ({
        id: `${parcelWithZones.parcelId}-split-${index + 1}`,
        coordinates: line.coordinates,
      }));

      const parcelCoords = extractCoordinates(
        parcelWithZones.parcelCoordinates
      );

      const drawnFeatures: GeoJsonFeature[] = [];
      if (parcelCoords.length > 0 && parcelCoords[0].length > 0) {
        const coords = parcelCoords[0][0];
        if (coords.length > 0) {
          drawnFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coords],
            },
            properties: {},
          });
        }
      }

      return {
        id: parcelWithZones.parcelId,
        name: parcelName || '',
        area: parcelWithZones.area,
        coordinates: parcelCoords as MapMultiPolygon,
        zones: zones as MapZone[],
        splitLines: splitLines as ParcelSplitLine[],
        drawnFeatures,
        createdAt: new Date().toISOString(),
        visible: true,
      };
    },
    [parcelName]
  );

  const isDrawingEnabled = useMemo(() => {
    return (enabledProp !== undefined ? enabledProp : true) && !!selectedFarm;
  }, [enabledProp, selectedFarm]);

  return (
    <div className="flex-1 min-h-0 relative">
      <Map
        ref={mapRef}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        currentMapSize={100}
        onMapSizeChange={() => {
          // Map size change handler - no action needed
        }}
        layerVisibility={layerVisibility}
        onLayerVisibilityChange={handleLayerVisibilityChange}
        isTaskDetail={false}
        showMapboxControls={false}
        showLayerSelector={true}
        showSearch={true}
        showSizeControls={false}
        showFullscreenButton={true}
      >
        <FarmsLayer
          farms={farmMarkers}
          visible={farmMarkers.length > 0}
          onZoomToFarmRef={zoomToFarmRef}
        />
        <ParcelsLayer
          parcels={
            layerVisibility.parcelZoneMode === 'zones'
              ? visibleParcels
              : apiParcels
          }
          visible={
            layerVisibility.farmParcels &&
            (layerVisibility.parcelZoneMode === 'parcels' ||
              (layerVisibility.parcelZoneMode === 'zones' &&
                visibleParcels.length > 0))
          }
          selectable={false}
          onlyBorder={false}
        />
        <ZonesLayer
          zones={apiZones}
          visible={
            layerVisibility.farmZones &&
            layerVisibility.parcelZoneMode === 'zones' &&
            apiZones.length > 0
          }
          showZoneLabels={true}
        />
        <DrawingManagementLayer
          enabled={isDrawingEnabled}
          parcelName={parcelName}
          parcelArea={parcelArea}
          onParcelWithZonesChange={handleParcelWithZonesChange}
          onParcelWithZonesChangeRaw={onParcelWithZonesChange}
          onDrawingChange={handleDrawingChange}
          onDrawingAreaChange={handleDrawingAreaChange}
          drawingMode={drawingMode}
          onClearDrawingRef={clearDrawingRef}
          onChangeModeRef={changeModeRef}
          onRestorePolygonRef={restorePolygonRef}
          hasDrawnFeatures={drawnFeatures.length > 0}
          drawnFeatures={drawnFeatures}
          convertParcelWithZonesToMapParcel={convertParcelWithZonesToMapParcel}
          showOnlyLine={showOnlyLine}
        />
        {/* ParcelLabelLayer removed - labels should not be shown by default in view-parcel */}
        {/* {activeParcelGeometry && activeParcelGeometry.length > 0 && (
          <ParcelLabelLayer
            enabled={true}
            parcelName={parcelName}
            geometry={activeParcelGeometry}
          />
        )} */}
      </Map>
      <DrawingMapButtons
        onChangeModeRef={changeModeRef}
        onClearDrawingRef={clearDrawingRef}
        enabled={isDrawingEnabled}
        showOnlyLine={showOnlyLine}
        hasDrawnFeatures={drawnFeatures.length > 0}
      />
    </div>
  );
}
