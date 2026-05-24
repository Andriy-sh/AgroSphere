'use client';
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '../button/button';
import { Badge } from '../badge/badge';
import { NotificationsDialog } from './notifications-dialog';
import { NotificationList } from './notification-list';
import { CustomScrollbar } from '../custom-scrollbar/custom-scrollbar';
import { cn } from '../../utils/cn';

export type NotificationUser = {
  name: string;
  avatarSrc?: string;
  avatarInitials?: string;
};

export type NotificationType =
  | 'task_created'
  | 'task_assigned'
  | 'task_status_changed'
  | 'documents_uploaded'
  | 'client_updated'
  | 'comment_left';

export type Notification = {
  id: string;
  user: NotificationUser;
  type: NotificationType;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isCompleted?: boolean;
  taskTitle?: string;
  documentName?: string;
  statusText?: string;
  taskAssignedData?: {
    taskTitle: string;
  };
  taskCreatedData?: {
    taskTitle: string;
    location: string;
  };
};

export type NotificationGroup = {
  title: string;
  notifications: Notification[];
};

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notificationGroups: NotificationGroup[];
  unreadCount: number;
  onMarkAllAsRead?: () => void;
  onMarkAsRead?: (notificationId: string) => void;
  sidebarWidth: number;
  className?: string;
}

export const Notifications: React.FC<NotificationsProps> = ({
  isOpen,
  onClose,
  notificationGroups,
  unreadCount,
  onMarkAllAsRead,
  onMarkAsRead,
  sidebarWidth,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredGroups =
    activeTab === 'unread'
      ? notificationGroups
          .map((group) => ({
            ...group,
            notifications: group.notifications.filter((n) => !n.isRead),
          }))
          .filter((group) => group.notifications.length > 0)
      : notificationGroups;

  return (
    <NotificationsDialog
      isOpen={isOpen}
      onClose={onClose}
      sidebarWidth={sidebarWidth}
      className={className}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-basic-border-gray flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-basic-green" />
            <h2 className="text-xl font-semibold text-basic-black">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-basic-gray hover:text-basic-black duration-300 transition-all "
            >
              <span className="material-symbols-outlined">done_all</span>
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-basic-gray hover:text-basic-gray/60"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex p-2 bg-gray-100 rounded-lg mx-4 my-4 relative flex-shrink-0">
          <div
            className={cn(
              'absolute top-2 bottom-2 bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out',
              activeTab === 'all'
                ? 'left-2 w-[calc(50%-4px)]'
                : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
            )}
          />

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex-1 relative z-10 transition-all duration-300 ease-in-out !focus:ring-basic-green',
              activeTab === 'all'
                ? 'text-basic-black font-medium'
                : 'text-basic-gray hover:text-basic-gray/80'
            )}
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex-1 flex items-center justify-center gap-2 relative z-10 transition-all duration-300 ease-in-out',
              activeTab === 'unread'
                ? 'text-basic-black font-medium'
                : 'text-basic-gray hover:text-basic-gray/80'
            )}
            onClick={() => setActiveTab('unread')}
          >
            Unread
            {unreadCount > 0 && (
              <Badge
                variant="notification"
                size="xs"
                className={cn(
                  'transition-all duration-300 ease-in-out animate-scale-in',
                  activeTab === 'unread'
                    ? 'bg-basic-green text-white scale-110'
                    : 'bg-gray-200 text-gray-600'
                )}
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex-1 min-h-0">
          <CustomScrollbar className="h-full">
            <div className="  h-full px-4 pb-4">
              {filteredGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-basic-gray animate-fade-in">
                  <img
                    src="/notification-error.svg"
                    alt="No notifications"
                    className="w-48 h-48 mb-4 opacity-60 animate-bounce-slow"
                  />
                  <p className="text-lg font-medium text-basic-black animate-slide-up text-center">
                    No notifications
                  </p>
                  <p className="text-sm text-basic-black animate-slide-up-delayed text-center">
                    {activeTab === 'unread'
                      ? 'All notifications are read'
                      : "You're all caught up"}
                  </p>
                </div>
              ) : (
                <NotificationList
                  notificationGroups={filteredGroups}
                  onMarkAsRead={onMarkAsRead}
                  showCompletionStatus={false}
                />
              )}
            </div>
          </CustomScrollbar>
        </div>
      </div>
    </NotificationsDialog>
  );
};
