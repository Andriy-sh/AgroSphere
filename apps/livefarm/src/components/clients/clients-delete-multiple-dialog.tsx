'use client';

import { ConfirmationDialog, Icon } from '@@agrosphere/shared';

interface ClientsDeleteMultipleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function ClientsDeleteMultipleDialog({
  isOpen,
  onClose,
  onConfirm,
  count,
}: ClientsDeleteMultipleDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete clients!"
      message={`Are you sure you want to delete ${count} selected client(s)? This action is irreversible and will permanently remove all selected clients from the system.`}
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
