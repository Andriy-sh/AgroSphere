'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as turf from '@turf/turf';
import { SamplePath } from '../../../mock/mock-samples';

interface MapSamplePathsProps {
  map: mapboxgl.Map | null;
  samplePaths: SamplePath[];
  onSamplePathClick?: (samplePath: SamplePath) => void;
  styleLoaded?: boolean;
  layerVisible?: boolean;
}

export const MapSamplePaths: React.FC<MapSamplePathsProps> = ({
  map,
  samplePaths,
  onSamplePathClick,
  styleLoaded = false,
  layerVisible = true,
}) => {
  const samplePathsRef = useRef<SamplePath[]>(samplePaths);

  useEffect(() => {
    samplePathsRef.current = samplePaths;
  }, [samplePaths]);

  const curvedPaths = useMemo(() => {
    return samplePaths.map((path) => {
      try {
        const lineString = turf.lineString(path.coordinates);

        const curvedLine = turf.bezierSpline(lineString, {
          resolution: 10000,
          sharpness: 0.85,
        });

        return {
          ...path,
          curvedLine,
        };
      } catch (error) {
        const lineString = turf.lineString(path.coordinates);
        return {
          ...path,
          curvedLine: lineString,
        };
      }
    });
  }, [samplePaths]);

  useEffect(() => {
    if (!map || !styleLoaded) return;

    try {
      const fillLayer = map.getLayer('sample-paths-line');
      const visibility = layerVisible ? 'visible' : 'none';

      if (fillLayer) {
        map.setLayoutProperty('sample-paths-line', 'visibility', visibility);
      }
    } catch (error) {
      // Error handled silently
    }
  }, [map, styleLoaded, layerVisible]);

  useEffect(() => {
    if (!map || !styleLoaded) return;

    const addSamplePathsToMap = () => {
      if (!map || !styleLoaded) {
        return;
      }

      try {
        const sourceId = 'sample-paths-source';

        const geojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: curvedPaths.map((path) => ({
            type: 'Feature' as const,
            properties: {
              id: path.id,
              sampleId: path.sampleId,
              farm: path.farm,
              zoneId: path.zoneId,
              color: path.color || '#ff6b6b',
              width: path.width || 3,
            },
            geometry: path.curvedLine.geometry,
          })),
        };

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, { type: 'geojson', data: geojson });
        } else {
          (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
        }

        if (!map.getLayer('sample-paths-line')) {
          map.addLayer({
            id: 'sample-paths-line',
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': ['get', 'color'],
              'line-width': ['get', 'width'],
              'line-opacity': 0.8,
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              visibility: layerVisible ? 'visible' : 'none',
            },
          });

          map.setPaintProperty('sample-paths-line', 'line-color-transition', {
            duration: 300,
          });
          map.setPaintProperty('sample-paths-line', 'line-width-transition', {
            duration: 300,
          });
        }

        map.on('click', 'sample-paths-line', (e) => {
          if (!e.features?.length) return;
          const props = e.features[0].properties as any;
          const path = samplePathsRef.current.find((p) => p.id === props.id);
          if (path && onSamplePathClick) {
            onSamplePathClick(path);
          }
        });

        map.on('mouseenter', 'sample-paths-line', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'sample-paths-line', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        // Error handled silently
      }
    };

    if (styleLoaded) {
      addSamplePathsToMap();
    }

    return () => {
      if (!map || !styleLoaded) return;

      try {
        if (map.getLayer('sample-paths-line')) {
          map.removeLayer('sample-paths-line');
        }

        if (map.getSource('sample-paths-source')) {
          map.removeSource('sample-paths-source');
        }
      } catch (error) {
        // Error handled silently
      }
    };
  }, [map, curvedPaths, onSamplePathClick, styleLoaded]);

  return null;
};
