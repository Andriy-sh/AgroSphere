export interface Client {
  id: string;
  business_name: string;
  business_type: string;
  first_name: string;
  last_name: string;
  full_name: string;
  mobile: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string | null;
  eircode: string;
  county: string;
  full_address: string;
  contact_name: string;
  contact_role: string | null;
  account_number: string | null;
  derogation: boolean;
  farm_type: string | null;
  herd_no: string | null;
  organic: boolean | null;
  status: string;
  created_at: string;
  updated_at: string;
  lead_consultant?: {
    id: string;
    name: string;
    email: string;
  } | null;

  name?: string;
  address?: string | null;
  phone?: string;
  farms?: number;
  farm_location_set?: boolean;
  active_tasks_count?: number;
  asgn?: string | null;
  tasks?: string | number;
  product?: string | null;
  tags?: string[];
}

export interface ClientLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ClientMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ClientMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ClientMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ClientsResponse {
  data: Client[];
  links: ClientLinks;
  meta: ClientMeta;
  search: string | null;
  paginate: string;
}

export interface ClientFilters {
  search?: string;
  per_page?: number;
  page?: number;
  status?: string;
  business_type?: string;
  lead_consultant?: string;
  tags?: string[];
  include?: string;
}

export interface ClientDetailsResponse {
  data: {
    id: string;
    business_name: string;
    business_type: string;
    first_name: string;
    last_name: string;
    full_name: string;
    mobile: string;
    email: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string | null;
    eircode: string;
    county: string;
    full_address: string;
    contact_name: string;
    contact_role: string | null;
    account_number: string | null;
    derogation: boolean;
    farm_type: string | null;
    herd_no: string | null;
    organic: boolean | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
  meta: {
    resource: string;
    version: string;
  };
}

export interface CreateClientRequest {
  business_name: string;
  business_type: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  county: string;
  eircode: string;
  contact_name: string;
  contact_role?: string;
  account_number?: string;
  derogation: boolean;
  farm_type?: string;
  herd_no?: string;
  organic?: boolean;
}

export interface CreateClientResponse {
  client: Client;
}

export interface CreateClientError {
  message: string;
  errors: Record<string, string[]>;
}
