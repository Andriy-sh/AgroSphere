'use client';

import React from 'react';
import { cn } from '@@agrosphere/shared';

interface StatsCardProps {
  title: string;
  value: string;
  valueColor?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  valueColor = 'text-basic-black',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-basic-gray-light rounded-lg p-4 flex flex-col',
        className
      )}
    >
      <h3 className="text-sm font-medium text-basic-black mb-2">{title}</h3>
      <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
    </div>
  );
}

