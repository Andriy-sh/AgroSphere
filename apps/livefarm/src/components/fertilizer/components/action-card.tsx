'use client';

import React from 'react';
import { Button, cn } from '@@agrosphere/shared';

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  title,
  subtitle,
  icon,
  iconColor,
  bgColor,
  onClick,
  className,
}: ActionCardProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        'flex flex-col items-start p-4 rounded-lg transition-all hover:shadow-md cursor-pointer w-full h-auto',
        bgColor,
        className
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <span
          className="material-symbols-outlined text-3xl"
          style={{ color: iconColor }}
        >
          {icon}
        </span>
        <div className="flex flex-col items-start flex-1">
          <h3 className="text-base font-semibold" style={{ color: iconColor }}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
    </Button>
  );
}
