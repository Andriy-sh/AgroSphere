'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import { Button, Icon, Toggle } from '@@agrosphere/shared';
import type { ClientFormMode } from './add-client.types';

const dialogVariants = cva(
  'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
  {
    variants: {
      mode: {
        add: '',
        edit: '',
      },
    },
    defaultVariants: {
      mode: 'add',
    },
  }
);

const titleVariants = cva('text-xl font-bold text-gray-900', {
  variants: {
    mode: {
      add: '',
      edit: '',
    },
  },
  defaultVariants: {
    mode: 'add',
  },
});

const iconVariants = cva('material-symbols-outlined text-green-600 text-2xl', {
  variants: {
    mode: {
      add: 'text-green-600',
      edit: 'text-blue-600',
    },
  },
  defaultVariants: {
    mode: 'add',
  },
});

interface AddClientModalProps {
  isOpen: boolean;
  mode: ClientFormMode;
  onClose: () => void;
  onSave: () => void;
  canSave: boolean;
  loading: boolean;
  showInviteToggle?: boolean;
  inviteChecked?: boolean;
  onInviteChange?: (checked: boolean) => void;
  children: React.ReactNode;
}

export function AddClientModal({
  isOpen,
  mode,
  onClose,
  onSave,
  canSave,
  loading,
  showInviteToggle = false,
  inviteChecked = false,
  onInviteChange,
  children,
}: AddClientModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className={dialogVariants({ mode })} onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={iconVariants({ mode })}>
                {mode === 'add' ? 'person_add' : 'edit'}
              </span>
              <h2 className={titleVariants({ mode })}>
                {mode === 'add' ? 'Add client' : 'Edit client'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="close" className="text-xl" />
            </button>
          </div>

          {children}
        </div>

        <div className="border-t border-basic-white p-5">
          <div className="space-y-5">
            {showInviteToggle && onInviteChange && (
              <div className="flex items-center gap-3">
                <Toggle
                  checked={inviteChecked}
                  onCheckedChange={onInviteChange}
                />
                <span className="text-sm text-gray-700">
                  Send the client an email invitation to join the platform.
                </span>
              </div>
            )}

            <div className="flex gap-4">
              {mode === 'add' ? (
                <Button
                  type="button"
                  variant="complete"
                  size="md"
                  className="flex-1"
                  disabled={!canSave || loading}
                  onClick={onSave}
                >
                  {loading ? 'Adding...' : 'Add client'}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="complete"
                  size="md"
                  className="w-full"
                  disabled={!canSave || loading}
                  onClick={onSave}
                >
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
