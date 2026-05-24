'use client';

import React from 'react';
import { Button, cn } from '@@agrosphere/shared';
import { useFertilizerTabs } from './hooks/use-fertilizer-tabs';
import { NitrogenInputsContent } from './tabs/nitrogen-inputs/nitrogen-inputs-content';
import { CropOutputsContent } from './tabs/crop-outputs/crop-outputs-content';
import { SoilAnalysisContent } from './tabs/soil-analysis/soil-analysis-content';

function Tab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      aria-label={`Switch to ${label} tab`}
      aria-selected={isActive}
      role="tab"
      variant="ghost"
      className={cn(
        'px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg bg-white border whitespace-nowrap overflow-hidden text-ellipsis max-w-full',
        isActive
          ? 'text-basic-black border-basic-green'
          : 'text-basic-gray hover:text-basic-black border-basic-gray-light'
      )}
    >
      {label}
    </Button>
  );
}

export default function Fertilizer() {
  const { activeTab, handleTabChange } = useFertilizerTabs();

  const tabs = [
    { id: 'nitrogen-inputs' as const, label: 'Nitrogen Inputs' },
    { id: 'crop-outputs' as const, label: 'Crop Outputs' },
    { id: 'soil-analysis' as const, label: 'Soil Analysis' },
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col border border-basic-gray-light rounded-xl">
      <div className="flex items-center gap-2 px-5 pt-4 pb-4 border-b">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'nitrogen-inputs' && <NitrogenInputsContent />}
        {activeTab === 'crop-outputs' && <CropOutputsContent />}
        {activeTab === 'soil-analysis' && <SoilAnalysisContent />}
      </div>
    </div>
  );
}
