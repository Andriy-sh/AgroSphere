'use client';
import { AssignUsersDialog, AssignableUser } from '@@agrosphere/shared';
import React from 'react';

import { AssignedUser } from '@@agrosphere/shared';

interface AssignUsersDialogProps {
  open: boolean;
  onClose: () => void;
  users: AssignedUser[];
  selected: string[];
  onChangeSelected: (selected: string[]) => void;
  onSave: () => void;
}

export function AssignUsersDialogWrapper({
  open,
  onClose,
  users,
  selected,
  onChangeSelected,
  onSave,
}: AssignUsersDialogProps) {
  const assignableUsers: AssignableUser[] = users.map((user, index) => ({
    id: user.name, 
    name: user.name,
    role: user.role,
    avatar: user.avatar || '',
    initials: user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase(),
  }));

  const selectedUserIds = selected;

  const handleSelectionChange = (selectedIds: string[]) => {
    onChangeSelected(selectedIds);
  };

  return (
    <AssignUsersDialog
      isOpen={open}
      onClose={onClose}
      users={assignableUsers}
      selectedUserIds={selectedUserIds}
      onSelectionChange={handleSelectionChange}
      onSave={onSave}
      title="Add user to client"
      searchPlaceholder="Search by name"
      saveButtonText="Save"
      showUserRole={true}
    />
  );
}
