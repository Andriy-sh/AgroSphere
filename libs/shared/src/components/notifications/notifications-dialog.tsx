'use client';
import React from 'react';
import { Dialog as DialogBase } from '@base-ui-components/react';
import { cn } from '../../utils/cn';

interface NotificationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sidebarWidth: number;
  className?: string;
}

export const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  isOpen,
  onClose,
  children,
  sidebarWidth,
  className,
}) => {
  return (
    <DialogBase.Root open={isOpen} onOpenChange={onClose}>
      <DialogBase.Portal>
        <DialogBase.Backdrop
          className="fixed bg-black/50 z-[999999]"
          style={{
            top: 0,
            bottom: 0,
            left: `${sidebarWidth}px`,
            right: 0,
          }}
        />
        <DialogBase.Popup
          className={cn(
            'fixed top-2 bottom-2 left-2 !z-[1000000] rounded-2xl bg-white shadow-xl  border-basic-white max-w-none w-[600px] flex flex-col',
            className
          )}
          style={{
            left: `${sidebarWidth + 8}px`,
            maxWidth: 'calc(100vw - 100px)',
            transform: 'none',
          }}
        >
          {children}
        </DialogBase.Popup>
      </DialogBase.Portal>
    </DialogBase.Root>
  );
};
