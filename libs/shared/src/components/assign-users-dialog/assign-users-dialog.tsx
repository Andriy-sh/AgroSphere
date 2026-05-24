'use client';
import React, { useState, useMemo } from 'react';
import { Button } from '../button/button';
import { Dialog } from '../dialog/dialog';
import { SearchInput } from '../search-input/search-input';
import { Checkbox } from '../checkbox/checkbox';
import { Avatar } from '../avatar/avatar';
import { Icon } from '../icon';

export interface AssignableUser {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  initials?: string;
}

export interface AssignUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: AssignableUser[];
  selectedUserIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onSave: () => void;
  title?: string;
  searchPlaceholder?: string;
  saveButtonText?: string;
  className?: string;
  dialogClassName?: string;
  showUserRole?: boolean;
  maxHeight?: string;
}

export const AssignUsersDialog: React.FC<AssignUsersDialogProps> = ({
  isOpen,
  onClose,
  users,
  selectedUserIds,
  onSelectionChange,
  onSave,
  title = 'Assign users',
  searchPlaceholder = 'Search by name',
  saveButtonText = 'Save',
  className = '',
  dialogClassName = 'max-w-lg',
  showUserRole = true,
  maxHeight = 'max-h-96',
}) => {
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredUsers.map((user) => user.id));
    }
  };

  const allSelected =
    filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;
  const someSelected =
    selectedUserIds.length > 0 && selectedUserIds.length < filteredUsers.length;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className={dialogClassName}
      showCloseButton={false}
    >
      <div className={`p-1 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Icon icon="person_add" className="text-basic-green" size="lg" />
            {title}
          </h2>
          <button
            className="text-gray-400 hover:text-black text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mb-5">
          <div className="relative">
            <SearchInput
              searchTerm={search}
              onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder={searchPlaceholder}
              className="border border-basic-white bg-white rounded-lg"
              inputClassName="bg-transparent outline-none border-none flex-1 text-base"
              isActive={true}
              onClose={() => undefined}
              onKeyDown={() => undefined}
              bottomBorder={false}
              closeButton={false}
            />
          </div>
        </div>

        <div className={`${maxHeight} overflow-y-auto mb-6 space-y-3 pr-2`}>
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center ">
              <Checkbox
                checked={selectedUserIds.includes(user.id)}
                onCheckedChange={() => handleToggle(user.id)}
                className="mr-3 w-4 h-4"
              />
              <Avatar
                className="rounded-md bg-green-50 text-basic-green font-medium mr-3 w-7 h-7"
                row={{
                  original: {
                    client: {
                      name: user.name,
                      surname: '',
                      avatarSrc: user.avatar,
                    },
                  },
                }}
                avatarSrc={user.avatar}
                tooltipText={user.name}
              />
              <span className="text-black font-medium text-sm flex-1">
                {user.name}
              </span>
              {showUserRole && user.role && (
                <span className="ml-auto bg-[#F3F4F6] text-[#101010] px-2 py-1 rounded-[4px] font-normal text-xs mr-1">
                  {user.role}
                </span>
              )}
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && search && (
          <div className="text-center py-8 text-gray-500">
            No users found matching "{search}"
          </div>
        )}

        <Button
          className="w-full h-9 text-sm font-medium rounded-xl text-white bg-[#29B54C] hover:bg-[#22a144]"
          onClick={onSave}
        >
          {saveButtonText}
        </Button>
      </div>
    </Dialog>
  );
};
