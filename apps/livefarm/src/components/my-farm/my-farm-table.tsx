'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Checkbox,
  type FarmItem,
  type ParcelItem,
  type ZoneItem,
  getAllIds,
} from '@@agrosphere/shared';
import { useFarmData } from './hooks/useFarmData';
import { FarmListItem } from './components/farm-list-item';

type TreeItem = FarmItem | ParcelItem | ZoneItem;

export function MyFarmList() {
  const { farmItems, loading } = useFarmData();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  }, []);

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

  const handleMapZoom = useCallback((itemId: string) => {
    console.log('Zoom to map for item:', itemId);
  }, []);

  const handleDropdownAction = useCallback((action: string, itemId: string) => {
    console.log('Dropdown action:', action, 'for item:', itemId);
  }, []);

  const allItemIds = useMemo(() => getAllIds(farmItems), [farmItems]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === allItemIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allItemIds);
    }
  }, [selectedItems.length, allItemIds]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-gray-600">Loading farm data...</div>
      </div>
    );
  }

  const renderFarmItem = (item: TreeItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = Boolean(
      'children' in item && item.children && item.children.length > 0
    );
    const isSelected = selectedItems.includes(item.id);

    return (
      <div key={item.id} className="w-full">
        <FarmListItem
          item={item}
          level={level}
          isExpanded={isExpanded}
          isSelected={isSelected}
          hasChildren={hasChildren}
          onToggleExpand={handleToggleExpand}
          onSelect={handleSelectItem}
          onMapZoom={handleMapZoom}
          onDropdownAction={handleDropdownAction}
        />
        {isExpanded && hasChildren && 'children' in item && item.children && (
          <div>
            {item.children.map((child) => renderFarmItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {selectedItems.length > 0 && (
        <div className="bg-basic-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedItems.length === allItemIds.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                {selectedItems.length} of {allItemIds.length} Selected
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSelectedItems([])}
                className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                <span className="text-sm">Clear</span>
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-200 rounded">
                <span className="material-symbols-outlined text-sm">
                  arrow_top_right
                </span>
                <span className="text-sm">Move to</span>
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-200 rounded">
                <span className="material-symbols-outlined text-sm">stack</span>
                <span className="text-sm">Group</span>
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button
                className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-200 rounded text-gray-400"
                disabled
              >
                <span className="material-symbols-outlined text-sm">
                  stack_off
                </span>
                <span className="text-sm">Ungroup</span>
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button className="p-1 hover:bg-gray-200 rounded">
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white">
        {farmItems.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">No data available</div>
          </div>
        ) : (
          farmItems.map((item) => renderFarmItem(item, 0))
        )}
      </div>
    </div>
  );
}
