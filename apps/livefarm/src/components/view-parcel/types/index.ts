import type { ParcelWithZones } from '@@agrosphere/shared';

export interface ViewParcelHistoryEntry {
  id: string;
  createdAt: Date;
  zonesCount: number;
  method: string;
  parcelWithZones: ParcelWithZones;
}

export interface ViewParcelFormParcelData {
  id: string;
  farmName: string;
  parcelCode: string;
  parcelName: string;
  areaLabel: string;
  effectiveArea: string;
  soilType: string;
  crop?: string;
  geometry: number[][];
  center: [number, number];
  history: ViewParcelHistoryEntry[];
  eosdaFieldId?: string | null;
}

export type ViewParcelData = ViewParcelFormParcelData;
export type Coordinate = [number, number];

