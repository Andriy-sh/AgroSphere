'use client';

import React, { useEffect, useRef } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { FeatureCollection, Feature, MultiPolygon } from 'geojson';
import {
  useMapInstance,
  useMapLoaded,
  useMapStyleLoaded,
} from '../context/map-context';

interface VegetationZone {
  zone_area: number;
  zone_p: number;
  fertilizer: number;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  kmean?: number[];
}

interface VegetationLayerProps {
  zonesData?: Array<{ [key: string]: VegetationZone }>;
  visible?: boolean;
  parcelCoordinates?: number[][][][] | null;
  onZoneClick?: (zoneIndex: number, ndvi: number) => void;
}

const SOURCE_ID = 'vegetation-ndvi-source';
const FILL_LAYER_ID = 'vegetation-ndvi-fill';
const PARCEL_BORDER_SOURCE_ID = 'vegetation-parcel-border-source';
const PARCEL_BORDER_LAYER_ID = 'vegetation-parcel-border-line';

function zonesToGeoJSON(
  zones: Array<{ [key: string]: VegetationZone }>
): FeatureCollection<MultiPolygon> {
  const features: Feature<MultiPolygon>[] = zones.map((z, index) => {
    const zoneKey = Object.keys(z)[0]; // zone_1, zone_2, etc.
    const zoneData = z[zoneKey];
    const rawCoords = zoneData.geometry.coordinates;

    let correctedCoords: number[][][][] = [];

    if (Array.isArray(rawCoords) && rawCoords.length > 0) {
      const firstItem = rawCoords[0];
      if (
        Array.isArray(firstItem) &&
        Array.isArray(firstItem[0]) &&
        typeof firstItem[0][0] === 'number'
      ) {
        correctedCoords = (rawCoords as number[][][]).map(
          (ring: number[][]) => [ring]
        );
      } else if (
        Array.isArray(firstItem) &&
        Array.isArray(firstItem[0]) &&
        Array.isArray(firstItem[0][0]) &&
        typeof firstItem[0][0][0] === 'number'
      ) {
        correctedCoords = rawCoords as number[][][][];
      }
    }

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'MultiPolygon' as const,
        coordinates: correctedCoords,
      },
      properties: {
        zoneIndex: index,
        zoneKey: zoneKey,
        ndvi: zoneData.kmean?.[0] ?? 0,
        zoneArea: zoneData.zone_area,
        zoneP: zoneData.zone_p,
        fertilizer: zoneData.fertilizer,
      },
    };
  });

  const validFeatures = features.filter(
    (f) => f.geometry.coordinates.length > 0
  );

  return {
    type: 'FeatureCollection',
    features: validFeatures,
  };
}

