'use client';

import React from 'react';
import { ConfirmationDialog, Icon } from '@@agrosphere/shared';

interface MyFarmDeleteMultipleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function MyFarmDeleteMultipleDialog({
  isOpen,
  onClose,
  onConfirm,
  count,
}: MyFarmDeleteMultipleDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete items!"
      message={`Are you sure you want to delete ${count} selected item(s)? This action is irreversible and will permanently remove all selected items from the system.`}
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
