export interface ZoneBoundary {
  boundaries: number[][];
  boundaries_xy: number[][];
}

export interface CreateParcelZone {
  name: string;
  itemId?: string | number;
  crop?: string;
  soilType?: string;
  acre?: number;
  hectare?: number;
  boundaries: number[][];
  boundaries_xy: number[][];
}

export interface CreateParcelRequest {
  name: string;
  itemId?: string | number;
  crop?: string;
  soilType?: string;
  acre: number;
  hectare: number;
  effectiveHectare?: number;
  boundaries: number[][];
  boundaries_xy: number[][];
  hasZones?: boolean;
  zoneType?: 'manual' | 'none' | 'satellite' | null;
  zones?: CreateParcelZone[];
}

export interface SampleZone {
  id: string;
  item_id: number;
  name: string;
  field_no: number;
  crop: string;
  soil_type: string;
  acre: number;
  hectare: string;
  parcel_item_id: unknown[];
  is_merged: boolean;
  is_split: boolean;
  show_default_plan: boolean;
  sample_plan: number;
  lab_tests: unknown[];
  boundaries: number[][];
  boundaries_xy: number[][];
  created_at: string;
}

export interface ParcelData {
  id: string;
  item_id: number;
  name: string;
  field_no: number;
  crop: string;
  soil_type: string;
  soil_type_formatted: string;
  acre: number;
  hectare: string;
  boundaries: number[][];
  boundaries_xy: number[][];
  sample_zones: SampleZone[];
  created_at: string;
  updated_at?: string;
}

export type Parcel = {
  id: string;
  item_id: string | number;
  name: string;
  field_no: number | null;
  crop: string;
  soil_type: string;
  soil_type_formatted?: string;
  acre: number;
  hectare: number | string;
  boundaries: number[][];
  boundaries_xy: number[][];
  sample_zones?: Array<{
    id: string;
    item_id: number;
    name: string;
    field_no: number | null;
    crop: string;
    soil_type: string;
    acre: number;
    hectare: number | string;
    boundaries: number[][];
    boundaries_xy: number[][];
    created_at: string;
    is_merged?: boolean;
    is_split?: boolean;
    show_default_plan?: boolean;
    sample_plan?: number;
    lab_tests?: unknown;
    parcel_item_id?: string | null;
  }>;
  created_at: string;
  updated_at?: string;
  eosda_field_id?: string | null;
  identifier?: string | null;
  identifier_xy?: number[] | null;
  productivity_id?: string | null;
  vegetation_id?: string | null;
};

export type CreateParcelResponse = ParcelData;

export interface GetParcelResponse {
  data: ParcelData;
}

export interface UpdateParcelRequest {
  name?: string;
  itemId?: string | number;
  crop?: string;
  soilType?: string;
  acre?: number;
  hectare?: number;
  boundaries?: number[][];
  boundaries_xy?: number[][];
}

export interface UpdateParcelResponse {
  message: string;
  data: ParcelData;
}

export interface DeleteParcelResponse {
  message: string;
}
