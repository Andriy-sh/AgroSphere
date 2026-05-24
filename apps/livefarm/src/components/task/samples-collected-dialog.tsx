'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface LabSampleCollectedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LabSampleCollectedDialog({
  isOpen,
  onClose,
  onConfirm,
}: LabSampleCollectedDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Samples already collected"
      message="You've changed the lab after the samples were collected. To proceed, you need to send them to the new lab."
      confirmText="Send to lab"
      cancelText="Cancel"
      confirmButtonVariant="primary"
      size="md"
      icon={
        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="text-green-600 text-xl font-bold">!</span>
        </div>
      }
    />
  );
}
