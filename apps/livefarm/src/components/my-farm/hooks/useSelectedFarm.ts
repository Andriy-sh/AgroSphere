import { useState, useCallback } from 'react';

export function useSelectedFarm() {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const selectFarm = useCallback((farmId: string | null) => {
    setSelectedFarmId(farmId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFarmId(null);
  }, []);

  return {
    selectedFarmId,
    selectFarm,
    clearSelection,
  };
}
