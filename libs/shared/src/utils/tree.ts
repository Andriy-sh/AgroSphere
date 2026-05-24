export interface BaseItem {
  id: string;
  name: string;
  area: number;
}

export interface FarmItem extends BaseItem {
  parcels: number;

  lat?: number;
  lng?: number;
  children?: (ParcelItem | GroupItem)[];
}

export interface ParcelItem extends BaseItem {
  type: string;
  geometry: number[][];
  children?: ZoneItem[];
  eosdaFieldId?: string;
  item_id?: string | number;
}

export interface GroupItem extends BaseItem {
  type: 'group';
  children: (ParcelItem | GroupItem)[];
}

export type ZoneItem = BaseItem;

export type TreeItem = FarmItem | ParcelItem | ZoneItem | GroupItem;

export function getChildrenIds(item: TreeItem): string[] {
  const ids: string[] = [];

  if ('children' in item && item.children) {
    item.children.forEach((child) => {
      ids.push(child.id, ...getChildrenIds(child));
    });
  }

  return ids;
}

export function getAllIds(items: FarmItem[]): string[] {
  return items.flatMap((item) => [item.id, ...getChildrenIds(item)]);
}

export function findParentIds(items: FarmItem[], targetId: string): string[] {
  for (const item of items) {
    if (item.id === targetId) {
      return [];
    }

    if (item.children) {
      for (const parcel of item.children) {
        if (parcel.id === targetId) {
          return [item.id];
        }

        if (parcel.children) {
          for (const zone of parcel.children) {
            if (zone.id === targetId) {
              return [item.id, parcel.id];
            }
          }
        }
      }
    }
  }

  return [];
}

export function findRelatedIds(
  items: FarmItem[],
  targetId: string
): {
  parentIds: string[];
  childIds: string[];
} {
  const parentIds = findParentIds(items, targetId);

  let targetItem: TreeItem | null = null;

  for (const item of items) {
    if (item.id === targetId) {
      targetItem = item;
      break;
    }

    if (item.children) {
      for (const parcel of item.children) {
        if (parcel.id === targetId) {
          targetItem = parcel;
          break;
        }

        if (parcel.children) {
          for (const zone of parcel.children) {
            if (zone.id === targetId) {
              targetItem = zone;
              break;
            }
          }
        }
      }
    }
  }

  const childIds = targetItem ? getChildrenIds(targetItem) : [];

  return { parentIds, childIds };
}

export function isLastChild<T extends { children?: any[] }>(
  item: T,
  index: number
): boolean {
  return item.children ? index === item.children.length - 1 : false;
}

export function canGroupParcels(
  items: FarmItem[],
  selectedIds: string[]
): { canGroup: boolean; farmId?: string; parcelIds: string[] } {
  const parcelIds: string[] = [];
  let farmId: string | undefined;

  for (const farm of items) {
    if (farm.children) {
      for (const parcel of farm.children) {
        if (selectedIds.includes(parcel.id)) {
          if (farmId && farmId !== farm.id) {
            return { canGroup: false, parcelIds: [] };
          }
          farmId = farm.id;
          parcelIds.push(parcel.id);
        }
      }
    }
  }

  return {
    canGroup: parcelIds.length >= 2,
    farmId,
    parcelIds,
  };
}

export function createGroupFromParcels(
  farmItems: FarmItem[],
  selectedParcelIds: string[],
  groupName = 'Group'
): { updatedItems: FarmItem[]; groupId: string } {
  const updatedItems = [...farmItems];
  const groupId = `group-${Date.now()}`;

  for (let i = 0; i < updatedItems.length; i++) {
    const farm = updatedItems[i];
    if (farm.children) {
      const selectedParcels: ParcelItem[] = [];
      const remainingParcels: ParcelItem[] = [];

      for (const parcel of farm.children) {
        if (selectedParcelIds.includes(parcel.id)) {
          if ('geometry' in parcel) {
            selectedParcels.push(parcel);
          }
        } else {
          if ('geometry' in parcel) {
            remainingParcels.push(parcel);
          }
        }
      }

      if (selectedParcels.length > 0) {
        const totalArea = selectedParcels.reduce(
          (sum, parcel) => sum + parcel.area,
          0
        );

        const groupItem: GroupItem = {
          id: groupId,
          name: groupName,
          area: totalArea,
          type: 'group',
          children: selectedParcels,
        };

        const newChildren = [...remainingParcels, groupItem];
        const parcelCount = newChildren.filter(
          (child) => 'type' in child && child.type !== 'group'
        ).length;

        updatedItems[i] = {
          ...farm,
          children: newChildren,
          parcels: parcelCount,
        };
        break;
      }
    }
  }

  return { updatedItems, groupId };
}

