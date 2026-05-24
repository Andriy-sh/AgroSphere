'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

interface DrawingFeature {
  id: string;
  type: 'Feature';
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'LineString'; coordinates: number[][] };
  properties: Record<string, unknown>;
}

export function ParcelSplitMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [currentMode, setCurrentMode] = useState<
    'polygon' | 'line_string' | 'simple_select' | null
  >(null);
  const [drawnFeatures, setDrawnFeatures] = useState<DrawingFeature[]>([]);
  const [polygonArea, setPolygonArea] = useState<number>(0);
  const [lineLength, setLineLength] = useState<number>(0);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Mapbox access token is not set');
      return;
    }

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-8.2, 53.4],
      zoom: 12,
    });

    mapRef.current = map;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        trash: true,
      },
      defaultMode: 'simple_select',
    });

    map.addControl(draw);
    drawRef.current = draw;

    const handleDrawCreate = (e: { features: DrawingFeature[] }) => {
      if (e.features && e.features.length > 0) {
        const createdFeature = e.features[0];

        if (createdFeature.geometry.type === 'Polygon' && draw) {
          const allFeatures = draw.getAll().features as DrawingFeature[];
          const polygonCount = allFeatures.filter(
            (f) => f.geometry.type === 'Polygon'
          ).length;

          if (polygonCount > 1) {
            draw.delete(createdFeature.id);
            return;
          }

          setTimeout(() => {
            if (draw && map) {
              draw.changeMode('draw_line_string');
              setCurrentMode('line_string');
            }
          }, 100);
        }

        if (createdFeature.geometry.type === 'LineString' && draw) {
          const allFeatures = draw.getAll().features as DrawingFeature[];
          const polygons = allFeatures.filter(
            (f) => f.geometry.type === 'Polygon'
          );

          if (polygons.length === 0) {
            draw.delete(createdFeature.id);
            updateDrawings();
            return;
          }

          let hasValidSplit = false;

          for (const polygon of polygons) {
            const splitResult = splitPolygonWithLine(polygon, createdFeature);

            if (splitResult && splitResult.length > 0) {
              hasValidSplit = true;

              draw.delete(polygon.id);
              draw.delete(createdFeature.id);

              splitResult.forEach((splitPoly) => {
                draw.add(splitPoly);
              });

              draw.changeMode('simple_select');
              setCurrentMode(null);

              updateDrawings();
              return;
            }
          }

          if (!hasValidSplit && draw) {
            draw.delete(createdFeature.id);
            updateDrawings();
          }
        }

        updateDrawings(createdFeature);
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
      } else {
        setCurrentMode(null);
      }
    };

    map.on('draw.create', handleDrawCreate);
    map.on('draw.delete', handleDrawDelete);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.modechange', handleDrawModeChange);

    return () => {
      map.off('draw.create', handleDrawCreate);
      map.off('draw.delete', handleDrawDelete);
      map.off('draw.update', handleDrawUpdate);
      map.off('draw.modechange', handleDrawModeChange);
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const splitPolygonWithLine = useCallback(
    (
      polygon: DrawingFeature,
      line: DrawingFeature
    ): DrawingFeature[] | null => {
      try {
        const polygonTurf = turf.polygon(
          polygon.geometry.coordinates as number[][][]
        );
        const lineTurf = turf.lineString(
          line.geometry.coordinates as number[][]
        );

        const intersection = turf.lineIntersect(lineTurf, polygonTurf);

        if (!intersection || intersection.features.length < 2) {
          return null;
        }

        const bufferedLineResult = turf.buffer(lineTurf, 0.000001, {
          units: 'kilometers',
        });

        if (
          !bufferedLineResult ||
          bufferedLineResult.geometry.type !== 'Polygon'
        ) {
          return null;
        }

        const bufferedLine =
          bufferedLineResult as GeoJSON.Feature<GeoJSON.Polygon>;

        let splittedPolygon: GeoJSON.Feature<
          GeoJSON.Polygon | GeoJSON.MultiPolygon
        > | null = null;

        try {
          const featureCollection = turf.featureCollection([
            polygonTurf,
            bufferedLine,
          ]);
          const turfAny = turf as Record<string, unknown>;
          if (typeof turfAny.difference === 'function') {
            try {
              splittedPolygon = (
                turfAny.difference as (
                  fc: GeoJSON.FeatureCollection
                ) => GeoJSON.Feature<
                  GeoJSON.Polygon | GeoJSON.MultiPolygon
                > | null
              )(featureCollection);
            } catch {
              splittedPolygon = (
                turfAny.difference as (
                  poly1: GeoJSON.Feature<GeoJSON.Polygon>,
                  poly2: GeoJSON.Feature<GeoJSON.Polygon>
                ) => GeoJSON.Feature<
                  GeoJSON.Polygon | GeoJSON.MultiPolygon
                > | null
              )(polygonTurf, bufferedLine);
            }
          }
        } catch (error) {
          return null;
        }

        if (!splittedPolygon) {
          return null;
        }

        let polygons: GeoJSON.Feature<GeoJSON.Polygon>[] = [];

        if (splittedPolygon.geometry.type === 'Polygon') {
          polygons = [splittedPolygon as GeoJSON.Feature<GeoJSON.Polygon>];
        } else if (splittedPolygon.geometry.type === 'MultiPolygon') {
          const multiPoly =
            splittedPolygon as GeoJSON.Feature<GeoJSON.MultiPolygon>;
          polygons = multiPoly.geometry.coordinates.map((coords) =>
            turf.polygon(coords)
          );
        }

        if (polygons.length === 0) {
          return null;
        }

        const splitPolygons: DrawingFeature[] = polygons
          .map((feature, index) => {
            return {
              id: `${polygon.id}_split_${index + 1}`,
              type: 'Feature' as const,
              geometry: {
                type: 'Polygon' as const,
                coordinates: feature.geometry.coordinates as number[][][],
              },
              properties: {
                ...polygon.properties,
                split_index: index + 1,
              },
            };
          })
          .filter((poly) => {
            try {
              const area = turf.area(turf.polygon(poly.geometry.coordinates));
              return area > 0;
            } catch {
              return false;
            }
          });

        return splitPolygons.length > 0 ? splitPolygons : null;
      } catch (error) {
        console.error('Error splitting polygon:', error);
        return null;
      }
    },
    []
  );

  const calculatePolygonArea = useCallback((features: DrawingFeature[]) => {
    const polygons = features.filter(
      (f) => f.geometry.type === 'Polygon'
    ) as DrawingFeature[];

    if (polygons.length === 0) {
      setPolygonArea(0);
      return;
    }

    try {
      const totalArea = polygons.reduce((sum, feature) => {
        const polygon = turf.polygon(
          feature.geometry.coordinates as number[][][]
        );
        const areaInSquareMeters = turf.area(polygon);
        return sum + areaInSquareMeters;
      }, 0);

      const areaInHectares = totalArea / 10000;
      setPolygonArea(areaInHectares);
    } catch {
      setPolygonArea(0);
    }
  }, []);

  const calculateLineLength = useCallback((features: DrawingFeature[]) => {
    const lines = features.filter(
      (f) => f.geometry.type === 'LineString'
    ) as DrawingFeature[];

    if (lines.length === 0) {
      setLineLength(0);
      return;
    }

    try {
      const totalLength = lines.reduce((sum, feature) => {
        const line = turf.lineString(
          feature.geometry.coordinates as number[][]
        );
        const lengthInMeters = turf.length(line, { units: 'meters' });
        return sum + lengthInMeters;
      }, 0);

      setLineLength(totalLength);
    } catch {
      setLineLength(0);
    }
  }, []);

  const updateDrawings = useCallback(
    (createdFeature?: DrawingFeature) => {
      if (!drawRef.current) return;

      const features = drawRef.current.getAll().features as DrawingFeature[];
      setDrawnFeatures(features);
      calculatePolygonArea(features);
      calculateLineLength(features);
    },
    [calculatePolygonArea, calculateLineLength]
  );

  const switchDrawingMode = useCallback(
    (mode: 'polygon' | 'line_string' | null) => {
      if (!drawRef.current || !mapRef.current) return;

      const hasPolygon = drawnFeatures.some(
        (f) => f.geometry.type === 'Polygon'
      );

      if (mode === 'polygon' && hasPolygon) {
        return;
      }

      if (currentMode === mode) {
        drawRef.current.changeMode('simple_select');
        setCurrentMode(null);
      } else {
        setCurrentMode(mode);
        if (mode === 'polygon') {
          drawRef.current.changeMode('draw_polygon');
        } else if (mode === 'line_string') {
          drawRef.current.changeMode('draw_line_string');
        }
      }
    },
    [currentMode, drawnFeatures]
  );

  const clearAll = useCallback(() => {
    if (!drawRef.current || !mapRef.current) return;
    drawRef.current.deleteAll();
    updateDrawings();
    setCurrentMode(null);
  }, [updateDrawings]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-white p-4 shadow-md flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => switchDrawingMode('polygon')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentMode === 'polygon'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={drawnFeatures.some((f) => f.geometry.type === 'Polygon')}
          >
            Draw Parcel
          </button>
          <button
            onClick={() => switchDrawingMode('line_string')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentMode === 'line_string'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={!drawnFeatures.some((f) => f.geometry.type === 'Polygon')}
          >
            Draw Split Line
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="flex gap-6 ml-auto">
          <div className="text-sm">
            <span className="font-semibold">Total Area: </span>
            <span>{polygonArea.toFixed(2)} ha</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Line Length: </span>
            <span>{lineLength.toFixed(2)} m</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Polygons: </span>
            <span>
              {
                drawnFeatures.filter((f) => f.geometry.type === 'Polygon')
                  .length
              }
            </span>
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} className="flex-1 w-full" />

      <div className="bg-gray-50 p-4 border-t">
        <div className="max-w-4xl mx-auto text-sm text-gray-600">
          <p className="font-semibold mb-2">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Click &quot;Draw Parcel&quot; to draw a polygon parcel on the map
            </li>
            <li>
              After drawing the parcel, you can click &quot;Draw Split
              Line&quot; to draw a line that splits the parcel
            </li>
            <li>
              The line must intersect the polygon at at least 2 points to split
              it
            </li>
            <li>
              The polygon will be automatically split using the turf.js
              buffer/difference method
            </li>
            <li>
              Use &quot;Clear All&quot; to remove all drawings and start over
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
