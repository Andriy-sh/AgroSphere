import React from 'react';
import { ParcelRow } from '../parcel-row/parcel-row';
import { Icon } from '../icon';
import Checkbox from '../checkbox/checkbox';
import { GroupItem, isLastChild } from '../../utils';
import { DropdownActionsNoLib } from '../dropdownitems/dropdownitems';

interface GroupRowProps {
  item: GroupItem;
  isSelected: boolean;
  isExpanded: boolean;
  isLast: boolean;
  expandedItems: Set<string>;
  selectedItems: string[];
  onSelect: (itemId: string, checked: boolean) => void;
  onToggleExpand: (itemId: string) => void;
  onDropdownAction: (action: string, itemId: string) => void;
}

export function GroupRow({
  item,
  isSelected,
  isExpanded,
  isLast,
  expandedItems,
  selectedItems,
  onSelect,
  onToggleExpand,
  onDropdownAction,
}: GroupRowProps) {
  const hasChildren = item.children && item.children.length > 0;

  const rowClasses = `
    flex items-center justify-between w-full pl-[45px] py-1 px-6
    hover:bg-gray-50 transition-colors bg-gray-25
    ${!isExpanded && isLast ? 'border-b border-gray-50' : ''}
  `;

  const contentClasses = 'flex items-center gap-2';
  const infoClasses = 'flex items-center space-x-2';

  return (
    <div className="w-full">
      <div className={rowClasses}>
        <div className={contentClasses}>
          <Icon icon="drag_handle" size="sm" className="text-gray-300" />

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
            <div className="w-5 h-5" />
          )}

          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          />

          <div className={contentClasses}>
            <div className={infoClasses}>
              <Icon icon="stack" size="sm" className="text-gray-500" />
              <span className="text-basic-black text-sm font-medium">
                {item.name}
              </span>
              <span className="text-basic-gray text-sm">Group</span>
              <span className="text-basic-gray text-sm">|</span>
              <span className="text-basic-gray text-sm">{item.area} ha</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <DropdownActionsNoLib
            items={[
              {
                id: 'edit-name',
                label: 'Edit name',
                icon: 'edit',
                onClick: () => onDropdownAction('edit-name', item.id),
              },
              {
                id: 'ungroup',
                label: 'Ungroup',
                icon: 'stack_off',
                onClick: () => onDropdownAction('ungroup', item.id),
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
              <Icon
                icon="more_vert"
                className="text-gray-600 hover:text-gray-500 cursor-pointer"
              />
            }
            triggerClassName="p-0"
            placement="bottom-end"
          />
        </div>
      </div>

      {isExpanded && hasChildren && item.children && (
        <div className="mt-2 space-y-2">
          {item.children.map((child, index) => {
            if ('geometry' in child) {
              return (
                <ParcelRow
                  key={child.id}
                  item={child}
                  isSelected={selectedItems.includes(child.id)}
                  isExpanded={expandedItems.has(child.id)}
                  isLast={isLastChild(item, index)}
                  expandedItems={expandedItems}
                  selectedItems={selectedItems}
                  onSelect={onSelect}
                  onToggleExpand={onToggleExpand}
                  onDropdownAction={onDropdownAction}
                  level={2}
                />
              );
            } else {
              return (
                <GroupRow
                  key={child.id}
                  item={child}
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
            }
          })}
        </div>
      )}
    </div>
  );
}
