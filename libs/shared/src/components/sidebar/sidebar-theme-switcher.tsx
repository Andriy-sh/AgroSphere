'use client';
import React from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../icon';
import { ThemeSwitcher } from '../themeswitcher/themeswitcher';
import { sidebarItemVariants, iconVariants, sidebarTextVariants } from './sidebar-variants';
import type { SidebarVariant } from './sidebar-variants';

const THEMES: Array<{
  key: SidebarVariant;
  label: string;
  bgColor: string;
  textColor: string;
}> = [
  {
    key: 'dark',
    label: 'Dark',
    bgColor: 'bg-basic-black',
    textColor: 'text-white',
  },
  {
    key: 'light',
    label: 'Light',
    bgColor: 'bg-white',
    textColor: 'text-basic-black',
  },
  {
    key: 'green',
    label: 'Green',
    bgColor: 'bg-[#004E3A]',
    textColor: 'text-white',
  },
  {
    key: 'basic-white',
    label: 'White',
    bgColor: 'bg-basic-white',
    textColor: 'text-basic-black',
  },
  {
    key: 'light-gray',
    label: 'Gray',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-800',
  },
];

interface SidebarThemeSwitcherProps {
  variant: SidebarVariant;
  onVariantChange: (variant: SidebarVariant) => void;
  isOpen: boolean;
  showNotificationBadge: boolean;
}

export function SidebarThemeSwitcher({
  variant,
  onVariantChange,
  isOpen,
  showNotificationBadge,
}: SidebarThemeSwitcherProps) {
  return (
    <>
      <div
        className={cn(
          'flex gap-1 mb-2',
          !isOpen ? 'flex-col items-center' : 'flex-wrap'
        )}
      >
        {THEMES.map(({ key, label, bgColor, textColor }) => (
          <button
            key={key}
            onClick={() => onVariantChange(key)}
            className={cn(
              'px-2 py-1 rounded text-xs font-medium transition-all duration-200 border',
              variant === key
                ? `${bgColor} ${textColor} border-current shadow-sm`
                : cn(
                    'bg-transparent border-gray-300 hover:bg-gray-100',
                    variant === 'dark' &&
                      'text-gray-300 border-gray-600 hover:bg-gray-700',
                    variant === 'light' &&
                      'text-gray-600 border-gray-300 hover:bg-gray-100',
                    variant === 'green' &&
                      'text-gray-300 border-gray-500 hover:bg-[#003d2e]',
                    variant === 'basic-white' &&
                      'text-gray-600 border-gray-300 hover:bg-gray-50',
                    variant === 'light-gray' &&
                      'text-gray-600 border-gray-400 hover:bg-gray-300'
                  )
            )}
            title={`Switch to ${label} variant`}
          >
            {isOpen ? label : key.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'flex items-center px-2 py-2 rounded-md transition-colors duration-200',
          isOpen && showNotificationBadge
            ? 'flex-row'
            : 'flex-col items-center gap-1 pt-2 pb-2'
        )}
      >
        <div className="flex-none w-5 h-5 flex items-center justify-center">
          <Icon icon="dark_mode" className={iconVariants({ variant })} />
        </div>
        <span
          className={cn(
            'ml-2 text-sm font-medium overflow-hidden whitespace-nowrap flex-1 text-ellipsis',
            (!isOpen || !showNotificationBadge) && 'hidden',
            sidebarTextVariants({ variant })
          )}
        >
          Dark mode
        </span>
        <div
          className={cn(
            'ml-auto flex-none',
            (!isOpen || !showNotificationBadge) && 'ml-0'
          )}
        >
          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
}

