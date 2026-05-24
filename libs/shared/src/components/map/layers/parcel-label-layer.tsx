'use client';

import React, { useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import type { Polygon as GeoJSONPolygon } from 'geojson';
import { useMapContext } from '../context/map-context';

const ACTIVE_PARCEL_LABEL_SOURCE = 'view-parcel-active-label-source';
const ACTIVE_PARCEL_LABEL_LAYER = 'view-parcel-active-label-layer';

type LatLng = [number, number];

interface ParcelLabelLayerProps {
  enabled: boolean;
  parcelName?: string;
  geometry: LatLng[] | null;
}

const ensureClosedRing = (ring: LatLng[]): LatLng[] => {
  if (ring.length === 0) {
    return ring;
  }

  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];

  if (firstLng === lastLng && firstLat === lastLat) {
    return ring;
  }

  return [...ring, ring[0]];
};

export const ParcelLabelLayer: React.FC<ParcelLabelLayerProps> = ({
  enabled,
  parcelName,
  geometry,
}) => {
  const { map, mapLoaded, styleLoaded } = useMapContext();

  const removeLabel = useCallback(() => {
    if (!map) return;

    if (map.getLayer(ACTIVE_PARCEL_LABEL_LAYER)) {
      map.removeLayer(ACTIVE_PARCEL_LABEL_LAYER);
    }

    if (map.getSource(ACTIVE_PARCEL_LABEL_SOURCE)) {
      map.removeSource(ACTIVE_PARCEL_LABEL_SOURCE);
    }
  }, [map]);

  const updateLabel = useCallback(
    (ring: LatLng[] | null) => {
      if (!map || !mapLoaded || !styleLoaded || !ring || ring.length < 3) {
        removeLabel();
        return;
      }

      const closedRing = ensureClosedRing(ring);
      const polygon = turf.polygon([
        closedRing.map(([lng, lat]) => [
          lng,
          lat,
        ]) as GeoJSONPolygon['coordinates'][0],
      ]);
      const areaHa = turf.area(polygon) / 10000;
      
      const centroid = turf.centroid(polygon);
      const [centroidLng, centroidLat] = centroid.geometry.coordinates;
      
      const coordinatesLabel = `${centroidLat.toFixed(6)}, ${centroidLng.toFixed(6)}`;
      
      const featureCollection = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [centroidLng, centroidLat],
            },
            properties: {
              parcelName: parcelName ?? '',
              parcelAreaLabel: `${areaHa.toFixed(1)} ha`,
              coordinatesLabel: coordinatesLabel,
            },
          },
        ],
      };

      const source = map.getSource(ACTIVE_PARCEL_LABEL_SOURCE) as
        | mapboxgl.GeoJSONSource
        | undefined;
      if (!source) {
        map.addSource(ACTIVE_PARCEL_LABEL_SOURCE, {
          type: 'geojson',
          data: featureCollection,
        });
      } else {
        source.setData(featureCollection);
      }

      if (!map.getLayer(ACTIVE_PARCEL_LABEL_LAYER)) {
        map.addLayer({
          id: ACTIVE_PARCEL_LABEL_LAYER,
          type: 'symbol',
          source: ACTIVE_PARCEL_LABEL_SOURCE,
          layout: {
            'text-field': [
              'format',
              ['get', 'parcelName'],
              { 'font-scale': 1 },
              '\n',
              {},
              ['get', 'parcelAreaLabel'],
              { 'font-scale': 0.9 },
              '\n',
              {},
              ['get', 'coordinatesLabel'],
              { 'font-scale': 0.85 },
            ],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
            'text-size': 12,
            'text-anchor': 'center',
            'text-justify': 'center',
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'text-line-height': 1.2,
          },
          paint: {
            'text-color': '#FFFFFF',
            'text-halo-color': 'rgba(0,0,0,0)',
            'text-halo-width': 0,
            'text-opacity': ['step', ['zoom'], 0, 14.5, 0, 14.5001, 1],
          },
        });
      }
    },
    [map, mapLoaded, styleLoaded, parcelName, removeLabel]
  );

  useEffect(() => {
    if (!enabled || !mapLoaded || !styleLoaded) {
      removeLabel();
      return;
    }

    updateLabel(geometry);

    return () => {
      removeLabel();
    };
  }, [enabled, mapLoaded, styleLoaded, geometry, updateLabel, removeLabel]);

  return null;
};

