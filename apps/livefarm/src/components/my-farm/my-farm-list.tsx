'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MyFarmDialogs } from './components/my-farm-dialogs';
import { useFarmDialogs } from './hooks/use-farm-dialogs';

import { SortState } from './sorting.config';
import {
  canGroupParcels,
  FarmRow,
  filterFarmItems,
  getAllIds,
  searchFarmItems,
  SelectionBar,
  sortFarmItems,
} from '@@agrosphere/shared';
import { useFarmData } from './hooks/useFarmData';
import { useSelectionState } from './hooks/useSelectionState';
import {
  canMoveSelectedItems,
  canUngroupSelected,
  findItemInTree,
} from './utils/farmTree';
import { useFarmActions } from './hooks/use-farm-actions';

interface MyFarmListProps {
  onZoomToFarm?: (farmId: string) => void;
  activeFilters?: Record<string, string[]>;
  sortState?: SortState;
  searchQuery?: string;
  onRequestLocationChange?: (farmId: string) => void;
  pendingLocationFarmId?: string | null;
  onCancelLocationSelection?: () => void;
}

export function MyFarmList({
  onZoomToFarm,
  activeFilters = {},
  sortState = { field: 'name', direction: 'asc' },
  searchQuery = '',
  onRequestLocationChange,
  pendingLocationFarmId = null,
  onCancelLocationSelection,
}: MyFarmListProps) {
  const router = useRouter();
  const { farmItems, setFarmItems } = useFarmData();
  const { selectedItems, handleSelectItem, toggleSelectAll, clearSelection } =
    useSelectionState(farmItems);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { activeDialog, openDialog, closeDialog } = useFarmDialogs();

  const actions = useFarmActions({
    farmItems,
    setFarmItems,
    clearSelection,
  });

  const moveSelectionAllowed = useMemo(
    () => canMoveSelectedItems(farmItems, selectedItems),
    [farmItems, selectedItems]
  );

  const ungroupAllowed = useMemo(
    () => canUngroupSelected(farmItems, selectedItems),
    [farmItems, selectedItems]
  );

  const handleToggleExpand = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleMapZoom = useCallback(
    (itemId: string) => {
      onZoomToFarm?.(itemId);
    },
    [onZoomToFarm]
  );

  const handleSetLocation = useCallback(
    (itemId: string) => {
      onRequestLocationChange?.(itemId);
    },
    [onRequestLocationChange]
  );

  const handleDropdownAction = useCallback(
    (action: string, itemId: string) => {
      if (action === 'view-details') {
        const { item } = findItemInTree(farmItems, itemId);
        if (item && 'type' in item && item.type !== 'group') {
          router.push(`/my-farm/view-parcel/${itemId}`);
        }
        return;
      }

      if (action === 'create-management-zones-satellite') {
        const { item } = findItemInTree(farmItems, itemId);
        if (item && 'type' in item && item.type !== 'group') {
          router.push(`/my-farm/view-parcel/${itemId}?openSatelliteForm=true`);
        }
        return;
      }

      if (action === 'change-location') {
        onRequestLocationChange?.(itemId);
        return;
      }

      if (action === 'ungroup') {
        actions.ungroupParcelsByIds([itemId]);
        return;
      }

      if (action === 'delete') {
        const { item } = findItemInTree(farmItems, itemId);
        if (!item) {
          return;
        }

        const itemName = 'name' in item ? item.name : '';
        let itemType: 'farm' | 'parcel' | 'zone' | 'location-missing' =
          'parcel';

        if ('parcels' in item) {
          itemType = 'farm';
        } else if ('type' in item && item.type === 'zone') {
          itemType = 'zone';
        } else if (!('type' in item)) {
          itemType = 'zone';
        }

        openDialog('DELETE', {
          itemId,
          itemName,
          itemType,
        });
        return;
      }

      if (action === 'edit-name') {
        const farmItem = farmItems.find((farm) => farm.id === itemId);
        if (farmItem) {
          openDialog('EDIT_NAME', {
            itemId,
            currentName: farmItem.name,
          });
        }
        return;
      }

      if (action === 'add-parcel') {
        router.replace(`/my-farm/create-parcel-zone?farmId=${itemId}`);
        return;
      }
    },
    [farmItems, router, onRequestLocationChange, openDialog, actions]
  );

  const handleDeleteConfirm = useCallback(
    async (itemId: string) => {
      await actions.deleteItem(itemId);
      closeDialog();
    },
    [actions, closeDialog]
  );

  const handleEditSave = useCallback(
    async (itemId: string, newName: string) => {
      await actions.updateFarmName(itemId, newName);
      closeDialog();
    },
    [actions, closeDialog]
  );

  const handleMoveToConfirm = useCallback(
    async (itemIds: string[], targetFarmId: string) => {
      await actions.moveItems(itemIds, targetFarmId);
      clearSelection();
      closeDialog();
    },
    [actions, clearSelection, closeDialog]
  );

  const handleDeleteMultipleConfirm = useCallback(
    async (itemIds: string[]) => {
      await actions.deleteItems(itemIds);
      clearSelection();
      closeDialog();
    },
    [actions, clearSelection, closeDialog]
  );

  const handleGroupNameSave = useCallback(
    async (itemIds: string[], groupName: string) => {
      await actions.groupParcels(itemIds, groupName);
      clearSelection();
      closeDialog();
    },
    [actions, clearSelection, closeDialog]
  );

  const handleMoveTo = useCallback(() => {
    if (moveSelectionAllowed) {
      openDialog('MOVE_TO', {
        selectedItems: selectedItems,
      });
    }
  }, [moveSelectionAllowed, selectedItems, openDialog]);

  const handleDeleteSelected = useCallback(() => {
    openDialog('DELETE_MULTIPLE', {
      selectedItems: selectedItems,
    });
  }, [selectedItems, openDialog]);

  const handleGroup = useCallback(() => {
    const { canGroup, parcelIds } = canGroupParcels(farmItems, selectedItems);
    if (canGroup && parcelIds.length >= 2) {
      openDialog('GROUP_NAME', {
        selectedItems: parcelIds,
      });
    }
  }, [farmItems, selectedItems, openDialog]);

  const handleUngroup = useCallback(() => {
    const selectedGroups = selectedItems.filter((id) => {
      for (const farm of farmItems) {
        if (farm.children) {
          for (const child of farm.children) {
            if (child.id === id && 'type' in child && child.type === 'group') {
              return true;
            }
          }
        }
      }
      return false;
    });

    if (selectedGroups.length > 0) {
      actions.ungroupParcelsByIds(selectedGroups);
      clearSelection();
    }
  }, [farmItems, selectedItems, actions, clearSelection]);

  const filteredFarmItems = useMemo(
    () => filterFarmItems(farmItems, activeFilters),
    [farmItems, activeFilters]
  );
  const searchedFarmItems = useMemo(
    () => searchFarmItems(filteredFarmItems, searchQuery),
    [filteredFarmItems, searchQuery]
  );
  const sortedFarmItems = useMemo(
    () =>
      sortFarmItems(searchedFarmItems, sortState.field, sortState.direction),
    [searchedFarmItems, sortState.field, sortState.direction]
  );
  const visibleIds = useMemo(
    () => getAllIds(sortedFarmItems),
    [sortedFarmItems]
  );
  const allSelectedVisible =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedItems.includes(id));

  const { canGroup } = useMemo(
    () => canGroupParcels(farmItems, selectedItems),
    [farmItems, selectedItems]
  );

  const handleSelectAllVisible = useCallback(() => {
    toggleSelectAll(visibleIds);
  }, [toggleSelectAll, visibleIds]);

  return (
    <div className="w-full">
      {selectedItems.length > 0 && (
        <div className="sticky top-0 z-10 bg-white">
          <SelectionBar
            selectedCount={selectedItems.length}
            totalCount={visibleIds.length}
            allSelected={allSelectedVisible}
            onSelectAll={handleSelectAllVisible}
            onClearSelection={clearSelection}
            onMoveTo={moveSelectionAllowed ? handleMoveTo : undefined}
            onDelete={handleDeleteSelected}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            canGroup={canGroup}
            canUngroup={ungroupAllowed}
          />
        </div>
      )}

      <div className="bg-white">
        {sortedFarmItems.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">
              {searchQuery ? (
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">
                    No items found for &quot;{searchQuery}&quot;
                  </div>
                  <div className="text-sm">Try a different search term</div>
                </div>
              ) : farmItems.length === 0 ? (
                'No data available'
              ) : (
                'No items match the current filters'
              )}
            </div>
          </div>
        ) : (
          sortedFarmItems.map((item, index) => (
            <div key={item.id}>
              <div className="mt-3">
                <FarmRow
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  isExpanded={expandedItems.has(item.id)}
                  expandedItems={expandedItems}
                  selectedItems={selectedItems}
                  onSelect={handleSelectItem}
                  onToggleExpand={handleToggleExpand}
                  onMapZoom={handleMapZoom}
                  onSetLocation={handleSetLocation}
                  onDropdownAction={handleDropdownAction}
                />
              </div>
              {index < sortedFarmItems.length - 1 && (
                <div className="mx-3 my-3 border-b border-gray-100" />
              )}
            </div>
          ))
        )}
      </div>

      <MyFarmDialogs
        activeDialog={activeDialog}
        farmItems={farmItems}
        onClose={closeDialog}
        onDeleteConfirm={handleDeleteConfirm}
        onEditSave={handleEditSave}
        onMoveToConfirm={handleMoveToConfirm}
        onDeleteMultipleConfirm={handleDeleteMultipleConfirm}
        onGroupNameSave={handleGroupNameSave}
      />
    </div>
  );
}
