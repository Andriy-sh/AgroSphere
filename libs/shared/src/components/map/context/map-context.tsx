'use client';

import React, { createContext, useContext, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export interface MapContextValue {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  styleLoaded: boolean;
  zoomTo: (center: [number, number], zoom?: number) => void;
  fitBounds: (bounds: mapboxgl.LngLatBoundsLike, options?: mapboxgl.FitBoundsOptions) => void;
  flyTo: (options: Parameters<mapboxgl.Map['flyTo']>[0]) => void;
  getZoom: () => number | undefined;
  getCenter: () => mapboxgl.LngLat | undefined;
  getBounds: () => mapboxgl.LngLatBounds | undefined;
  resize: () => void;
}

const MapContext = createContext<MapContextValue | null>(null);

export interface MapProviderProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  styleLoaded: boolean;
  children: React.ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({
  map,
  mapLoaded,
  styleLoaded,
  children,
}) => {
  const zoomTo = useCallback(
    (center: [number, number], zoom?: number) => {
      if (!map) return;
      if (zoom !== undefined) {
        map.setCenter(center);
        map.setZoom(zoom);
      } else {
        map.setCenter(center);
      }
    },
    [map]
  );

  const fitBounds = useCallback(
    (bounds: mapboxgl.LngLatBoundsLike, options?: mapboxgl.FitBoundsOptions) => {
      if (!map) return;
      map.fitBounds(bounds, options);
    },
    [map]
  );

  const flyTo = useCallback(
    (options: Parameters<mapboxgl.Map['flyTo']>[0]) => {
      if (!map) return;
      map.flyTo(options);
    },
    [map]
  );

  const getZoom = useCallback(() => {
    if (!map) return undefined;
    return map.getZoom();
  }, [map]);

  const getCenter = useCallback(() => {
    if (!map) return undefined;
    return map.getCenter();
  }, [map]);

  const getBounds = useCallback(() => {
    if (!map) return undefined;
    const bounds = map.getBounds();
    return bounds ?? undefined;
  }, [map]);

  const resize = useCallback(() => {
    if (!map) return;
    map.resize();
  }, [map]);

  const value: MapContextValue = {
    map,
    mapLoaded,
    styleLoaded,
    zoomTo,
    fitBounds,
    flyTo,
    getZoom,
    getCenter,
    getBounds,
    resize,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = (): MapContextValue => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

export const useMapInstance = (): mapboxgl.Map | null => {
  const context = useMapContext();
  return context.map;
};

export const useMapLoaded = (): boolean => {
  const context = useMapContext();
  return context.mapLoaded;
};

export const useMapStyleLoaded = (): boolean => {
  const context = useMapContext();
  return context.styleLoaded;
};

