'use client';

import React, { useState } from 'react';
import { Dialog, Button, Label } from '@@agrosphere/shared';
import { CustomSelect, SelectOption } from '@@agrosphere/shared';

interface MyFarmMoveToDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetFarmId: string) => void;
  selectedCount: number;
  availableFarms: Array<{ id: string; name: string }>;
  defaultFarmId?: string;
}

export function MyFarmMoveToDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  availableFarms,
  defaultFarmId,
}: MyFarmMoveToDialogProps) {
  const [selectedFarmId, setSelectedFarmId] = useState(
    defaultFarmId || availableFarms[0]?.id || ''
  );

  const handleConfirm = () => {
    if (selectedFarmId) {
      onConfirm(selectedFarmId);
      onClose();
    }
  };

  const farmOptions: SelectOption[] = availableFarms.map((farm) => ({
    value: farm.id,
    label: farm.name,
  }));

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
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-basic-green">
              arrow_forward
            </span>
          </div>
          <h2 className="text-xl font-semibold text-basic-black">Move to</h2>
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
          <Label className="mb-2">Farm</Label>
          <CustomSelect
            options={farmOptions}
            value={selectedFarmId}
            onValueChange={setSelectedFarmId}
            placeholder="Select farm"
            triggerClassName="w-full"
          />
        </div>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={!selectedFarmId}
        className="w-full bg-basic-green text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Move to {selectedCount} parcels & zones
      </Button>
    </Dialog>
  );
}
