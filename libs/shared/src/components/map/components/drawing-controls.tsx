'use client';

import React from 'react';
import { Button } from '../../button/button';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

interface DrawingControlsProps {
  currentDraw: MapboxDraw | null;
  enableDrawing: boolean;
  enablePolygonSplitting?: boolean;
  showOnlyLine?: boolean;
}

export function DrawingControls({
  currentDraw,
  enableDrawing,
  enablePolygonSplitting = false,
  showOnlyLine = false,
}: DrawingControlsProps) {
  if (!enableDrawing) {
    return null;
  }

  const handlePolygonClick = () => {
    if (currentDraw) {
      try {
        currentDraw.changeMode('draw_polygon');
      } catch (error) {
        // Error handled silently
      }
    }
  };

  const handleLineClick = () => {
    if (currentDraw) {
      try {
        currentDraw.changeMode('draw_line_string');
      } catch (error) {
        // Error handled silently
      }
    }
  };

  //   const handleDeleteClick = () => {
  //     if (currentDraw) {
  //       try {
  //         const features = currentDraw.getSelected();
  //         if (features.features.length > 0) {
  //           features.features.forEach((feature) => {
  //             if (feature.id) {
  //               const featureId =
  //                 typeof feature.id === 'string'
  //                   ? feature.id
  //                   : String(feature.id);
  //               currentDraw.delete(featureId);
  //             }
  //           });
  //         }
  //       } catch (error) {
  //         console.warn('Error deleting feature:', error);
  //       }
  //     }
  //   };

  return (
    <>
      {!showOnlyLine && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
          onClick={handlePolygonClick}
          title="Draw polygon"
        >
          <span className="material-symbols-outlined text-lg text-basic-black">
            change_history
          </span>
        </Button>
      )}

      {(enablePolygonSplitting || showOnlyLine) && (
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
          onClick={handleLineClick}
          title="Draw line"
        >
          <span className="material-symbols-outlined text-lg text-basic-black">
            show_chart
          </span>
        </Button>
      )}

      {/* <Button
        variant="outline"
        size="icon"
        className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
        onClick={handleDeleteClick}
        title="Delete selected"
      >
        <span className="material-symbols-outlined text-lg text-basic-black">
          delete
        </span>
      </Button> */}
    </>
  );
}
