import React from 'react';
import { cn } from '../../utils/cn';

interface TaskInfoRowProps {
  label: string;
  icon?: React.ReactNode;
  value?: string | number;
  children?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  iconContainerClassName?: string;
  valueContainerClassName?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const TaskInfoRow: React.FC<TaskInfoRowProps> = ({
  label,
  icon,
  value,
  children,
  className,
  labelClassName,
  iconContainerClassName,
  valueContainerClassName,
  containerProps,
}) => {
  return (
    <div
      className={cn('flex items-center gap-4 ', className)}
      {...containerProps}
    >
      <div className="flex-shrink-0 w-32 flex items-center gap-2">
        <span
          className={cn('flex-shrink-0 text-gray-400', iconContainerClassName)}
        >
          {icon}
        </span>
        <span
          className={cn(
            'font-sans font-medium whitespace-nowrap text-basic-gray text-sm',
            labelClassName
          )}
        >
          {label}:
        </span>
      </div>

      <div
        className={cn(
          'flex-grow font-sans text-gray-800 text-sm ',
          valueContainerClassName
        )}
      >
        {children || value}
      </div>
    </div>
  );
};
