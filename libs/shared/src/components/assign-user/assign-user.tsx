'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '../dialog/dialog';
import { UserSelect } from '../user-select/user-select';

interface UserOption {
  value: string;
  label: string;
  initials?: string;
  avatar?: string;
}

interface AssignUserProps {
  userOptions: UserOption[];
  onAssign: (userId: string, userLabel: string) => void;
  triggerButton?: React.ReactNode;
  dialogTitle?: string;
  label?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export function AssignUser({
  userOptions,
  onAssign,
  triggerButton,
  dialogTitle = 'Assign user',
  label = 'User',
  buttonText = 'Add',
  placeholder = 'Select user',
  className = '',
}: AssignUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const handleAssign = () => {
    if (!selectedUser) return;

    const userObj = userOptions.find((opt) => opt.value === selectedUser);

    if (userObj) {
      onAssign(selectedUser, userObj.label);
      setIsOpen(false);
      setSelectedUser('');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedUser('');
  };

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setIsOpen(true)} className={className}>
          {triggerButton}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center justify-center w-8 h-8 rounded-md border border-[#EEF0F6] bg-white hover:bg-gray-100 ${className}`}
        >
          <span className="material-symbols-outlined text-[#29B54C] text-lg">
            add
          </span>
        </button>
      )}

      <Dialog isOpen={isOpen} onClose={handleClose} showCloseButton={false}>
        <div className="mb-4">
          <div className="flex gap-2 justify-between w-full">
            <div className="flex gap-2 items-center">
              <span className="material-symbols-outlined">person</span>
              <h1 className="text-xl font-semibold">{dialogTitle}</h1>
            </div>
            <button onClick={handleClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <label className="block mb-2 font-normal text-xs mt-4">{label}</label>
          <UserSelect
            options={userOptions}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder={placeholder}
            triggerClassName="w-full"
          />
        </div>
        <button
          className="w-full bg-[#29B54C] hover:bg-[#22a144] text-white font-semibold rounded-xl py-2 transition"
          onClick={handleAssign}
        >
          {buttonText}
        </button>
      </Dialog>
    </>
  );
}
