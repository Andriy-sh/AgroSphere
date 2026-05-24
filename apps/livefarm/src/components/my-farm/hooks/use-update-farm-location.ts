import { useCallback } from 'react';
import { useUpdateFarm } from '@@agrosphere/shared';
import type { LocationCoordinates } from './useLocationSelection';

export function useUpdateFarmLocation() {
  const updateFarmMutation = useUpdateFarm();

  const updateLocation = useCallback(
    async (farmId: string, coords: LocationCoordinates) => {
      const updateData = {
        farmLocation: {
          location: [coords.latitude, coords.longitude] as [number, number],
          location_xy: [coords.latitude, coords.longitude] as [
            number,
            number
          ],
        },
      };

      await updateFarmMutation.mutateAsync({
        farmId,
        data: updateData,
      });
    },
    [updateFarmMutation]
  );

  return {
    updateLocation,
    isUpdating: updateFarmMutation.isPending,
  };
}
