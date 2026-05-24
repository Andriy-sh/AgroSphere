import { useEffect, useState, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

interface DrawingFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: Record<string, unknown>;
}

interface UseMapPolygonUnionProps {
  map: mapboxgl.Map | null;
  draw: MapboxDraw | null;
  enabled: boolean;
  onDrawingChange?: (features: DrawingFeature[]) => void;
  onDrawingAreaChange?: (area: number) => void;
}

export function useMapPolygonUnion({
  map,
  draw,
  enabled,
  onDrawingChange,
  onDrawingAreaChange,
}: UseMapPolygonUnionProps) {
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<string[]>([]);
  const [canUnion, setCanUnion] = useState(false);
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const isUnitingRef = useRef(false);

  useEffect(() => {
    if (!map || !draw || !enabled) {
      setSelectedPolygonIds([]);
      setCanUnion(false);
      setCurrentMode(null);
      return;
    }

    const handleSelectionChange = () => {
      if (isUnitingRef.current) {
        return;
      }

      const selectedFeatures = draw.getSelected();
      const polygonFeatures = selectedFeatures.features.filter(
        (feature) => feature.geometry.type === 'Polygon'
      );

      const polygonIds = polygonFeatures
        .map((feature) => feature.id)
        .filter((id): id is string => typeof id === 'string');

      setSelectedPolygonIds(polygonIds);
    };

    const handleModeChange = (e: { mode: string }) => {
      const mode = e.mode;
      setCurrentMode(mode);
      if (mode !== 'simple_select') {
        setSelectedPolygonIds([]);
        setCanUnion(false);
      } else {
        handleSelectionChange();
      }
    };

    map.on('draw.selectionchange', handleSelectionChange);
    map.on('draw.modechange', handleModeChange);

    try {
      const mode = (draw as { getMode?: () => string }).getMode?.();
      if (mode) {
        setCurrentMode(mode);
      }
      handleSelectionChange();
    } catch {
      return;
    }

    return () => {
      map.off('draw.selectionchange', handleSelectionChange);
      map.off('draw.modechange', handleModeChange);
    };
  }, [map, draw, enabled]);

  useEffect(() => {
    setCanUnion(
      currentMode === 'simple_select' && selectedPolygonIds.length >= 2
    );
  }, [currentMode, selectedPolygonIds]);

  const unionPolygons = useCallback(() => {
    if (!draw || !map || selectedPolygonIds.length < 2) {
      return;
    }

    try {
      isUnitingRef.current = true;

      const allFeatures = draw.getAll();
      const selectedPolygons = allFeatures.features.filter(
        (feature) =>
          typeof feature.id === 'string' &&
          selectedPolygonIds.includes(feature.id) &&
          feature.geometry.type === 'Polygon'
      ) as GeoJSON.Feature<GeoJSON.Polygon>[];

      if (selectedPolygons.length < 2) {
        isUnitingRef.current = false;
        return;
      }

      const validPolygons = selectedPolygons.filter(
        (poly) => poly.geometry.type === 'Polygon'
      ) as GeoJSON.Feature<GeoJSON.Polygon>[];

      if (validPolygons.length < 2) {
        isUnitingRef.current = false;
        return;
      }

      let unionResult: GeoJSON.Feature<
        GeoJSON.Polygon | GeoJSON.MultiPolygon
      > | null = null;

      try {
        unionResult = validPolygons[0];

        for (let i = 1; i < validPolygons.length; i++) {
          const currentPolygon = validPolygons[i];

          if (!unionResult) {
            throw new Error('Union result is null');
          }

          const unioned = (turf.union as any)(
            unionResult,
            currentPolygon
          ) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;

          if (!unioned) {
            throw new Error(`Union failed for polygon ${i}`);
          }

          unionResult = unioned;
        }

        if (!unionResult) {
          throw new Error('Union returned null');
        }
      } catch (error) {
        isUnitingRef.current = false;
        return;
      }

      selectedPolygonIds.forEach((id) => {
        draw.delete(id);
      });

      const unionFeature: DrawingFeature = {
        id: `union-${Date.now()}`,
        type: 'Feature',
        geometry: unionResult.geometry,
        properties: unionResult.properties || {},
      };

      draw.add(unionFeature as GeoJSON.Feature);

      const updatedFeatures = draw.getAll().features as DrawingFeature[];

      onDrawingChange?.(updatedFeatures);

      draw.changeMode('simple_select');
      setSelectedPolygonIds([]);
      setCanUnion(false);
    } catch (error) {
      console.error('Error in unionPolygons:', error);
    } finally {
      isUnitingRef.current = false;
    }
  }, [draw, map, selectedPolygonIds, onDrawingChange]);

  return {
    selectedPolygonIds,
    canUnion,
    unionPolygons,
  };
}