export function ungroupParcels(
  farmItems: FarmItem[],
  groupId: string
): FarmItem[] {
  const updatedItems = [...farmItems];

  for (let i = 0; i < updatedItems.length; i++) {
    const farm = updatedItems[i];
    if (farm.children) {
      const newChildren: (ParcelItem | GroupItem)[] = [];
      let parcelsAdded = 0;

      for (const child of farm.children) {
        if (child.id === groupId && 'type' in child && child.type === 'group') {
          const groupChildren = (child as GroupItem).children;
          newChildren.push(...groupChildren);
          parcelsAdded = groupChildren.length;
        } else {
          newChildren.push(child);
        }
      }

      const parcelCount = newChildren.filter(
        (child) => 'type' in child && child.type !== 'group'
      ).length;

      updatedItems[i] = {
        ...farm,
        children: newChildren,
        parcels: parcelCount,
      };
      break;
    }
  }

  return updatedItems;
}

export function filterFarmItems(
  items: FarmItem[],
  activeFilters: Record<string, string[]>
): FarmItem[] {
  if (Object.keys(activeFilters).length === 0) {
    return items;
  }

  return items.filter((farm) => {
    return matchesFilters(farm, activeFilters);
  });
}

function matchesFilters(
  item: FarmItem | ParcelItem | ZoneItem,
  activeFilters: Record<string, string[]>
): boolean {
  if (activeFilters.size && activeFilters.size.length > 0) {
    const area = item.area;
    const sizeMatches = activeFilters.size.some((sizeFilter) => {
      switch (sizeFilter) {
        case 'Less than 1 ha':
          return area < 1;
        case '1-5 ha':
          return area >= 1 && area <= 5;
        case 'More than 5 ha':
          return area > 5;
        default:
          return false;
      }
    });
    if (!sizeMatches) return false;
  }

  if (activeFilters.cropType && activeFilters.cropType.length > 0) {
    const cropMatches = activeFilters.cropType.some((cropFilter) => {
      if (cropFilter === 'All') return true;

      if ('children' in item && item.children) {
        return item.children.some((parcel) => {
          if ('type' in parcel) {
            return parcel.type === cropFilter;
          }
          return false;
        });
      }
      return false;
    });
    if (!cropMatches) return false;
  }

  if (activeFilters.soilType && activeFilters.soilType.length > 0) {
    return true;
  }

  return true;
}

export function sortFarmItems(
  items: FarmItem[],
  field: 'id' | 'name' | 'size',
  direction: 'asc' | 'desc'
): FarmItem[] {
  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.area - b.area;
        break;
      default:
        comparison = 0;
    }

    return direction === 'desc' ? -comparison : comparison;
  });

  return sortedItems;
}

export function searchFarmItems(items: FarmItem[], query: string): FarmItem[] {
  if (!query.trim()) {
    return items;
  }

  const searchTerm = query.toLowerCase().trim();

  return items.filter((farm) => {
    if (farm.name.toLowerCase().includes(searchTerm)) {
      return true;
    }

    if (farm.id.toLowerCase().includes(searchTerm)) {
      return true;
    }

    if (farm.children) {
      return farm.children.some((parcel) => {
        if (parcel.name.toLowerCase().includes(searchTerm)) {
          return true;
        }

        if (
          'type' in parcel &&
          parcel.type.toLowerCase().includes(searchTerm)
        ) {
          return true;
        }

        if (parcel.children) {
          return parcel.children.some((zone) =>
            zone.name.toLowerCase().includes(searchTerm)
          );
        }

        return false;
      });
    }

    return false;
  });
}
