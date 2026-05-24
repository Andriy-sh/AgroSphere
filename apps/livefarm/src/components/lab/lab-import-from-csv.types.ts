export interface LabImportFromCsvProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (labItems: ImportedLabItem[]) => void;
}

export interface ImportedLabItem {
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

export interface CsvLabRow {
  labName: string;
  clientName: string;
  clientSurname?: string;
  farm: string;
  taskId: string;
  labOrderNo?: string;
  samples: string;
  sampleDate: string;
  sentDate?: string;
  receivedDate?: string;
  status?: string;
  type: string;
}
