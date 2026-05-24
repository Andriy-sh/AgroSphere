import type { Feature as GeoJsonFeature } from 'geojson';

export interface FarmMarker {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  status: string;
  color?: string;
  type?: 'task' | 'farm';
  name?: string;
  client_name?: string;
  address?: string;
  size?: number;
  crop_type?: string;
  last_visit?: string;
  visible?: boolean;
  clientId?: string;
  priority?: 'normal' | 'urgent' | 'none';
  avatarSrc?: string;
  description?: string;
  created_date?: string;
  assigned_users?: Array<{
    name: string;
    surname: string;
    avatarSrc?: string;
  }>;
}

export type MapCoordinate = [number, number];
export type MapLinearRing = MapCoordinate[];
export type MapPolygon = MapLinearRing[];
export type MapMultiPolygon = MapPolygon[];

export interface MapZone {
  id: string;
  name: string;
  area?: number;
  cropType?: string;
  coordinates: MapMultiPolygon;
  fillColor?: string;
  borderColor?: string;
  fillOpacity?: number;
  borderWidth?: number;
  visible?: boolean;
  clientId?: string;
  farmId?: string;
  farmName?: string;
  parcelId?: string;
  parcelName?: string;
  zIndex?: number;
  pH?: number;
  textColor?: string;
  textSize?: number;
  textWeight?: string;
  eosdaFieldId?: string;
}

export interface ParcelSplitLine {
  id: string;
  coordinates: MapCoordinate[];
}

export interface MapParcel {
  id: string;
  name?: string;
  area?: number;
  coordinates: MapMultiPolygon;
  zones?: MapZone[];
  splitLines?: ParcelSplitLine[];
  drawnFeatures?: GeoJsonFeature[];
  createdAt?: string;
  updatedAt?: string;
  clientId?: string;
  farmId?: string;
  visible?: boolean;
  fillColor?: string;
  borderColor?: string;
  fillOpacity?: number;
  borderWidth?: number;
  pH?: number;
  zIndex?: number;
  textColor?: string;
  textSize?: number;
  textWeight?: string;
  eosdaFieldId?: string;
}
