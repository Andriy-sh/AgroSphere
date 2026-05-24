'use client';

import { Icon } from '@@agrosphere/shared';
import type { FormStep } from '../types';

interface InfoBannerProps {
  currentStep: FormStep;
}

export function InfoBanner({ currentStep }: InfoBannerProps) {
  const getTitle = () => {
    if (currentStep === 'select-farm') {
      return 'Select a farm to get started';
    }
    if (currentStep === 'create-parcel') {
      return 'Draw the boundary for the parcel';
    }
    return 'Parcel drawn - Create management zones';
  };

  const getDescription = () => {
    if (currentStep === 'select-farm') {
      return "First select a farm from the dropdown above, then you'll be able to draw the parcel boundary on the map.";
    }
    if (currentStep === 'create-parcel') {
      return 'Use the drawing tool to outline the exact boundary of your parcel directly on the map.';
    }
    return 'Great! Your parcel is drawn. You can now create management zones or save the parcel.';
  };

  return (
    <div className="bg-white border border-basic-gray-light rounded-lg p-4">
      <div className="flex flex-col items-start gap-1">
        <div className="flex gap-3">
          <Icon icon="info" />
          <p className="font-semibold text-basic-black">{getTitle()}</p>
        </div>
        <p className="text-basic-gray text-sm">{getDescription()}</p>
      </div>
    </div>
  );
}

