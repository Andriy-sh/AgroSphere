import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export const MIN_COORDINATE_DISTANCE = 0.00001;

export const MAP_SOURCE_IDS = {
  ZONES: 'zones-source',
  SPLIT_LINES: 'split-lines-source',
} as const;

export const MAP_LAYER_IDS = {
  ZONES_FILL: 'zones-fill-layer',
  ZONES_LINE: 'zones-layer',
  ZONES_SELECTED: 'zones-selected-layer',
  SPLIT_LINES: 'split-lines-layer',
  ZONES_LABEL: 'zones-label-layer',
  PARCEL_LABEL: 'parcel-label-layer',
} as const;

export type DrawingMode = 'polygon' | 'line_string' | 'simple_select' | null;

export interface PolygonProperties {
  zone_id?: string;
  parent_parcel_id?: string;
  area?: number;
  zone_name?: string;
  [key: string]: unknown;
}

export interface LineProperties {
  isSplitLine?: boolean;
  [key: string]: unknown;
}

export interface DrawingFeature {
  id: string;
  type: 'Feature';
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'LineString'; coordinates: number[][] };
  properties: PolygonProperties | LineProperties;
}

export interface ParcelWithZones {
  parcelId: string;
  parcelCoordinates: number[][];
  zones: Array<{
    zoneId: string;
    zoneName?: string;
    coordinates: number[][];
    area?: number;
  }>;
  splitLines: Array<{
    coordinates: number[][];
  }>;
  area?: number;
}

export interface UseMapPolygonSplittingProps {
  map: mapboxgl.Map | null;
  draw: MapboxDraw | null;
  enabled: boolean;
  parcelName?: string;
  parcelAreaProp?: number;
}
