import { ZoneRow } from '../zone-row/zone-row';
import { Icon } from '../icon';
import Checkbox from '../checkbox/checkbox';
import { ParcelPreview } from '../parcel-preview/parcel-preview';
import { DropdownActionsNoLib } from '../dropdownitems/dropdownitems';
import { isLastChild, ParcelItem } from '../../utils';

interface ParcelRowProps {
  item: ParcelItem;
  isSelected: boolean;
  isExpanded: boolean;
  isLast: boolean;
  expandedItems: Set<string>;
  selectedItems: string[];
  onSelect: (itemId: string, checked: boolean) => void;
  onToggleExpand: (itemId: string) => void;
  onDropdownAction: (action: string, itemId: string) => void;
  level?: number;
}

export function ParcelRow({
  item,
  isSelected,
  isExpanded,
  isLast,
  expandedItems,
  selectedItems,
  onSelect,
  onToggleExpand,
  onDropdownAction,
  level = 1,
}: ParcelRowProps) {
  const hasChildren = item.children && item.children.length > 0;

  const rowClasses = `
    flex items-center justify-between w-full py-1 px-6
     transition-colors bg-gray-25
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
            {item.geometry && item.geometry.length > 0 ? (
              <ParcelPreview geometry={item.geometry} />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <Icon icon="crop" size="xs" className="text-gray-400" />
              </div>
            )}
            <div className={infoClasses}>
              {item.item_id && (
                <span className="text-basic-gray text-sm">{item.item_id}</span>
              )}
              <span className="text-basic-black text-sm">{item.name}</span>
              <span className="text-basic-gray text-sm">{item.type}</span>
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
          <DropdownActionsNoLib
            items={[
              {
                id: 'view-details',
                label: 'View details',
                icon: 'visibility',
                onClick: () => onDropdownAction('view-details', item.id),
              },
              {
                id: 'create-management-zones',
                label: 'Create management zones',
                icon: 'border_style',
                children: [
                  {
                    id: 'manual',
                    label: 'Manual',
                    onClick: () =>
                      onDropdownAction(
                        'create-management-zones-manual',
                        item.id
                      ),
                  },
                  {
                    id: 'satellite',
                    label: 'Satellite',
                    onClick: () =>
                      onDropdownAction(
                        'create-management-zones-satellite',
                        item.id
                      ),
                  },
                ],
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
          {item.children.map((child, index) => (
            <ZoneRow
              key={child.id}
              item={child}
              isSelected={selectedItems.includes(child.id)}
              isLast={isLastChild(item, index)}
              onSelect={onSelect}
              onDropdownAction={onDropdownAction}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
