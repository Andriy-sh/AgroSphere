'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Button, Input, Label, Icon } from '@@agrosphere/shared';

interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => Promise<void> | void;
  title: string;
  label: string;
  placeholder?: string;
  defaultName?: string;
  saveLabel?: string;
  cancelLabel?: string;
  icon?: string;
  validate?: (value: string) => boolean;
}

export function ActionDialog({
  isOpen,
  onClose,
  onSave,
  title,
  label,
  placeholder = 'Enter value',
  defaultName = '',
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  icon = 'edit',
  validate = (value) => value.trim().length > 0,
}: ActionDialogProps) {
  const [inputValue, setInputValue] = useState(defaultName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultName);
      setIsLoading(false);
    }
  }, [isOpen, defaultName]);

  const handleSave = async () => {
    if (!validate(inputValue)) return;

    setIsLoading(true);
    try {
      await onSave(inputValue.trim());
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
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

  const handleClose = () => {
    setInputValue(defaultName);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-md text-sm text-basic-black font-medium"
      showCloseButton={false}
      title=""
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Icon icon={icon} className="text-basic-green" />
          </div>
          <h2 className="text-xl font-semibold text-basic-black">{title}</h2>
        </div>
        <Icon icon="close" onClick={handleClose} className="cursor-pointer" />
      </div>

      <div className="pt-5">
        <div className="mb-6">
          <Label className="mb-2">{label}</Label>
          <Input>
            <Input.Content
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoFocus
              className="w-full"
            />
          </Input>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <Button
          onClick={handleClose}
          variant="cancel"
          className="flex-1 text-sm font-medium"
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleSave}
          disabled={!validate(inputValue) || isLoading}
          className="flex-1 bg-basic-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : saveLabel}
        </Button>
      </div>
    </Dialog>
  );
}
