'use client';

import { ConfirmationDialog, Icon } from '@@agrosphere/shared';

interface LabDeleteSingleProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  labOrderId: string;
}

export function LabDeleteSingle({
  isOpen,
  onClose,
  onConfirm,
  labOrderId,
}: LabDeleteSingleProps) {
  return (
    <ConfirmationDialog 
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete lab order"
      message={`Are you sure you want to delete lab order ${labOrderId}?\n\nThis action cannot be undone. All associated samples and data will be permanently removed.`}
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
