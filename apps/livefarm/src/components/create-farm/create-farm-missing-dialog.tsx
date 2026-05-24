'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface CreateFarmMissingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CreateFarmMissingDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}: CreateFarmMissingDialogProps) {
  const warningIcon = (
    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
      <span className="material-symbols-outlined text-red-500 text-xl">
        warning
      </span>
    </div>
  );

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title="Location missing"
      message="This farm does not have a location set. Save without it?"
      confirmText="Yes"
      cancelText="Cancel"
      icon={warningIcon}
      confirmButtonVariant="danger"
      size="md"
    />
  );
}
