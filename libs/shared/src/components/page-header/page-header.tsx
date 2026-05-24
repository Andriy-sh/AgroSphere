'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../icon';

interface PageHeaderProps {
  icon: string;
  title: string;
  iconColor?: string;
  titleColor?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export function PageHeader({
  icon,
  title,
  iconColor = '',
  titleColor = '',
  className = '',
  iconClassName = '',
  titleClassName = '',
}: PageHeaderProps) {
  return (
    <h1
      className={cn(
        'text-[28px] font-bold flex items-center gap-2 text-basic-black',
        titleColor,
        titleClassName,
        className
      )}
    >
      <Icon
        icon={icon}
        className={cn('text-[32px] text-basic-green', iconClassName)}
      />
      {title}
    </h1>
  );
}
