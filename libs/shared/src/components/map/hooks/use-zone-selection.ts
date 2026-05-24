import { useState, useCallback } from 'react';

export function useZoneSelection() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([]);

  const toggleZoneSelection = useCallback((zoneId: string) => {
    setSelectedZoneIds((prev) => {
      if (prev.includes(zoneId)) {
        return prev.filter((id) => id !== zoneId);
      }
      return [...prev, zoneId];
    });
  }, []);

  const clearZoneSelection = useCallback(() => {
    setSelectedZoneIds([]);
    setSelectedZoneId(null);
  }, []);

  const selectZone = useCallback(
    (zoneId: string, isMultiSelect: boolean) => {
      if (isMultiSelect) {
        toggleZoneSelection(zoneId);
      } else {
        setSelectedZoneIds([]);
        setSelectedZoneId((prev) => (prev === zoneId ? null : zoneId));
      }
    },
    [toggleZoneSelection]
  );

  return {
    selectedZoneId,
    selectedZoneIds,
    toggleZoneSelection,
    clearZoneSelection,
    selectZone,
    setSelectedZoneId,
    setSelectedZoneIds,
  };
}
