import React from 'react';
import { Icon } from '../icon';

interface SelectionBarProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onMoveTo?: () => void;
  onDelete?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  canGroup?: boolean;
  canUngroup?: boolean;
}

interface ActionButton {
  id: string;
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const CustomCheckbox = ({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => {
  return (
    <label className="relative flex items-center justify-center text-center w-4 h-4 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="rounded-[4px] peer appearance-none w-4 h-4 border border-basic-gray-light bg-white cursor-pointer transition-colors checked:bg-black checked:border-black disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <span className="pointer-events-none absolute left-1 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-all peer-checked:opacity-100"></span>
    </label>
  );
};

export function SelectionBar({
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onClearSelection,
  onMoveTo,
  onDelete,
  onGroup,
  onUngroup,
  canGroup = false,
  canUngroup = false,
}: SelectionBarProps) {
  const actionButtons: ActionButton[] = [
    {
      id: 'move-to',
      icon: 'arrow_top_right',
      label: 'Move to',
      onClick: onMoveTo,
      disabled: !onMoveTo,
      className: !onMoveTo ? 'text-basic-gray' : '',
    },
    {
      id: 'group',
      icon: 'stack',
      label: 'Group',
      onClick: onGroup,
      disabled: !canGroup,
      className: !canGroup ? 'text-basic-gray' : '',
    },
    {
      id: 'ungroup',
      icon: 'stack_off',
      label: 'Ungroup',
      onClick: onUngroup,
      disabled: !canUngroup,
      className: !canUngroup ? 'text-basic-gray' : '',
    },
  ];

  const renderActionButton = (button: ActionButton) => (
    <button
      key={button.id}
      onClick={button.onClick}
      className={`flex items-center gap-1 ${button.className || ''}`}
      disabled={button.disabled}
    >
      <Icon icon={button.icon} />
      <span className="text-sm">{button.label}</span>
    </button>
  );

  const renderSeparator = () => (
    <div className="w-px h-4 bg-basic-gray-light" />
  );

  return (
    <div className="bg-basic-white p-2.5 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CustomCheckbox
            checked={selectedCount > 0}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm text-basic-gray">
            {selectedCount} of {totalCount} Selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actionButtons.map((button, index) => (
            <React.Fragment key={button.id}>
              {renderActionButton(button)}
              {index < actionButtons.length - 1 && renderSeparator()}
            </React.Fragment>
          ))}

          {onDelete && (
            <>
              {renderSeparator()}
              <Icon disabled={!onDelete} onClick={onDelete} icon="delete" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
