interface Geometry {
  type: 'Polygon';
  coordinates: number[][][];
}

interface FieldProperties {
  name: string;
  group: string | null;
  years_data: {
    crop_type: string;
    year: number;
    sowing_date: string;
  }[];
}

export interface CreateFieldDto {
  type: 'Feature';
  properties: FieldProperties;
  geometry: Geometry;
}

//UpdateFieldDto
interface UpdateProperties {
  years_data: {
    crop_type: string;
    ndvi_list: string;
    year: number;
    sowing_date: string;
    fertilizer: string;
    aoi: number;
  }[];
  group: string;
  name: string;
}

interface UpdateGeometry {
  coordinates: number[][][];
  type: 'Polygon';
}

export interface UpdateFieldDto {
  properties: UpdateProperties;
  geometry: UpdateGeometry;
}

//CreateProductivityMapDto
export interface CreateProductivityMapDto {
  field_id: number;
  vegetation_index: string;
  zone_quantity: number;
  need_answer: boolean;
}

export interface ProductivityMapPendingResponse {
  status: 'pending';
  request_url: string;
}

// ZoningMapResponse
export interface ZoningMapResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      zone_id: string;
      zone_name?: string;
      [key: string]: unknown;
    };
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: number[][][] | number[][][][];
    };
  }>;
}

// DownloadVisualRequest
export interface DownloadVisualGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface DownloadVisualParams {
  view_id: string;
  bm_type: string;
  geometry: DownloadVisualGeometry;
  px_size: number;
  format?: 'jpeg' | 'tiff' | 'png';
  colormap?: string;
  reference: string;
  name_alias?: string;
  resample?: 'near' | 'bilinear' | 'cubic' | 'cubicspline' | 'lanczos' | 'average' | 'mode' | 'max' | 'min' | 'med' | 'q1' | 'q3';
  levels?: string;
  colors_limit?: number;
  calibrate?: 0 | 1;
  size?: 'S' | 'M' | 'L' | 'XL';
  georeference?: 'world' | 'kmz' | 'tiff';
  pansharpening?: boolean;
  colors?: string[];
  thresholds?: number[];
}

export interface DownloadVisualRequest {
  type: 'jpeg';
  params: DownloadVisualParams;
}

// DownloadVisualTaskResponse
export interface DownloadVisualTaskResponse {
  status: string;
  task_id: string;
  req_id: string;
  task_timeout: number;
}

// TaskStatusResponse
export interface TaskStatusResponse {
  status: string;
  task_id?: string;
  req_id?: string;
  result?: {
    url?: string;
    [key: string]: unknown;
  };
  error?: string;
  [key: string]: unknown;
}

// SceneSearchRequest
export interface SceneSearchParams {
  date_start: string;
  date_end: string;
  data_source?: ('sentinel2' | 'sentinel2l2a' | 'landsat8')[];
  sensors?: ('sentinel2' | 'sentinel2l2a' | 'landsat8')[];
  limit?: number;
  max_cloud_cover_in_aoi?: number;
}

export interface SceneSearchRequest {
  params: SceneSearchParams;
}

// SceneSearchPendingResponse
export interface SceneSearchPendingResponse {
  status: 'pending';
  request_id: string;
}

// SceneSearchResultItem
export interface SceneSearchResultItem {
  date: string;
  view_id: string;
  cloud: number;
}

// SceneSearchResultResponse
export interface SceneSearchResultResponse {
  status: string;
  result?: SceneSearchResultItem[];
  errors?: unknown[];
}

// P&K Zoning API Types
export interface CreatePKZoningRequest {
  type_zmap: 2; // Productivity map
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  zones: number; // 2-7
  vegetation_index: 'NDVI' | 'EVI' | 'NDWI' | 'SAVI';
}

export interface CreatePKZoningResponse {
  zmap_id: number;
  status: 'processing' | 'pending';
  type_zmap?: number;
}

export interface PKZoningMapResponse {
  zmap_id: number;
  type_zmap: number;
  vegetation_index: string;
  start_date: string;
  end_date: string;
  status: 'processing' | 'done' | 'failed';
  zones?: Array<{
    id: number;
    area: number;
    fertilizer: number;
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: number[][][] | number[][][][];
    };
  }>;
  image_link?: string; // PNG URL
}
