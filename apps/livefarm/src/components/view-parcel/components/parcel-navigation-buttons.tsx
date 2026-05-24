'use client';

import { Button } from '@@agrosphere/shared';
import { useCallback } from 'react';

interface ParcelNavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  parcels: Array<{ id: string }>;
  activeIndex: number;
  zoomToParcelRef?: React.MutableRefObject<((parcelId: string) => void) | null>;
}

export function ParcelNavigationButtons({
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
  parcels,
  activeIndex,
  zoomToParcelRef,
}: ParcelNavigationButtonsProps) {
  const handlePrev = useCallback(() => {
    if (!onPrev || disablePrev) {
      return;
    }

    const prevIndex = activeIndex - 1;
    const prevParcelId = parcels[prevIndex]?.id;

    onPrev();

    if (prevParcelId && zoomToParcelRef?.current) {
      setTimeout(() => {
        zoomToParcelRef.current?.(prevParcelId);
      }, 0);
    }
  }, [onPrev, disablePrev, activeIndex, parcels, zoomToParcelRef]);

  const handleNext = useCallback(() => {
    if (!onNext || disableNext) {
      return;
    }

    const nextIndex = activeIndex + 1;
    const nextParcelId = parcels[nextIndex]?.id;

    onNext();

    if (nextParcelId && zoomToParcelRef?.current) {
      setTimeout(() => {
        zoomToParcelRef.current?.(nextParcelId);
      }, 0);
    }
  }, [onNext, disableNext, activeIndex, parcels, zoomToParcelRef]);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-lg bg-basic-white p-0"
        onClick={handlePrev}
        disabled={disablePrev}
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-lg bg-basic-white p-0"
        onClick={handleNext}
        disabled={disableNext}
      >
        <span className="material-symbols-outlined text-xl">arrow_forward</span>
      </Button>
    </div>
  );
}
