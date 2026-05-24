export interface CreateZoneRequest {
  name: string;
  itemId?: string | number;
  acre: number;
  hectare: number;
  boundaries: number[][];
  boundaries_xy: number[][];
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

export interface ZoneData {
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
}

export interface CreateZoneResponse {
  message: string;
  data: ZoneData;
}

export interface DeleteZoneResponse {
  message: string;
}
