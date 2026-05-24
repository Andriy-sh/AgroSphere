'use client';
import React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../badge/badge';
import { Icon } from '../icon';
import { useNotificationStore } from '../../stores/use-notification-store';
import { sidebarItemVariants, iconVariants } from './sidebar-variants';
import { getUnreadCount } from '../../mock/mock-notifications';
import { mockNotificationGroups } from '../../mock/mock-notifications';
import type { SidebarVariant } from './sidebar-variants';

interface SidebarNotificationsProps {
  variant?: SidebarVariant;
  isOpen: boolean;
  showNotificationBadge: boolean;
}

export function SidebarNotifications({
  variant = 'dark',
  isOpen,
  showNotificationBadge,
}: SidebarNotificationsProps) {
  const { isOpen: isNotificationsOpen, open: openNotifications } =
    useNotificationStore();

  const unreadCount = getUnreadCount();

  return (
    <div
      className={cn(
        'flex items-center px-2 py-2 rounded-md transition-colors duration-200 cursor-pointer',
        isOpen && showNotificationBadge ? 'flex-row' : 'flex-col items-center',
        sidebarItemVariants({
          variant,
          active: isNotificationsOpen,
        })
      )}
      onClick={openNotifications}
    >
      <div className="flex-none w-5 h-5 flex items-center justify-center relative">
        <Icon
          icon="notifications"
          className={cn(
            iconVariants({ variant }),
            !isOpen && !showNotificationBadge && 'text-basic-gray'
          )}
        />
        {unreadCount > 0 && (
          <div
            className={cn(
              'absolute -top-1 -right-1',
              isOpen && showNotificationBadge && 'hidden'
            )}
          >
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        )}
      </div>
      <span
        className={cn(
          'text-sm font-medium overflow-hidden whitespace-nowrap flex-1 text-ellipsis',
          (!isOpen || !showNotificationBadge) && 'hidden'
        )}
      >
        Notifications
      </span>
      {unreadCount > 0 && isOpen && showNotificationBadge && (
        <div className="ml-auto flex-none">
          <Badge variant="notification" size="xs">
            {unreadCount}
          </Badge>
        </div>
      )}
    </div>
  );
}
