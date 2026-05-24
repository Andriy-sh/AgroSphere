'use client';

import * as React from 'react';
import { PageHeader } from '../page-header/page-header';

interface SettingsTabHeaderProps {
  icon: string;
  title: string;
  className?: string;
}

export function SettingsTabHeader({
  icon,
  title,
  className = '',
}: SettingsTabHeaderProps) {
  return (
    <div className={`flex items-center mb-3 gap-3 ${className}`}>
      <PageHeader
        icon={icon}
        title={title}
        iconColor="text-basic-green"
        titleColor="text-basic-black"
        titleClassName="font-semibold"
      />
    </div>
  );
}
