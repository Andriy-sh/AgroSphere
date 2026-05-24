export interface Test {
  id: number;
  hashid: string;
  code: string;
  farmer_id: string;
  farm_name: string;
  task_comment: string | null;
  status: string;
  lab_name: string;
  sent_to_lab: boolean;
  soil_analysis_status: boolean;
  task_report_status: boolean;
  path_issues: boolean;
  logsheet_issue: number;
  smap_smaple_paths: boolean;
  csv_created: boolean;
  task_hashid: string;
  farm_hashid: string;
  survey_ident: string;
  update_id: number | null;
}

export interface LabInfo {
  labNumber: string;
  sentDate: string;
  receivedDate: string;
  status:
    | 'received'
    | 'pending'
    | 'testing'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  labName: string;
  clientName: string;
  farmName: string;
  samplesCount: number;
  type: 'Soil' | 'Grass' | 'Silage' | 'Feed' | 'Water' | 'Slurry';
  estimatedCompletionDate?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

export interface TaskDetails {
  id: string;
  organisation_name: string;
  organisation_id: number;
  assigned_to_organisation: number | null;
  farmer_name: string;
  task_type: string;
  assigned_to: number;
  task_creator: number;
  farmer_organisation_id: number;
  farms: string;
  lab: string;
  no_of_samples: number;
  farmer_address: string;
  soil_sampler: string | null;
  farmteam_task_number: string;
  id_number: number;
  task_has_not_started_test: boolean;
  task_has_unmatched_samples: boolean;
  task_has_tests_without_lab_result: boolean;
  date: string;
  complete_by: string | null;
  status: string;
  tests: Test[];
  created_by: number;
  issues_approve_by: number | null;
  reporting_status: string | null;
  notes?: string;
  combine_task_report: number;
  combine_soil_analysis_report: number;
  advisor: string;
  latitude?: number;
  longitude?: number;
  taskZones?: Record<string, string[]>;
  labInfo?: LabInfo;
  labOrderNumber?: string;
  labSentDate?: string;
  labReceivedDate?: string;
  labStatus?: LabInfo['status'];
  labType?: LabInfo['type'];
  labPriority?: LabInfo['priority'];
  labContactPerson?: string;
  labContactPhone?: string;
  labContactEmail?: string;
  labNotes?: string;
  labEstimatedCompletion?: string;
}
