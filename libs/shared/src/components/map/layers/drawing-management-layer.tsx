'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { Feature as GeoJsonFeature } from 'geojson';
import * as turf from '@turf/turf';
import { useMapInstance, useMapLoaded } from '../context/map-context';
import { useMapPolygonSplitting } from '../hooks/use-map-polygon-splitting';
import type { ParcelWithZones } from '../hooks/use-map-polygon-splitting';
import { DrawingControls } from '../components/drawing-controls';
import { ManagementZonesContainer } from '../components/management-zones-container';
import { Button } from '../../button/button';
import type { MapParcel } from '../../../types/map';
import type { DownloadVisualGeometry } from '../../../api/types/eosda.types';

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

interface DrawingManagementLayerProps {
  enabled?: boolean;
  parcelName?: string;
  parcelArea?: number;
  onParcelWithZonesChange?: (parcel: MapParcel | null) => void;
  onParcelWithZonesChangeRaw?: (parcel: ParcelWithZones | null) => void;
  onDrawingChange?: (features: DrawingFeature[]) => void;
  onDrawingAreaChange?: (area: number) => void;
  drawingMode?: 'draw_polygon' | 'draw_line_string' | 'simple_select';
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
  onDeleteLastParcel?: () => void;
  hasDrawnFeatures?: boolean;
  drawnFeatures?: DrawingFeature[];
  convertParcelWithZonesToMapParcel?: (
    parcelWithZones: ParcelWithZones
  ) => MapParcel;
  showOnlyLine?: boolean;
}

