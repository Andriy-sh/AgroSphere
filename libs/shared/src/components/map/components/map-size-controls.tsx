'use client';

import React from 'react';

interface MapSizeControlsProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
  side: 'left' | 'right';
  showFilters?: boolean;
  isTaskDetail?: boolean;
}

export const MapSizeControls: React.FC<MapSizeControlsProps> = ({
  currentSize,
  onSizeChange,
  side,
  showFilters = false,
  isTaskDetail = false,
}) => {
  const sizes = isTaskDetail
    ? [100, 40]
    : showFilters
    ? [100, 30, 0]
    : [100, 40, 0];
  const currentIndex = sizes.indexOf(currentSize);

  const showLeftButton = currentSize !== 100;
  const showRightButton = currentSize !== (isTaskDetail ? 40 : 0);

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      onSizeChange(sizes[currentIndex - 1]);
    }
  };

  const handleRightClick = () => {
    if (currentIndex < sizes.length - 1) {
      onSizeChange(sizes[currentIndex + 1]);
    }
  };

  return (
    <div
      className={`absolute top-1/2 z-10 ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <div className="flex flex-row">
        {showLeftButton && (
          <button
            onClick={handleLeftClick}
            className="w-6 h-12 bg-white border border-basic-gray-light flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-gray-100 group-hover:border-gray-400"
            title="Increase map size"
          >
            <span className="material-symbols-outlined text-basic-black text-xl group-hover:text-black transition-colors font-bold">
              {side === 'left' ? 'arrow_left' : 'arrow_right'}
            </span>
          </button>
        )}
        {showRightButton && (
          <button
            onClick={handleRightClick}
            className="w-6 h-12 bg-white border border-basic-gray-light flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-gray-100 group-hover:border-gray-400"
            title="Decrease map size"
          >
            <span className="material-symbols-outlined text-basic-black text-xl group-hover:text-black transition-colors font-bold">
              {side === 'left' ? 'arrow_right' : 'arrow_left'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