function getNdviRange(zones: Array<{ [key: string]: VegetationZone }>): {
  min: number;
  max: number;
} {
  const values = zones
    .map((z) => {
      const key = Object.keys(z)[0];
      return z[key].kmean?.[0] ?? 0;
    })
    .filter((v) => !isNaN(v) && isFinite(v));

  if (values.length === 0) {
    return { min: 0, max: 1 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return { min: Math.max(0, min - 0.1), max: min + 0.1 };
  }

  return { min, max };
}

function ndviColorExpression(min: number, max: number): mapboxgl.Expression {
  const range = max - min;

  if (range < 0.1) {
    return [
      'step',
      ['get', 'ndvi'],
      '#d7191c',
      min + range * 0.5,
      '#ffffbf',
      max,
      '#1a9641',
    ];
  }

  const step1 = min + range * 0.25;
  const step2 = min + range * 0.5;
  const step3 = min + range * 0.75;

  return [
    'interpolate',
    ['linear'],
    ['get', 'ndvi'],
    min,
    '#d7191c',
    step1,
    '#fdae61',
    step2,
    '#ffffbf',
    step3,
    '#abdda4',
    max,
    '#1a9641',
  ];
}

export const VegetationLayer: React.FC<VegetationLayerProps> = ({
  zonesData = [],
  visible = true,
  parcelCoordinates = null,
  onZoneClick,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const styleLoaded = useMapStyleLoaded();
  const layersInitializedRef = useRef(false);
  const clickHandlerRef = useRef<
    ((e: mapboxgl.MapLayerMouseEvent) => void) | null
  >(null);

  useEffect(() => {
    if (!map || !styleLoaded || !visible || zonesData.length === 0) {
      if (map) {
        try {
          if (map.getLayer(FILL_LAYER_ID)) {
            map.removeLayer(FILL_LAYER_ID);
          }
          if (map.getSource(SOURCE_ID)) {
            map.removeSource(SOURCE_ID);
          }
          layersInitializedRef.current = false;
        } catch (error) {
          console.error('Error cleaning up VegetationLayer:', error);
        }
      }
      return;
    }

    try {
      const geojson = zonesToGeoJSON(zonesData);

      if (geojson.features.length === 0) {
        return;
      }

      const { min, max } = getNdviRange(zonesData);

      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: geojson,
        });
      } else {
        const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
        source.setData(geojson);
      }

      if (!map.getLayer(FILL_LAYER_ID)) {
        map.addLayer({
          id: FILL_LAYER_ID,
          type: 'fill',
          source: SOURCE_ID,
          paint: {
            'fill-color': ndviColorExpression(min, max),
            'fill-opacity': 0.7,
            'fill-antialias': true,
            'fill-outline-color': 'transparent',
          },
        });
      } else {
        map.setPaintProperty(
          FILL_LAYER_ID,
          'fill-color',
          ndviColorExpression(min, max)
        );
        map.setPaintProperty(FILL_LAYER_ID, 'fill-opacity', 0.7);
        map.setPaintProperty(FILL_LAYER_ID, 'fill-antialias', true);
        map.setPaintProperty(
          FILL_LAYER_ID,
          'fill-outline-color',
          'transparent'
        );
      }

      if (onZoneClick && !clickHandlerRef.current) {
        clickHandlerRef.current = (e: mapboxgl.MapLayerMouseEvent) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const zoneIndex = feature.properties?.zoneIndex;
            const ndvi = feature.properties?.ndvi;

            if (typeof zoneIndex === 'number' && typeof ndvi === 'number') {
              onZoneClick(zoneIndex, ndvi);
            }
          }
        };

        map.on('click', FILL_LAYER_ID, clickHandlerRef.current);
      }

      if (parcelCoordinates && parcelCoordinates.length > 0) {
        const parcelGeoJSON: FeatureCollection<MultiPolygon> = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'MultiPolygon',
                coordinates: parcelCoordinates,
              },
              properties: {},
            },
          ],
        };

        if (!map.getSource(PARCEL_BORDER_SOURCE_ID)) {
          map.addSource(PARCEL_BORDER_SOURCE_ID, {
            type: 'geojson',
            data: parcelGeoJSON,
          });
        } else {
          const parcelSource = map.getSource(
            PARCEL_BORDER_SOURCE_ID
          ) as mapboxgl.GeoJSONSource;
          parcelSource.setData(parcelGeoJSON);
        }

        if (!map.getLayer(PARCEL_BORDER_LAYER_ID)) {
          map.addLayer({
            id: PARCEL_BORDER_LAYER_ID,
            type: 'line',
            source: PARCEL_BORDER_SOURCE_ID,
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 3,
              'line-opacity': 1,
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
          });
        }

        try {
          map.moveLayer(PARCEL_BORDER_LAYER_ID);
        } catch {}
      }

      layersInitializedRef.current = true;
    } catch (error) {
      layersInitializedRef.current = false;
    }

    return () => {
      try {
        if (clickHandlerRef.current && map) {
          map.off('click', FILL_LAYER_ID, clickHandlerRef.current);
          clickHandlerRef.current = null;
        }

        if (map) {
          if (map.getLayer(FILL_LAYER_ID)) {
            map.removeLayer(FILL_LAYER_ID);
          }
          if (map.getSource(SOURCE_ID)) {
            map.removeSource(SOURCE_ID);
          }
          if (map.getLayer(PARCEL_BORDER_LAYER_ID)) {
            map.removeLayer(PARCEL_BORDER_LAYER_ID);
          }
          if (map.getSource(PARCEL_BORDER_SOURCE_ID)) {
            map.removeSource(PARCEL_BORDER_SOURCE_ID);
          }
        }

        layersInitializedRef.current = false;
      } catch (error) {
        console.error('Error during VegetationLayer cleanup:', error);
      }
    };
  }, [
    map,
    mapLoaded,
    styleLoaded,
    zonesData,
    visible,
    onZoneClick,
    parcelCoordinates,
  ]);

  useEffect(() => {
    if (
      !map ||
      !styleLoaded ||
      !visible ||
      zonesData.length === 0 ||
      !layersInitializedRef.current
    ) {
      return;
    }

    try {
      const geojson = zonesToGeoJSON(zonesData);

      if (geojson.features.length === 0) {
        return;
      }

      const { min, max } = getNdviRange(zonesData);
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | null;

      if (source) {
        source.setData(geojson);

        if (map.getLayer(FILL_LAYER_ID)) {
          map.setPaintProperty(
            FILL_LAYER_ID,
            'fill-color',
            ndviColorExpression(min, max)
          );
        }
      }
    } catch (error) {
      console.error('Error updating VegetationLayer data:', error);
    }
  }, [map, styleLoaded, zonesData, visible]);

  useEffect(() => {
    if (
      !map ||
      !styleLoaded ||
      !visible ||
      !parcelCoordinates ||
      parcelCoordinates.length === 0 ||
      !layersInitializedRef.current
    ) {
      return;
    }

    try {
      const parcelGeoJSON: FeatureCollection<MultiPolygon> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'MultiPolygon',
              coordinates: parcelCoordinates,
            },
            properties: {},
          },
        ],
      };

      const parcelSource = map.getSource(
        PARCEL_BORDER_SOURCE_ID
      ) as mapboxgl.GeoJSONSource | null;

      if (parcelSource) {
        parcelSource.setData(parcelGeoJSON);
      } else if (map.getLayer(PARCEL_BORDER_LAYER_ID)) {
        map.addSource(PARCEL_BORDER_SOURCE_ID, {
          type: 'geojson',
          data: parcelGeoJSON,
        });
      }
    } catch (error) {
      console.error('Error updating parcel border:', error);
    }
  }, [map, styleLoaded, visible, parcelCoordinates]);

  useEffect(() => {
    if (!map || !styleLoaded) return;

    if (!visible) {
      try {
        if (map.getLayer(FILL_LAYER_ID)) {
          map.removeLayer(FILL_LAYER_ID);
        }
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
        if (map.getLayer(PARCEL_BORDER_LAYER_ID)) {
          map.removeLayer(PARCEL_BORDER_LAYER_ID);
        }
        if (map.getSource(PARCEL_BORDER_SOURCE_ID)) {
          map.removeSource(PARCEL_BORDER_SOURCE_ID);
        }
        layersInitializedRef.current = false;

        if (clickHandlerRef.current) {
          map.off('click', FILL_LAYER_ID, clickHandlerRef.current);
          clickHandlerRef.current = null;
        }
      } catch (error) {
        console.error(
          'Error cleaning up VegetationLayer when visible=false:',
          error
        );
      }
      return;
    }
  }, [map, styleLoaded, visible]);

  useEffect(() => {
    if (!map || !styleLoaded || !visible) return;

    try {
      if (map.getLayer(FILL_LAYER_ID)) {
        map.setLayoutProperty(FILL_LAYER_ID, 'visibility', 'visible');
      }
    } catch {
      // Ignore errors
    }
  }, [map, styleLoaded, visible]);

  return null;
};
