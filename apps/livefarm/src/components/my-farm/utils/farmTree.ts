import { FarmItem, ParcelItem, GroupItem, ZoneItem } from '@@agrosphere/shared';

export interface TreeSearchResult {
  item: FarmItem | ParcelItem | GroupItem | ZoneItem | null;
  parentFarm: FarmItem | null;
  parentParcel: (ParcelItem | GroupItem) | null;
}

export const findItemInTree = (
  items: FarmItem[],
  targetId: string
): TreeSearchResult => {
  for (const farm of items) {
    if (farm.id === targetId) {
      return { item: farm, parentFarm: null, parentParcel: null };
    }

    if (farm.children) {
      for (const parcel of farm.children) {
        if (parcel.id === targetId) {
          return { item: parcel, parentFarm: farm, parentParcel: null };
        }

        if (parcel.children) {
          for (const zone of parcel.children) {
            if (zone.id === targetId) {
              return { item: zone, parentFarm: farm, parentParcel: parcel };
            }
          }
        }
      }
    }
  }

  return { item: null, parentFarm: null, parentParcel: null };
};

export const removeItemById = (
  items: FarmItem[],
  targetId: string
): FarmItem[] =>
  items.reduce<FarmItem[]>((result, farm) => {
    if (farm.id === targetId) {
      return result;
    }

    if (!farm.children) {
      return [...result, farm];
    }

    const updatedChildren = farm.children.reduce<(ParcelItem | GroupItem)[]>(
      (childAcc, parcel) => {
        if (parcel.id === targetId) {
          return childAcc;
        }

        if (!parcel.children) {
          return [...childAcc, parcel];
        }

        const filteredZones = parcel.children.filter(
          (zone) => zone.id !== targetId
        );

        return [
          ...childAcc,
          {
            ...parcel,
            children: filteredZones as (ParcelItem | GroupItem)[],
          },
        ];
      },
      []
    );

    return [...result, { ...farm, children: updatedChildren }];
  }, []);

export const removeItemsByIds = (
  items: FarmItem[],
  targetIds: string[]
): FarmItem[] =>
  items.reduce<FarmItem[]>((result, farm) => {
    if (targetIds.includes(farm.id)) {
      return result;
    }

    if (!farm.children) {
      return [...result, farm];
    }

    const updatedChildren = farm.children.reduce<(ParcelItem | GroupItem)[]>(
      (childAcc, parcel) => {
        if (targetIds.includes(parcel.id)) {
          return childAcc;
        }

        if (!parcel.children) {
          return [...childAcc, parcel];
        }

        const filteredZones = parcel.children.filter(
          (zone) => !targetIds.includes(zone.id)
        );

        return [
          ...childAcc,
          {
            ...parcel,
            children: filteredZones as (ParcelItem | GroupItem)[],
          },
        ];
      },
      []
    );

    return [...result, { ...farm, children: updatedChildren }];
  }, []);

export const canUngroupSelected = (
  farmItems: FarmItem[],
  selectedIds: string[]
): boolean => {
  for (const farm of farmItems) {
    if (!farm.children) {
      continue;
    }

    for (const child of farm.children) {
      if (
        'type' in child &&
        child.type === 'group' &&
        selectedIds.includes(child.id)
      ) {
        return true;
      }
    }
  }

  return false;
};

export const canMoveSelectedItems = (
  farmItems: FarmItem[],
  selectedIds: string[]
): boolean => {
  for (const farm of farmItems) {
    if (!farm.children) {
      continue;
    }

    for (const child of farm.children) {
      if ('type' in child && child.type === 'group') {
        if (selectedIds.includes(child.id)) {
          return false;
        }

        if (child.children) {
          for (const parcel of child.children) {
            if (selectedIds.includes(parcel.id)) {
              return false;
            }

            if ('children' in parcel && parcel.children) {
              for (const zone of parcel.children) {
                if (selectedIds.includes(zone.id)) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
  }

  return true;
};
