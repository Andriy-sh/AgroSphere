import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { useZoneSelection } from './use-zone-selection';
import { useZoneSelectionVisualization } from './use-zone-selection-visualization';
import {
  MAP_SOURCE_IDS,
  MAP_LAYER_IDS,
  type DrawingMode,
  type DrawingFeature,
  type ParcelWithZones,
  type UseMapPolygonSplittingProps,
  type PolygonProperties,
} from './polygon-splitting-constants';
import { calculatePolygonArea, calculateLineLength, splitPolygonByLine } from './polygon-splitting-geometry';
import { extractZoneNumber, getNextZoneName, updateParcelArea, getSelectedZoneInfo } from './polygon-splitting-zone-utils';
import { mergeZones } from './polygon-splitting-zone-operations';
import { updateLabels } from './polygon-splitting-labels';
import { createDrawCreateHandler } from './polygon-splitting-draw-create-handler';

export { type ParcelWithZones } from './polygon-splitting-constants';

export function useMapPolygonSplitting({
  map,
  draw,
  enabled,
  parcelName,
  parcelAreaProp,
}: UseMapPolygonSplittingProps) {
  const zonesDataRef = useRef<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const parcelWithZonesRef = useRef<ParcelWithZones | null>(null);
  const zoneNameCounterRef = useRef<number>(0);

  const [currentMode, setCurrentMode] = useState<DrawingMode>(null);
  const [drawnFeatures, setDrawnFeatures] = useState<DrawingFeature[]>([]);
  const [polygonArea, setPolygonArea] = useState<number>(0);
  const [parcelArea, setParcelArea] = useState<number>(0);
  const [lineLength, setLineLength] = useState<number>(0);
  const [, setSelectedDrawFeatureIds] = useState<string[]>([]);

  const {
    selectedZoneId,
    selectedZoneIds,
    toggleZoneSelection,
    clearZoneSelection,
    setSelectedZoneId,
    setSelectedZoneIds,
  } = useZoneSelection();

  useZoneSelectionVisualization(map, selectedZoneIds);

  const wrappedCalculatePolygonArea = useCallback(
    (features: DrawingFeature[]) => {
      calculatePolygonArea(features, setPolygonArea);
    },
    []
  );

  const wrappedCalculateLineLength = useCallback(
    (features: DrawingFeature[]) => {
      calculateLineLength(features, setLineLength);
    },
    []
  );

  const wrappedGetNextZoneName = useCallback(() => {
    return getNextZoneName(parcelWithZonesRef, zoneNameCounterRef, extractZoneNumber);
  }, []);

  const wrappedUpdateParcelArea = useCallback(() => {
    updateParcelArea(parcelWithZonesRef, setParcelArea);
  }, []);

  const wrappedUpdateLabels = useCallback(() => {
    if (map && draw) {
      updateLabels(map, draw, parcelName, parcelAreaProp, parcelWithZonesRef, zonesDataRef);
    }
  }, [map, draw, parcelName, parcelAreaProp]);

  const wrappedGetSelectedZoneInfo = useCallback(() => {
    return getSelectedZoneInfo(selectedZoneId, zonesDataRef);
  }, [selectedZoneId]);

  useEffect(() => {
    if (!map || !draw) {
      return;
    }
    wrappedUpdateLabels();
  }, [map, draw, wrappedUpdateLabels]);

  const updateDrawings = useCallback(
    (createdFeature?: DrawingFeature) => {
      if (!draw) return;

      const features = draw.getAll().features as DrawingFeature[];
      setDrawnFeatures(features);
      wrappedCalculatePolygonArea(features);
      wrappedCalculateLineLength(features);

      if (map && draw) {
        wrappedUpdateLabels();
      }
    },
    [draw, map, wrappedCalculatePolygonArea, wrappedCalculateLineLength, wrappedUpdateLabels]
  );

  useEffect(() => {
    if (map && map.getLayer(MAP_LAYER_IDS.ZONES_SELECTED)) {
      map.setFilter(MAP_LAYER_IDS.ZONES_SELECTED, [
        '==',
        ['get', 'zone_id'],
        selectedZoneId || '',
      ]);
    }
  }, [selectedZoneId, map]);

  const wrappedMergeZones = useCallback(() => {
    if (!map || !draw) return;
    mergeZones(
      map,
      draw,
      selectedZoneIds,
      zonesDataRef,
      parcelWithZonesRef,
      zoneNameCounterRef,
      wrappedGetNextZoneName,
      extractZoneNumber,
      wrappedUpdateParcelArea,
      wrappedUpdateLabels,
      setParcelArea,
      setSelectedZoneIds,
      setSelectedZoneId
    );
  }, [
    map,
    draw,
    selectedZoneIds,
    wrappedGetNextZoneName,
    wrappedUpdateParcelArea,
    wrappedUpdateLabels,
  ]);

  const canMerge = selectedZoneIds.length >= 2;

  const switchDrawingMode = useCallback(
    (mode: DrawingMode) => {
      if (!draw || !map) return;

      const hasPolygon = drawnFeatures.some(
        (f) => f.geometry.type === 'Polygon'
      );
      if (mode === 'polygon' && hasPolygon) {
        return;
      }

      if (currentMode === mode) {
        draw.changeMode('simple_select');
        setCurrentMode(null);
      } else {
        setCurrentMode(mode);
        if (mode === 'polygon') {
          draw.changeMode('draw_polygon');
        } else if (mode === 'line_string') {
          draw.changeMode('draw_line_string');
        }
      }
    },
    [currentMode, drawnFeatures, draw, map]
  );

  const clearAll = useCallback(() => {
    if (!draw || !map) return;
    draw.deleteAll();

    zonesDataRef.current = {
      type: 'FeatureCollection',
      features: [],
    };
    zoneNameCounterRef.current = 0;
    const zonesSourceId = MAP_SOURCE_IDS.ZONES;
    if (map.getSource(zonesSourceId)) {
      const zonesSource = map.getSource(
        zonesSourceId
      ) as mapboxgl.GeoJSONSource;
      zonesSource.setData(zonesDataRef.current);
    }

    setSelectedZoneId(null);
    setSelectedZoneIds([]);
    parcelWithZonesRef.current = null;
    setParcelArea(0);
    updateDrawings();
    setCurrentMode(null);
  }, [updateDrawings, draw, map, setSelectedZoneId, setSelectedZoneIds]);

  const getParcelWithZones = useCallback((): ParcelWithZones | null => {
    return parcelWithZonesRef.current;
  }, []);

  const restoreParcelWithZones = useCallback(
    (parcelToRestore: ParcelWithZones | null) => {
      if (!draw || !map) return;

      draw.deleteAll();

      zonesDataRef.current = {
        type: 'FeatureCollection',
        features: [],
      };

      if (!parcelToRestore) {
        parcelWithZonesRef.current = null;
        setParcelArea(0);
        setPolygonArea(0);
        setLineLength(0);
        setDrawnFeatures([]);
        setCurrentMode(null);
        setSelectedZoneId(null);
        setSelectedZoneIds([]);
        zoneNameCounterRef.current = 0;

        const sourceId = MAP_SOURCE_IDS.ZONES;
        if (map.getSource(sourceId)) {
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData(zonesDataRef.current);
        }

        wrappedUpdateLabels();
        return;
      }

      parcelWithZonesRef.current = JSON.parse(JSON.stringify(parcelToRestore));

      if (parcelToRestore.zones.length > 0) {
        const maxZoneNumber = parcelToRestore.zones.reduce((max, zone) => {
          const num = extractZoneNumber(zone.zoneName);
          return num !== null ? Math.max(max, num) : max;
        }, 0);
        zoneNameCounterRef.current = maxZoneNumber;
      } else {
        zoneNameCounterRef.current = 0;
      }

      if (parcelToRestore.zones.length === 0) {
        const sourceId = MAP_SOURCE_IDS.ZONES;
        if (map.getSource(sourceId)) {
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData({
            type: 'FeatureCollection',
            features: [],
          });
        }

        const closedCoords = [
          ...parcelToRestore.parcelCoordinates,
          parcelToRestore.parcelCoordinates[0],
        ];
        const parcelFeature: GeoJSON.Feature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [closedCoords],
          },
          properties: {},
        };
        draw.add(parcelFeature);
      } else {
        parcelToRestore.zones.forEach((zone) => {
          const closedCoords = [...zone.coordinates, zone.coordinates[0]];
          const zoneFeature: GeoJSON.Feature = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [closedCoords],
            },
            properties: {
              zone_id: zone.zoneId,
              zone_name: zone.zoneName,
              parent_parcel_id: parcelToRestore.parcelId,
              draw_feature_id: '',
              area: zone.area || 0,
            },
          };
          zonesDataRef.current.features.push(zoneFeature);
        });

        const sourceId = MAP_SOURCE_IDS.ZONES;
        if (map.getSource(sourceId)) {
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData(zonesDataRef.current);
        } else {
          map.addSource(sourceId, {
            type: 'geojson',
            data: zonesDataRef.current,
          });
        }
      }

      const totalArea =
        parcelToRestore.zones.length === 0
          ? parcelToRestore.area || 0
          : parcelToRestore.zones.reduce(
              (sum, zone) => sum + (zone.area || 0),
              0
            );
      setParcelArea(totalArea / 10000);
      setPolygonArea(totalArea / 10000);

      const features: DrawingFeature[] = [];
      if (parcelToRestore.zones.length === 0) {
        const closedCoords = [
          ...parcelToRestore.parcelCoordinates,
          parcelToRestore.parcelCoordinates[0],
        ];
        features.push({
          id: parcelToRestore.parcelId,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [closedCoords],
          },
          properties: {},
        });
      }
      setDrawnFeatures(features);

      wrappedUpdateLabels();

      draw.changeMode('simple_select');
      setCurrentMode(null);
      setSelectedZoneId(null);
      setSelectedZoneIds([]);

      map.triggerRepaint();
    },
    [
      draw,
      map,
      extractZoneNumber,
      wrappedUpdateLabels,
      setSelectedZoneId,
      setSelectedZoneIds,
    ]
  );

  const getParcelArea = useCallback((): number => {
    if (parcelArea > 0) {
      return parcelArea;
    }
    return polygonArea;
  }, [parcelArea, polygonArea]);

  useEffect(() => {
    if (!enabled || !map || !draw) return;

    const handleDrawCreate = (e: { features: DrawingFeature[] }) => {
      if (e.features && e.features.length > 0) {
        const createdFeature = e.features[0];
        createDrawCreateHandler(
          createdFeature,
          draw,
          map,
          zonesDataRef,
          parcelWithZonesRef,
          zoneNameCounterRef,
          wrappedUpdateParcelArea,
          updateDrawings,
          toggleZoneSelection,
          setCurrentMode
        );
      } else {
        updateDrawings();
      }
    };

    const handleDrawDelete = () => {
      updateDrawings();
    };

    const handleDrawUpdate = () => {
      updateDrawings();
    };

    const handleDrawModeChange = (e: { mode: string }) => {
      const mode = e.mode;
      if (mode === 'draw_polygon') {
        setCurrentMode('polygon');
      } else if (mode === 'draw_line_string') {
        setCurrentMode('line_string');
      } else if (mode === 'direct_select') {
        if (draw) {
          const selected = draw.getSelected();
          const selectedIds = selected.features
            .filter((f) => f.geometry.type === 'Polygon')
            .map((f) => f.id)
            .filter((id): id is string => typeof id === 'string');
          setSelectedDrawFeatureIds(selectedIds);
        }
      } else {
        setCurrentMode(null);
        setSelectedDrawFeatureIds([]);
      }
    };

    const handleDrawSelectionChange = () => {
      if (!draw) return;
      const selected = draw.getSelected();
      const selectedIds = selected.features
        .filter((f) => f.geometry.type === 'Polygon')
        .map((f) => f.id)
        .filter((id): id is string => typeof id === 'string');
      setSelectedDrawFeatureIds(selectedIds);
    };

    map.on('draw.create', handleDrawCreate);
    map.on('draw.delete', handleDrawDelete);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.modechange', handleDrawModeChange);
    map.on('draw.selectionchange', handleDrawSelectionChange);

    return () => {
      map.off('draw.create', handleDrawCreate);
      map.off('draw.delete', handleDrawDelete);
      map.off('draw.update', handleDrawUpdate);
      map.off('draw.modechange', handleDrawModeChange);
      map.off('draw.selectionchange', handleDrawSelectionChange);
    };
  }, [
    enabled,
    map,
    draw,
    updateDrawings,
    wrappedUpdateParcelArea,
    toggleZoneSelection,
  ]);

  return {
    currentMode,
    drawnFeatures,
    polygonArea,
    lineLength,
    selectedZoneId,
    selectedZoneIds,
    getSelectedZoneInfo: wrappedGetSelectedZoneInfo,
    switchDrawingMode,
    clearAll,
    zonesDataRef,
    getParcelWithZones,
    getParcelArea,
    toggleZoneSelection,
    clearZoneSelection,
    mergeZones: wrappedMergeZones,
    canMerge,
    restoreParcelWithZones,
  };
}

