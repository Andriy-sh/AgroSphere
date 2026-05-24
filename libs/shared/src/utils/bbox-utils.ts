import * as turf from '@turf/turf';
import React from 'react';
import mapboxgl from 'mapbox-gl';

export interface BboxZoomOptions {
  padding?: number;
  duration?: number;
  essential?: boolean;
}

/**
 * Zoom to farm zones using mapRef
 * Uses calculateZoomBbox internally for consistency
 * @deprecated Consider using zoomToItemsWithRef for new code
 */
export const zoomToFarmBbox = (
  mapRef: React.MutableRefObject<any>,
  farmZones: Array<{ coordinates: [number, number][][][] }>,
  farmCenter: { longitude: number; latitude: number },
  options: BboxZoomOptions = {}
) => {
  if (!mapRef?.current) return;

  const { padding = 50, duration = 1500, essential = true } = options;

  // Try to use new utility function first
  const bounds = calculateZoomBbox(farmZones);
  if (bounds) {
    try {
      mapRef.current.fitBounds(bounds, {
        padding,
        duration,
        essential,
      });
      return;
    } catch (error) {
      // Fall through to fallback
    }
  }

  // Fallback to center if no zones or zoom failed
  mapRef.current.flyTo({
    center: [farmCenter.longitude, farmCenter.latitude],
    zoom: 14,
    duration,
    essential,
  });
};

/**
 * Zoom to client zones using mapRef
 * Uses calculateZoomBbox internally for consistency
 * @deprecated Consider using zoomToItemsWithRef for new code
 */
export const zoomToClientBbox = (
  mapRef: React.MutableRefObject<any>,
  clientZones: Array<{ coordinates: [number, number][][][] }>,
  clientCenter: { longitude: number; latitude: number },
  options: BboxZoomOptions = {}
) => {
  if (!mapRef?.current) return;

  const { padding = 50, duration = 1000, essential = true } = options;

  // Try to use new utility function first
  const bounds = calculateZoomBbox(clientZones);
  if (bounds) {
    try {
      mapRef.current.fitBounds(bounds, {
        padding,
        duration,
        essential,
      });
      return;
    } catch (error) {
      // Fall through to fallback
    }
  }

  // Fallback to center if no zones or zoom failed
  mapRef.current.flyTo({
    center: [clientCenter.longitude, clientCenter.latitude],
    zoom: 12,
    duration,
    essential,
  });
};

export const zoomToParcelBbox = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null> | null,
  parcelCoordinates: number[][],
  options: BboxZoomOptions = {}
) => {
  if (
    !mapRef?.current ||
    !parcelCoordinates ||
    parcelCoordinates.length === 0
  ) {
    return;
  }

  const { padding = 50, duration = 1500, essential = true } = options;

  try {
    const closedCoordinates = [...parcelCoordinates];
    if (
      closedCoordinates.length > 0 &&
      (closedCoordinates[0][0] !==
        closedCoordinates[closedCoordinates.length - 1][0] ||
        closedCoordinates[0][1] !==
          closedCoordinates[closedCoordinates.length - 1][1])
    ) {
      closedCoordinates.push(closedCoordinates[0]);
    }

    const polygon = turf.polygon([closedCoordinates]);
    const bbox = turf.bbox(polygon);

    mapRef.current.fitBounds(bbox as mapboxgl.LngLatBoundsLike, {
      padding,
      duration,
      essential,
    });
  } catch (error) {
    try {
      const centerLng =
        parcelCoordinates.reduce((sum, coord) => sum + coord[0], 0) /
        parcelCoordinates.length;
      const centerLat =
        parcelCoordinates.reduce((sum, coord) => sum + coord[1], 0) /
        parcelCoordinates.length;

      mapRef.current.flyTo({
        center: [centerLng, centerLat],
        zoom: 15,
        duration,
        essential,
      });
    } catch (fallbackError) {
      console.error('Failed to zoom to parcel:', fallbackError);
    }
  }
};

/**
 * Calculate bounding box from an array of parcels/zones with MultiPolygon coordinates
 * @param items Array of items with MultiPolygon coordinates (parcels, zones, etc.)
 * @returns Bounding box in Mapbox format [[minLng, minLat], [maxLng, maxLat]] or null if invalid
 */
export const calculateZoomBbox = (
  items: Array<{ coordinates: [number, number][][][]; visible?: boolean }>
): [[number, number], [number, number]] | null => {
  if (!items || items.length === 0) return null;

  try {
    // Filter out items with invalid coordinates
    const validItems = items.filter(
      (item) =>
        item.coordinates &&
        Array.isArray(item.coordinates) &&
        item.coordinates.length > 0 &&
        item.visible !== false
    );

    if (validItems.length === 0) return null;

    // Convert items to GeoJSON features
    const features = validItems
      .map((item) => {
        try {
          return turf.multiPolygon(item.coordinates);
        } catch {
          return null;
        }
      })
      .filter((feature) => feature !== null);

    if (features.length === 0) return null;

    // Create feature collection and calculate bounding box
    const featureCollection = turf.featureCollection(features);
    const bbox = turf.bbox(featureCollection);

    // Convert to Mapbox bounds format: [[minLng, minLat], [maxLng, maxLat]]
    return [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ];
  } catch (error) {
    console.error('Failed to calculate zoom bbox:', error);
    return null;
  }
};

/**
 * Zoom to parcels/zones using fitBounds function from map context
 * @param items Array of items with MultiPolygon coordinates (parcels, zones, etc.)
 * @param fitBounds Function from useMapContext
 * @param options Zoom options
 */
export const zoomToItems = (
  items: Array<{ coordinates: [number, number][][][]; visible?: boolean }>,
  fitBounds: (
    bounds: mapboxgl.LngLatBoundsLike,
    options?: mapboxgl.FitBoundsOptions
  ) => void,
  options: BboxZoomOptions = {}
): void => {
  const { padding = 60, duration = 1500, essential = true } = options;

  const bounds = calculateZoomBbox(items);
  if (!bounds) return;

  fitBounds(bounds, {
    padding,
    duration,
    essential,
  });
};

/**
 * Zoom to parcels/zones using mapRef (for backward compatibility)
 * @param mapRef React ref to mapboxgl.Map
 * @param items Array of items with MultiPolygon coordinates (parcels, zones, etc.)
 * @param options Zoom options
 */
export const zoomToItemsWithRef = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null> | null,
  items: Array<{ coordinates: [number, number][][][]; visible?: boolean }>,
  options: BboxZoomOptions = {}
): void => {
  if (!mapRef?.current) return;

  const { padding = 60, duration = 1500, essential = true } = options;

  const bounds = calculateZoomBbox(items);
  if (!bounds) return;

  mapRef.current.fitBounds(bounds, {
    padding,
    duration,
    essential,
  });
};
