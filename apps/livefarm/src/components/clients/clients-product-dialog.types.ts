export interface ClientsProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  onProductAdded?: (clientId: string, productName: string) => void;
}

export interface BillingOption {
  value: string;
  label: string;
}
