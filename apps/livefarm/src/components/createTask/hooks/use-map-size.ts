import { useEffect, useCallback } from 'react';
import { useMapStore } from '@/stores/use-map-store';

export function useMapSize() {
  const { mapSize, setMapSize, validateAndSetMapSize } = useMapStore();

  useEffect(() => {
    validateAndSetMapSize(mapSize, false);
  }, [mapSize, validateAndSetMapSize]);

  useEffect(() => {
    if (mapSize === 0) {
      setMapSize(40);
    }
  }, [mapSize, setMapSize]);

  const handleMapSizeChange = useCallback(
    (size: number) => {
      setMapSize(size);
    },
    [setMapSize]
  );

  return {
    mapSize,
    handleMapSizeChange,
  };
}

