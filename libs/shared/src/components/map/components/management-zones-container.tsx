'use client';

import React from 'react';
import { ManagementZones } from './management-zones';
import type { ParcelWithZones } from '../hooks/use-map-polygon-splitting';
import type { MapParcel } from '../../../types/map';

interface ManagementZonesContainerProps {
  enabled: boolean;
  polygonSplitting: {
    getParcelWithZones: () => ParcelWithZones | null;
    restoreParcelWithZones: (parcel: ParcelWithZones | null) => void;
    clearAll: () => void;
  } | null;
  hasUnsavedChanges: boolean;
  onHasUnsavedChangesChange: (hasChanges: boolean) => void;
  savedParcelWithZonesSnapshotRef: React.MutableRefObject<ParcelWithZones | null>;
  unsavedChangesSnapshotRef: React.MutableRefObject<ParcelWithZones | null>;
  originalParcelSnapshotRef: React.MutableRefObject<ParcelWithZones | null>;
  previousParcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>;
  zonesCountRef: React.MutableRefObject<number>;
  onParcelWithZonesChange?: (parcel: MapParcel | null) => void;
  convertParcelWithZonesToMapParcel: (parcel: ParcelWithZones) => MapParcel;
}

export const ManagementZonesContainer: React.FC<
  ManagementZonesContainerProps
> = ({
  enabled,
  polygonSplitting,
  hasUnsavedChanges,
  onHasUnsavedChangesChange,
  savedParcelWithZonesSnapshotRef,
  unsavedChangesSnapshotRef,
  originalParcelSnapshotRef,
  previousParcelWithZonesRef,
  zonesCountRef,
  onParcelWithZonesChange,
  convertParcelWithZonesToMapParcel,
}) => {
  if (!enabled || !polygonSplitting) {
    return null;
  }

  const parcelWithZones = polygonSplitting.getParcelWithZones();
  const hasZones = parcelWithZones?.zones && parcelWithZones.zones.length > 0;

  if (!hasZones || !hasUnsavedChanges) {
    return null;
  }

  const handleSave = () => {
    if (!polygonSplitting) return;

    const parcelWithZones = polygonSplitting.getParcelWithZones();
    if (parcelWithZones) {
      savedParcelWithZonesSnapshotRef.current = parcelWithZones
        ? JSON.parse(JSON.stringify(parcelWithZones))
        : null;
      unsavedChangesSnapshotRef.current = null;
      onHasUnsavedChangesChange(false);

      if (onParcelWithZonesChange) {
        onParcelWithZonesChange(
          convertParcelWithZonesToMapParcel(parcelWithZones)
        );
      }
    }
  };

  const handleCancel = () => {
    if (!polygonSplitting) return;

    let snapshotToRestore =
      unsavedChangesSnapshotRef.current ||
      savedParcelWithZonesSnapshotRef.current;

    if (
      snapshotToRestore &&
      snapshotToRestore.zones.length === 0 &&
      originalParcelSnapshotRef.current
    ) {
      snapshotToRestore = originalParcelSnapshotRef.current;
    }

    if (!snapshotToRestore && originalParcelSnapshotRef.current) {
      snapshotToRestore = originalParcelSnapshotRef.current;
    }

    if (snapshotToRestore) {
      polygonSplitting.restoreParcelWithZones(snapshotToRestore);

      previousParcelWithZonesRef.current = snapshotToRestore
        ? JSON.parse(JSON.stringify(snapshotToRestore))
        : null;
      zonesCountRef.current = snapshotToRestore?.zones?.length || 0;

      unsavedChangesSnapshotRef.current = null;
      onHasUnsavedChangesChange(false);

      if (onParcelWithZonesChange) {
        onParcelWithZonesChange(
          snapshotToRestore
            ? convertParcelWithZonesToMapParcel(snapshotToRestore)
            : null
        );
      }
    } else {
      polygonSplitting.clearAll();
      previousParcelWithZonesRef.current = null;
      zonesCountRef.current = 0;
      savedParcelWithZonesSnapshotRef.current = null;
      unsavedChangesSnapshotRef.current = null;
      originalParcelSnapshotRef.current = null;
      onHasUnsavedChangesChange(false);

      if (onParcelWithZonesChange) {
        onParcelWithZonesChange(null);
      }
    }
  };

  return (
    <ManagementZones
      isVisible={true}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};
