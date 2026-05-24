import React from 'react';
import { ActionDialog } from './components/action-dialog';

interface MyFarmGroupNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupName: string) => void | Promise<void>;
  defaultName?: string;
}

export function MyFarmGroupNameDialog({
  isOpen,
  onClose,
  onSave,
  defaultName = 'Group',
}: MyFarmGroupNameDialogProps) {
  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      title="Create Group"
      label="Group name"
      placeholder="Enter group name"
      defaultName={defaultName}
      saveLabel="Create Group"
      icon="stack"
    />
  );
}
