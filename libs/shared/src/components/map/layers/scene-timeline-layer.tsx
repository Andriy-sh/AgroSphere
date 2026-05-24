'use client';

import React from 'react';
import { MapSceneTimeline, type SceneTimelineItem } from '../components/map-scene-timeline';
import { MapBandSelector } from '../components/map-band-selector';

interface SceneTimelineLayerProps {
  showSceneTimeline?: boolean;
  sceneTimelineItems?: SceneTimelineItem[];
  sceneTimelineSelectedId?: string;
  onSceneTimelineSelect?: (scene: SceneTimelineItem) => void;
  sceneTimelineLoading?: boolean;
  sceneTimelineClassName?: string;
  showBandSelector?: boolean;
  bandOptions?: readonly string[];
  selectedBand?: string | null;
  onBandChange?: (band: string) => void;
}

export const SceneTimelineLayer: React.FC<SceneTimelineLayerProps> = ({
  showSceneTimeline = false,
  sceneTimelineItems = [],
  sceneTimelineSelectedId,
  onSceneTimelineSelect,
  sceneTimelineLoading = false,
  sceneTimelineClassName,
  showBandSelector = false,
  bandOptions = [],
  selectedBand,
  onBandChange,
}) => {
  if (!showSceneTimeline) {
    return null;
  }

  const resolvedBandOptions = Array.isArray(bandOptions) ? bandOptions : [];
  const timelineEnabled = showSceneTimeline;

  return (
    <>
      {showBandSelector && timelineEnabled && (
        <div className="absolute bottom-16 right-16 flex items-end gap-3 z-10">
          <MapBandSelector
            options={resolvedBandOptions}
            value={selectedBand ?? null}
            onChange={onBandChange}
            className="pointer-events-auto"
          />
        </div>
      )}

      {timelineEnabled && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 z-0">
          <MapSceneTimeline
            scenes={sceneTimelineItems}
            visible={timelineEnabled}
            selectedSceneId={sceneTimelineSelectedId}
            onSelectScene={onSceneTimelineSelect}
            isLoading={sceneTimelineLoading}
            className={`pointer-events-auto rounded-xl shadow-md ${
              sceneTimelineClassName ?? ''
            }`}
          />
        </div>
      )}
    </>
  );
};

