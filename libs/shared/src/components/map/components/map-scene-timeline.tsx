'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../icon';
import { SceneTimelineCard } from './scene-timeline-item';

export interface SceneTimelineItem {
  tms: string;
  sceneID: string;
  cloudCoverage: number;
  view_id: string;
  date: string | Date;
  imageryUrl?: string;
}

export interface MapSceneTimelineProps {
  scenes: SceneTimelineItem[];
  visible?: boolean;
  selectedSceneId?: string;
  onSelectScene?: (scene: SceneTimelineItem) => void;
  className?: string;
  isLoading?: boolean;
  leftAccessory?: React.ReactNode;
}

const SCROLL_RATIO = 0.65;
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatSceneDate = (value: string | Date): string => {
  const dateValue = value instanceof Date ? value : new Date(value ?? '');
  if (Number.isNaN(dateValue.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  const day = dateValue.getDate().toString().padStart(2, '0');
  const month = MONTH_LABELS[dateValue.getMonth()] ?? '';
  const year = dateValue.getFullYear().toString().slice(-2);
  return `${day} ${month}'${year}`;
};

export function MapSceneTimeline({
  scenes,
  visible = false,
  selectedSceneId,
  onSelectScene,
  className,
  isLoading = false,
  leftAccessory,
}: MapSceneTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const offset = container.clientWidth * SCROLL_RATIO;

    container.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    });
  }, []);

  const handleSelect = useCallback(
    (scene: SceneTimelineItem) => {
      onSelectScene?.(scene);
    },
    [onSelectScene]
  );

  const hasScenes = scenes.length > 0;

  const updateScrollAvailability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    if (scrollWidth <= clientWidth + 1) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScroll = scrollWidth - clientWidth;
    const EDGE_EPSILON = 4;

    setCanScrollLeft(scrollLeft > EDGE_EPSILON);
    setCanScrollRight(scrollLeft < maxScroll - EDGE_EPSILON);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container || scenes.length === 0) {
      updateScrollAvailability();
      return;
    }

    const previousBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = 'auto';
    container.scrollLeft = container.scrollWidth;
    requestAnimationFrame(() => {
      if (container) {
        container.style.scrollBehavior = previousBehavior;
      }
      updateScrollAvailability();
    });
  }, [scenes.length, updateScrollAvailability]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => updateScrollAvailability();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollAvailability]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div className={cn('flex w-full items-end gap-2', className)}>
        {leftAccessory}
        <Icon
          icon="chevron_left"
          aria-label="Scroll left"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border border-basic-white bg-basic-white text-basic-black shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basic-green',
            hasScenes && canScrollLeft
              ? 'hover:border-basic-green'
              : 'opacity-60 cursor-not-allowed'
          )}
          onClick={() => {
            if (!hasScenes || !canScrollLeft) return;
            scrollByDirection('left');
          }}
          disabled={!hasScenes || !canScrollLeft}
        />

        <div className="flex h-9 flex-1 items-center overflow-hidden">
          <div className="relative flex h-full w-full items-center">
            {hasScenes ? (
              <div
                ref={scrollContainerRef}
                className="map-scene-timeline-scroll relative flex h-full w-full items-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none]"
                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              >
                {scenes.map((scene) => (
                  <SceneTimelineCard
                    key={scene.sceneID}
                    scene={scene}
                    isSelected={scene.sceneID === selectedSceneId}
                    onClick={handleSelect}
                    formatDate={formatSceneDate}
                  />
                ))}
              </div>
            ) : (
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-lg border border-basic-white bg-basic-white px-3 text-xs font-medium text-basic-black/70">
                {isLoading ? 'Loading...' : 'No data available'}
              </div>
            )}
          </div>
        </div>

        <Icon
          icon="chevron_right"
          aria-label="Scroll right"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border border-basic-white bg-basic-white text-basic-black shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-basic-green',
            hasScenes && canScrollRight
              ? 'hover:border-basic-green'
              : 'opacity-60 cursor-not-allowed'
          )}
          onClick={() => {
            if (!hasScenes || !canScrollRight) return;
            scrollByDirection('right');
          }}
          disabled={!hasScenes || !canScrollRight}
        />
      </div>
      <style jsx>{`
        .map-scene-timeline-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
