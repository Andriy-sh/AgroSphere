'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamActivateUserProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function TeamActivateUser({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: TeamActivateUserProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Activate user!"
      message={`Are you sure you want to activate ${userName}? After activation, the user will be able to log in to the system and access all their permissions.`}
      confirmText="Activate"
      confirmButtonVariant="primary"
      size="lg"
      icon={
        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 text-xl">
            person_add
          </span>
        </div>
      }
    />
  );
}



