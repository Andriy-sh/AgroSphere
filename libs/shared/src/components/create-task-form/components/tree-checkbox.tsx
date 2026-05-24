import React from 'react';
import { FieldZone } from '../types';
import { StyledCheckbox } from './styled-checkbox';

interface TreeCheckboxProps {
  node: FieldZone;
  checked: boolean;
  onToggle: (value: string, parentValue?: string) => void;
  expanded: boolean;
  onExpand: (value: string) => void;
  selectedFarms: Record<string, string[]>;
  parentId: string;
  parentValue?: string;
  disabled?: boolean;
}

export const TreeCheckbox: React.FC<TreeCheckboxProps> = ({
  node,
  checked,
  onToggle,
  expanded,
  onExpand,
  selectedFarms,
  parentId,
  parentValue,
  disabled,
}) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 py-1 mb-1 pb-1">
        {hasChildren && (
          <button
            className="focus:outline-none"
            onClick={() => onExpand(node.value)}
            type="button"
            disabled={disabled}
          >
            <span
              className={`material-symbols-outlined w-6 h-6 transition-transform duration-300 ease-in-out ${
                expanded ? 'rotate-90' : ''
              }`}
            >
              arrow_right
            </span>
          </button>
        )}
        <StyledCheckbox
          checked={checked}
          onCheckedChange={(isChecked) => {
            if (isChecked !== checked) {
              onToggle(node.value, parentValue);
            }
          }}
          disabled={disabled}
        />
        <span className="font-medium text-sm">{node.label}</span>
        {node.area !== undefined && (
          <span className="text-basic-gray font-medium text-sm">
            {node.area} ha
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="pl-16 my-2">
          {node.children!.map((child, idx, arr) => (
            <div
              key={child.value}
              className={
                'mb-1  ' +
                (idx === arr.length - 1 ? 'last:border-b-0' : '') +
                ' pb-1'
              }
            >
              <TreeCheckbox
                node={child}
                checked={
                  selectedFarms[parentId]?.includes(child.value) || false
                }
                onToggle={onToggle}
                expanded={false}
                onExpand={onExpand}
                selectedFarms={selectedFarms}
                parentId={parentId}
                parentValue={node.value}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
