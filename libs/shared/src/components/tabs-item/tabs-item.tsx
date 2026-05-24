'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

interface TabItemProps extends React.ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  indicatorClassName?: string;
}

export const TabItem: React.FC<TabItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  className,
  iconClassName,
  labelClassName,
  indicatorClassName,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-2 py-3 px-4',
        'font-sans text-gray-800 text-sm font-medium',
        'bg-white cursor-pointer select-none',
        'transition-colors duration-200',
        isActive && 'text-basic-black',
        'flex-shrink-0', 
        className
      )}
      role="tab"
      aria-selected={isActive}
      {...props}
    >
      <span
        className={cn(
          'material-symbols-outlined text-[20px]',
          'flex items-center justify-center flex-shrink-0',
          iconClassName
        )}
      >
        {icon}
      </span>

      <span
        className={cn(
          'flex-grow', 
          'min-w-0', 
          'overflow-hidden',
          'text-ellipsis',
          'whitespace-nowrap',
          labelClassName
        )}
      >
        {label}
      </span>

      <div
        className={cn(
          'absolute bottom-0 left-0 h-1 w-full',
          'bg-green-500',
          'transition-transform duration-300 ease-out',
          isActive ? 'scale-x-100' : 'scale-x-0',
          indicatorClassName
        )}
      />
    </button>
  );
};
