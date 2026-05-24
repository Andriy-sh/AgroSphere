'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMapInstance, useMapLoaded } from '../context/map-context';
import { useMapPolygonSplitting } from '../hooks/use-map-polygon-splitting';
import type { ParcelWithZones } from '../hooks/use-map-polygon-splitting';
import { ManagementZonesContainer } from '../components/management-zones-container';
import { Button } from '../../button/button';
import type { MapParcel } from '../../../types/map';
import type { DownloadVisualGeometry } from '../../../api/types/eosda.types';

interface PolygonSplittingLayerProps {
  enabled?: boolean;
  parcelName?: string;
  parcelArea?: number;
  onParcelWithZonesChange?: (parcel: MapParcel | null) => void;
  onClearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  convertParcelWithZonesToMapParcel?: (
    parcelWithZones: ParcelWithZones
  ) => MapParcel;
}

export const PolygonSplittingLayer: React.FC<PolygonSplittingLayerProps> = ({
  enabled = false,
  parcelName,
  parcelArea,
  onParcelWithZonesChange,
  onClearDrawingRef,
  convertParcelWithZonesToMapParcel,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const [currentDraw, setCurrentDraw] = useState<any>(null);

  const polygonSplitting = useMapPolygonSplitting({
    map,
    draw: currentDraw,
    enabled: enabled && mapLoaded,
    parcelName,
    parcelAreaProp: parcelArea,
  });

  useEffect(() => {
    if (onClearDrawingRef && polygonSplitting?.clearAll) {
      onClearDrawingRef.current = polygonSplitting.clearAll;
    }
    return () => {
      if (onClearDrawingRef) {
        onClearDrawingRef.current = null;
      }
    };
  }, [onClearDrawingRef, polygonSplitting?.clearAll]);

  const previousParcelWithZonesRef = useRef<ParcelWithZones | null>(null);
  const zonesCountRef = useRef<number>(0);
  const savedParcelWithZonesSnapshotRef = useRef<ParcelWithZones | null>(
    null
  );
  const unsavedChangesSnapshotRef = useRef<ParcelWithZones | null>(null);
  const originalParcelSnapshotRef = useRef<ParcelWithZones | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (
      enabled &&
      polygonSplitting &&
      onParcelWithZonesChange &&
      convertParcelWithZonesToMapParcel
    ) {
      const parcelWithZones = polygonSplitting.getParcelWithZones();
      const currentZonesCount = parcelWithZones?.zones?.length || 0;

      const previousParcel = previousParcelWithZonesRef.current;
      const hasChanged =
        !previousParcel ||
        !parcelWithZones ||
        previousParcel.parcelId !== parcelWithZones.parcelId ||
        previousParcel.zones.length !== parcelWithZones.zones.length ||
        previousParcel.splitLines.length !== parcelWithZones.splitLines.length ||
        zonesCountRef.current !== currentZonesCount;

      if (hasChanged) {
        if (currentZonesCount === 0 && parcelWithZones) {
          originalParcelSnapshotRef.current = JSON.parse(
            JSON.stringify(parcelWithZones)
          );
        }

        const previousZonesCount = zonesCountRef.current;
        if (currentZonesCount !== previousZonesCount) {
          if (savedParcelWithZonesSnapshotRef.current) {
            unsavedChangesSnapshotRef.current =
              savedParcelWithZonesSnapshotRef.current
                ? JSON.parse(
                    JSON.stringify(savedParcelWithZonesSnapshotRef.current)
                  )
                : null;
          }
        }

        zonesCountRef.current = currentZonesCount;
        previousParcelWithZonesRef.current = parcelWithZones
          ? JSON.parse(JSON.stringify(parcelWithZones))
          : null;

        if (parcelWithZones) {
          const mapParcel = convertParcelWithZonesToMapParcel(parcelWithZones);
          onParcelWithZonesChange(mapParcel);
        } else {
          onParcelWithZonesChange(null);
        }
      }
    }
  }, [
    enabled,
    polygonSplitting,
    onParcelWithZonesChange,
    convertParcelWithZonesToMapParcel,
  ]);

  if (!enabled || !mapLoaded) {
    return null;
  }

  return (
    <>
      {polygonSplitting?.canMerge && (
        <div className="absolute bottom-4 right-4 flex items-end gap-3">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
            onClick={polygonSplitting.mergeZones}
          >
            <span className="material-symbols-outlined text-lg text-basic-black">
              linked_services
            </span>
          </Button>
        </div>
      )}

      {convertParcelWithZonesToMapParcel && (
        <ManagementZonesContainer
          enabled={enabled}
          polygonSplitting={polygonSplitting}
          hasUnsavedChanges={hasUnsavedChanges}
          onHasUnsavedChangesChange={setHasUnsavedChanges}
          savedParcelWithZonesSnapshotRef={savedParcelWithZonesSnapshotRef}
          unsavedChangesSnapshotRef={unsavedChangesSnapshotRef}
          originalParcelSnapshotRef={originalParcelSnapshotRef}
          previousParcelWithZonesRef={previousParcelWithZonesRef}
          zonesCountRef={zonesCountRef}
          onParcelWithZonesChange={onParcelWithZonesChange}
          convertParcelWithZonesToMapParcel={convertParcelWithZonesToMapParcel}
        />
      )}
    </>
  );
};

