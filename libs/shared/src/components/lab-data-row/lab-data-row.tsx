'use client';
import React from 'react';
import { cn } from '../../utils/cn';

interface LabDataRowProps {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const LabDataRow: React.FC<LabDataRowProps> = ({
  icon,
  label,
  children,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon && (
        <span className="text-basic-gray w-5 h-5 flex-shrink-0">{icon}</span>
      )}
      <span className="text-sm text-basic-gray font-medium flex-shrink-0">
        {label}:
      </span>
      <span className="text-sm text-basic-black font-medium min-w-0 flex-1">
        {children}
      </span>
    </div>
  );
};
