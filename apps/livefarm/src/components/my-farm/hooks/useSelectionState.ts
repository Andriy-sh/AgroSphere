import { useCallback, useState } from 'react';
import { FarmItem, findRelatedIds } from '@@agrosphere/shared';

interface UseSelectionStateResult {
  selectedItems: string[];
  handleSelectItem: (itemId: string, checked: boolean) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useSelectionState = (
  farmItems: FarmItem[]
): UseSelectionStateResult => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = useCallback(
    (itemId: string, checked: boolean) => {
      setSelectedItems((prevSelected) => {
        let updatedSelection = [...prevSelected];

        if (checked) {
          if (!updatedSelection.includes(itemId)) {
            updatedSelection.push(itemId);
          }

          const { childIds } = findRelatedIds(farmItems, itemId);
          childIds.forEach((id) => {
            if (!updatedSelection.includes(id)) {
              updatedSelection.push(id);
            }
          });

          const { parentIds } = findRelatedIds(farmItems, itemId);

          if (parentIds.length >= 2) {
            const parcelId = parentIds[1];
            const farmId = parentIds[0];

            const farm = farmItems.find((farmItem) => farmItem.id === farmId);
            const parcel = farm?.children?.find(
              (child) => child.id === parcelId
            );

            if (parcel?.children) {
              const areAllZonesSelected = parcel.children.every((zone) =>
                updatedSelection.includes(zone.id)
              );

              if (areAllZonesSelected && !updatedSelection.includes(parcelId)) {
                updatedSelection.push(parcelId);
              }
            }
          }

          if (parentIds.length >= 1) {
            const farmId = parentIds[0];
            const farm = farmItems.find((farmItem) => farmItem.id === farmId);

            if (farm?.children) {
              const areAllParcelsSelected = farm.children.every((parcel) =>
                updatedSelection.includes(parcel.id)
              );

              if (areAllParcelsSelected && !updatedSelection.includes(farmId)) {
                updatedSelection.push(farmId);
              }
            }
          }
        } else {
          updatedSelection = updatedSelection.filter((id) => id !== itemId);

          const { childIds } = findRelatedIds(farmItems, itemId);
          updatedSelection = updatedSelection.filter(
            (id) => !childIds.includes(id)
          );

          const { parentIds } = findRelatedIds(farmItems, itemId);

          if (parentIds.length >= 2) {
            const parcelId = parentIds[1];
            updatedSelection = updatedSelection.filter((id) => id !== parcelId);
          }

          if (parentIds.length >= 1) {
            const farmId = parentIds[0];
            updatedSelection = updatedSelection.filter((id) => id !== farmId);
          }
        }

        return updatedSelection;
      });
    },
    [farmItems]
  );

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedItems((prevSelected) => {
      const isAllSelected =
        ids.length > 0 && ids.every((id) => prevSelected.includes(id));

      if (isAllSelected) {
        return prevSelected.filter((id) => !ids.includes(id));
      }

      const merged = new Set(prevSelected);
      ids.forEach((id) => merged.add(id));
      return Array.from(merged);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return {
    selectedItems,
    handleSelectItem,
    toggleSelectAll,
    clearSelection,
    setSelectedItems,
  };
};
