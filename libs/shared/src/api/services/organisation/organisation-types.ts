export type OrganisationType = 'advisor' | 'farmer' | 'lab' | 'contractor';

export type FarmType =
  | 'dairy'
  | 'cattle'
  | 'rearing'
  | 'cattle_other'
  | 'sheep'
  | 'tillage'
  | 'mixed_livestock';

export interface CreateOrganisationRequest {
  name: string;
  email: string;
  type: OrganisationType;
  farm_type?: FarmType;
  business_type?: string;
}

export interface Organisation {
  id: number;
  name: string;
  email: string;
  type: OrganisationType;
  farm_type?: FarmType;
  business_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrganisationResponse {
  status: 'success';
  organisation: Organisation;
}

export interface CreateOrganisationError {
  message: string;
  errors?: Record<string, string[]>;
}
