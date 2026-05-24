import React, { useState, useEffect } from 'react';
import { Dialog, Button, Input, Label } from '@@agrosphere/shared';

interface MyFarmEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName: string;
  farmId: string;
}

export const MyFarmEditDialog: React.FC<MyFarmEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  farmId,
}) => {
  const [farmName, setFarmName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFarmName(currentName);
  }, [currentName]);

  const handleSave = async () => {
    if (!farmName.trim()) return;

    setIsLoading(true);
    try {
      await onSave(farmName.trim());
      onClose();
    } catch (error) {
      return
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md text-sm text-basic-black font-medium"
      showCloseButton={false}
      title=""
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8  rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-basic-green">edit</span>
          </div>
          <h2 className="text-xl font-semibold text-basic-black">
            Edit farm name
          </h2>
        </div>
        <span
          onClick={onClose}
          className="text-basic-black material-symbols-outlined cursor-pointer"
        >
          close
        </span>
      </div>

      <div className="pt-5">
        <div className="mb-6">
          <Label className="mb-2">
            Farm name
          </Label>
          <Input>
            <Input.Content
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter farm name"
              autoFocus
              className="w-full"
            />
          </Input>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!farmName.trim() || isLoading}
        className="w-full bg-basic-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </Dialog>
  );
};
