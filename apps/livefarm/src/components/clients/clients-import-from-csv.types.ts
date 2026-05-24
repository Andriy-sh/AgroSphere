export interface ClientsImportFromCsvProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (clients: ImportedClient[]) => void;
}

export interface ImportedClient {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  herdNo: string | null;
  asgn: string | null;
  tasks: number | null;
  product: string | null;
  tags: string[] | null;
  avatar: string;
  initials: string;
  isOwn: boolean;
}

export interface CsvRow {
  name: string;
  address?: string;
  phone?: string;
  herdNo?: string;
  asgn?: string;
  tasks?: string;
  product?: string;
  tags?: string;
}
