import { useCallback, useState } from 'react';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface UseLocationSelectionOptions {
  ensureMapVisible?: () => void;
  onApplyLocation?: (farmId: string, coords: LocationCoordinates) => void;
}

interface UseLocationSelectionResult {
  pendingLocationFarmId: string | null;
  requestLocationChange: (farmId: string) => void;
  confirmLocationSelection: (event: {
    farmId: string;
    latitude: number;
    longitude: number;
  }) => void;
  cancelLocationSelection: () => void;
}

export const useLocationSelection = (
  options: UseLocationSelectionOptions
): UseLocationSelectionResult => {
  const { ensureMapVisible, onApplyLocation } = options;
  const [pendingLocationFarmId, setPendingLocationFarmId] = useState<
    string | null
  >(null);

  const requestLocationChange = useCallback(
    (farmId: string) => {
      ensureMapVisible?.();
      setPendingLocationFarmId(farmId);
    },
    [ensureMapVisible]
  );

  const confirmLocationSelection = useCallback(
    (event: { farmId: string; latitude: number; longitude: number }) => {
      if (!pendingLocationFarmId || pendingLocationFarmId !== event.farmId) {
        return;
      }

      onApplyLocation?.(event.farmId, {
        latitude: event.latitude,
        longitude: event.longitude,
      });

      setPendingLocationFarmId(null);
    },
    [onApplyLocation, pendingLocationFarmId]
  );

  const cancelLocationSelection = useCallback(() => {
    setPendingLocationFarmId(null);
  }, []);

  return {
    pendingLocationFarmId,
    requestLocationChange,
    confirmLocationSelection,
    cancelLocationSelection,
  };
};
