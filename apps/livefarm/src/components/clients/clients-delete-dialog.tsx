'use client';

import { ConfirmationDialog, Icon } from '@@agrosphere/shared';

interface ClientsDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
}

export function ClientsDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  clientName,
}: ClientsDeleteDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete client!"
      message={`Are you sure you want to delete "${clientName}"? This action is irreversible and will permanently remove this client from the system.`}
      confirmText="Delete"
      confirmButtonVariant="danger"
      size="lg"
      icon={
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <Icon icon="delete" className="text-basic-red" />
        </div>
      }
    />
  );
}
