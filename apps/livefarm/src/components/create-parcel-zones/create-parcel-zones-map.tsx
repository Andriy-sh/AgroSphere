'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  Map,
  FarmsLayer,
  ParcelsLayer,
  DrawingManagementLayer,
  ImageOverlayLayer,
  type DrawingFeature,
} from '@@agrosphere/shared';
import { ParcelWithZones } from '@@agrosphere/shared';
import type {
  MapParcel,
  MapMultiPolygon,
  MapCoordinate,
  FarmMarker,
  DownloadVisualGeometry,
} from '@@agrosphere/shared';
import mapboxgl from 'mapbox-gl';
import type { Feature as GeoJsonFeature } from 'geojson';

interface CreateParcelZonesMapProps {
  onMapSizeChange?: (size: number) => void;
  selectedFarm?: {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
  } | null;
  onDrawingChange?: (features: unknown[]) => void; // Can accept DrawingFeature[] or unknown[]
  onDrawingAreaChange?: (area: number) => void;
  onParcelWithZonesChange?: (parcelWithZones: ParcelWithZones | null) => void;
  enableDrawing?: boolean;
  drawingMode?: 'draw_polygon' | 'draw_line_string' | 'simple_select';
  parcels?: MapParcel[];
  onDeleteLastParcel?: () => void;
  parcelName?: string;
  parcelArea?: number;
  onClearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  onChangeModeRef?: React.MutableRefObject<((mode: string) => void) | null>;
  onRestorePolygonRef?: React.MutableRefObject<
    | ((
        geometry: DownloadVisualGeometry,
        parcelName?: string,
        parcelArea?: number
      ) => void)
    | null
  >;
  hasDrawnFeatures?: boolean;
  imageUrl?: string | null;
  savedGeometry?: DownloadVisualGeometry | null;
  onMapRefRef?: React.MutableRefObject<React.MutableRefObject<mapboxgl.Map | null> | null>;
}

