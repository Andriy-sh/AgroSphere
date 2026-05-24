'use client';

import { useState } from 'react';
import {
  DropdownActionsNoLib,
  Icon,
  ImagePreview,
  ParcelPreview,
  Separator,
} from '@@agrosphere/shared';
import type { ZonesHistoryEntry } from '../types';
import type { ParcelWithZones } from '@@agrosphere/shared';
import { zoomToParcelBbox } from '@@agrosphere/shared';
import mapboxgl from 'mapbox-gl';
import { EditZonesNameDialog } from './edit-zones-name-dialog';

interface ZonesHistoryProps {
  zonesHistory: ZonesHistoryEntry[];
  canCreateZones: boolean;
  mapRef?: React.MutableRefObject<React.MutableRefObject<mapboxgl.Map | null> | null>;
  onDeleteHistoryEntry?: (entryId: string) => void;
  onUpdateHistoryEntryName?: (entryId: string, name: string) => void;
  onUpdateHistoryEntryZones?: (
    entryId: string,
    parcelWithZones: ParcelWithZones
  ) => void;
}

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForTitle = (date: Date) => {
  const day = date.getDate();
  const monthNames = [
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export function ZonesHistory({
  zonesHistory,
  canCreateZones,
  mapRef,
  onDeleteHistoryEntry,
  onUpdateHistoryEntryName,
  onUpdateHistoryEntryZones,
}: ZonesHistoryProps) {
  const hasHistory = zonesHistory.length > 0;
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const [selectedEntryForEdit, setSelectedEntryForEdit] =
    useState<ZonesHistoryEntry | null>(null);

  const handleViewOnMap = (historyEntry: ZonesHistoryEntry) => {
    if (!mapRef?.current || !historyEntry.parcelWithZones?.parcelCoordinates) {
      return;
    }

    zoomToParcelBbox(
      mapRef.current,
      historyEntry.parcelWithZones.parcelCoordinates
    );
  };

  const handleDelete = (historyEntry: ZonesHistoryEntry) => {
    if (onDeleteHistoryEntry) {
      onDeleteHistoryEntry(historyEntry.id);
    }
  };

  const handleEditName = (historyEntry: ZonesHistoryEntry) => {
    setSelectedEntryForEdit(historyEntry);
    setEditNameDialogOpen(true);
  };

  const handleSaveName = (name: string) => {
    if (selectedEntryForEdit && onUpdateHistoryEntryName) {
      onUpdateHistoryEntryName(selectedEntryForEdit.id, name);
    }
  };

  const getDisplayName = (historyEntry: ZonesHistoryEntry): string => {
    if (historyEntry.name) {
      return historyEntry.name;
    }
    if (historyEntry.imageUrl) {
      return `Satellite Image ${formatDateForTitle(
        historyEntry.satelliteDate || historyEntry.createdAt
      )}`;
    }
    return `Management zones ${formatDateForTitle(historyEntry.createdAt)}`;
  };

  if (!hasHistory) {
    return (
      <div className="flex items-start flex-col gap-1">
        <div className="flex items-center gap-3">
          <Icon icon="info" />
          <p className="font-semibold text-basic-black">
            Add zones to your parcel
          </p>
        </div>
        <p className="text-basic-gray text-sm">
          {canCreateZones
            ? 'You can create management zones to better organize your fields. Click "Plus" to get started.'
            : 'Draw your parcel first, then you can create management zones.'}
        </p>
      </div>
    );
  }

  const reversedHistory = [...zonesHistory].reverse();

  return (
    <div className="flex flex-col text-basic-black gap-3">
      {reversedHistory.map((historyEntry, index) => (
        <div
          key={historyEntry.id}
          className={
            index < reversedHistory.length - 1
              ? 'pb-3 border-b border-basic-gray-light'
              : ''
          }
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {historyEntry.imageUrl ? (
                <ImagePreview
                  imageUrl={historyEntry.imageUrl}
                  alt="Satellite image"
                />
              ) : (
                <ParcelPreview parcelWithZones={historyEntry.parcelWithZones} />
              )}
              <span className="text-basic-black">
                {getDisplayName(historyEntry)}
              </span>
            </div>
            <DropdownActionsNoLib
              items={[
                {
                  id: 'view_on_map',
                  label: 'View on map',
                  icon: 'location_searching',
                  onClick: () => {
                    handleViewOnMap(historyEntry);
                  },
                },
                {
                  id: 'edit_name',
                  label: 'Edit name',
                  icon: 'title',
                  onClick: () => {
                    handleEditName(historyEntry);
                  },
                },
                {
                  id: 'edit_zones',
                  label: 'Edit zones',
                  icon: 'edit',
                  isDisabled: true,
                },
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: 'delete',
                  onClick: () => {
                    handleDelete(historyEntry);
                  },
                },
              ]}
            />
          </div>
          <div className="flex items-center">
            <p className="text-basic-gray">
              Created:{' '}
              <span className="text-basic-black">
                {formatDate(historyEntry.createdAt)}
              </span>
            </p>
            <Separator orientation="vertical" className="h-5 mx-2 w-px" />
            <p className="text-basic-gray">
              Zones:{' '}
              <span className="text-basic-black">
                {historyEntry.zonesCount}
              </span>
            </p>
            <Separator orientation="vertical" className="h-5 mx-2 w-px" />
            <p className="text-basic-gray">
              Method:{' '}
              <span className="text-basic-black">{historyEntry.method}</span>
            </p>
          </div>
        </div>
      ))}
      {selectedEntryForEdit && (
        <EditZonesNameDialog
          isOpen={editNameDialogOpen}
          onClose={() => {
            setEditNameDialogOpen(false);
            setSelectedEntryForEdit(null);
          }}
          currentName={
            selectedEntryForEdit.name || getDisplayName(selectedEntryForEdit)
          }
          onSave={handleSaveName}
        />
      )}
    </div>
  );
}
