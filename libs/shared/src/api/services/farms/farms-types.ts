export interface FarmLocation {
  location: [number, number];
  location_xy: [number, number];
}

export interface CreateFarmRequest {
  name: string;
  farmLocation: FarmLocation | null;
}

export interface FarmData {
  id: string;
  name: string;
  location: [number, number];
  location_xy: [number, number];
  item_id: string;
  created_at: string;
  parcels?: Array<{
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
  }>;
}

export interface CreateFarmResponse {
  message: string;
  farm: FarmData;
}

export interface GetFarmsResponse {
  farms: FarmData[];
}

export interface GetFarmResponse {
  farm: FarmData;
}

export interface UpdateFarmRequest {
  name?: string;
  farmLocation?: FarmLocation;
  item_id?: string;
  sampling_interval?: number;
  sampling_start_year?: number;
}

export interface UpdateFarmResponse {
  message: string;
  farm: FarmData;
}
