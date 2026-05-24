'use client';

import React from 'react';
import { ConfirmationDialog } from './confirmation-dialog';

interface DeleteCommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCommentsDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteCommentsDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete comment"
      message="Are you sure you want to delete this comment? This action is irreversible."
      confirmText="Delete"
      cancelText="Cancel"
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
