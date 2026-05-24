'use client';

import React from 'react';
import {
  Checkbox,
  DropdownActionsNoLib,
  Icon,
  ParcelPreview,
  type FarmItem,
  type ParcelItem,
  type ZoneItem,
} from '@@agrosphere/shared';

type TreeItem = FarmItem | ParcelItem | ZoneItem;

interface FarmListItemProps {
  item: TreeItem;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  onToggleExpand: (itemId: string) => void;
  onSelect: (itemId: string, checked: boolean) => void;
  onMapZoom: (itemId: string) => void;
  onDropdownAction: (action: string, itemId: string) => void;
}

const getPaddingClass = (level: number): string => {
  switch (level) {
    case 0:
      return 'pl-4';
    case 1:
      return 'pl-8';
    case 2:
      return 'pl-12';
    default:
      return 'pl-4';
  }
};

const getBackgroundClass = (level: number): string => {
  switch (level) {
    case 0:
      return 'bg-white border-b border-gray-100';
    case 1:
      return 'bg-gray-25 border-b border-gray-50';
    case 2:
      return 'bg-white border-b border-gray-25';
    default:
      return 'bg-white';
  }
};

export function FarmListItem({
  item,
  level,
  isExpanded,
  isSelected,
  hasChildren,
  onToggleExpand,
  onSelect,
  onMapZoom,
  onDropdownAction,
}: FarmListItemProps) {
  const paddingClass = getPaddingClass(level);
  const backgroundClass = getBackgroundClass(level);

  return (
    <div className="w-full">
      <div
        className={`
          flex items-center justify-between w-full px-4 py-3 
          hover:bg-gray-50 transition-colors
          ${backgroundClass}
          ${paddingClass}
        `}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button
              onClick={() => onToggleExpand(item.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              disabled={!hasChildren}
            >
              <span className="material-symbols-outlined text-sm text-gray-600">
                {isExpanded ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
          )}

          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          />

          <div className="flex items-center gap-2">
            {level === 1 && 'geometry' in item && (
              <ParcelPreview geometry={item.geometry} />
            )}

            <div className="flex items-center space-x-2">
              {level === 1 && <span className="text-gray-500 text-sm">1A</span>}
              <span
                className={`font-medium text-gray-900 ${
                  level === 2 ? 'font-semibold' : ''
                }`}
              >
                {item.name}
              </span>

              {level === 0 && 'parcels' in item && (
                <>
                  <span className="text-gray-600">{item.parcels} Parcels</span>
                  <span className="text-gray-400">|</span>
                </>
              )}

              {level === 1 && 'type' in item && (
                <>
                  <span className="text-gray-500">{item.type}</span>
                  <span className="text-gray-400">|</span>
                  {'children' in item &&
                    item.children &&
                    item.children.length > 0 && (
                      <>
                        <span className="text-gray-600">
                          {item.children.length} Zones
                        </span>
                        <span className="text-gray-400">|</span>
                      </>
                    )}
                </>
              )}

              {/* <span className="text-gray-600">
                {(typeof item.area === 'number' ? item.area : 0).toFixed(2)} ha
              </span> */}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
            onClick={() => onMapZoom(item.id)}
          >
            <span className="material-symbols-outlined text-[20px] text-gray-600 hover:text-red-500 transition-colors">
              my_location
            </span>
            <Icon icon="my_location" size="sm" className="text-gray-600" />
          </button>

          <DropdownActionsNoLib
            items={[
              {
                id: 'edit-name',
                label: 'Edit name',
                icon: 'edit',
                onClick: () => onDropdownAction('edit-name', item.id),
              },
              ...(level === 0
                ? [
                    {
                      id: 'change-location',
                      label: 'Change location',
                      icon: 'location_on',
                      onClick: () =>
                        onDropdownAction('change-location', item.id),
                    },
                    {
                      id: 'add-parcel',
                      label: 'Add parcel',
                      icon: 'add',
                      onClick: () => onDropdownAction('add-parcel', item.id),
                    },
                  ]
                : level === 1
                ? [
                    {
                      id: 'change-location',
                      label: 'Change location',
                      icon: 'location_on',
                      onClick: () =>
                        onDropdownAction('change-location', item.id),
                    },
                  ]
                : []),
              {
                id: 'delete',
                label: 'Delete',
                icon: 'delete',
                onClick: () => onDropdownAction('delete', item.id),
              },
            ]}
            rowClassName="text-basic-black rounded-lg"
            contentClassName="min-w-[150px]"
            triggerIcon={
              <div className="w-9 h-9 bg-basic-white hover:bg-gray-200 rounded flex items-center justify-center transition-colors group-focus-within:bg-white group-focus-within:border group-focus-within:border-basic-green">
                <span className="material-symbols-outlined text-[20px] text-gray-600 hover:text-gray-500 transition-colors group-focus-within:text-basic-green">
                  more_vert
                </span>
              </div>
            }
            triggerClassName="p-0"
            placement="bottom-end"
          />
        </div>
      </div>
    </div>
  );
}
