import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import type { DownloadVisualGeometry } from '../../../api/types/eosda.types';
import type { Feature as GeoJsonFeature } from 'geojson';

interface UseMapImageOverlayProps {
  map: mapboxgl.Map | null;
  imageUrl: string | null;
  geometry: DownloadVisualGeometry | null;
  onImageReady?: () => void;
  isLoading?: boolean;
  isImageReady?: boolean;
  onLoadingOverlayReady?: () => void;
}

export function useMapImageOverlay({
  map,
  imageUrl,
  geometry,
  onImageReady,
  isLoading = false,
  isImageReady = false,
  onLoadingOverlayReady,
}: UseMapImageOverlayProps) {
  const previousGeometryRef = useRef<string | null>(null);
  const loadingOverlayReadyRef = useRef(false);

  useEffect(() => {
    const sourceId = 'download-visual-image-source';
    const layerId = 'download-visual-image-layer';
    const imageBorderSourceId = 'download-visual-image-border-source';
    const imageBorderLayerId = 'download-visual-image-border-layer';

    const cleanupOverlay = () => {
      try {
        if (map && map.getStyle()) {
          if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'raster-opacity-transition', {
              duration: 300,
              delay: 0,
            });
            map.setPaintProperty(layerId, 'raster-opacity', 0);

            setTimeout(() => {
              try {
                if (map.getLayer(layerId)) {
                  map.removeLayer(layerId);
                }
                if (map.getLayer(imageBorderLayerId)) {
                  map.removeLayer(imageBorderLayerId);
                }
                if (map.getSource(sourceId)) {
                  map.removeSource(sourceId);
                }
                if (map.getSource(imageBorderSourceId)) {
                  map.removeSource(imageBorderSourceId);
                }
              } catch {
              }
            }, 350);
            return;
          }

          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
          if (map.getSource(imageBorderSourceId)) {
            map.removeSource(imageBorderSourceId);
          }
        }
      } catch {
        if (!map?.style) return;
      }
    };

    if (!imageUrl || !geometry) {
      if (map) {
        cleanupOverlay();
      }
      return;
    }

    if (!map) {
      return;
    }

    const existingLayer = map.getLayer(layerId);
    if (existingLayer) {
      map.setPaintProperty(layerId, 'raster-opacity-transition', {
        duration: 300,
        delay: 0,
      });
      map.setPaintProperty(layerId, 'raster-opacity', 0);

    }

    const addImageOverlay = () => {
      try {
        const polygonFeature = turf.polygon(geometry.coordinates);
        const bbox = turf.bbox(polygonFeature);

        const paddingLng = (bbox[2] - bbox[0]) * 0.001;
        const paddingLat = (bbox[3] - bbox[1]) * 0.001;

        const paddedBbox = [
          bbox[0] - paddingLng,
          bbox[1] - paddingLat,
          bbox[2] + paddingLng,
          bbox[3] + paddingLat,
        ];

        if (paddedBbox.some((coord) => !isFinite(coord))) {
          return;
        }

        const imageCoordinates: [
          [number, number],
          [number, number],
          [number, number],
          [number, number]
        ] = [
          [paddedBbox[0], paddedBbox[3]],
          [paddedBbox[2], paddedBbox[3]],
          [paddedBbox[2], paddedBbox[1]],
          [paddedBbox[0], paddedBbox[1]],
        ];

        let canvasSource = map.getSource(sourceId) as
          | mapboxgl.CanvasSource
          | undefined;
        if (!canvasSource) {
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          map.addSource(sourceId, {
            // @ts-expect-error - Canvas source is supported at runtime but may not be in older Mapbox GL JS types
            type: 'canvas',
            canvas,
            coordinates: imageCoordinates,
            animate: false,
          });
          canvasSource = map.getSource(sourceId) as mapboxgl.CanvasSource;
        } else {
          canvasSource.setCoordinates(imageCoordinates);
        }

        let borderSource = map.getSource(imageBorderSourceId) as
          | mapboxgl.GeoJSONSource
          | undefined;
        if (!borderSource) {
          map.addSource(imageBorderSourceId, {
            type: 'geojson',
            data: polygonFeature,
          });
          borderSource = map.getSource(
            imageBorderSourceId
          ) as mapboxgl.GeoJSONSource;
        } else {
          borderSource.setData(polygonFeature as GeoJsonFeature);
        }

        const layerExists = map.getLayer(layerId);
        if (!layerExists) {
          map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
              'raster-opacity': 0,
              'raster-fade-duration': 0,
            },
          });
        } else {
          map.setPaintProperty(layerId, 'raster-opacity', 0);
        }

        map.setPaintProperty(layerId, 'raster-opacity-transition', {
          duration: 500,
          delay: 0,
        });

        if (!map.getLayer(imageBorderLayerId)) {
          map.addLayer({
            id: imageBorderLayerId,
            type: 'line',
            source: imageBorderSourceId,
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 2,
              'line-opacity': 1,
            },
          });
        } else {
          map.setPaintProperty(imageBorderLayerId, 'line-opacity', 1);
        }

        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
          const crop = -0.7; 

          const croppedWidth = img.width - crop * 2;
          const croppedHeight = img.height - crop * 2;

          const currentCanvasSource = map.getSource(
            sourceId
          ) as mapboxgl.CanvasSource;
          if (!currentCanvasSource) {
            return;
          }
          const canvasElement = currentCanvasSource.getCanvas();

          canvasElement.width = croppedWidth;
          canvasElement.height = croppedHeight;

          const ctx = canvasElement.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(
            img,
            crop,
            crop,
            croppedWidth,
            croppedHeight,
            0,
            0,
            croppedWidth,
            croppedHeight
          );

          map.triggerRepaint();

          if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, 'raster-opacity', 1.0);
          }

          onImageReady?.();
        };

        img.onerror = (e) => {
          console.error(
            '❌ Failed to load image:',
            e,
            'URL:',
            imageUrl.substring(0, 100) + '...'
          );
        };

        setTimeout(() => {
          try {
            // Move image layers below parcel layers (not to the very top)
            // This ensures parcels remain clickable
            const parcelFillLayer = map.getLayer('parcels-turf-fill');
            if (parcelFillLayer) {
              // Move image layers just below the parcels
              if (map.getLayer(layerId)) {
                map.moveLayer(layerId, 'parcels-turf-fill');
              }
              if (map.getLayer(imageBorderLayerId)) {
                map.moveLayer(imageBorderLayerId, 'parcels-turf-fill');
              }
            } else {
              // Fallback: move to top if parcels layer doesn't exist
              if (map.getLayer(layerId)) {
                map.moveLayer(layerId);
              }
              if (map.getLayer(imageBorderLayerId)) {
                map.moveLayer(imageBorderLayerId);
              }
            }
          } catch {
            // Error handled silently
          }
        }, 100);
      } catch {
        // Error handled silently
      }
    };

    const checkAndAddOverlay = () => {
      const mapLoaded = map.loaded();
      const styleLoaded = map.isStyleLoaded();
      const hasStyle = !!map.getStyle();

      if (mapLoaded && styleLoaded && hasStyle) {
        addImageOverlay();
        return true;
      }
      return false;
    };

    let handleStyleLoad: (() => void) | null = null;
    let handleLoad: (() => void) | null = null;
    let pollingTimeout: NodeJS.Timeout | null = null;
    let pollingAttempts = 0;
    const MAX_POLLING_ATTEMPTS = 50;

    if (checkAndAddOverlay()) {
      return () => {
        if (handleStyleLoad) {
          map.off('styledata', handleStyleLoad);
        }
        if (handleLoad) {
          map.off('load', handleLoad);
        }
      };
    }

    handleStyleLoad = () => {
      if (checkAndAddOverlay()) {
        if (handleStyleLoad) map.off('styledata', handleStyleLoad);
        if (handleLoad) map.off('load', handleLoad);
        if (pollingTimeout) {
          clearTimeout(pollingTimeout);
          pollingTimeout = null;
        }
      }
    };

    handleLoad = () => {
      if (checkAndAddOverlay()) {
        if (handleLoad) map.off('load', handleLoad);
        if (handleStyleLoad) map.off('styledata', handleStyleLoad);
        if (pollingTimeout) {
          clearTimeout(pollingTimeout);
          pollingTimeout = null;
        }
      }
    };

    map.on('styledata', handleStyleLoad);
    map.once('load', handleLoad);

    const startPolling = () => {
      pollingTimeout = setTimeout(() => {
        pollingAttempts++;

        if (checkAndAddOverlay()) {
          if (handleStyleLoad) map.off('styledata', handleStyleLoad);
          if (handleLoad) map.off('load', handleLoad);
          if (pollingTimeout) {
            clearTimeout(pollingTimeout);
            pollingTimeout = null;
          }
        } else if (pollingAttempts < MAX_POLLING_ATTEMPTS) {
          startPolling();
        } else {
          return;
        }
      }, 100);
    };

    startPolling();

    return () => {
      if (handleStyleLoad) {
        map.off('styledata', handleStyleLoad);
      }
      if (handleLoad) {
        map.off('load', handleLoad);
      }

      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
        pollingTimeout = null;
      }
    };
  }, [map, imageUrl, geometry, onImageReady]);

  useEffect(() => {
    return () => {
      if (!map || !map.getStyle()) {
        return;
      }
      const sourceId = 'download-visual-image-source';
      const layerId = 'download-visual-image-layer';
      const imageBorderSourceId = 'download-visual-image-border-source';
      const imageBorderLayerId = 'download-visual-image-border-layer';
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getLayer(imageBorderLayerId)) {
          map.removeLayer(imageBorderLayerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
        if (map.getSource(imageBorderSourceId)) {
          map.removeSource(imageBorderSourceId);
        }
      } catch {
        // ignore cleanup errors
      }
    };
  }, [map]);

  // Loading overlay effect
  useEffect(() => {
    if (!map) {
      return;
    }

    const loadingFillSourceId = 'loading-placeholder-fill-source';
    const loadingFillLayerId = 'loading-placeholder-fill-layer';
    const loadingBorderSourceId = 'loading-placeholder-border-source';
    const loadingBorderLayerId = 'loading-placeholder-border-layer';

    const cleanupLoadingOverlay = () => {
      try {
        if (!map || !map.getStyle()) {
          return;
        }

        if (map.getLayer(loadingFillLayerId)) {
          map.setPaintProperty(loadingFillLayerId, 'fill-opacity-transition', {
            duration: 300,
            delay: 0,
          });
          map.setPaintProperty(loadingFillLayerId, 'fill-opacity', 0);
        }
        if (map.getLayer(loadingBorderLayerId)) {
          map.setPaintProperty(loadingBorderLayerId, 'line-opacity-transition', {
            duration: 300,
            delay: 0,
          });
          map.setPaintProperty(loadingBorderLayerId, 'line-opacity', 0);
        }

        setTimeout(() => {
          try {
            if (!map || !map.getStyle()) {
              return;
            }
            if (map.getLayer(loadingFillLayerId)) {
              map.removeLayer(loadingFillLayerId);
            }
            if (map.getLayer(loadingBorderLayerId)) {
              map.removeLayer(loadingBorderLayerId);
            }
            if (map.getSource(loadingFillSourceId)) {
              map.removeSource(loadingFillSourceId);
            }
            if (map.getSource(loadingBorderSourceId)) {
              map.removeSource(loadingBorderSourceId);
            }
          } catch {
            // Error handled silently
          }
        }, 350);
      } catch {
        // Error handled silently
      }
    };

    if (!isLoading || !geometry) {
      previousGeometryRef.current = null;
      loadingOverlayReadyRef.current = false;
      cleanupLoadingOverlay();
      return cleanupLoadingOverlay;
    }

    if (isImageReady) {
      previousGeometryRef.current = null;
      loadingOverlayReadyRef.current = false;
      cleanupLoadingOverlay();
      return cleanupLoadingOverlay;
    }


    const addLoadingOverlay = () => {
      try {
        if (!map || !map.getStyle() || !geometry) {
          return;
        }

        const polygonFeature = turf.polygon(geometry.coordinates);

        const geometryKey = JSON.stringify(geometry.coordinates);
        const geometryChanged = previousGeometryRef.current !== geometryKey;
        previousGeometryRef.current = geometryKey;

        const fillSource = map.getSource(loadingFillSourceId) as
          | mapboxgl.GeoJSONSource
          | undefined;
        if (!fillSource) {
          map.addSource(loadingFillSourceId, {
            type: 'geojson',
            data: polygonFeature,
          });
        } else if (geometryChanged) {
          fillSource.setData(polygonFeature as GeoJsonFeature);
        }

        const borderSource = map.getSource(loadingBorderSourceId) as
          | mapboxgl.GeoJSONSource
          | undefined;
        if (!borderSource) {
          map.addSource(loadingBorderSourceId, {
            type: 'geojson',
            data: polygonFeature,
          });
        } else if (geometryChanged) {
          borderSource.setData(polygonFeature as GeoJsonFeature);
        }

        // Add fill layer
        if (!map.getLayer(loadingFillLayerId)) {
          map.addLayer({
            id: loadingFillLayerId,
            type: 'fill',
            source: loadingFillSourceId,
            paint: {
              'fill-color': '#9CA3AF',
              'fill-opacity': 0.85,
            },
          });
        }

        if (!map.getLayer(loadingBorderLayerId)) {
          map.addLayer({
            id: loadingBorderLayerId,
            type: 'line',
            source: loadingBorderSourceId,
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 2,
              'line-opacity': 1,
            },
          });
        } else {
          map.setPaintProperty(loadingBorderLayerId, 'line-opacity', 1);
        }

        if (map.getLayer(loadingFillLayerId)) {
          map.setPaintProperty(loadingFillLayerId, 'fill-opacity-transition', {
            duration: 0,
            delay: 0,
          });
          map.setPaintProperty(loadingFillLayerId, 'fill-opacity', 0.85);
        }

        try {
          // Move loading layers below parcel layers (not to the very top)
          // This ensures parcels remain clickable during loading
          const parcelFillLayer = map.getLayer('parcels-turf-fill');
          if (parcelFillLayer) {
            // Move loading layers just below the parcels
            if (map.getLayer(loadingFillLayerId)) {
              map.moveLayer(loadingFillLayerId, 'parcels-turf-fill');
            }
            if (map.getLayer(loadingBorderLayerId)) {
              map.moveLayer(loadingBorderLayerId, 'parcels-turf-fill');
            }
          } else {
            // Fallback: move to top if parcels layer doesn't exist
            if (map.getLayer(loadingFillLayerId)) {
              map.moveLayer(loadingFillLayerId);
            }
            if (map.getLayer(loadingBorderLayerId)) {
              map.moveLayer(loadingBorderLayerId);
            }
          }
          if (!loadingOverlayReadyRef.current) {
            loadingOverlayReadyRef.current = true;
            onLoadingOverlayReady?.();
          }
        } catch {
          // Error handled silently
        }
      } catch {
        // Error handled silently
      }
    };

    const checkAndAddLoadingOverlay = () => {
      const mapLoaded = map.loaded();
      const styleLoaded = map.isStyleLoaded();
      const hasStyle = !!map.getStyle();

      if (mapLoaded && styleLoaded && hasStyle) {
        return addLoadingOverlay();
      }
      return null;
    };

    let handleStyleLoad: (() => void) | null = null;
    let handleLoad: (() => void) | null = null;
    let pollingTimeout: NodeJS.Timeout | null = null;
    let pollingAttempts = 0;
    const MAX_POLLING_ATTEMPTS = 50;

    if (checkAndAddLoadingOverlay()) {
      return () => {
        if (handleStyleLoad) {
          map.off('styledata', handleStyleLoad);
        }
        if (handleLoad) {
          map.off('load', handleLoad);
        }
        if (pollingTimeout) {
          clearTimeout(pollingTimeout);
          pollingTimeout = null;
        }
        cleanupLoadingOverlay();
      };
    }

    handleStyleLoad = () => {
      if (checkAndAddLoadingOverlay()) {
        if (handleStyleLoad) map.off('styledata', handleStyleLoad);
        if (handleLoad) map.off('load', handleLoad);
        if (pollingTimeout) {
          clearTimeout(pollingTimeout);
          pollingTimeout = null;
        }
      }
    };

    handleLoad = () => {
      if (checkAndAddLoadingOverlay()) {
        if (handleLoad) map.off('load', handleLoad);
        if (handleStyleLoad) map.off('styledata', handleStyleLoad);
        if (pollingTimeout) {
          clearTimeout(pollingTimeout);
          pollingTimeout = null;
        }
      }
    };

    map.on('styledata', handleStyleLoad);
    map.once('load', handleLoad);

    const startPolling = () => {
      pollingTimeout = setTimeout(() => {
        pollingAttempts++;

        if (checkAndAddLoadingOverlay()) {
          if (handleStyleLoad) map.off('styledata', handleStyleLoad);
          if (handleLoad) map.off('load', handleLoad);
          if (pollingTimeout) {
            clearTimeout(pollingTimeout);
            pollingTimeout = null;
          }
        } else if (pollingAttempts < MAX_POLLING_ATTEMPTS) {
          startPolling();
        } else {
          return;
        }
      }, 100);
    };

    startPolling();

    return () => {
      if (handleStyleLoad) {
        map.off('styledata', handleStyleLoad);
      }
      if (handleLoad) {
        map.off('load', handleLoad);
      }

      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
        pollingTimeout = null;
      }
      cleanupLoadingOverlay();
    };
  }, [map, isLoading, geometry, imageUrl, isImageReady, onLoadingOverlayReady]);

}
