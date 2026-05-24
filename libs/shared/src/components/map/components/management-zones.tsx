'use client';

import React from 'react';
import { Button } from '../../button/button';

interface ManagementZonesProps {
  isVisible: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ManagementZones: React.FC<ManagementZonesProps> = ({
  isVisible,
  onSave,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-white text-basic-black rounded-lg py-3 px-2 z-10 flex flex-col gap-3 text-sm min-w-[245px] min-h-[188px]">
      <div className="flex flex-col gap-2 text-center p-1">
        <h2 className="font-semibold">Management zones</h2>

        <p className="text-basic-gray">
          Click & drag to draw lines across <br /> the field (Double click to
          finish)
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="complete"
          size="md"
          className="w-full"
          onClick={onSave}
        >
          Save
        </Button>

        <Button
          variant="cancel"
          size="md"
          className="w-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
