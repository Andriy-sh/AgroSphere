'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { Feature as GeoJsonFeature } from 'geojson';
import * as turf from '@turf/turf';
import { useMapInstance, useMapLoaded } from '../context/map-context';
import { DrawingControls } from '../components/drawing-controls';
import { Button } from '../../button/button';
import { useMapPolygonUnion } from '../hooks/use-map-polygon-union';

const BRAND_DRAW_STROKE_COLOR = '#29B54C';
const BRAND_DRAW_FILL_COLOR = '#00AF4D';
const BRAND_DRAW_FILL_OPACITY = 0.12;

const brandMapboxDrawStyles = [
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': BRAND_DRAW_FILL_COLOR,
      'fill-opacity': BRAND_DRAW_FILL_OPACITY,
    },
  },
  {
    id: 'gl-draw-lines',
    type: 'line',
    filter: ['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': BRAND_DRAW_STROKE_COLOR,
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-point-outer',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': '#ffffff',
    },
  },
  {
    id: 'gl-draw-point-inner',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': BRAND_DRAW_STROKE_COLOR,
    },
  },
  {
    id: 'gl-draw-vertex-outer',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': '#ffffff',
    },
  },
  {
    id: 'gl-draw-vertex-inner',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': BRAND_DRAW_STROKE_COLOR,
    },
  },
  {
    id: 'gl-draw-midpoint',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': BRAND_DRAW_STROKE_COLOR,
    },
  },
] as unknown as mapboxgl.AnyLayer[];

export interface DrawingFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: Record<string, unknown>;
}

interface DrawingLayerProps {
  enabled?: boolean;
  enablePolygonSplitting?: boolean;
  drawingMode?:
    | 'draw_polygon'
    | 'draw_line_string'
    | 'simple_select'
    | 'direct_select';
  onDrawingChange?: (features: DrawingFeature[]) => void;
  onDrawingAreaChange?: (area: number) => void;
  onClearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  onChangeModeRef?: React.MutableRefObject<((mode: string) => void) | null>;
  onRestorePolygonRef?: React.MutableRefObject<
    ((geometry: any, parcelName?: string, parcelArea?: number) => void) | null
  >;
  parcelName?: string;
  parcelArea?: number;
  onDeleteLastParcel?: () => void;
  hasDrawnFeatures?: boolean;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  enabled = false,
  enablePolygonSplitting = false,
  drawingMode = 'draw_polygon',
  onDrawingChange,
  onDrawingAreaChange,
  onClearDrawingRef,
  onChangeModeRef,
  onRestorePolygonRef,
  parcelName,
  parcelArea,
  onDeleteLastParcel,
  hasDrawnFeatures = false,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const [currentDraw, setCurrentDraw] = useState<MapboxDraw | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const updateDrawingArea = useCallback(
    (features: DrawingFeature[]) => {
      if (features.length > 0) {
        try {
          const area = turf.area(turf.featureCollection(features as any));
          const areaInHectares = area / 10000;
          onDrawingAreaChange?.(areaInHectares);
        } catch {
          onDrawingAreaChange?.(0);
        }
      } else {
        onDrawingAreaChange?.(0);
      }
    },
    [onDrawingAreaChange]
  );

  const polygonUnion = useMapPolygonUnion({
    map,
    draw: currentDraw,
    enabled: (enabled || enablePolygonSplitting) && mapLoaded,
    onDrawingChange,
    onDrawingAreaChange,
  });

  useEffect(() => {
    if (!map || !mapLoaded) return;

    if (enabled || enablePolygonSplitting) {
      if (!drawRef.current) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: false,
            line_string: false,
            trash: false,
            point: false,
            combine_features: false,
            uncombine_features: false,
          },
          defaultMode: drawingMode,
          styles: brandMapboxDrawStyles,
        });

        map.addControl(draw);
        drawRef.current = draw;
        setCurrentDraw(draw);

        map.on('draw.create', (e) => {
          if (draw) {
            const features = draw.getAll().features as DrawingFeature[];
            updateDrawingArea(features);
            onDrawingChange?.(features);

            if (
              enabled &&
              !enablePolygonSplitting &&
              drawingMode === 'draw_polygon'
            ) {
              const drawEvent = e as { features?: GeoJsonFeature[] };
              const createdFeature = drawEvent.features?.[0];
              if (
                createdFeature &&
                (createdFeature.geometry.type === 'Polygon' ||
                  createdFeature.geometry.type === 'MultiPolygon')
              ) {
                setTimeout(() => {
                  try {
                    draw.changeMode('simple_select');
                    if (onChangeModeRef?.current) {
                      onChangeModeRef.current('simple_select');
                    }
                  } catch {
                    // Error handled silently
                  }
                }, 100);
              }
            }
          }
        });

