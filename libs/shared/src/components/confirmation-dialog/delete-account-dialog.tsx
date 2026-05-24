'use client';

import * as React from 'react';
import { ConfirmationDialog } from './confirmation-dialog';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete Account"
      message="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data from this organisation."
      confirmText="Delete Account"
      cancelText="Cancel"
      confirmButtonVariant="danger"
      size="md"
      icon={
        <div className="w-9 h-9 flex items-center bg-[#FF323F1F] rounded-lg  justify-center">
          <span className="material-symbols-outlined text-lg text-basic-red">
            delete
          </span>
        </div>
      }
    />
  );
}
