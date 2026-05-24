import { useCallback } from 'react';
import {
  FarmItem,
  ParcelItem,
  GroupItem,
  ZoneItem,
  createGroupFromParcels,
  ungroupParcels,
  useUpdateFarm,
  useDeleteZone,
  useDeleteParcel,
  useDeleteFarm,
} from '@@agrosphere/shared';
import {
  findItemInTree,
  removeItemById,
  removeItemsByIds,
} from '../utils/farmTree';

interface UseFarmActionsOptions {
  farmItems: FarmItem[];
  setFarmItems: React.Dispatch<React.SetStateAction<FarmItem[]>>;
  clearSelection: () => void;
}

export function useFarmActions({
  farmItems,
  setFarmItems,
  clearSelection,
}: UseFarmActionsOptions) {
  const updateFarmMutation = useUpdateFarm();
  const deleteZoneMutation = useDeleteZone();
  const deleteParcelMutation = useDeleteParcel();
  const deleteFarmMutation = useDeleteFarm();

  const moveItems = useCallback(
    (itemIds: string[], targetFarmId: string) => {
      setFarmItems((prev) => {
        const newFarmItems = [...prev];

        const targetFarmIndex = newFarmItems.findIndex(
          (farm) => farm.id === targetFarmId
        );
        if (targetFarmIndex === -1) {
          return prev;
        }

        const targetFarm = newFarmItems[targetFarmIndex];

        const itemsToMoveData: Array<{
          item: FarmItem | ParcelItem | ZoneItem;
          parentFarm: FarmItem | null;
          parentParcel: (ParcelItem | GroupItem) | null;
        }> = [];

        const zonesBeingMovedAsPartOfParcels = new Set<string>();

        itemIds.forEach((itemId) => {
          const { item, parentFarm, parentParcel } = findItemInTree(
            newFarmItems,
            itemId
          );
          if (item) {
            if (
              'type' in item &&
              (item.type === 'Grassland' ||
                item.type === 'Cropland' ||
                item.type === 'parcel')
            ) {
              const parcel = item as ParcelItem;
              if (parcel.children) {
                parcel.children.forEach((zone) => {
                  zonesBeingMovedAsPartOfParcels.add(zone.id);
                });
              }
            }
            itemsToMoveData.push({ item, parentFarm, parentParcel });
          }
        });

        itemsToMoveData.forEach(({ item, parentFarm, parentParcel }) => {
          if (
            !('type' in item) &&
            !('parcels' in item) &&
            zonesBeingMovedAsPartOfParcels.has(item.id)
          ) {
            return;
          }

          if ('parcels' in item) {
            return;
          }

          if (parentParcel && parentFarm) {
            const farmIndex = newFarmItems.findIndex(
              (farm) => farm.id === parentFarm.id
            );
            if (farmIndex !== -1) {
              const existingChildren = newFarmItems[farmIndex].children ?? [];
              const parcelIndex = existingChildren.findIndex(
                (child) => child.id === parentParcel.id
              );
              if (parcelIndex !== -1) {
                const updatedChildren = [...existingChildren];
                const parcelToUpdate = updatedChildren[parcelIndex];
                if (
                  !('type' in parcelToUpdate) ||
                  parcelToUpdate.type === 'group'
                ) {
                  return;
                }
                const updatedParcel = {
                  ...parcelToUpdate,
                  children:
                    parcelToUpdate.children?.filter((z) => z.id !== item.id) ||
                    [],
                } as ParcelItem;
                updatedChildren[parcelIndex] = updatedParcel;
                newFarmItems[farmIndex] = {
                  ...newFarmItems[farmIndex],
                  children: updatedChildren,
                };
              }
            }
          } else if (parentFarm) {
            if (
              'type' in item &&
              (item.type === 'Grassland' ||
                item.type === 'Cropland' ||
                item.type === 'parcel' ||
                item.type === 'group')
            ) {
              const farmIndex = newFarmItems.findIndex(
                (f) => f.id === parentFarm.id
              );
              if (farmIndex !== -1) {
                newFarmItems[farmIndex] = {
                  ...newFarmItems[farmIndex],
                  children:
                    newFarmItems[farmIndex].children?.filter(
                      (p) => p.id !== item.id
                    ) || [],
                };
              }
            }
          }

          if (
            'type' in item &&
            (item.type === 'Grassland' ||
              item.type === 'Cropland' ||
              item.type === 'parcel' ||
              item.type === 'group')
          ) {
            const updatedTargetFarm = {
              ...targetFarm,
              children: [
                ...(targetFarm.children || []),
                item as ParcelItem | GroupItem,
              ],
            };
            newFarmItems[targetFarmIndex] = updatedTargetFarm;
          } else if ('type' in item && item.type === 'zone') {
            const newParcel: ParcelItem = {
              id: `parcel-${Date.now()}-${Math.random()}`,
              name: `Parcel for ${item.name}`,
              type: 'Grassland' as const,
              area: item.area,
              geometry: [
                [0, 0],
                [10, 0],
                [10, 10],
                [0, 10],
                [0, 0],
              ],
              children: [item as ZoneItem],
            };

            newFarmItems[targetFarmIndex] = {
              ...targetFarm,
              children: [...(targetFarm.children || []), newParcel],
            };
          } else if (!('type' in item) && !('parcels' in item)) {
            const newParcel: ParcelItem = {
              id: `parcel-${Date.now()}-${Math.random()}`,
              name: `Parcel for ${item.name}`,
              type: 'Grassland' as const,
              area: item.area,
              geometry: [
                [0, 0],
                [10, 0],
                [10, 10],
                [0, 10],
                [0, 0],
              ],
              children: [item as ZoneItem],
            };

            newFarmItems[targetFarmIndex] = {
              ...targetFarm,
              children: [...(targetFarm.children || []), newParcel],
            };
          } else {
            return;
          }
        });

        return newFarmItems;
      });

      clearSelection();
    },
    [setFarmItems, clearSelection]
  );

  const groupParcels = useCallback(
    (parcelIds: string[], groupName: string) => {
      const { updatedItems } = createGroupFromParcels(
        farmItems,
        parcelIds,
        groupName
      );
      setFarmItems(updatedItems);
      clearSelection();
    },
    [farmItems, setFarmItems, clearSelection]
  );

  const ungroupParcelsByIds = useCallback(
    (groupIds: string[]) => {
      let updatedItems = [...farmItems];
      groupIds.forEach((groupId) => {
        updatedItems = ungroupParcels(updatedItems, groupId);
      });
      setFarmItems(updatedItems);
      clearSelection();
    },
    [farmItems, setFarmItems, clearSelection]
  );

  const deleteItems = useCallback(
    async (itemIds: string[]) => {
      const zonesToDelete: Array<{
        zoneId: string;
        farmId: string;
        parcelId: string;
      }> = [];
      const parcelsToDelete: Array<{
        farmId: string;
        parcelId: string;
      }> = [];

      itemIds.forEach((itemId) => {
        const { item, parentFarm, parentParcel } = findItemInTree(
          farmItems,
          itemId
        );

        if (!item || !parentFarm) {
          return;
        }

        const isZone =
          parentParcel &&
          !('parcels' in item) &&
          parentParcel.type !== 'group' &&
          (!('type' in item) || item.type === 'zone');

        const isParcel =
          !parentParcel &&
          !('parcels' in item) &&
          'type' in item &&
          (item.type === 'Grassland' ||
            item.type === 'Cropland' ||
            item.type === 'parcel' ||
            item.type === 'group');

        if (isZone && parentParcel) {
          zonesToDelete.push({
            zoneId: itemId,
            farmId: parentFarm.id,
            parcelId: parentParcel.id,
          });
        } else if (isParcel) {
          parcelsToDelete.push({
            farmId: parentFarm.id,
            parcelId: itemId,
          });
        }
      });

      if (zonesToDelete.length > 0) {
        await Promise.all(
          zonesToDelete.map(({ zoneId, farmId, parcelId }) =>
            deleteZoneMutation.mutateAsync({
              farmId,
              parcelId,
              zoneId,
            })
          )
        );
      }

      if (parcelsToDelete.length > 0) {
        await Promise.all(
          parcelsToDelete.map(({ farmId, parcelId }) =>
            deleteParcelMutation.mutateAsync({
              farmId,
              parcelId,
            })
          )
        );
      }

      setFarmItems((prev) => removeItemsByIds(prev, itemIds));
      clearSelection();
    },
    [
      farmItems,
      setFarmItems,
      clearSelection,
      deleteZoneMutation,
      deleteParcelMutation,
    ]
  );

  const deleteItem = useCallback(
    async (itemId: string) => {
      const { item, parentFarm, parentParcel } = findItemInTree(
        farmItems,
        itemId
      );

      if (!item) {
        setFarmItems((prev) => removeItemById(prev, itemId));
        return;
      }

      const isFarm = 'parcels' in item;

      const isZone =
        !isFarm &&
        parentParcel &&
        parentFarm &&
        'type' in parentParcel &&
        parentParcel.type !== 'group' &&
        (!('type' in item) || item.type === 'zone');

      const isParcel =
        !isFarm &&
        !parentParcel &&
        parentFarm &&
        'type' in item &&
        (item.type === 'Grassland' ||
          item.type === 'Cropland' ||
          item.type === 'parcel' ||
          item.type === 'group');

      if (isFarm) {
        await deleteFarmMutation.mutateAsync(itemId);
      } else if (isZone && parentParcel && parentFarm) {
        await deleteZoneMutation.mutateAsync({
          farmId: parentFarm.id,
          parcelId: parentParcel.id,
          zoneId: itemId,
        });
      } else if (isParcel && parentFarm) {
        await deleteParcelMutation.mutateAsync({
          farmId: parentFarm.id,
          parcelId: itemId,
        });
      }

      setFarmItems((prev) => removeItemById(prev, itemId));
    },
    [
      farmItems,
      setFarmItems,
      deleteFarmMutation,
      deleteZoneMutation,
      deleteParcelMutation,
    ]
  );

  const updateFarmName = useCallback(
    async (farmId: string, newName: string) => {
      await updateFarmMutation.mutateAsync({
        farmId,
        data: { name: newName },
      });
    },
    [updateFarmMutation]
  );

  return {
    moveItems,
    groupParcels,
    ungroupParcelsByIds,
    deleteItems,
    deleteItem,
    updateFarmName,
  };
}