        map.on('draw.delete', () => {
          if (draw) {
            const features = draw.getAll().features as DrawingFeature[];
            updateDrawingArea(features);
            onDrawingChange?.(features);
          }
        });

        map.on('draw.update', () => {
          if (draw) {
            const features = draw.getAll().features as DrawingFeature[];
            updateDrawingArea(features);
            onDrawingChange?.(features);
          }
        });

        if (onChangeModeRef) {
          map.on('draw.modechange', (e: { mode: string }) => {
            if (onChangeModeRef?.current) {
              onChangeModeRef.current(e.mode);
            }
          });
        }
      }
    } else if (drawRef.current && map) {
      map.removeControl(drawRef.current);
      drawRef.current = null;
      setCurrentDraw(null);
    }

    return () => {
      if (drawRef.current && map) {
        map.removeControl(drawRef.current);
        drawRef.current = null;
        setCurrentDraw(null);
      }
    };
  }, [
    map,
    mapLoaded,
    enabled,
    enablePolygonSplitting,
    drawingMode,
    onDrawingChange,
    updateDrawingArea,
    onChangeModeRef,
  ]);

  useEffect(() => {
    if (
      drawRef.current &&
      (enabled || enablePolygonSplitting) &&
      map &&
      currentDraw
    ) {
      try {
        (drawRef.current as any).changeMode(drawingMode);
      } catch {
        // Error handled silently
      }
    }
  }, [drawingMode, enabled, enablePolygonSplitting, map, currentDraw]);

  useEffect(() => {
    if (onClearDrawingRef && currentDraw) {
      onClearDrawingRef.current = () => {
        if (currentDraw) {
          try {
            currentDraw.deleteAll();
            onDrawingChange?.([]);
            onDrawingAreaChange?.(0);
          } catch {
            // Error handled silently
          }
        }
      };
    }
    return () => {
      if (onClearDrawingRef) {
        onClearDrawingRef.current = null;
      }
    };
  }, [onClearDrawingRef, currentDraw, onDrawingChange, onDrawingAreaChange]);

  useEffect(() => {
    if (onChangeModeRef && currentDraw) {
      onChangeModeRef.current = (mode: string) => {
        if (currentDraw) {
          try {
            currentDraw.changeMode(mode);
          } catch {
            // Error handled silently
          }
        }
      };
    }
    return () => {
      if (onChangeModeRef) {
        onChangeModeRef.current = null;
      }
    };
  }, [onChangeModeRef, currentDraw]);

  useEffect(() => {
    if (onRestorePolygonRef && currentDraw) {
      onRestorePolygonRef.current = (
        geometry: any,
        parcelNameParam?: string,
        parcelAreaParam?: number
      ) => {
        if (currentDraw && geometry.type === 'Polygon') {
          const nameToUse = parcelNameParam ?? parcelName ?? '';
          const areaToUse = parcelAreaParam ?? parcelArea ?? 0;

          const feature: GeoJsonFeature = {
            type: 'Feature',
            properties: {
              parcelName: nameToUse,
              parcelAreaLabel:
                areaToUse > 0 ? `${areaToUse.toFixed(1)} ha` : '',
            },
            geometry: {
              type: 'Polygon',
              coordinates: geometry.coordinates,
            },
          };
          try {
            currentDraw.add(feature);
          } catch {
            // Error handled silently
          }
        }
      };
    }
    return () => {
      if (onRestorePolygonRef) {
        onRestorePolygonRef.current = null;
      }
    };
  }, [currentDraw, parcelName, parcelArea, onRestorePolygonRef]);

  useEffect(() => {
    if (enabled && mapLoaded && currentDraw) {
      const style = document.createElement('style');
      style.textContent = `
        .mapbox-gl-draw-polygon,
        .mapbox-gl-draw-line_string,
        .mapbox-gl-draw-trash {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
    return undefined;
  }, [enabled, mapLoaded, currentDraw]);

  if (!enabled && !enablePolygonSplitting) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 flex items-end gap-3">
      {polygonUnion.canUnion && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
          onClick={polygonUnion.unionPolygons}
        >
          <span className="material-symbols-outlined text-lg text-basic-black">
            merge
          </span>
        </Button>
      )}

      {onDeleteLastParcel && enabled && hasDrawnFeatures && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
          onClick={onDeleteLastParcel}
          title="Delete current parcel"
        >
          <span className="material-symbols-outlined text-lg text-basic-black">
            delete
          </span>
        </Button>
      )}

      <div className="flex flex-col space-y-2">
        <DrawingControls
          currentDraw={currentDraw}
          enableDrawing={enabled}
          enablePolygonSplitting={enablePolygonSplitting}
        />
      </div>
    </div>
  );
};

