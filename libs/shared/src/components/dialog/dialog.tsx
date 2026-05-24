import { Dialog as DialogBase } from '@base-ui-components/react';
import React, { ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  initialFocusRef,
  showCloseButton = true,
}) => {
  return (
    <DialogBase.Root open={isOpen} onOpenChange={onClose}>
      <DialogBase.Portal>
        <DialogBase.Backdrop
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={(e) => e.stopPropagation()}
        />
        <DialogBase.Popup
          className={`fixed left-1/2 z-[9999] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-xl w-full ${
            className || 'max-w-md'
          }`}
          initialFocus={initialFocusRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start">
            <DialogBase.Title className="text-xl font-semibold text-gray-900">
              {title}
            </DialogBase.Title>
            {showCloseButton && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-basic-black material-symbols-outlined cursor-pointer"
              >
                close
              </span>
            )}
          </div>
          {children}
        </DialogBase.Popup>
      </DialogBase.Portal>
    </DialogBase.Root>
  );
};
