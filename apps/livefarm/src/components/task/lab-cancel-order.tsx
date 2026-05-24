'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface LabCancelOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LabCancelOrder({
  isOpen,
  onClose,
  onConfirm,
}: LabCancelOrderProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cancel lab order"
      message="Are you sure you want to cancel this lab order? This action cannot be undone and will permanently delete the lab order."
      confirmText="Cancel order"
      cancelText="Keep order"
      confirmButtonVariant="danger"
      size="md"
      icon={
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-red-600 text-xl">
            delete
          </span>
        </div>
      }
    />
  );
}
