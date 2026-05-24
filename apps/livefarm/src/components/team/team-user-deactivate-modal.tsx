'use client';

import React from 'react';
import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamUserDeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loading?: boolean;
}

export function TeamUserDeactivateModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  loading = false,
}: TeamUserDeactivateModalProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Deactivate User"
      message={`Are you sure you want to deactivate ${userName}? This user will no longer have access to the system.`}
      confirmText={loading ? 'Deactivating...' : 'Deactivate User'}
      cancelText="Cancel"
      icon={
        <div className="w-9 h-9 bg-[#FF323F1F] rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-basic-red text-xl">
            account_circle_off
          </span>
        </div>
      }
      confirmButtonVariant="danger"
      size="md"
    />
  );
}
