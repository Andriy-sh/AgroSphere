'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import type { FeatureCollection, Feature } from 'geojson';
import {
  useMapInstance,
  useMapLoaded,
  useMapStyleLoaded,
} from '../context/map-context';
import type { MapParcel } from '../../../types/map';
import type { GaugeConfig } from '../../../data/soildashboard-variations';

const getPhColor = (pH: number): string => {
  if (pH < 5.5) return '#FF352E';
  if (pH < 6.2) return '#DFA72C';
  if (pH < 6.5) return '#6AE730';
  if (pH <= 7.5) return '#41B0FF';
  return '#0078CD';
};

const getNueColor = (nue: number): string => {
  if (nue < 35) return '#FF352E';
  if (nue < 50) return '#FF8C00';
  if (nue < 65) return '#FFC652';
  return '#10B981';
};

const COLOR_SCHEMES = {
  redToBlue: ['#FF352E', '#DFA72C', '#6AE730', '#41B0FF', '#0078CD'],
  redToGreen: ['#FF352E', '#DFA72C', '#6AE730', '#4B8630', '#4B8630'],
  greenToRed: ['#4B8630', '#6AE730', '#DFA72C', '#FF352E', '#FF352E'],
  default: ['#FF352E', '#DFA72C', '#FFFF00', '#6AE730', '#41B0FF', '#0078CD'],
};

const getMetricColor = (
  value: number,
  gaugeConfig: GaugeConfig | null
): string => {
  if (!gaugeConfig) {
    return getPhColor(value);
  }

  const { min, max, colorScheme } = gaugeConfig;
  const clampedValue = Math.max(min, Math.min(max, value));
  const range = max - min;
  const percentage = range > 0 ? (clampedValue - min) / range : 0;

  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.redToBlue;

  if (percentage < 0.2) return colors[0];
  if (percentage < 0.4) return colors[1];
  if (percentage < 0.6) return colors[2];
  if (percentage < 0.8) return colors[3];
  return colors[4] || colors[colors.length - 1];
};

const DEFAULT_PARCEL_COLOR = '#FFFFFF';
const SELECTED_PARCEL_COLOR = '#29B54C';

export interface ParcelStyleVariant {
  fillColor: string;
  fillOpacity: number;
  borderColor: string;
  borderWidth: number;
}

