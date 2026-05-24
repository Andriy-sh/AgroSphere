'use client';
import React from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
import { LogoutButton } from '../sign-out/sign-out';
import { sidebarFooterTextVariants } from './sidebar-variants';
import type { SidebarVariant } from './sidebar-variants';

interface SidebarFooterProps {
  variant?: SidebarVariant;
  isOpen: boolean;
}

export function SidebarFooter({ variant = 'dark', isOpen }: SidebarFooterProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-center gap-2">
        <Avatar
          row={{
            original: {
              client: {
                name: 'Robert',
                surname: 'Fox',
                avatarSrc: 'https://i.pravatar.cc/40?img=3',
              },
            },
          }}
          size="ssm"
          rounded="md"
          className="flex-none"
        />
        <div
          className={cn(
            'flex items-center justify-between w-full overflow-hidden min-w-0',
            !isOpen && 'hidden'
          )}
        >
          <span
            className={cn(
              'text-sm font-medium overflow-hidden whitespace-nowrap flex-1 text-ellipsis',
              sidebarFooterTextVariants({ variant })
            )}
          >
            Robert Fox
          </span>
          <LogoutButton iconSize={16} />
        </div>
      </div>
    </div>
  );
}

