import type { ClientFormData, ExistingClient } from '@@agrosphere/shared';
import type { Client, ClientData } from '@@agrosphere/shared';

export type ClientFormMode = 'add' | 'edit';

export interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (clientData: ClientFormData, inviteClient: boolean) => void;
  mode?: ClientFormMode;
  clientData?: ClientData;
  onClientUpdated?: (updatedClient: Client) => void;
  updateClientState?: (clientData: Partial<ClientData>) => void;
}

export interface AddClientFormProps {
  mode: ClientFormMode;
  defaultValues: ClientFormData;
  existingClients?: ExistingClient[];
  excludeClientId?: string;
  serverErrors?: Record<string, string>;
  onSubmit: (data: ClientFormData) => void;
  onFieldBlur?: (fieldName: string) => void;
  formSubmitRef?: React.MutableRefObject<(() => void) | null>;
}

export interface UseAddClientFormReturn {
  form: ReturnType<typeof import('react-hook-form').useForm<ClientFormData>>;
  canSubmit: boolean;
  hasErrors: boolean;
  validationIssues: Array<{
    type: 'error' | 'warning';
    field: string;
    message: string;
  }>;
  validateField: (fieldName: keyof ClientFormData) => Promise<boolean>;
  setServerErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
}

export interface UseAddClientDialogReturn {
  handleSubmit: (data: ClientFormData, inviteClient: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  serverErrors: Record<string, string>;
}
