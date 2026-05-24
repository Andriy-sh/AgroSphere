'use client';

import { AddButton, SplitCard } from '@@agrosphere/shared';
import type { ParcelWithZones } from '@@agrosphere/shared';
import { ZonesHistory } from './zones-history';
import type { ZonesHistoryEntry } from '../types';
import mapboxgl from 'mapbox-gl';

interface ZonesManagementProps {
  canCreateZones: boolean;
  zonesHistory: ZonesHistoryEntry[];
  onDrawZone: () => void;
  onSatelliteZone: () => void;
  mapRef?: React.MutableRefObject<React.MutableRefObject<mapboxgl.Map | null> | null>;
  onDeleteHistoryEntry?: (entryId: string) => void;
  onUpdateHistoryEntryName?: (entryId: string, name: string) => void;
  onUpdateHistoryEntryZones?: (
    entryId: string,
    parcelWithZones: ParcelWithZones
  ) => void;
}

export function ZonesManagement({
  canCreateZones,
  zonesHistory,
  onDrawZone,
  onSatelliteZone,
  mapRef,
  onDeleteHistoryEntry,
  onUpdateHistoryEntryName,
  onUpdateHistoryEntryZones,
}: ZonesManagementProps) {
  return (
    <SplitCard
      className={!canCreateZones ? 'opacity-50 pointer-events-none' : ''}
      topContent={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-basic-black">
            Management zones
          </h3>
          {canCreateZones ? (
            <AddButton
              buttonText="Create management zones"
              useCustomOptions={true}
              customOptions={[
                {
                  id: 'draw',
                  label: 'Draw',
                  onClick: onDrawZone,
                },
                {
                  id: 'satellite',
                  label: 'Satellite P&K',
                  onClick: onSatelliteZone,
                },
              ]}
              className="flex-shrink-0"
            />
          ) : (
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-500 text-sm">
              Draw parcel first
            </div>
          )}
        </div>
      }
      bottomContent={
        <ZonesHistory
          zonesHistory={zonesHistory}
          canCreateZones={canCreateZones}
          mapRef={mapRef}
          onDeleteHistoryEntry={onDeleteHistoryEntry}
          onUpdateHistoryEntryName={onUpdateHistoryEntryName}
          onUpdateHistoryEntryZones={onUpdateHistoryEntryZones}
        />
      }
    />
  );
}
