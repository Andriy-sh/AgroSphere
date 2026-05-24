'use client';

import React from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../icon';
import type { SceneTimelineItem } from './map-scene-timeline';

interface SceneItemProps {
  scene: SceneTimelineItem;
  isSelected: boolean;
  onClick: (scene: SceneTimelineItem) => void;
  formatDate: (value: string | Date) => string;
}

export const SceneTimelineCard = React.memo(function SceneTimelineCard({
  scene,
  isSelected,
  onClick,
  formatDate,
}: SceneItemProps) {
  const formattedDate = formatDate(scene.date);

  return (
    <button
      type="button"
      data-selected={isSelected}
      className={cn(
        'relative z-10 flex h-9 min-w-[120px] flex-col justify-center rounded-lg border border-basic-white bg-basic-white px-2 py-0.5 text-left text-basic-black shadow-sm transition-colors',
        'hover:bg-[#D6D9E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basic-green',
        'data-[selected=true]:bg-[#C3C7D3] data-[selected=true]:border-[#C3C7D3] data-[selected=true]:text-basic-black'
      )}
      onClick={() => onClick(scene)}
    >
      <div className="text-xs font-semibold leading-tight text-basic-black">
        {formattedDate}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-basic-black whitespace-nowrap">
        <Icon icon="cloudy" className="shrink-0 text-[10px]" />
        <span className="truncate text-[9px] leading-none">
          Cloud cover:{' '}
          {typeof scene.cloudCoverage === 'number'
            ? scene.cloudCoverage.toFixed(1)
            : scene.cloudCoverage}
          %
        </span>
      </div>
    </button>
  );
});
