'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import type { MapZone, ParcelWithZones } from '@@agrosphere/shared';
import type { SelectedFarm, ZonesHistoryEntry } from '../types';

interface UseZonesHistoryProps {
  selectedFarm: SelectedFarm | null;
}

export function useZonesHistory({ selectedFarm }: UseZonesHistoryProps) {
  const [zonesHistory, setZonesHistory] = useState<ZonesHistoryEntry[]>([]);
  const previousZonesCountRef = useRef<number>(0);

  const handleParcelWithZonesChange = useCallback(
    (parcel: ParcelWithZones | null) => {
      if (parcel && parcel.zones && parcel.zones.length > 0) {
        const currentZonesCount = parcel.zones.length;

        if (currentZonesCount !== previousZonesCountRef.current) {
          const historyEntry: ZonesHistoryEntry = {
            id: Date.now().toString(),
            parcelWithZones: JSON.parse(JSON.stringify(parcel)),
            createdAt: new Date(),
            zonesCount: currentZonesCount,
            method: 'Manual',
          };

          setZonesHistory((prev) => [...prev, historyEntry]);
          previousZonesCountRef.current = currentZonesCount;
        }
      } else if (!parcel || !parcel.zones || parcel.zones.length === 0) {
        previousZonesCountRef.current = 0;
      }
    },
    []
  );

  const addHistoryEntry = useCallback((entry: ZonesHistoryEntry) => {
    setZonesHistory((prev) => [...prev, entry]);
  }, []);

  const clearHistory = useCallback(() => {
    setZonesHistory([]);
    previousZonesCountRef.current = 0;
  }, []);

  const deleteHistoryEntry = useCallback((entryId: string) => {
    setZonesHistory((prev) => prev.filter((entry) => entry.id !== entryId));
  }, []);

  const updateHistoryEntryName = useCallback(
    (entryId: string, name: string) => {
      setZonesHistory((prev) =>
        prev.map((entry) => (entry.id === entryId ? { ...entry, name } : entry))
      );
    },
    []
  );

  const updateHistoryEntryZones = useCallback(
    (entryId: string, parcelWithZones: ParcelWithZones) => {
      setZonesHistory((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                parcelWithZones,
                zonesCount: parcelWithZones.zones.length,
              }
            : entry
        )
      );
    },
    []
  );

  const mapZones = useMemo<MapZone[]>(() => {
    return zonesHistory.flatMap((historyEntry) =>
      historyEntry.parcelWithZones.zones.map((zone) => {
        const ring = zone.coordinates.map(
          (coord) => [coord[0], coord[1]] as [number, number]
        );
        const coordinates = [[ring]] as [number, number][][][];
        return {
          id: zone.zoneId,
          name: zone.zoneName || zone.zoneId,
          area: zone.area,
          cropType: 'default',
          coordinates,
          fillColor: '#FFFFFF',
          borderColor: '#FFFFFF',
          fillOpacity: 0.12,
          borderWidth: 1,
          visible: true,
          farmId: selectedFarm?.id,
          farmName: selectedFarm?.label,
          parcelName: historyEntry.parcelWithZones.parcelId,
        };
      })
    );
  }, [zonesHistory, selectedFarm]);

  return {
    zonesHistory,
    setZonesHistory,
    handleParcelWithZonesChange,
    addHistoryEntry,
    clearHistory,
    deleteHistoryEntry,
    updateHistoryEntryName,
    updateHistoryEntryZones,
    mapZones,
  };
}
