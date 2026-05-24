'use client';

import { Dialog, Button } from '@@agrosphere/shared';
import { Icon } from '@@agrosphere/shared';
import type { ZonesHistoryEntry } from '../types';

interface EditZonesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  historyEntry: ZonesHistoryEntry | null;
  onConfirm?: () => void;
}

export function EditZonesDialog({
  isOpen,
  onClose,
  historyEntry,
  onConfirm,
}: EditZonesDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon icon="edit" className="text-green-600" />
          </div>
          <span>Edit zones</span>
        </div>
      }
      className="max-w-md"
    >
      <div className="mt-4 flex flex-col gap-4">
        <p className="text-sm text-basic-gray">
          Editing zones functionality will allow you to modify zone boundaries
          and properties. This feature is coming soon.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={onClose} variant="cancel">
            Close
          </Button>
          {/* {onConfirm && (
            <Button
              onClick={handleConfirm}
              variant="default"
              className="bg-basic-green hover:bg-basic-green/80 text-white"
            >
              Continue
            </Button>
          )} */}
        </div>
      </div>
    </Dialog>
  );
}
