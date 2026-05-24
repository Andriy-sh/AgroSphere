'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamDeleteMultipleUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function TeamDeleteMultipleUsers({
  isOpen,
  onClose,
  onConfirm,
  count,
}: TeamDeleteMultipleUsersProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete users!"
      message={`Are you sure you want to delete ${count} selected user(s)? This action is irreversible and will permanently remove all selected users from the system.`}
      confirmText="Delete"
      confirmButtonVariant="danger"
      size="lg"
      icon={
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-red-600 text-xl">
            delete_sweep
          </span>
        </div>
      }
    />
  );
} 