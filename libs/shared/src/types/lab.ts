export interface LabItem {
  id: string;
  labName: string;
  client: {
    name: string;
    surname: string;
    avatarSrc?: string;
  };
  farm: string;
  taskId: string;
  labOrderNo: string;
  samples: number;
  sampleDate: string;
  sentDate: string;
  receivedDate: string;
  status:
    | 'pending'
    | 'complete'
    | 'in_progress'
    | 'cancelled'
    | 'testing'
    | 'received';
  hasResults: boolean;
  updatedAt: string;
  type: 'Soil' | 'Grass' | 'Silage' | 'Feed' | 'Water' | 'Slurry';
}

export enum LabStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  TESTING = 'testing',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'complete',
  CANCELLED = 'cancelled',
}

export interface LabStatusConfig {
  id: LabStatus;
  label: string;
  icon: string;
  color: string;
  backgroundColor: string;
  isActive: boolean;
  order: number;
}

export const DEFAULT_LAB_STATUS_CONFIGS: LabStatusConfig[] = [
  {
    id: LabStatus.PENDING,
    label: 'Pending',
    icon: 'hourglass_bottom',
    color: 'text-yellow-600',
    backgroundColor: 'bg-yellow-100',
    isActive: true,
    order: 1,
  },
  {
    id: LabStatus.RECEIVED,
    label: 'Received',
    icon: 'approval_delegation',
    color: 'text-blue-600',
    backgroundColor: 'bg-blue-100',
    isActive: true,
    order: 2,
  },
  {
    id: LabStatus.TESTING,
    label: 'Testing',
    icon: 'timelapse',
    color: 'text-blue-600',
    backgroundColor: 'bg-blue-100',
    isActive: true,
    order: 3,
  },
  {
    id: LabStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: 'timelapse',
    color: 'text-blue-600',
    backgroundColor: 'bg-blue-100',
    isActive: true,
    order: 4,
  },
  {
    id: LabStatus.COMPLETED,
    label: 'Completed',
    icon: 'task_alt',
    color: 'text-green-600',
    backgroundColor: 'bg-green-100',
    isActive: true,
    order: 5,
  },
  {
    id: LabStatus.CANCELLED,
    label: 'Cancelled',
    icon: 'block',
    color: 'text-red-600',
    backgroundColor: 'bg-red-100',
    isActive: true,
    order: 6,
  },
];
