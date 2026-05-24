'use client';

import { useState, useEffect } from 'react';
import { Dialog, Button, Input } from '@@agrosphere/shared';
import { Icon } from '@@agrosphere/shared';

interface EditZonesNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string) => void;
}

export function EditZonesNameDialog({
  isOpen,
  onClose,
  currentName,
  onSave,
}: EditZonesNameDialogProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Icon icon="edit" className="text-basic-green" />
          <span>Edit zones name</span>
        </div>
      }
    >
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-basic-black">
            Zones name
          </label>
          <Input>
            <Input.Content
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter zones name"
              autoFocus
              className="w-full"
            />
          </Input>
        </div>
        <Button onClick={handleSave} variant="complete" disabled={!name.trim()}>
          Confirm
        </Button>
      </div>
    </Dialog>
  );
}
