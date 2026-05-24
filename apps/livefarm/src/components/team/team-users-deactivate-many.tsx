'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamUsersDeactivateManyProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function TeamUsersDeactivateMany({
  isOpen,
  onClose,
  onConfirm,
  count,
}: TeamUsersDeactivateManyProps) {
  const getMessage = () => {
    if (count === 0) {
      return 'No active users selected to deactivate.';
    }
    if (count === 1) {
      return 'Are you sure you want to deactivate this active user? After deactivation, the user will no longer be able to log in to the system.';
    }
    return `Are you sure you want to deactivate ${count} active users? After deactivation, these users will no longer be able to log in to the system.`;
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Deactivate users!"
      message={getMessage()}
      confirmText="Deactivate"
      confirmButtonVariant="danger"
      size="lg"
      icon={
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-red-600 text-xl">
            person_off
          </span>
        </div>
      }
    />
  );
}
