'use client';

import { useEffect, useRef, useMemo } from 'react';
// import * as turf from '@turf/turf';
import { MapZone } from '../../../types/map';

const getPhColor = (pH: number): string => {
  if (pH < 5.5) {
    return '#FF352ECC';
  } else if (pH >= 5.5 && pH < 6.2) {
    return '#DFA72CCC';
  } else if (pH >= 6.2 && pH < 6.5) {
    return '#6AE730CC';
  } else if (pH >= 6.5 && pH <= 7.5) {
    return '#41B0FFCC';
  } else {
    return '#0078CDCC';
  }
};

const DEFAULT_ZONE_COLOR = '#22c55e';

interface MapZonesTurfProps {
  map: mapboxgl.Map | null;
  zones: MapZone[];
  onZoneClick?: (zone: MapZone) => void;
  styleLoaded?: boolean;
  showArea?: boolean;
  showLabels?: boolean;
  minZoomForLabels?: number;
  onZonesBboxCalculated?: (bbox: [number, number, number, number]) => void;
  layerVisible?: boolean;
}

export const MapZonesTurf: React.FC<MapZonesTurfProps> = ({
  map,
  zones,
  onZoneClick,
  styleLoaded = false,
  showArea = true,
  showLabels = true,
  minZoomForLabels = 12,
  onZonesBboxCalculated,
  layerVisible = true,
}) => {
  const zonesRef = useRef<MapZone[]>(zones);
  const layersInitializedRef = useRef(false);

  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);

  // const zonesWithArea = useMemo(() => {
  //   return zones.map((zone) => {
  //     try {
  //       const multiPolygon = turf.multiPolygon(zone.coordinates);
  //
  //       const areaInSquareMeters = turf.area(multiPolygon);
  //
  //       const areaInHectares = areaInSquareMeters / 10000;
  //
  //       return {
  //         ...zone,
  //         area: areaInHectares,
  //         areaInSquareMeters,
  //         multiPolygon,
  //       };
  //     } catch (error) {
  //       console.warn(`Error calculating area for zone ${zone.id}:`, error);
  //       return {
  //         ...zone,
  //         area: zone.area || 0,
  //         areaInSquareMeters: 0,
  //         multiPolygon: null,
  //       };
  //     }
  //   });
  // }, [zones]);

  const visibleZones = useMemo(
    () => zones.filter((zone) => zone.visible !== false),
    [zones]
  );

  // const zonesBbox = useMemo(() => {
  //   if (zonesWithArea.length === 0) return null;
  //
  //   try {
  //     const multiPolygons = zonesWithArea.flatMap((zone) =>
  //       zone.multiPolygon && zone.visible !== false ? [zone.multiPolygon] : []
  //     );
  //
  //     if (multiPolygons.length === 0) {
  //       return null;
  //     }
  //
  //     const featureCollection = turf.featureCollection(multiPolygons);
  //
  //     const bbox = turf.bbox(featureCollection);
  //
  //     return bbox as [number, number, number, number];
  //   } catch (error) {
  //     console.warn('Error calculating bbox for zones:', error);
  //     return null;
  //   }
  // }, [zonesWithArea]);
  //
  // useEffect(() => {
  //   if (zonesBbox && onZonesBboxCalculated) {
  //     onZonesBboxCalculated(zonesBbox);
  //   }
  // }, [zonesBbox, onZonesBboxCalculated]);

  useEffect(() => {
    if (!map || !styleLoaded || layersInitializedRef.current) return;

    const initializeLayers = () => {
      try {
        const sourceId = 'zones-turf-source';
        const initialGeojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: visibleZones
            .map((z) => ({
              type: 'Feature' as const,
              properties: {
                id: z.id,
                name: z.name,
                area:
                  typeof z.area === 'number'
                    ? z.area.toFixed(2)
                    : typeof z.area === 'string'
                    ? parseFloat(z.area).toFixed(2)
                    : '0.00',
                cropType: z.cropType,
                fillColor: z.fillColor || '#FFFFFF',
                borderColor: z.borderColor || '#FFFFFF',
                fillOpacity: z.fillOpacity ?? 0.3,
                borderWidth: z.borderWidth ?? 1,
                clientId: z.clientId,
                zIndex: z.zIndex || 5,
                textColor: z.textColor || '#fff',
                textSize: z.textSize || 12,
                textWeight: z.textWeight || 'Open Sans Semibold',
              },
              geometry: {
                type: 'MultiPolygon' as const,
                coordinates: z.coordinates,
              },
            }))
            .sort(
              (a, b) =>
                (b.properties?.zIndex || 0) - (a.properties?.zIndex || 0)
            ),
        };

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, { type: 'geojson', data: initialGeojson });
        }

        if (!map.getLayer('zones-turf-fill')) {
          map.addLayer({
            id: 'zones-turf-fill',
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': ['get', 'fillColor'],
              'fill-opacity': ['get', 'fillOpacity'],
            },
            layout: {},
          });

          map.setPaintProperty('zones-turf-fill', 'fill-color-transition', {
            duration: 300,
          });
          map.setPaintProperty('zones-turf-fill', 'fill-opacity-transition', {
            duration: 300,
          });
        }

        if (!map.getLayer('zones-turf-line')) {
          map.addLayer({
            id: 'zones-turf-line',
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': ['get', 'borderColor'],
              'line-width': ['get', 'borderWidth'],
            },
            layout: {},
          });

          map.setPaintProperty('zones-turf-line', 'line-color-transition', {
            duration: 300,
          });
          map.setPaintProperty('zones-turf-line', 'line-width-transition', {
            duration: 300,
          });
        }

        const shouldShowLabels =
          layerVisible && showLabels && map.getZoom() >= minZoomForLabels;

        if (shouldShowLabels && !map.getLayer('zones-turf-label')) {
          map.addLayer({
            id: 'zones-turf-label',
            type: 'symbol',
            source: sourceId,
            layout: {
              'text-field': showArea
                ? ['concat', ['get', 'name'], '\n', ['get', 'area'], ' ha']
                : ['get', 'name'],
              'text-size': 12,
              'text-anchor': 'center',
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            },
            paint: {
              'text-color': '#ffffff',
            },
          });
        }

        const updateLabelVisibility = () => {
          try {
            const labelLayerId = 'zones-turf-label';
            const hasLabelLayer = map.getLayer(labelLayerId);
            const labelsShouldBeVisible =
              layerVisible && showLabels && map.getZoom() >= minZoomForLabels;

            if (labelsShouldBeVisible && !hasLabelLayer) {
              map.addLayer({
                id: labelLayerId,
                type: 'symbol',
                source: sourceId,
                layout: {
                  'text-field': showArea
                    ? ['concat', ['get', 'name'], '\n', ['get', 'area'], ' ha']
                    : ['get', 'name'],
                  'text-size': 12,
                  'text-anchor': 'center',
                  'text-allow-overlap': true,
                  'text-ignore-placement': true,
                },
                paint: {
                  'text-color': '#ffffff',
                  'text-opacity': [
                    'step',
                    ['zoom'],
                    0,
                    minZoomForLabels,
                    0,
                    minZoomForLabels + 0.0001,
                    1,
                  ],
                },
              });
            } else if (!labelsShouldBeVisible && hasLabelLayer) {
              map.removeLayer(labelLayerId);
            }
          } catch (error) {
            // Error handled silently
          }
        };

        const handleZoneClick = (
          e: mapboxgl.MapMouseEvent & {
            features?: mapboxgl.MapboxGeoJSONFeature[];
          }
        ) => {
          const feature = e.features?.[0];
          if (!feature?.properties) {
            return;
          }

          const featureId =
            typeof feature.properties.id === 'string'
              ? feature.properties.id
              : undefined;

          if (!featureId) {
            return;
          }

          const z = zonesRef.current.find((zone) => zone.id === featureId);
          if (z && onZoneClick) {
            onZoneClick(z);
          }
        };

        const handleMouseEnter = () => {
          map.getCanvas().style.cursor = 'pointer';
        };

        const handleMouseLeave = () => {
          map.getCanvas().style.cursor = '';
        };

        map.on('zoom', updateLabelVisibility);
        map.on('zoomend', updateLabelVisibility);
        map.on('click', 'zones-turf-fill', handleZoneClick);
        map.on('mouseenter', 'zones-turf-fill', handleMouseEnter);
        map.on('mouseleave', 'zones-turf-fill', handleMouseLeave);

        layersInitializedRef.current = true;

        return () => {
          try {
            map.off('zoom', updateLabelVisibility);
            map.off('zoomend', updateLabelVisibility);
            map.off('click', 'zones-turf-fill', handleZoneClick);
            map.off('mouseenter', 'zones-turf-fill', handleMouseEnter);
            map.off('mouseleave', 'zones-turf-fill', handleMouseLeave);
          } catch {
            // ignore cleanup errors
          }
        };
      } catch {
        return;
      }
    };

    const cleanup = initializeLayers();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [
    map,
    styleLoaded,
    visibleZones,
    showArea,
    showLabels,
    minZoomForLabels,
    layerVisible,
    onZoneClick,
  ]);

  useEffect(() => {
    if (!map || !styleLoaded || !layersInitializedRef.current) return;

    const updateZonesData = () => {
      try {
        const sourceId = 'zones-turf-source';
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

        if (!source) return;

        const updatedGeojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: visibleZones
            .map((z) => ({
              type: 'Feature' as const,
              properties: {
                id: z.id,
                name: z.name,
                area:
                  typeof z.area === 'number'
                    ? z.area.toFixed(2)
                    : typeof z.area === 'string'
                    ? parseFloat(z.area).toFixed(2)
                    : '0.00',
                cropType: z.cropType,
                fillColor: z.fillColor || '#FFFFFF',
                borderColor: z.borderColor || '#FFFFFF',
                fillOpacity: z.fillOpacity ?? 0.3,
                borderWidth: z.borderWidth ?? 1,
                clientId: z.clientId,
                zIndex: z.zIndex || 5,
                textColor: z.textColor || '#ef4444',
                textSize: z.textSize || 20,
                textWeight: z.textWeight || 'Open Sans Semibold',
              },
              geometry: {
                type: 'MultiPolygon' as const,
                coordinates: z.coordinates,
              },
            }))
            .sort(
              (a, b) =>
                (b.properties?.zIndex || 0) - (a.properties?.zIndex || 0)
            ),
        };

        source.setData(updatedGeojson);
      } catch {
        return;
      }
    };

    updateZonesData();
  }, [map, styleLoaded, visibleZones]);

  useEffect(() => {
    if (!map || !styleLoaded || !layersInitializedRef.current) return;

    try {
      const fillLayer = map.getLayer('zones-turf-fill');
      const lineLayer = map.getLayer('zones-turf-line');
      const labelLayer = map.getLayer('zones-turf-label');

      const visibility = layerVisible ? 'visible' : 'none';

      if (fillLayer) {
        map.setLayoutProperty('zones-turf-fill', 'visibility', visibility);
      }
      if (lineLayer) {
        map.setLayoutProperty('zones-turf-line', 'visibility', visibility);
      }
      if (labelLayer) {
        map.setLayoutProperty('zones-turf-label', 'visibility', visibility);
        if (!layerVisible) {
          map.removeLayer('zones-turf-label');
        }
      }
    } catch (error) {
      return;
    }
  }, [map, styleLoaded, layerVisible]);

  useEffect(() => {
    if (!map || !styleLoaded || !layersInitializedRef.current) return;

    const handleZoomChange = () => {
      if (!map || !styleLoaded) return;

      try {
        const zoom = map.getZoom();
        const hasLabelLayer = map.getLayer('zones-turf-label');
        const sourceId = 'zones-turf-source';

        const labelsVisible =
          layerVisible && showLabels && zoom >= minZoomForLabels;

        if (labelsVisible && !hasLabelLayer) {
          map.addLayer({
            id: 'zones-turf-label',
            type: 'symbol',
            source: sourceId,
            layout: {
              'text-field': showArea
                ? ['concat', ['get', 'name'], '\n', ['get', 'area'], ' ha']
                : ['get', 'name'],
              'text-size': 12,
              'text-anchor': 'center',
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            },
            paint: {
              'text-color': '#ffffff',
              'text-opacity': [
                'step',
                ['zoom'],
                0,
                minZoomForLabels,
                0,
                minZoomForLabels + 0.0001,
                1,
              ],
            },
          });
        } else if (!labelsVisible && hasLabelLayer) {
          map.removeLayer('zones-turf-label');
        }
      } catch (err) {
        // Error handled silently
      }
    };

    map.on('zoom', handleZoomChange);

    return () => {
      if (map) {
        map.off('zoom', handleZoomChange);
      }
    };
  }, [map, styleLoaded, minZoomForLabels, showLabels, showArea, layerVisible]);

  useEffect(() => {
    return () => {
      if (!map) return;

      try {
        ['zones-turf-fill', 'zones-turf-line', 'zones-turf-label'].forEach(
          (layerId) => {
            if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
          }
        );

        if (map.getSource('zones-turf-source')) {
          map.removeSource('zones-turf-source');
        }

        layersInitializedRef.current = false;
      } catch (error) {
        // Error handled silently
      }
    };
  }, [map]);

  return null;
};
