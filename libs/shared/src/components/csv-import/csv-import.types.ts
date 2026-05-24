export interface CsvTemplate {
  filename: string;
  content: string;
  description: string;
}

export interface CsvImportConfig<T = any> {
  title: string;
  requiredFields: string[];
  parseRow: (values: string[], headers: string[]) => T;
  convertToImported: (csvData: T[]) => any[];
  generateId: () => string;
  previewColumns: {
    key: string;
    label: string;
    render: (item: any) => string;
  }[];
  successMessage: (count: number, filesCount: number) => string;
  importButtonText: (count: number) => string;
  templates?: CsvTemplate[];
}

export interface CsvImportProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  config: CsvImportConfig<T>;
}

export interface CsvImportState {
  files: File[];
  isProcessing: boolean;
  error: string | null;
  previewData: any[];
  showPreview: boolean;
}
