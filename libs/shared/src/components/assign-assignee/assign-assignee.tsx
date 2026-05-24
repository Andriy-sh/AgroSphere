'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '../dialog/dialog';
import { UserSelect } from '../user-select/user-select';
import { Button } from '../button/button';
import { Icon } from '../icon';

interface AssigneeOption {
  value: string;
  label: string;
  initials?: string;
  avatar?: string;
}

interface AssignAssigneeProps {
  assigneeOptions: AssigneeOption[];
  onAssign: (assigneeId: string, assigneeLabel: string) => void;
  triggerButton?: React.ReactNode;
  dialogTitle?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export function AssignAssignee({
  assigneeOptions,
  onAssign,
  triggerButton,
  dialogTitle = 'Assign assignee',
  buttonText = 'Add',
  placeholder = 'Select assignee',
  className = '',
}: AssignAssigneeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const handleAssign = () => {
    if (!selectedAssignee) return;

    const assigneeObj = assigneeOptions.find(
      (opt) => opt.value === selectedAssignee
    );

    if (assigneeObj) {
      onAssign(selectedAssignee, assigneeObj.label);
      setIsOpen(false);
      setSelectedAssignee('');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedAssignee('');
  };

  return (
    <>
      {triggerButton ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={className}
        >
          {triggerButton}
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`flex items-center justify-center w-8 h-8 rounded-md border border-[#EEF0F6] bg-white hover:bg-gray-100 ${className}`}
        >
          <span className="material-symbols-outlined text-[#29B54C] text-lg">
            add
          </span>
        </button>
      )}

      <Dialog isOpen={isOpen} onClose={handleClose} showCloseButton={false}>
        <div className="mb-5">
          <div className="flex gap-2 justify-between w-full">
            <div className="flex gap-2 items-center">
              <Icon icon="person" className='text-basic-green' size="lg" />
              <h1 className="text-xl font-semibold">{dialogTitle}</h1>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <label className="block mb-2 font-normal text-xs mt-4">
            Assignee
          </label>
          <UserSelect
            options={assigneeOptions}
            value={selectedAssignee}
            onChange={setSelectedAssignee}
            placeholder={placeholder}
            triggerClassName="w-full"
          />
        </div>
        <Button
          className="w-full"
          variant="complete"
          onClick={(e) => {
            e.stopPropagation();
            handleAssign();
          }}
        >
          {buttonText}
        </Button>
      </Dialog>
    </>
  );
}