export function CreateParcelZonesMap({
  onMapSizeChange,
  selectedFarm,
  onDrawingChange,
  onDrawingAreaChange,
  onParcelWithZonesChange,
  enableDrawing = false,
  drawingMode = 'draw_polygon',
  parcels = [],
  onDeleteLastParcel,
  parcelName,
  parcelArea,
  onClearDrawingRef,
  onChangeModeRef,
  onRestorePolygonRef,
  hasDrawnFeatures = false,
  imageUrl,
  savedGeometry,
  onMapRefRef,
}: CreateParcelZonesMapProps) {
  const [mapSize, setMapSize] = useState(40);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (onMapRefRef) {
      onMapRefRef.current = mapRef;
    }
  }, [onMapRefRef]);

  const handleMapSizeChange = useCallback(
    (size: number) => {
      let newSize = 40;
      if (size >= 50) {
        newSize = 100;
      } else {
        newSize = 40;
      }
      setMapSize(newSize);
      onMapSizeChange?.(newSize);
    },
    [onMapSizeChange]
  );

  useEffect(() => {
    if (selectedFarm && mapRef.current && mapRef.current.isStyleLoaded()) {
      mapRef.current.flyTo({
        center: [selectedFarm.longitude, selectedFarm.latitude],
        zoom: 15,
        speed: 1,
        curve: 1.5,
        easing: (t) => t,
        duration: 1000,
      });
    } else if (selectedFarm && mapRef.current) {
      const checkMapReady = () => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
          mapRef.current.flyTo({
            center: [selectedFarm.longitude, selectedFarm.latitude],
            zoom: 15,
            speed: 1,
            curve: 1.5,
            easing: (t) => t,
            duration: 1000,
          });
        } else {
          setTimeout(checkMapReady, 100);
        }
      };
      checkMapReady();
    } else if (selectedFarm) {
      return;
    }
  }, [selectedFarm]);

  const farmMarkers = useMemo<FarmMarker[]>(() => {
    if (!selectedFarm) {
      return [];
    }

    const latitude =
      typeof selectedFarm.latitude === 'string'
        ? parseFloat(selectedFarm.latitude)
        : selectedFarm.latitude;
    const longitude =
      typeof selectedFarm.longitude === 'string'
        ? parseFloat(selectedFarm.longitude)
        : selectedFarm.longitude;

    if (
      latitude === undefined ||
      longitude === undefined ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return [];
    }

    return [
      {
        id: selectedFarm.id,
        longitude,
        latitude,
        title: selectedFarm.label,
        status: 'active',
        type: 'farm',
        name: selectedFarm.label,
        visible: true,
        color: '#29B54C',
        clientId: selectedFarm.id,
      },
    ];
  }, [selectedFarm]);

  const isDrawingEnabled = useMemo(() => {
    return enableDrawing && !!selectedFarm;
  }, [enableDrawing, selectedFarm]);

  const convertParcelToParcelWithZones = useCallback(
    (parcelWithZones: ParcelWithZones): MapParcel => {
      const extractCoordinates = (coords: number[][]): MapMultiPolygon => {
        if (coords.length === 0) {
          return [];
        }
        const closedCoords = [...coords, coords[0]] as [number, number][];
        return [[closedCoords]];
      };

      const zones = parcelWithZones.zones.map((zone) => ({
        id: zone.zoneId,
        name: zone.zoneName || zone.zoneId,
        area: zone.area,
        coordinates: extractCoordinates(zone.coordinates),
        // fillColor: '#FFFFFF',
        // borderColor: '#FFFFFF',
        // fillOpacity: 0.12,
        // borderWidth: 1,
        visible: true,
        parcelId: parcelWithZones.parcelId,
        parcelName: parcelName || parcelWithZones.parcelId,
      }));

      const splitLines = parcelWithZones.splitLines.map((line, index) => ({
        id: `${parcelWithZones.parcelId}-split-${index + 1}`,
        coordinates: line.coordinates as MapCoordinate[],
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
        name: parcelName || parcelWithZones.parcelId,
        area: parcelWithZones.area,
        coordinates: parcelCoords,
        zones,
        splitLines,
        drawnFeatures,
        createdAt: new Date().toISOString(),
        visible: true,
      };
    },
    [parcelName]
  );

  const convertMapParcelToParcelWithZones = useCallback(
    (parcel: MapParcel): ParcelWithZones => {
      const extractCoordinates = (multiPolygon: number[][][][]): number[][] => {
        if (multiPolygon.length > 0 && multiPolygon[0].length > 0) {
          return multiPolygon[0][0];
        }
        return [];
      };

      let parcelCoordinates = extractCoordinates(parcel.coordinates);

      if (
        parcelCoordinates.length === 0 &&
        parcel.drawnFeatures &&
        parcel.drawnFeatures.length > 0
      ) {
        const polygonFeature = parcel.drawnFeatures.find((feature) => {
          return (
            feature.geometry?.type === 'Polygon' ||
            feature.geometry?.type === 'MultiPolygon'
          );
        }) as GeoJsonFeature | undefined;

        if (polygonFeature?.geometry) {
          if (polygonFeature.geometry.type === 'Polygon') {
            parcelCoordinates = (polygonFeature.geometry.coordinates[0] ||
              []) as number[][];
          } else if (polygonFeature.geometry.type === 'MultiPolygon') {
            const multi = polygonFeature.geometry.coordinates;
            if (multi.length > 0 && multi[0].length > 0) {
              parcelCoordinates = multi[0][0] as number[][];
            }
          }
        }
      }

      const zones = (parcel.zones || []).map((zone) => ({
        zoneId: zone.id,
        zoneName: zone.name,
        coordinates: extractCoordinates(zone.coordinates),
        area: zone.area,
      }));

      return {
        parcelId: parcelName || parcel.id || '',
        parcelCoordinates,
        zones,
        splitLines: (parcel.splitLines || []).map((line) => ({
          coordinates: line.coordinates,
        })),
        area: parcelArea || parcel.area,
      };
    },
    [parcelName, parcelArea]
  );

  const handleParcelWithZones = useCallback(
    (parcel: MapParcel | null) => {
      if (!onParcelWithZonesChange) {
        return;
      }

      if (!parcel) {
        onParcelWithZonesChange(null);
        return;
      }

      onParcelWithZonesChange(convertMapParcelToParcelWithZones(parcel));
    },
    [convertMapParcelToParcelWithZones, onParcelWithZonesChange]
  );

  // Wrapper to convert DrawingFeature[] to unknown[] for compatibility
  const handleDrawingChange = useCallback(
    (features: DrawingFeature[]) => {
      if (onDrawingChange) {
        onDrawingChange(features as unknown[]);
      }
    },
    [onDrawingChange]
  );

  const mapComponent = useMemo(
    () => (
      <Map
        ref={mapRef}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        currentMapSize={mapSize}
        onMapSizeChange={handleMapSizeChange}
        layerVisibility={{
          farmLocations: true,
          farmParcels: true,
          farmZones: true,
          showTasks: false,
        }}
        isTaskDetail={true}
        showMapboxControls={false}
        showLayerSelector={true}
        showSearch={true}
        showSizeControls={true}
        showFullscreenButton={true}
      >
        <FarmsLayer farms={farmMarkers} />
        {/* 
          Parcels from JSON (farm-data.json):
          - Loaded via useFarmData hook in use-create-parcel-zones-form.ts
          - Converted to MapParcel[] via convertParcelDataToMapParcel()
          - Passed as parcels={mapParcels} prop
          - Displayed here via ParcelsLayer
          
          JSON structure:
          {
            "id": "1A",
            "name": "Mollys",
            "type": "parcel",
            "area": 12.82,
            "geometry": [[lng, lat], ...],
            "children": [],
            "eosdaFieldId": "10821338"
          }
        */}
        <ParcelsLayer parcels={parcels} visible={true} />
        {imageUrl && savedGeometry && (
          <ImageOverlayLayer
            imageUrl={imageUrl}
            savedGeometry={savedGeometry}
          />
        )}
        {/* DrawingManagementLayer рендериться останнім, щоб бути поверх всіх інших слоїв */}
        {isDrawingEnabled && (
          <DrawingManagementLayer
            enabled={true}
            parcelName={parcelName}
            parcelArea={parcelArea}
            onParcelWithZonesChange={handleParcelWithZones}
            onDrawingChange={handleDrawingChange}
            onDrawingAreaChange={onDrawingAreaChange}
            drawingMode={drawingMode}
            onClearDrawingRef={onClearDrawingRef}
            onChangeModeRef={onChangeModeRef}
            onRestorePolygonRef={onRestorePolygonRef}
            onDeleteLastParcel={onDeleteLastParcel}
            hasDrawnFeatures={hasDrawnFeatures}
            convertParcelWithZonesToMapParcel={convertParcelToParcelWithZones}
          />
        )}
      </Map>
    ),
    [
      mapSize,
      handleMapSizeChange,
      farmMarkers,
      isDrawingEnabled,
      drawingMode,
      onDrawingChange,
      onDrawingAreaChange,
      handleParcelWithZones,
      parcels,
      onDeleteLastParcel,
      parcelName,
      parcelArea,
      onClearDrawingRef,
      onChangeModeRef,
      onRestorePolygonRef,
      hasDrawnFeatures,
      imageUrl,
      savedGeometry,
    ]
  );

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-sm overflow-hidden ${
        mapSize === 100 ? 'w-full h-full' : 'h-full'
      }`}
      style={{
        width: mapSize === 40 ? '40%' : mapSize === 100 ? '100%' : '40%',
        minWidth: mapSize === 40 ? '40vw' : mapSize === 100 ? '100vw' : '40vw',
      }}
    >
      <div className="flex-1 min-h-0 relative">{mapComponent}</div>
    </div>
  );
}
