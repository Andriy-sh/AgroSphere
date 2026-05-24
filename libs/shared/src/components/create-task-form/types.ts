export type SelectOption = { value: string; label: string };

export type FieldZone = {
  value: string;
  label: string;
  area?: number;
  children?: FieldZone[];
};

export type Farm = {
  id?: string;
  name: string;
  area: number;
  fields: FieldZone[];
  selectedFields: { label: string; value: string }[];
  remainingCount: number;
  total: number;
  isActive: boolean;
  clientId?: string;
};

export type LabOption = { value: string; label: string };

export interface CreateTaskFormValues {
  lab: string;
  client: string;
  taskType: string;
  assignedTo: string;
  assignedUser: string;
  priority: string;
  startAfter: string;
  completeBy: string;
  description: string;
}

export interface CreateTaskFormProps {
  taskTypes: SelectOption[];
  organizations: OrganizationOption[];
  priorities: SelectOption[];
  labs: LabOption[];
  values: CreateTaskFormValues;
  onChange: (field: keyof CreateTaskFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAttachFiles?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  farms: Farm[];
  selectedFarms: Record<string, string[]>;
  onFarmsChange: (farmId: string, selectedFields: string[]) => void;
  attachedFiles: File[];
  showTaskTypeDropdown?: boolean;
  onZoomToFarm?: (farmId: string) => void;
  resetExpanded?: boolean;
  showActionButtons?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  isFormValid?: boolean;
  isSubmitting?: boolean;
  selectedLab?: string;
  selectedStartAfter?: string;
  selectedCompleteBy?: string;
  selectedOrganization?: any;
  selectedUser?: any;
  selectedPriority?: string;
  allowSave?: boolean;
  isEditing?: boolean;
}

export type UserOption = { value: string; label: string; photo?: string };

export interface OrganizationOption {
  value: string;
  label: string;
  distance?: number;
  tasks?: number;
  own?: boolean;
  users?: UserOption[];
}

export interface InlineOrganizationSelectProps {
  organizations: OrganizationOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  triggerClassName?: string;
  className?: string;
}

export interface ClientSelectProps {
  clients: Farm[];
  selectedFarms: Record<string, string[]>;
  onToggle: (farmName: string, active: boolean) => void;
  onFieldsChange: (farmName: string, selectedFieldValues: string[]) => void;
}

export type UploadFile = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
};
