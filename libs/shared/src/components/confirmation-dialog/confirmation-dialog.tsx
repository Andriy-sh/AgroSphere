'use client';

import { Button } from '../button/button';
import { Dialog } from '../dialog/dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;  
  message: string;
  confirmText: string;
  cancelText?: string;
  icon?: React.ReactNode;
  confirmButtonVariant?: 'danger' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  icon,
  confirmButtonVariant = 'primary',
  size = 'md',
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-lg';
      case 'md':
      default:
        return 'max-w-md';
    }
  };

  const getConfirmButtonStyles = () => {
    switch (confirmButtonVariant) {
      case 'danger':
        return 'bg-basic-red hover:bg-red-700 text-white';
      case 'primary':
      default:
        return 'bg-basic-green hover:bg-basic-green/80 text-white';
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={getSizeClasses()}
      showCloseButton={false}
      title=""
    >
      <div className="flex flex-col items-center text-center">
        {icon && <div className="mb-5">{icon}</div>}

        <h2 className="text-xl font-semibold text-basic-black mb-2">{title}</h2>

        <p className="text-sm font-normal text-basic-gray mb-5 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2 w-full">
          <Button
            onClick={handleCancel}
            variant="cancel"
            className="flex-1 text-sm font-medium"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`flex-1 text-sm font-medium ${getConfirmButtonStyles()}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