export const PARCEL_STYLE_VARIANTS: Record<string, ParcelStyleVariant> = {
  default: {
    fillColor: '#FFFFFF',
    fillOpacity: 0.3,
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  dark: {
    fillColor: '#1F2937',
    fillOpacity: 0.12,
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  active: {
    fillColor: '#29B54C',
    fillOpacity: 0.3,
    borderColor: '#29B54C',
    borderWidth: 3,
  },
  subtle: {
    fillColor: '#FFFFFF',
    fillOpacity: 0.05,
    borderColor: '#FFFFFF',
    borderWidth: 0.5,
  },
};

const DEFAULT_STYLE_VARIANT = 'default';

interface ParcelsLayerProps {
  parcels?: MapParcel[];
  onParcelClick?: (parcel: MapParcel) => void;
  selectable?: boolean;
  selectedParcelId?: string | null;
  visible?: boolean;
  showPhColors?: boolean;
  showNueColors?: boolean;
  onlyBorder?: boolean;
  showLabels?: boolean;
  metricConfig?: GaugeConfig | null;
  parcelStyleVariant?: string;
}

export const ParcelsLayer: React.FC<ParcelsLayerProps> = ({
  parcels = [],
  onParcelClick,
  selectable = false,
  selectedParcelId = null,
  visible = true,
  showPhColors = false,
  showNueColors = false,
  onlyBorder = false,
  showLabels = true,
  metricConfig = null,
  parcelStyleVariant = DEFAULT_STYLE_VARIANT,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const styleLoaded = useMapStyleLoaded();

  const layersInitializedRef = useRef(false);
  const parcelsRef = useRef<MapParcel[]>([]);
  const onParcelClickRef = useRef(onParcelClick);

  useEffect(() => {
    onParcelClickRef.current = onParcelClick;
  }, [onParcelClick]);

  const parcelsWithArea = useMemo(() => {
    const styleVariant =
      PARCEL_STYLE_VARIANTS[parcelStyleVariant] ||
      PARCEL_STYLE_VARIANTS[DEFAULT_STYLE_VARIANT];

    return parcels.map((parcel) => {
      let areaInHectares: number | undefined = parcel.area;

      if (typeof areaInHectares === 'string')
        areaInHectares = parseFloat(areaInHectares);
      if (isNaN(areaInHectares as number)) areaInHectares = undefined;

      let areaInSquareMeters = 0;
      let multiPolygon = null;

      if (!areaInHectares || areaInHectares <= 0) {
        try {
          multiPolygon = turf.multiPolygon(parcel.coordinates);
          areaInSquareMeters = turf.area(multiPolygon);
          areaInHectares = areaInSquareMeters / 10000;
        } catch {
          areaInHectares = typeof parcel.area === 'number' ? parcel.area : 0;
        }
      } else {
        try {
          multiPolygon = turf.multiPolygon(parcel.coordinates);
          areaInSquareMeters = areaInHectares * 10000;
        } catch {
          // Ignore invalid geometry.
        }
      }

      let fillColor = parcel.fillColor;
      let borderColor = parcel.borderColor;
      let fillOpacity = parcel.fillOpacity;
      let borderWidth = parcel.borderWidth;

      if (showPhColors && parcel.pH !== undefined) {
        if (metricConfig) {
          fillColor = getMetricColor(parcel.pH, metricConfig);
          borderColor = getMetricColor(parcel.pH, metricConfig);
        } else {
          fillColor = getPhColor(parcel.pH);
          borderColor = getPhColor(parcel.pH);
        }
      } else if (showNueColors && (parcel as any).nue !== undefined) {
        fillColor = getNueColor((parcel as any).nue);
        borderColor = getNueColor((parcel as any).nue);
      } else {
        if (!fillColor) {
          fillColor = styleVariant.fillColor;
        }
        if (!borderColor) {
          borderColor = styleVariant.borderColor;
        }
        if (fillOpacity === undefined) {
          fillOpacity = styleVariant.fillOpacity;
        }
        if (borderWidth === undefined) {
          borderWidth = styleVariant.borderWidth;
        }
        if (parcel.pH !== undefined) {
          fillColor = getPhColor(parcel.pH);
          borderColor = getPhColor(parcel.pH);
        }
      }

      return {
        ...parcel,
        multiPolygon,
        area: areaInHectares,
        areaInSquareMeters,
        fillColor,
        borderColor,
        fillOpacity,
        borderWidth,
      };
    });
  }, [parcels, showPhColors, metricConfig, parcelStyleVariant]);

  useEffect(() => {
    if (
      !map ||
      !mapLoaded ||
      !styleLoaded ||
      layersInitializedRef.current ||
      !visible ||
      parcels.length === 0
    )
      return;

    const sourceId = 'parcels-turf-source';

    const buildFeatures = (): Feature[] => {
      return parcelsWithArea.map((p): Feature => {
        const isVisible = p.visible !== false;
        const isSelected =
          Boolean(selectedParcelId) && p.id === selectedParcelId;
        const borderWidth = isSelected ? 2 : p.borderWidth ?? 1;

        let fillColor = isSelected ? SELECTED_PARCEL_COLOR : p.fillColor;
        let borderColor = isSelected ? SELECTED_PARCEL_COLOR : p.borderColor;

        if (showPhColors && p.pH !== undefined) {
          if (metricConfig) {
            fillColor = getMetricColor(p.pH, metricConfig);
            borderColor = getMetricColor(p.pH, metricConfig);
          } else {
            fillColor = getPhColor(p.pH);
            borderColor = getPhColor(p.pH);
          }
          fillColor = getPhColor(p.pH);
          borderColor = getPhColor(p.pH);
        } else if (showNueColors && (p as any).nue !== undefined) {
          fillColor = getNueColor((p as any).nue);
          borderColor = getNueColor((p as any).nue);
        }

        const fillOpacity =
          isVisible && !onlyBorder
            ? isSelected
              ? 0.12
              : p.fillOpacity ?? 0.3
            : 0.01;

        return {
          type: 'Feature',
          id: p.id,
          properties: {
            id: p.id,
            name: p.name,
            area: p.area?.toFixed(1) || '0.0',
            areaInSquareMeters: p.areaInSquareMeters || 0,
            fillColor,
            borderColor,
            fillOpacity,
            borderWidth: isVisible ? borderWidth : 0,
            zIndex: p.zIndex || 5,
            pH: p.pH,
            visible: isVisible,
          },
          geometry: {
            type: 'MultiPolygon',
            coordinates: p.coordinates,
          },
        };
      });
    };

    const initialGeojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: buildFeatures(),
    };

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: initialGeojson,
        promoteId: 'id',
      });
    }

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
    }

    if (!map.getLayer('parcels-turf-line')) {
      map.addLayer({
        id: 'parcels-turf-line',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': ['get', 'borderColor'],
          'line-width': ['get', 'borderWidth'],
        },
      });
    }

    if (showLabels && !onlyBorder) {
      const minZoomForLabels = 14;
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
            'text-size': ['interpolate', ['linear'], ['zoom'], 8, 0, 12, 14],
            'text-anchor': 'center',
            'text-justify': 'center',
            'text-optional': true,
            'symbol-placement': 'point',
            'symbol-avoid-edges': true,
            'text-line-height': 1.2,
            'text-pitch-alignment': 'viewport',
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

    layersInitializedRef.current = true;
    parcelsRef.current = parcels;

    return () => {
      // Layer/source
    };
  }, [
    map,
    mapLoaded,
    styleLoaded,
    visible,
    parcels,
    parcelsWithArea,
    onlyBorder,
    showPhColors,
    showNueColors,
    showLabels,
    metricConfig,
    parcelStyleVariant,
    selectable,
    selectedParcelId,
  ]);

  useEffect(() => {
    if (!map || !layersInitializedRef.current) return;

    const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (!selectable) return;
      const f = e.features?.[0];
      if (!f) return;

      const id = String(f.properties?.id ?? '');
      const parcel = parcelsWithArea.find((p) => p.id === id);
      if (parcel && onParcelClickRef.current) {
        onParcelClickRef.current(parcel);
      }
    };

    const handleMouseEnter = () => {
      try {
        const canvas = map?.getCanvas();

        if (selectable && canvas && canvas.style) {
          canvas.style.cursor = 'pointer';
        }
      } catch (error) {
        console.error(error);
      }
    };
    const handleMouseLeave = () => {
      const canvas = map?.getCanvas();
      if (selectable && canvas) canvas.style.cursor = '';
    };

    map.on('click', 'parcels-turf-fill', handleClick);
    map.on('click', 'parcels-turf-line', handleClick);
    map.on('mouseenter', 'parcels-turf-fill', handleMouseEnter);
    map.on('mouseleave', 'parcels-turf-fill', handleMouseLeave);

    return () => {
      if (!map) return;
      try {
        map.off('click', 'parcels-turf-fill', handleClick);
        map.off('click', 'parcels-turf-line', handleClick);
        map.off('mouseenter', 'parcels-turf-fill', handleMouseEnter);
        map.off('mouseleave', 'parcels-turf-fill', handleMouseLeave);

        const canvas = map?.getCanvas();
        if (canvas) canvas.style.cursor = '';
      } catch (error) {
        console.error(error);
      }
    };
  }, [map, parcelsWithArea, selectable]);

  useEffect(() => {
    if (!map || !layersInitializedRef.current) return;

    const source = map.getSource(
      'parcels-turf-source'
    ) as mapboxgl.GeoJSONSource;
    if (!source) return;

    const updatedFeatures: Feature[] = parcelsWithArea.map((p): Feature => {
      const isSelected = Boolean(selectedParcelId) && p.id === selectedParcelId;

      let fillColor = isSelected ? SELECTED_PARCEL_COLOR : p.fillColor;
      let borderColor = isSelected ? SELECTED_PARCEL_COLOR : p.borderColor;

      if (showPhColors && p.pH !== undefined) {
        fillColor = getPhColor(p.pH);
        borderColor = getPhColor(p.pH);
      } else if (showNueColors && (p as any).nue !== undefined) {
        fillColor = getNueColor((p as any).nue);
        borderColor = getNueColor((p as any).nue);
      }

      return {
        type: 'Feature',
        id: p.id,
        properties: {
          id: p.id,
          name: p.name,
          area: p.area?.toFixed(1) || '0.0',
          areaInSquareMeters: p.areaInSquareMeters || 0,
          fillColor,
          borderColor,
          fillOpacity:
            p.visible !== false && !onlyBorder ? p.fillOpacity ?? 0.12 : 0.01,
          borderWidth:
            p.visible !== false ? (isSelected ? 2 : p.borderWidth ?? 2) : 0,
          zIndex: p.zIndex || 5,
          pH: p.pH,
          visible: p.visible !== false,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: p.coordinates,
        },
      };
    });

    const updatedGeojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: updatedFeatures,
    };

    source.setData(updatedGeojson);
  }, [
    map,
    parcelsWithArea,
    onlyBorder,
    showPhColors,
    metricConfig,
    parcelStyleVariant,
    showNueColors,
    selectedParcelId,
  ]);

  useEffect(() => {
    if (!map) return;

    const vis = visible ? 'visible' : 'none';

    if (map.getLayer('parcels-turf-line'))
      map.setLayoutProperty('parcels-turf-line', 'visibility', vis);

    if (map.getLayer('parcels-turf-fill'))
      map.setLayoutProperty('parcels-turf-fill', 'visibility', vis);

    if (map.getLayer('parcels-turf-labels')) {
      const labelsVisibility =
        visible && showLabels && !onlyBorder ? 'visible' : 'none';
      map.setLayoutProperty(
        'parcels-turf-labels',
        'visibility',
        labelsVisibility
      );
    }
  }, [visible, map, showLabels, onlyBorder]);

  useEffect(() => {
    if (!map || !layersInitializedRef.current) return;

    const ensureLayersOnTop = () => {
      try {
        if (map.getLayer('parcels-turf-fill')) {
          map.moveLayer('parcels-turf-fill');
        }
        if (map.getLayer('parcels-turf-line')) {
          map.moveLayer('parcels-turf-line');
        }
        if (map.getLayer('parcels-turf-labels')) {
          map.moveLayer('parcels-turf-labels');
        }
      } catch {
        // Ignore errors when layers don't exist
      }
    };

    ensureLayersOnTop();

    map.on('styledata', ensureLayersOnTop);

    return () => {
      map.off('styledata', ensureLayersOnTop);
    };
  }, [map]);

  return null;
};
