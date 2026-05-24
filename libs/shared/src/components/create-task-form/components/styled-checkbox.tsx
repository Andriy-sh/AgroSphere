import React from 'react';
import { Checkbox } from '../../checkbox/checkbox';

interface StyledCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled,
}) => (
  <Checkbox
    checked={checked}
    onCheckedChange={onCheckedChange}
    className="w-4 h-4 rounded-sm"
    disabled={disabled}
  />
);
