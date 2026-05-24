'use client';

import { Progress } from '@base-ui-components/react';
import React from 'react';

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface MapProgressBarProps {
  steps: ProgressStep[];
  currentStepIndex: number;
  className?: string;
  onClose?: () => void;
}

export const MapProgressBar: React.FC<MapProgressBarProps> = ({
  steps,
  currentStepIndex,
  className = '',
  onClose,
}) => {
  const progressPercentage =
    steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  const currentStep = steps[currentStepIndex];

  return (
    <div
      className={`bg-white rounded-xl text-basic-black relative ${className}`}
    >
      <div className="flex items-center p-3 pr-12">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1 flex flex-col gap-2 ">
            <h3 className="flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-[20px]">
                info
              </span>

              {currentStep?.title || 'Click on the map to set farm location'}
            </h3>
            {currentStep?.description && <p>{currentStep.description}</p>}
          </div>
        </div>
      </div>

      {progressPercentage > 0 && (
        <Progress.Root
          className="h-1 bg-border-white overflow-hidden mx-[3px] rounded-bl-3xl rounded-br-3xl"
          value={progressPercentage}
        >
          <Progress.Track className="h-full bg-border-white">
            <Progress.Indicator
              className="h-full bg-basic-green transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </Progress.Track>
        </Progress.Root>
      )}

      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-6 h-6 rounded-full  flex items-center justify-center transition-colors z-10"
        title="Close"
      >
        <span className="material-symbols-outlined text-basic-gray text-[20px]">
          close
        </span>
      </button>
    </div>
  );
};