export const DrawingManagementLayer: React.FC<DrawingManagementLayerProps> = ({
  enabled = false,
  parcelName,
  parcelArea,
  onParcelWithZonesChange,
  onParcelWithZonesChangeRaw,
  onDrawingChange,
  onDrawingAreaChange,
  drawingMode = 'draw_polygon',
  onClearDrawingRef,
  onChangeModeRef,
  onRestorePolygonRef,
  onDeleteLastParcel,
  hasDrawnFeatures = false,
  drawnFeatures = [],
  convertParcelWithZonesToMapParcel,
  showOnlyLine = false,
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

  const polygonSplitting = useMapPolygonSplitting({
    map,
    draw: currentDraw,
    enabled: enabled && mapLoaded,
    parcelName,
    parcelAreaProp: parcelArea,
  });

  useEffect(() => {
    if (!map || !mapLoaded) return;

    if (enabled) {
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

        const handleDrawCreate = (e: any) => {
          if (drawRef.current) {
            try {
              const features = drawRef.current.getAll()
                .features as DrawingFeature[];

              const drawEvent = e as { features?: GeoJsonFeature[] };
              const createdFeature = drawEvent.features?.[0];

              if (
                createdFeature &&
                'geometry' in createdFeature &&
                createdFeature.geometry.type === 'LineString'
              ) {
                const lineId = createdFeature.id;

                setTimeout(() => {
                  if (drawRef.current && lineId) {
                    const currentFeatures = drawRef.current.getAll()
                      .features as DrawingFeature[];
                    const lineStillExists = currentFeatures.some(
                      (f) => String(f.id) === String(lineId)
                    );

                    if (lineStillExists) {
                      try {
                        drawRef.current.delete(String(lineId));
                        const updatedFeatures = drawRef.current.getAll()
                          .features as DrawingFeature[];
                        updateDrawingArea(updatedFeatures);
                        onDrawingChange?.(updatedFeatures);
                      } catch (error) {
                        console.warn('Error deleting line:', error);
                      }
                    }

                    setTimeout(() => {
                      if (drawRef.current) {
                        try {
                          drawRef.current.changeMode('draw_line_string');
                          if (onChangeModeRef?.current) {
                            onChangeModeRef.current('draw_line_string');
                          }
                        } catch (error) {
                          console.warn('Error switching mode:', error);
                        }
                      }
                    }, 100);
                  }
                }, 300);
              }

              updateDrawingArea(features);
              onDrawingChange?.(features);
            } catch (error) {
              console.warn('Error in draw.create handler:', error);
            }
          }
        };

        const handleDrawDelete = () => {
          if (drawRef.current) {
            try {
              const features = drawRef.current.getAll()
                .features as DrawingFeature[];
              updateDrawingArea(features);
              onDrawingChange?.(features);
            } catch (error) {
              console.warn('Error in draw.delete handler:', error);
            }
          }
        };

        const handleDrawUpdate = () => {
          if (drawRef.current) {
            try {
              const features = drawRef.current.getAll()
                .features as DrawingFeature[];
              updateDrawingArea(features);
              onDrawingChange?.(features);
            } catch (error) {
              console.warn('Error in draw.update handler:', error);
            }
          }
        };

        map.on('draw.create', handleDrawCreate);
        map.on('draw.delete', handleDrawDelete);
        map.on('draw.update', handleDrawUpdate);

        const handleDrawModeChange = (e: { mode: string }) => {
          if (onChangeModeRef?.current) {
            onChangeModeRef.current(e.mode);
          }
        };

        if (onChangeModeRef) {
          map.on('draw.modechange', handleDrawModeChange);
        }

        (drawRef.current as any)._drawHandlers = {
          create: handleDrawCreate,
          delete: handleDrawDelete,
          update: handleDrawUpdate,
          modechange: handleDrawModeChange,
        };
      }
    } else if (drawRef.current && map) {
      const handlers = (drawRef.current as any)?._drawHandlers;
      if (handlers) {
        map.off('draw.create', handlers.create);
        map.off('draw.delete', handlers.delete);
        map.off('draw.update', handlers.update);
        if (handlers.modechange) {
          map.off('draw.modechange', handlers.modechange);
        }
      }
      try {
        map.removeControl(drawRef.current);
      } catch (error) {
        console.warn('Error removing draw control:', error);
      }
      drawRef.current = null;
      setCurrentDraw(null);
    }

    return () => {
      if (drawRef.current && map) {
        const handlers = (drawRef.current as any)?._drawHandlers;
        if (handlers) {
          map.off('draw.create', handlers.create);
          map.off('draw.delete', handlers.delete);
          map.off('draw.update', handlers.update);
          if (handlers.modechange) {
            map.off('draw.modechange', handlers.modechange);
          }
        }
        try {
          map.removeControl(drawRef.current);
        } catch (error) {
          console.warn('Error removing draw control:', error);
        }
        drawRef.current = null;
        setCurrentDraw(null);
      }
    };
  }, [
    map,
    mapLoaded,
    enabled,
    drawingMode,
    onDrawingChange,
    updateDrawingArea,
    onChangeModeRef,
  ]);

  useEffect(() => {
    if (drawRef.current && enabled && map && currentDraw) {
      try {
        (drawRef.current as any).changeMode(drawingMode);
      } catch {
        // Error handled silently
      }
    }
  }, [drawingMode, enabled, map, currentDraw]);

  useEffect(() => {
    if (onClearDrawingRef && polygonSplitting?.clearAll) {
      onClearDrawingRef.current = () => {
        if (polygonSplitting?.clearAll) {
          polygonSplitting.clearAll();
          onDrawingChange?.([]);
          onDrawingAreaChange?.(0);
        }
      };
    }
    return () => {
      if (onClearDrawingRef) {
        onClearDrawingRef.current = null;
      }
    };
  }, [
    onClearDrawingRef,
    polygonSplitting?.clearAll,
    onDrawingChange,
    onDrawingAreaChange,
  ]);

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
            currentDraw.deleteAll();
            currentDraw.add(feature);
            setTimeout(() => {
              try {
                const allFeatures = currentDraw.getAll();
                if (allFeatures.features.length > 0) {
                  const addedFeature = allFeatures.features[0];
                  currentDraw.changeMode('simple_select');
                }
              } catch {
                // Error handled silently
              }
            }, 100);
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

  useEffect(() => {
    if (enabled && mapLoaded && currentDraw && drawnFeatures.length > 0) {
      try {
        const currentFeatures = currentDraw.getAll()
          .features as DrawingFeature[];
        const currentFeatureIds = new Set(currentFeatures.map((f) => f.id));
        const propFeatureIds = new Set(drawnFeatures.map((f) => f.id));

        const needsUpdate =
          currentFeatures.length !== drawnFeatures.length ||
          !drawnFeatures.every((f) => currentFeatureIds.has(f.id));

        if (needsUpdate) {
          currentDraw.deleteAll();
          drawnFeatures.forEach((feature) => {
            try {
              currentDraw.add(feature as any);
            } catch (error) {
              console.warn('Error adding feature to map:', error);
            }
          });
        }
      } catch (error) {
        console.warn('Error syncing drawnFeatures:', error);
      }
    }
  }, [enabled, mapLoaded, currentDraw, drawnFeatures]);

  const previousParcelWithZonesRef = useRef<ParcelWithZones | null>(null);
  const zonesCountRef = useRef<number>(0);
  const savedParcelWithZonesSnapshotRef = useRef<ParcelWithZones | null>(null);
  const unsavedChangesSnapshotRef = useRef<ParcelWithZones | null>(null);
  const originalParcelSnapshotRef = useRef<ParcelWithZones | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (
      enabled &&
      polygonSplitting &&
      onParcelWithZonesChange &&
      convertParcelWithZonesToMapParcel
    ) {
      const parcelWithZones = polygonSplitting.getParcelWithZones();
      const currentZonesCount = parcelWithZones?.zones?.length || 0;

      const previousParcel = previousParcelWithZonesRef.current;
      const hasChanged =
        !previousParcel ||
        !parcelWithZones ||
        previousParcel.parcelId !== parcelWithZones.parcelId ||
        previousParcel.zones.length !== parcelWithZones.zones.length ||
        previousParcel.splitLines.length !==
          parcelWithZones.splitLines.length ||
        zonesCountRef.current !== currentZonesCount;

      if (hasChanged) {
        if (currentZonesCount === 0 && parcelWithZones) {
          originalParcelSnapshotRef.current = JSON.parse(
            JSON.stringify(parcelWithZones)
          );
        }

        const previousZonesCount = zonesCountRef.current;
        if (currentZonesCount !== previousZonesCount) {
          if (savedParcelWithZonesSnapshotRef.current) {
            unsavedChangesSnapshotRef.current =
              savedParcelWithZonesSnapshotRef.current
                ? JSON.parse(
                    JSON.stringify(savedParcelWithZonesSnapshotRef.current)
                  )
                : null;
          }
        }

        zonesCountRef.current = currentZonesCount;
        previousParcelWithZonesRef.current = parcelWithZones
          ? JSON.parse(JSON.stringify(parcelWithZones))
          : null;

        if (parcelWithZones) {
          const mapParcel = convertParcelWithZonesToMapParcel(parcelWithZones);
          onParcelWithZonesChange?.(mapParcel);
          onParcelWithZonesChangeRaw?.(parcelWithZones);
        } else {
          onParcelWithZonesChange?.(null);
          onParcelWithZonesChangeRaw?.(null);
        }
      }
    }
  }, [
    enabled,
    polygonSplitting,
    onParcelWithZonesChange,
    onParcelWithZonesChangeRaw,
    convertParcelWithZonesToMapParcel,
  ]);

  if (!enabled || !mapLoaded) {
    return null;
  }

  return (
    <>
      <div className="absolute bottom-4 right-4 flex items-end gap-3">
        {polygonSplitting?.canMerge && (
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
            onClick={polygonSplitting.mergeZones}
          >
            <span className="material-symbols-outlined text-lg text-basic-black">
              linked_services
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
            enablePolygonSplitting={!showOnlyLine}
            showOnlyLine={showOnlyLine}
          />
        </div>
      </div>

      {convertParcelWithZonesToMapParcel && (
        <ManagementZonesContainer
          enabled={enabled}
          polygonSplitting={polygonSplitting}
          hasUnsavedChanges={hasUnsavedChanges}
          onHasUnsavedChangesChange={setHasUnsavedChanges}
          savedParcelWithZonesSnapshotRef={savedParcelWithZonesSnapshotRef}
          unsavedChangesSnapshotRef={unsavedChangesSnapshotRef}
          originalParcelSnapshotRef={originalParcelSnapshotRef}
          previousParcelWithZonesRef={previousParcelWithZonesRef}
          zonesCountRef={zonesCountRef}
          onParcelWithZonesChange={onParcelWithZonesChange}
          convertParcelWithZonesToMapParcel={convertParcelWithZonesToMapParcel}
        />
      )}
    </>
  );
};
