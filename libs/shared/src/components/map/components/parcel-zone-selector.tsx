'use client';

import React from 'react';
import { Button } from '../../button/button';

export type ParcelZoneMode = 'parcels' | 'zones';

interface ParcelZoneSelectorProps {
  mode: ParcelZoneMode;
  onModeChange: (mode: ParcelZoneMode) => void;
  showParcelsOption?: boolean;
  showZonesOption?: boolean;
  className?: string;
}

export const ParcelZoneSelector: React.FC<ParcelZoneSelectorProps> = ({
  mode,
  onModeChange,
  showParcelsOption = true,
  showZonesOption = true,
  className = '',
}) => {
  if (!showParcelsOption && !showZonesOption) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showParcelsOption && (
        <Button
          variant={mode === 'parcels' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('parcels')}
          className={
            mode === 'parcels'
              ? 'bg-basic-green text-white hover:bg-basic-green/80'
              : 'bg-white/90 backdrop-blur-sm hover:bg-white'
          }
        >
          Parcels
        </Button>
      )}
      {showZonesOption && (
        <Button
          variant={mode === 'zones' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('zones')}
          className={
            mode === 'zones'
              ? 'bg-basic-green text-white hover:bg-basic-green/80'
              : 'bg-white/90 backdrop-blur-sm hover:bg-white'
          }
        >
          Zones
        </Button>
      )}
    </div>
  );
};

