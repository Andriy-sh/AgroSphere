'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface LabDeleteSampleProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sampleId: string;
  labOrderId: string;
}

export function LabDeleteSample({
  isOpen,
  onClose,
  onConfirm,
  sampleId,
  labOrderId,
}: LabDeleteSampleProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete sample"
      message={`Are you sure you want to delete sample ${sampleId}?\n\nThis sample will be permanently removed from lab order ${labOrderId}.\n\nThis action cannot be undone.`}
      confirmText="Delete"
      confirmButtonVariant="danger"
      size="lg"
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
