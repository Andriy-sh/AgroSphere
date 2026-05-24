'use client';

import React from 'react';
import { Button } from '@@agrosphere/shared';

interface DrawingMapButtonsProps {
  onChangeModeRef?: React.MutableRefObject<((mode: string) => void) | null>;
  onClearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  enabled?: boolean;
  showOnlyLine?: boolean;
  hasDrawnFeatures?: boolean;
}

export function DrawingMapButtons({
  onChangeModeRef,
  onClearDrawingRef,
  enabled = false,
  showOnlyLine = false,
  hasDrawnFeatures = false,
}: DrawingMapButtonsProps) {
  if (!enabled) {
    return null;
  }

  const handleDrawPolygon = () => {
    if (onChangeModeRef?.current) {
      onChangeModeRef.current('draw_polygon');
    }
  };

  const handleDrawLine = () => {
    if (onChangeModeRef?.current) {
      onChangeModeRef.current('draw_line_string');
    }
  };

  const handleDelete = () => {
    if (onClearDrawingRef?.current) {
      onClearDrawingRef.current();
    }
  };

  return (
    <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-10">
      {!showOnlyLine && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
          onClick={handleDrawPolygon}
          title="Draw polygon"
        >
          <span className="material-symbols-outlined text-lg text-basic-black">
            change_history
          </span>
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
        onClick={handleDrawLine}
        title="Draw line"
      >
        <span className="material-symbols-outlined text-lg text-basic-black">
          show_chart
        </span>
      </Button>

      {hasDrawnFeatures && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
          onClick={handleDelete}
          title="Delete drawing"
        >
          <span className="material-symbols-outlined text-lg text-basic-black">
            delete
          </span>
        </Button>
      )}
    </div>
  );
}
