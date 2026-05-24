'use client';

import React from 'react';
import { SplitCard } from '@@agrosphere/shared';

export interface NueMapLegendProps {
  show?: boolean;
  position?: 'left' | 'right';
  className?: string;
}

const nueLevels = [
  { level: 1, color: '#FF352E', label: 'Poor (<35%)' },
  { level: 2, color: '#FF8C00', label: 'Fair (35-50%)' },
  { level: 3, color: '#FFC652', label: 'Good (50-65%)' },
  { level: 4, color: '#10B981', label: 'Excellent (≥65%)' },
];

export function NueMapLegend({
  show = true,
  position = 'left',
  className = '',
}: NueMapLegendProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className={`absolute ${
        position === 'left' ? 'left-5 bottom-10' : 'right-5 bottom-10'
      } w-[180px] pointer-events-auto z-10 ${className}`}
    >
      <SplitCard
        className="bg-white shadow-lg rounded-lg"
        topClassName="!p-0"
        bottomClassName="!p-0"
        hideBottom={false}
        topContent={
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">NUE</h3>
          </div>
        }
        bottomContent={
          <div className="flex flex-col gap-1.5 p-3">
            {nueLevels.map((item) => (
              <div key={item.level} className="flex items-center gap-2 min-h-[20px]">
                <div
                  className="w-8 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-900 leading-tight whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

