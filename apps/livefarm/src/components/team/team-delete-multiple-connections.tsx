'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamDeleteMultipleConnectionsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function TeamDeleteMultipleConnections({
  isOpen,
  onClose,
  onConfirm,
  count,
}: TeamDeleteMultipleConnectionsProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete connections!"
      message={`Are you sure you want to delete ${count} selected connection(s)? This action is irreversible and will permanently remove all selected connections from the system.`}
      confirmText="Delete"
      confirmButtonVariant="danger"
      size="lg"
      icon={
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-red-600 text-xl">
            link_off
          </span>
        </div>
      }
    />
  );
}
