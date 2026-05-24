'use client';
import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Icon } from '../icon';
import { sidebarItemVariants } from './sidebar-variants';
import type { SidebarVariant } from './sidebar-variants';

const SIDEBAR_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  'file-text': FileText,
};

interface SidebarItemProps {
  icon: string;
  label: string;
  isOpen: boolean;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: SidebarVariant;
}

export function SidebarItem({
  icon,
  label,
  isOpen,
  active,
  children,
  className,
  href,
  onClick,
  variant = 'dark',
}: SidebarItemProps) {
  const IconComponent = SIDEBAR_ICONS[icon];

  const iconElement = IconComponent ? (
    <IconComponent size={18} />
  ) : (
    <Icon icon={icon} />
  );

  const itemContent = (
    <>
      <div className="flex-none w-5 h-5 flex items-center justify-center">
        {iconElement}
      </div>
      <span
        className={cn(
          'ml-2 text-sm font-medium overflow-hidden whitespace-nowrap flex-1 text-ellipsis',
          !isOpen && 'hidden'
        )}
      >
        {label}
      </span>
      {children && <div className="ml-auto flex-none">{children}</div>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          sidebarItemVariants({ variant, active: !!active }),
          className
        )}
      >
        {itemContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        sidebarItemVariants({ variant, active: !!active }),
        className
      )}
    >
      {itemContent}
    </button>
  );
}

