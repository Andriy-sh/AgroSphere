'use client';

import React from 'react';
import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamUserActivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loading?: boolean;
}

export function TeamUserActivateModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  loading = false,
}: TeamUserActivateModalProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Activate User"
      message={`Are you sure you want to activate ${userName}? This user will regain access to the system.`}
      confirmText={loading ? 'Activating...' : 'Activate User'}
      cancelText="Cancel"
      icon={
        <div className="w-9 h-9 bg-[#00AF4D1F] rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-basic-green text-xl">
            replay
          </span>
        </div>
      }
      confirmButtonVariant="primary"
      size="md"
    />
  );
}
