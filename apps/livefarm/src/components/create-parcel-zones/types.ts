import type { ParcelWithZones, DownloadVisualGeometry } from '@@agrosphere/shared';

export type MapCoordinates = [number, number][][][];

export interface CreateParcelZonesFormData {
  farm: string;
  name: string;
  id: string;
  area: string;
  effectiveArea: string;
  soilType: string;
  crop: string;
}

export interface SelectedFarm {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

export interface ParcelData {
  id: string;
  farm: string;
  farmData: SelectedFarm | null;
  name: string;
  parcelId: string;
  area: string;
  effectiveArea: string;
  soilType: string;
  drawnFeatures: unknown[];
  drawnArea: number;
  createdAt: string;
}

export type FormStep = 'select-farm' | 'create-parcel' | 'create-zones';

export type DrawingMode = 'draw_polygon' | 'draw_line_string' | 'simple_select';

export interface FormErrors {
  name?: string;
  id?: string;
}

export interface ZonesHistoryEntry {
  id: string;
  parcelWithZones: ParcelWithZones;
  createdAt: Date;
  zonesCount: number;
  method: string;
  name?: string; 
  imageUrl?: string | null;
  savedGeometry?: DownloadVisualGeometry | null;
  satelliteDate?: Date | null; 
}

