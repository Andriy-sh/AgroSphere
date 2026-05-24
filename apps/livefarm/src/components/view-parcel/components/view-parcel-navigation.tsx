'use client';

import { Button, ParcelPreview } from '@@agrosphere/shared';
import { ParcelSelector, type ParcelOption } from './parcel-selector';
import { ParcelNavigationButtons } from './parcel-navigation-buttons';

interface ViewParcelNavigationProps {
  geometry: number[][];
  farmName: string;
  parcelCode: string;
  parcelName: string;
  areaLabel: string;
  effectiveAreaLabel: string;
  soilTypeLabel: string;
  parcels?: ParcelOption[];
  activeParcelId?: string;
  onParcelSelect?: (parcelId: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDelete?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  navigationParcels?: Array<{ id: string }>;
  activeIndex?: number;
  zoomToParcelRef?: React.MutableRefObject<((parcelId: string) => void) | null>;
  disabled?: boolean;
}

export function ViewParcelNavigation({
  geometry,
  farmName,
  parcelCode,
  parcelName,
  areaLabel,
  effectiveAreaLabel,
  soilTypeLabel,
  parcels = [],
  activeParcelId,
  onParcelSelect,
  onPrev,
  onNext,
  onDelete,
  disablePrev,
  disableNext,
  navigationParcels = [],
  activeIndex = 0,
  zoomToParcelRef,
  disabled = false,
}: ViewParcelNavigationProps) {
  const navigationDisabled = disabled;

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ParcelPreview geometry={geometry} />

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-3 text-2xl font-semibold text-basic-black md:text-[28px]">
            <div className="flex items-center gap-3">
              <span className="w-[100px] truncate">{farmName}</span>
              <span className="h-6 w-px bg-basic-gray-light flex-shrink-0" />

              <div className="w-[200px]">
                <ParcelSelector
                  parcels={parcels}
                  activeParcelId={activeParcelId}
                  parcelCode={parcelCode}
                  parcelName={parcelName}
                  onParcelSelect={
                    navigationDisabled ? undefined : onParcelSelect
                  }
                  disabled={navigationDisabled}
                />
              </div>

              <span className="h-6 w-px bg-basic-gray-light flex-shrink-0" />
              <ParcelNavigationButtons
                onPrev={navigationDisabled ? undefined : onPrev}
                onNext={navigationDisabled ? undefined : onNext}
                disablePrev={navigationDisabled ? true : disablePrev}
                disableNext={navigationDisabled ? true : disableNext}
                parcels={navigationParcels}
                activeIndex={activeIndex}
                zoomToParcelRef={zoomToParcelRef}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl bg-basic-gray-light text-basic-black hover:bg-basic-gray-light/80"
              onClick={navigationDisabled ? undefined : onDelete}
              disabled={navigationDisabled}
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
