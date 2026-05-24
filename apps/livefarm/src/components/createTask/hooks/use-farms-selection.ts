import { useState, useMemo } from 'react';
import { FormFarm } from '@@agrosphere/shared';
import { filterFarmsByClient } from '../utils/transform-farms';

export function useFarmsSelection(
  formFarms: FormFarm[],
  selectedClientId: string
) {
  const [selectedFarms, setSelectedFarms] = useState<Record<string, string[]>>(
    {}
  );

  const selectedClientFarms = useMemo(() => {
    return filterFarmsByClient(formFarms, selectedClientId);
  }, [formFarms, selectedClientId]);

  const handleFarmsChange = (farmId: string, selectedFields: string[]) => {
    setSelectedFarms((prev) => ({ ...prev, [farmId]: selectedFields }));
  };

  const resetFarms = () => {
    setSelectedFarms({});
  };

  const isFarmsSelectionValid = useMemo(() => {
    const hasSelectedFarms = Object.keys(selectedFarms).length > 0;
    const hasSelectedFields = Object.values(selectedFarms).some(
      (fields) => fields.length > 0
    );
    return hasSelectedFarms && hasSelectedFields;
  }, [selectedFarms]);

  return {
    selectedFarms,
    selectedClientFarms,
    handleFarmsChange,
    resetFarms,
    isFarmsSelectionValid,
  };
}
