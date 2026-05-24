import React from 'react';
import { ZoneItem } from '../../utils';
import { Icon } from '../icon';
import Checkbox from '../checkbox/checkbox';

interface ZoneRowProps {
  item: ZoneItem;
  isSelected: boolean;
  isLast: boolean;
  onSelect: (itemId: string, checked: boolean) => void;
  onDropdownAction: (action: string, itemId: string) => void;
  level?: number;
}

export function ZoneRow({
  item,
  isSelected,
  isLast,
  onSelect,
  onDropdownAction,
  level = 3,
}: ZoneRowProps) {
  const rowClasses = `
    flex items-center justify-between w-full py-1 px-6
    transition-colors bg-white
    ${isLast ? 'border-b border-gray-50' : ''}
  `; 

  const contentClasses = 'flex items-center gap-2';
  const infoClasses = 'flex items-center space-x-2';

  return (
    <div className="w-full">
      <div
        className={rowClasses}
        style={{ paddingLeft: `${29 + (level - 1) * 52}px` }}
      >
        <div className={contentClasses}>
          <Icon icon="drag_handle" size="sm" className="text-gray-300" />

          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          />

          <div className={contentClasses}>
            <div className={infoClasses}>
              <span className="text-basic-black text-sm">{item.name}</span>
              <span className="text-basic-gray text-sm">{item.area.toFixed(2)} ha</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className="material-symbols-outlined text-[20px] text-gray-600 hover:text-red-500 cursor-pointer transition-colors"
            onClick={() => onDropdownAction('delete', item.id)}
          >
            delete
          </span>
        </div>
      </div>
    </div>
  );
}
