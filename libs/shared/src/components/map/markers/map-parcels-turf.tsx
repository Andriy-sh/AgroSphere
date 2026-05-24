'use client';

import { useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { MapParcel } from '../../../types/map';

const getPhColor = (pH: number): string => {
  if (pH < 5.5) {
    return '#FF352E';
  } else if (pH >= 5.5 && pH < 6.2) {
    return '#DFA72C';
  } else if (pH >= 6.2 && pH < 6.5) {
    return '#6AE730';
  } else if (pH >= 6.5 && pH <= 7.5) {
    return '#41B0FF';
  } else {
    return '#0078CD';
  }
};

const DEFAULT_PARCEL_COLOR = '#FFFFFF1F';

interface MapParcelsTurfProps {
  map: mapboxgl.Map | null;
  parcels: MapParcel[];
  onParcelClick?: (parcel: MapParcel) => void;
  styleLoaded?: boolean;
  showArea?: boolean;
  showLabels?: boolean;
  minZoomForLabels?: number;
  layerVisible?: boolean;
  showPhColors?: boolean;
  onlyBorder?: boolean;
}

export const MapParcelsTurf: React.FC<MapParcelsTurfProps> = ({
  map,
  parcels,
  onParcelClick,
  styleLoaded = false,
  showArea = true,
  showLabels = true,
  minZoomForLabels = 12,
  layerVisible = true,
  showPhColors = false,
  onlyBorder = false,
}) => {
  const layersInitializedRef = useRef(false);
  const parcelsRef = useRef<MapParcel[]>([]);

  const parcelsWithArea = useMemo(() => {
    return parcels.map((parcel) => {
      // Use existing area if it's valid, otherwise calculate from coordinates
      // Convert to number if it's a string
      let areaInHectares: number | undefined = parcel.area;
      if (typeof areaInHectares === 'string') {
        areaInHectares = parseFloat(areaInHectares);
      }
      if (areaInHectares !== undefined && isNaN(areaInHectares)) {
        areaInHectares = undefined;
      }

      let areaInSquareMeters = 0;
      let multiPolygon: GeoJSON.Feature<GeoJSON.MultiPolygon> | null = null;

      if (
        areaInHectares === undefined ||
        areaInHectares === null ||
        areaInHectares <= 0
      ) {
        try {
          multiPolygon = turf.multiPolygon(parcel.coordinates);
          areaInSquareMeters = turf.area(multiPolygon);
          areaInHectares = areaInSquareMeters / 10000;
        } catch (error) {
          console.warn(
            `Error calculating area for parcel ${parcel.id}:`,
            error
          );
          // Fall back to existing area if calculation fails
          const fallbackArea =
            typeof parcel.area === 'string'
              ? parseFloat(parcel.area)
              : parcel.area;
          areaInHectares =
            fallbackArea && !isNaN(fallbackArea) && fallbackArea > 0
              ? fallbackArea
              : 0;
          areaInSquareMeters = 0;
        }
      } else {
        areaInSquareMeters = areaInHectares * 10000;
        try {
          multiPolygon = turf.multiPolygon(parcel.coordinates);
        } catch (error) {
          console.warn(
            `Error creating multiPolygon for parcel ${parcel.id}:`,
            error
          );
        }
      }

      let fillColor = parcel.fillColor;
      let borderColor = parcel.borderColor;

      if (showPhColors && parcel.pH !== undefined) {
        fillColor = getPhColor(parcel.pH);
      } else if (!fillColor) {
        fillColor = DEFAULT_PARCEL_COLOR;
      }

      if (!borderColor) {
        if (showPhColors && parcel.pH !== undefined) {
          borderColor = getPhColor(parcel.pH);
        } else {
          borderColor = DEFAULT_PARCEL_COLOR;
        }
      }

      return {
        ...parcel,
        area: areaInHectares,
        areaInSquareMeters,
        multiPolygon,
        fillColor,
        borderColor,
      };
    });
  }, [parcels, showPhColors]);

  const parcelsBbox = useMemo(() => {
    if (parcelsWithArea.length === 0) return null;

    try {
      const featureCollection = turf.featureCollection(
        parcelsWithArea
          .filter((parcel) => parcel.multiPolygon && parcel.visible !== false)
          .map(
            (parcel) =>
              parcel.multiPolygon as GeoJSON.Feature<GeoJSON.MultiPolygon>
          )
      );

      const bbox = turf.bbox(featureCollection);

      return bbox as [number, number, number, number];
    } catch {
      return null;
    }
  }, [parcelsWithArea]);

  useEffect(() => {
    if (!map || !styleLoaded || layersInitializedRef.current) return;

    const initializeLayers = () => {
      try {
        const sourceId = 'parcels-turf-source';
        const allParcels = parcelsWithArea;

        const initialGeojson: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: allParcels
            .map((p) => {
              let fillColor = p.fillColor;
              let borderColor = p.borderColor;
              const isVisible = p.visible !== false;
              const borderWidth =
                typeof p.borderWidth === 'number' ? p.borderWidth : 1;

              if (showPhColors && p.pH !== undefined) {
                fillColor = getPhColor(p.pH);
                borderColor = getPhColor(p.pH);
              } else {
                if (!fillColor) {
                  fillColor = DEFAULT_PARCEL_COLOR;
                }
                if (!borderColor) {
                  borderColor = DEFAULT_PARCEL_COLOR;
                }
              }

              const fillOpacityValue =
                isVisible && !onlyBorder
                  ? typeof p.fillOpacity === 'number' && p.fillOpacity > 0
                    ? p.fillOpacity
                    : 0.12
                  : 0.01;

              return {
                type: 'Feature' as const,
                id: p.id, 
                properties: {
                  id: p.id, 
                  name: p.name,
                  area: p.area?.toFixed(1) || '0.0',
                  areaInSquareMeters: p.areaInSquareMeters || 0,
                  fillColor,
                  borderColor,
                  fillOpacity: fillOpacityValue,
                  borderWidth: isVisible ? borderWidth : 0,
                  zIndex: p.zIndex || 5,
                  pH: p.pH,
                  visible: isVisible,
                },
                geometry: {
                  type: 'MultiPolygon' as const,
                  coordinates: p.coordinates,
                },
              };
            })
            .sort(
              (a, b) =>
                (b.properties?.zIndex || 0) - (a.properties?.zIndex || 0)
            ),
        };

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: initialGeojson,
            promoteId: 'id',
          });
        } else {
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData(initialGeojson);
        }

        console.log(
          'Initial GeoJSON features:',
          initialGeojson.features.map((f) => ({
            id: f.properties?.id,
            name: f.properties?.name,
            fillColor: f.properties?.fillColor,
            fillOpacity: f.properties?.fillOpacity,
            pH: f.properties?.pH,
          }))
        );

        if (!map.getLayer('parcels-turf-fill')) {
          map.addLayer({
            id: 'parcels-turf-fill',
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': ['get', 'fillColor'],
              'fill-opacity': onlyBorder ? 0.01 : ['get', 'fillOpacity'],
            },
          });
        } else {
          if (onlyBorder) {
            map.setPaintProperty('parcels-turf-fill', 'fill-opacity', 0);
          } else {
            map.setPaintProperty('parcels-turf-fill', 'fill-opacity', [
              'get',
              'fillOpacity',
            ]);
          }
        }

        if (!map.getLayer('parcels-turf-line')) {
          map.addLayer({
            id: 'parcels-turf-line',
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': ['get', 'borderColor'],
              'line-width': onlyBorder ? 2 : ['get', 'borderWidth'],
              'line-opacity': 1,
            },
          });
        } else if (onlyBorder) {
          map.setPaintProperty('parcels-turf-line', 'line-width', 2);
        }

        if (showLabels && !onlyBorder) {
          const parcelLabelTextField = [
            'format',
            ['get', 'name'],
            { 'font-scale': 1 },
            '\n',
            {},
            ['get', 'area'],
            { 'font-scale': 0.9 },
            ' ha',
            { 'font-scale': 0.9 },
          ] as mapboxgl.Expression;

          if (!map.getLayer('parcels-turf-labels')) {
            map.addLayer({
              id: 'parcels-turf-labels',
              type: 'symbol',
              source: sourceId,
              layout: {
                'text-field': parcelLabelTextField,
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
                'text-size': 12,
                'text-anchor': 'center',
                'text-justify': 'center',
                'text-allow-overlap': true,
                'text-ignore-placement': true,
                'text-line-height': 1.2,
              },
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': 'rgba(0,0,0,0)',
                'text-halo-width': 0,
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
          }
        }

        const handleParcelClick = (
          e: mapboxgl.MapMouseEvent & {
            features?: mapboxgl.MapboxGeoJSONFeature[];
          }
        ) => {
          if (!e.features?.length) {
            console.log('[MapParcelsTurf] No features in click event');
            return;
          }

          const props = e.features[0].properties as {
            id: string;
            [key: string]: unknown;
          };
          const parcelId = props.id;

          if (!parcelId) {
            console.log('[MapParcelsTurf] No parcel ID in feature properties');
            return;
          }

          console.log('[MapParcelsTurf] Parcel clicked:', parcelId);

          let p = parcelsRef.current.find((p) => p.id === parcelId);
          if (!p) {
            p = allParcels.find((p) => p.id === parcelId);
          }

          if (p) {
            console.log('[MapParcelsTurf] Found parcel:', p.id, p.name);
            if (onParcelClickRef.current) {
              onParcelClickRef.current(p);
            } else {
              console.warn('[MapParcelsTurf] onParcelClick handler is not set');
            }
          } else {
            console.warn('[MapParcelsTurf] Parcel not found:', parcelId);
          }
        };

        // Add click handlers to both fill and line layers for better clickability
        map.on('click', 'parcels-turf-fill', handleParcelClick);
        map.on('click', 'parcels-turf-line', handleParcelClick);

        const handleMouseEnter = () => {
          map.getCanvas().style.cursor = 'pointer';
        };

        const handleMouseLeave = () => {
          map.getCanvas().style.cursor = '';
        };

        map.on('mouseenter', 'parcels-turf-fill', handleMouseEnter);
        map.on('mouseleave', 'parcels-turf-fill', handleMouseLeave);
        map.on('mouseenter', 'parcels-turf-line', handleMouseEnter);
        map.on('mouseleave', 'parcels-turf-line', handleMouseLeave);

        layersInitializedRef.current = true;

        parcelsRef.current = allParcels;

        return {
          handleParcelClick,
          handleMouseEnter,
          handleMouseLeave,
        };
      } catch (error) {
        return null;
      }
    };

    const handlers = initializeLayers();

    return () => {
      if (map && handlers) {
        map.off('click', 'parcels-turf-fill', handlers.handleParcelClick);
        map.off('click', 'parcels-turf-line', handlers.handleParcelClick);
        map.off('mouseenter', 'parcels-turf-fill', handlers.handleMouseEnter);
        map.off('mouseleave', 'parcels-turf-fill', handlers.handleMouseLeave);
      }
    };
  }, [map, styleLoaded, parcelsWithArea, showLabels, showPhColors, onlyBorder]);

  const onParcelClickRef = useRef(onParcelClick);
  useEffect(() => {
    onParcelClickRef.current = onParcelClick;
  }, [onParcelClick]);

  useEffect(() => {
    if (!map || !layersInitializedRef.current) return;

    const updateParcelsData = () => {
      try {
        const sourceId = 'parcels-turf-source';
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;

        if (source) {
          const allParcels = parcelsWithArea;

          const updatedGeojson: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features: allParcels
              .map((p) => {
                let fillColor = p.fillColor;
                let borderColor = p.borderColor;
                const isVisible = p.visible !== false;
                const borderWidth =
                  typeof p.borderWidth === 'number' ? p.borderWidth : 2;

                if (showPhColors && p.pH !== undefined) {
                  fillColor = getPhColor(p.pH);
                  borderColor = getPhColor(p.pH);
                } else {
                  if (!fillColor) {
                    fillColor = DEFAULT_PARCEL_COLOR;
                  }
                  if (!borderColor) {
                    borderColor = DEFAULT_PARCEL_COLOR;
                  }
                }

                const fillOpacityValue =
                  isVisible && !onlyBorder
                    ? typeof p.fillOpacity === 'number' && p.fillOpacity > 0
                      ? p.fillOpacity
                      : 0.12
                    : 0.01; 

                return {
                  type: 'Feature' as const,
                  id: p.id, 
                  properties: {
                    id: p.id, 
                    name: p.name,
                    area: p.area?.toFixed(1) || '0.0',
                    areaInSquareMeters: p.areaInSquareMeters || 0,
                    fillColor,
                    borderColor,
                    fillOpacity: fillOpacityValue,
                    borderWidth: isVisible ? borderWidth : 0,
                    zIndex: p.zIndex || 5,
                    pH: p.pH,
                    visible: isVisible,
                  },
                  geometry: {
                    type: 'MultiPolygon' as const,
                    coordinates: p.coordinates,
                  },
                };
              })
              .sort(
                (a, b) =>
                  (b.properties?.zIndex || 0) - (a.properties?.zIndex || 0)
              ),
          };

          source.setData(updatedGeojson);
        }
      } catch (error) {
        console.error('Error updating parcels data:', error);
      }
    };

    updateParcelsData();
  }, [map, parcelsWithArea, showPhColors, onlyBorder]);

  useEffect(() => {
    if (!map || !layersInitializedRef.current) return;

    const visibility = layerVisible ? 'visible' : 'none';

    if (map.getLayer('parcels-turf-fill')) {
      const fillVisibility = layerVisible && !onlyBorder ? 'visible' : 'none';
      map.setLayoutProperty('parcels-turf-fill', 'visibility', fillVisibility);
      if (onlyBorder) {
        map.setPaintProperty('parcels-turf-fill', 'fill-opacity', 0);
      } else {
        map.setPaintProperty('parcels-turf-fill', 'fill-opacity', [
          'get',
          'fillOpacity',
        ]);
      }
    }
    if (map.getLayer('parcels-turf-line')) {
      map.setLayoutProperty('parcels-turf-line', 'visibility', visibility);
    }
    if (map.getLayer('parcels-turf-labels')) {
      const labelsVisibility = layerVisible && !onlyBorder ? 'visible' : 'none';
      map.setLayoutProperty(
        'parcels-turf-labels',
        'visibility',
        labelsVisibility
      );
    }
  }, [map, layerVisible, onlyBorder]);

  useEffect(() => {
    if (!map || !layersInitializedRef.current || !showLabels) return;

    const updateLabelsVisibility = () => {
      const zoom = map.getZoom();
      const visibility = zoom >= minZoomForLabels ? 'visible' : 'none';

      if (map.getLayer('parcels-turf-labels')) {
        map.setLayoutProperty('parcels-turf-labels', 'visibility', visibility);
      }
    };

    updateLabelsVisibility();

    map.on('zoom', updateLabelsVisibility);
    map.on('zoomend', updateLabelsVisibility);

    return () => {
      map.off('zoom', updateLabelsVisibility);
      map.off('zoomend', updateLabelsVisibility);
    };
  }, [map, showLabels, minZoomForLabels]);

  useEffect(() => {
    parcelsRef.current = parcels;
  }, [parcels]);

  return null;
};
