'use client';

import React from 'react';
import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-5 w-10',
    lg: 'h-7 w-14',
  };

  const thumbSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const thumbTranslateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-1',
    md: checked ? 'translate-x-[22px]' : 'translate-x-[2px]',
    lg: checked ? 'translate-x-7' : 'translate-x-1',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex items-center rounded-full  transition-all duration-300',
        checked ? 'bg-basic-green' : 'bg-basic-white',
        disabled && 'opacity-50 cursor-not-allowed',
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          'inline-block transform rounded-full bg-white transition-transform',
          thumbSizeClasses[size],
          thumbTranslateClasses[size]
        )}
      />
    </button>
  );
};
