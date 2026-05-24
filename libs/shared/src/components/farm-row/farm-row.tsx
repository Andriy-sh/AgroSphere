import React from 'react';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { ParcelRow } from '../parcel-row/parcel-row';
import { GroupRow } from '../group-row/group-row';
import { FarmItem, GroupItem, isLastChild, ParcelItem } from '../../utils';
import { Icon } from '../icon';
import Checkbox from '../checkbox/checkbox';
import { DropdownActionsNoLib } from '../dropdownitems/dropdownitems';

interface FarmRowProps {
  item: FarmItem;
  isSelected: boolean;
  isExpanded: boolean;
  expandedItems: Set<string>;
  selectedItems: string[];
  onSelect: (itemId: string, checked: boolean) => void;
  onToggleExpand: (itemId: string) => void;
  onMapZoom: (itemId: string) => void;
  onSetLocation: (itemId: string) => void;
  onDropdownAction: (action: string, itemId: string) => void;
}

export function FarmRow({
  item,
  isSelected,
  isExpanded,
  expandedItems,
  selectedItems,
  onSelect,
  onToggleExpand,
  onMapZoom,
  onSetLocation,
  onDropdownAction,
}: FarmRowProps) {
  const hasChildren = item.children && item.children.length > 0;

  const rowClasses = `
    flex items-center justify-between w-full
     transition-colors bg-white
  `;

  const contentClasses = 'flex items-center gap-2';
  const infoClasses = 'flex items-center space-x-2';

  return (
    <div className="w-full">
      <div className={rowClasses}>
        <div className={contentClasses}>
          {hasChildren ? (
            <Icon
              icon="arrow_right"
              className={`
                text-gray-600 transition-transform duration-200 cursor-pointer 
                hover:bg-gray-200 rounded ${isExpanded ? 'rotate-90' : ''}
              `}
              onClick={() => onToggleExpand(item.id)}
            />
          ) : (
            <Icon
              icon="arrow_right"
              className="text-basic-gray-light cursor-not-allowed"
            />
          )}

          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          />

          <div className={contentClasses}>
            <div className={infoClasses}>
              <span className="text-basic-black text-sm">{item.name}</span>
              <span className="text-basic-gray text-sm">
                {item.parcels} Parcels
              </span>
              <span className="text-basic-gray text-sm">|</span>
              <span className="text-basic-gray text-sm">
                {typeof item.area === 'number'
                  ? `${item.area.toFixed(1)} ha`
                  : `${item.area} ha`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {!item.lat || !item.lng ? (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <button
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
                  onClick={() => onSetLocation(item.id)}
                >
                  <Icon icon="my_location" className="text-basic-red" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="top" sideOffset={5}>
                  <Tooltip.Popup className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 z-[9999]">
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="warning"
                        size="sm"
                        className="text-basic-black"
                      />
                      <span className="text-sm font-medium text-basic-black">
                        Location Missing
                      </span>
                    </div>
                    <div className="text-xs text-basic-gray mt-1">
                      This farm does not have a location set.
                    </div>
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          ) : (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <button
                  className="w-9 h-9 bg-basic-white hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
                  onClick={() => onMapZoom(item.id)}
                >
                  <Icon icon="my_location" className="text-basic-black" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="top" sideOffset={5}>
                  <Tooltip.Popup className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 z-[9999]">
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="zoom_in"
                        size="sm"
                        className="text-basic-black"
                      />
                      <span className="text-sm font-medium text-basic-black">
                        Zoom to farm
                      </span>
                    </div>
                    <div className="text-xs text-basic-gray mt-1">
                      Click to zoom to this farm on the map
                    </div>
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          )}

          <DropdownActionsNoLib
            items={[
              {
                id: 'edit-name',
                label: 'Edit name',
                icon: 'edit',
                onClick: () => onDropdownAction('edit-name', item.id),
              },
              {
                id: 'change-location',
                label: 'Change location',
                icon: 'location_on',
                onClick: () => onDropdownAction('change-location', item.id),
              },
              {
                id: 'add-parcel',
                label: 'Add parcel',
                icon: 'add',
                onClick: () => onDropdownAction('add-parcel', item.id),
              },
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
                <Icon
                  icon="more_vert"
                  className="text-gray-600 hover:text-gray-500 group-focus-within:text-basic-green"
                />
              </div>
            }
            triggerClassName="p-0"
            placement="bottom-end"
          />
        </div>
      </div>

      {isExpanded && hasChildren && item.children && (
        <div className="mt-2 space-y-2">
          {item.children.map((child, index) => {
            if ('type' in child && child.type === 'group') {
              return (
                <GroupRow
                  key={child.id}
                  item={child as unknown as GroupItem}
                  isSelected={selectedItems.includes(child.id)}
                  isExpanded={expandedItems.has(child.id)}
                  isLast={isLastChild(item, index)}
                  expandedItems={expandedItems}
                  selectedItems={selectedItems}
                  onSelect={onSelect}
                  onToggleExpand={onToggleExpand}
                  onDropdownAction={onDropdownAction}
                />
              );
            } else {
              return (
                <ParcelRow
                  key={child.id}
                  item={child as ParcelItem}
                  isSelected={selectedItems.includes(child.id)}
                  isExpanded={expandedItems.has(child.id)}
                  isLast={isLastChild(item, index)}
                  expandedItems={expandedItems}
                  selectedItems={selectedItems}
                  onSelect={onSelect}
                  onToggleExpand={onToggleExpand}
                  onDropdownAction={onDropdownAction}
                  level={1}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
