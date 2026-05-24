'use client';

import { ConfirmationDialog } from '@@agrosphere/shared';

interface LabSendUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasChanges?: boolean;
}

export function LabSendUpdate({
  isOpen,
  onClose,
  onConfirm,
  hasChanges = false,
}: LabSendUpdateProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={hasChanges ? 'Send lab update' : 'Send to lab'}
      message={
        hasChanges
          ? "This task already has a lab order, but you've made changes to the lab or sample details that may affect it. Do you want to send an updated order to the lab now?"
          : 'This task already has a lab order. Do you want to send it to the lab now?'
      }
      confirmText={hasChanges ? 'Send update to lab' : 'Send to lab'}
      cancelText="Send later"
      confirmButtonVariant="primary"
      size="md"
      icon={
        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 text-xl">
            {hasChanges ? 'drive_folder_upload' : 'send'}
          </span>
        </div>
      }
    />
  );
}
