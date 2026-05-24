export interface FarmAssignment {
  hashid: string;
}

export interface CreateTaskRequest {
  task_type: string;
  farmer_hashid: string;
  lab: number;
  assigned_to_hashid: string[];
  assigned_organization_hashid: string;
  priority: string;
  active_date: string;
  complete_by: string;
  note?: string;
  farms: FarmAssignment[];
}

export interface Client {
  id: string;
  name: string;
}

export interface AssignedToOrganisation {
  id: string;
  name: string;
  email: string;
  type: string;
}

export interface CreatedBy {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TaskData {
  id: string;
  task_type: string;
  client: Client;
  status: string;
  assigned_to_organisation: AssignedToOrganisation;
  created_date: string;
  reporting: string;
  created_by: CreatedBy;
  task_number: string;
  task_status: string;
  issues: any[];
  priority: string;
  active_date: string;
  complete_by: string | null;
  advisor: string;
}

export interface CreateTaskResponse {
  task: TaskData;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface TaskStatuses {
  not_started: string;
  in_progress: string;
  rejected: string;
  collected: string;
  cancelled: string;
  lab: string;
  complete: string;
}

export interface TasksListResponse {
  data: TaskData[];
  links: PaginationLinks;
  meta: PaginationMeta;
  search: string | null;
  paginate: string;
  statuses: TaskStatuses;
}

export interface TaskFilters {
  search?: string;
  status?:
    | 'not_started'
    | 'in_progress'
    | 'rejected'
    | 'collected'
    | 'cancelled'
    | 'lab'
    | 'completed';
  sort?: string;
  sortingOrder?: 'asc' | 'desc';
  advisor?: number;
  filter?: string;
  active_date_start?: string;
  active_date_end?: string;
  complete_by?: string;
  page?: number;
  per_page?: number;
  farmer_hashid?: string;
  task_type?: string;
}

export interface TaskTest {
  id: string;
  status: string;
  codes: string[];
  lab: number;
  assigned_to_hashid: string;
  sampleId?: string;
  parcelId?: string;
  zoneId?: string;
  parcel?: string;
  zone?: string;
  lpisId?: string;
  labOrderId?: string;
  latitude?: string;
  longitude?: string;
}

export interface TaskDetails {
  id: string;
  task_type: string;
  status: string;
  priority: string;
  active_date: string;
  complete_by: string;
  notes?: string;
  client?: {
    id: string;
    name: string;
  };
  assigned_to_organisation: {
    id: string;
    name: string;
    type: string;
    email: string;
    telephone?: string;
    address?: {
      line_1: string;
      line_2: string;
      city: string;
      county: string;
      eircode: string;
    };
    enabled?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  organisation?: {
    id: string;
    name: string;
    type: string;
  };
  farmer: {
    id: string;
    name: string;
  };
  tests: TaskTest[];
  created_date: string;
  reporting: string;
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
  };
  task_number: string;
  task_status: string;
  issues: any[];
  assigned_to_user?: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
  collected?: any;
  lab?: string;
  advisor: string;
}

export interface Lab {
  id: number;
  hashid: string | null;
  name: string;
  address: string | null;
  country: string | null;
  is_active: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface LabTest {
  id: number;
  name: string;
  code: string;
  description: string;
  lab_id: number;
}

export interface TaskDetailsResponse {
  task: TaskDetails;
  statuses: TaskStatuses;
  priorities: {
    // low: string;
    // medium: string;
    normal: string;
    high: string;
    // urgent: string;
  };
  labs: Lab[];
  lab_tests: LabTest[];
}

export interface UpdateTaskRequest {
  lab?: number;
  assigned_to_hashid?: string[];
  assigned_organization_hashid?: string;
  priority?: string;
  active_date?: string;
  complete_by?: string;
  note?: string;
  farms?: FarmAssignment[];
  status?: string;
}

export interface PatchTaskRequest {
  lab?: number;
  assigned_to_hashid?: string[];
  assigned_organization_hashid?: string;
  priority?: string;
  active_date?: string;
  complete_by?: string;
  note?: string;
  farms?: FarmAssignment[];
  status?: 'complete' | 'cancelled' | 'not_started' | 'in_progress';
}

export interface UpdateTaskResponse {
  task: TaskData;
  status: string;
}

export interface DeleteTaskResponse {
  message: string;
  status: string;
}

export interface TaskStatusCounts {
  status_counts: {
    not_started: number;
    in_progress: number;
    rejected: number;
    collected: number;
    cancelled: number;
    lab: number;
    complete: number;
  };
}

export interface TaskType {
  id: string;
  task_type: string;
  client: Client;
  status: string;
  assigned_to_organisation: AssignedToOrganisation;
  created_date: string;
  reporting: string;
  created_by: CreatedBy;
  task_number: string;
  task_status: string;
  issues: any[];
  priority: string;
  active_date: string;
  complete_by: string | null;
  advisor: string;
  latitude?: number;
  longitude?: number;
}
