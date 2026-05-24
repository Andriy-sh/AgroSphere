export type FarmParcel = {
  id: string;
  name: string;
  type: string;
  area: number;
  geometry: number[][];
  children: never[];
  eosdaFieldId?: string;
  zoningId?: string;
};

export type FarmDataItem = {
  id: string;
  name: string;
  area: number;
  parcels: number;
  lat?: number;
  lng?: number;
  children: FarmParcel[];
};

export type FarmData = FarmDataItem[];


