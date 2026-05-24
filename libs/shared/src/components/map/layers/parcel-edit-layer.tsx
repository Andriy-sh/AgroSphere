'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import { useMapContext } from '../context/map-context';

const PARCEL_EDIT_DRAW_STYLES = [
  {
    id: 'lf-gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': '#29B54C',
      'fill-opacity': 0.1,
    },
  },
  {
    id: 'lf-gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'line-color': '#29B54C',
      'line-width': 3,
    },
  },
  {
    id: 'lf-gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 7,
      'circle-color': '#ffffff',
    },
  },
  {
    id: 'lf-gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#29B54C',
    },
  },
  {
    id: 'lf-gl-draw-midpoint-halo',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 6,
      'circle-color': '#ffffff',
    },
  },
  {
    id: 'lf-gl-draw-midpoint',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 4,
      'circle-color': '#29B54C',
    },
  },
] as unknown as mapboxgl.AnyLayer[];

type LatLng = [number, number];

interface ParcelEditLayerProps {
  enabled: boolean;
  activeParcelId?: string;
  activeParcelGeometry: LatLng[] | null;
  onParcelEdit?: (parcelId: string, coordinates: LatLng[]) => void;
  onGeometryChange?: (geometry: LatLng[] | null) => void;
  drawRef?: React.MutableRefObject<MapboxDraw | null>;
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

export const ParcelEditLayer: React.FC<ParcelEditLayerProps> = ({
  enabled,
  activeParcelId,
  activeParcelGeometry,
  onParcelEdit,
  onGeometryChange,
  drawRef: externalDrawRef,
}) => {
  const { map, mapLoaded, styleLoaded } = useMapContext();
  const internalDrawRef = useRef<MapboxDraw | null>(null);
  const drawRefToUse = externalDrawRef || internalDrawRef;
  const [drawReady, setDrawReady] = useState(false);
  const activeParcelIdRef = useRef<string | undefined>(activeParcelId);
  const onParcelEditRef = useRef<ParcelEditLayerProps['onParcelEdit']>(onParcelEdit);

  useEffect(() => {
    activeParcelIdRef.current = activeParcelId;
  }, [activeParcelId]);

  useEffect(() => {
    onParcelEditRef.current = onParcelEdit;
  }, [onParcelEdit]);

  const handleFeatureChange = useCallback(() => {
    const currentActiveId = activeParcelIdRef.current;
    if (!currentActiveId || !drawRefToUse.current) {
      return;
    }

    const featureCollection = drawRefToUse.current.get(currentActiveId) as
      | FeatureCollection<Polygon>
      | undefined;

    if (
      !featureCollection ||
      !featureCollection.features ||
      featureCollection.features.length === 0
    ) {
      return;
    }

    const feature = featureCollection.features[0];

    if (!feature || feature.geometry.type !== 'Polygon') {
      return;
    }

    const ringCoordinates = feature.geometry.coordinates[0];
    if (!ringCoordinates || ringCoordinates.length === 0) {
      return;
    }

    const normalizedRing = ensureClosedRing(
      ringCoordinates.map(([lng, lat]) => [lng, lat] as LatLng)
    );

    onGeometryChange?.(normalizedRing);

    const callback = onParcelEditRef.current;
    if (callback) {
      callback(currentActiveId, normalizedRing);
    }
  }, [drawRefToUse, onGeometryChange]);

  useEffect(() => {
    if (!map || !mapLoaded || !enabled) {
      if (drawRefToUse.current && map) {
        map.removeControl(drawRefToUse.current);
        drawRefToUse.current = null;
        setDrawReady(false);
      }
      return;
    }

    let isMounted = true;

    const handleDrawUpdate = () => {
      if (isMounted) {
        handleFeatureChange();
      }
    };

    const handleSelectionChange = () => {
      if (isMounted) {
        handleFeatureChange();
      }
    };

    const initializeDraw = () => {
      if (!isMounted || drawRefToUse.current) {
        return;
      }

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        styles: PARCEL_EDIT_DRAW_STYLES,
      });

      map.addControl(draw);
      drawRefToUse.current = draw;
      setDrawReady(true);

      map.on('draw.update', handleDrawUpdate);
      map.on('draw.selectionchange', handleSelectionChange);
    };

    const initOnce = () => {
      initializeDraw();
    };

    if (map.loaded()) {
      initOnce();
    } else {
      map.on('load', initOnce);
    }

    return () => {
      isMounted = false;
      map.off('draw.update', handleDrawUpdate);
      map.off('draw.selectionchange', handleSelectionChange);
      map.off('load', initOnce);
      if (drawRefToUse.current) {
        map.removeControl(drawRefToUse.current);
        drawRefToUse.current = null;
      }
      setDrawReady(false);
    };
  }, [map, mapLoaded, enabled, handleFeatureChange, drawRefToUse]);

  useEffect(() => {
    const draw = drawRefToUse.current;
    if (!draw || !drawReady || !enabled) {
      return;
    }

    draw.deleteAll();

    if (!activeParcelId || !activeParcelGeometry) {
      return;
    }

    const ring = ensureClosedRing(activeParcelGeometry);
    const feature: Feature<Polygon> = {
      id: activeParcelId,
      type: 'Feature',
      properties: {
        parcelId: activeParcelId,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ring as Polygon['coordinates'][0]],
      },
    };

    draw.add(feature);

    try {
      draw.changeMode('direct_select', {
        featureId: activeParcelId,
      });
    } catch {
      // swallow mode change errors
    }
  }, [
    activeParcelId,
    activeParcelGeometry,
    drawReady,
    enabled,
    drawRefToUse,
  ]);

  return null;
};

