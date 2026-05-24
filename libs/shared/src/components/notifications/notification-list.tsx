import React from 'react';
import { NotificationGroup } from './notifications';
import { ActivityItem } from '../activity-log/activity-log';

interface NotificationListProps {
  notificationGroups: NotificationGroup[];
  onMarkAsRead?: (notificationId: string) => void;
  showCompletionStatus?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notificationGroups,
  onMarkAsRead,
  showCompletionStatus = false,
}) => {
  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const convertNotificationToActivity = (notification: any) => {
    return {
      id: notification.id,
      user: {
        name: notification.user.name,
        avatarSrc: notification.user.avatarSrc,
        avatarInitials: notification.user.name.charAt(0),
      },
      timestamp: notification.timestamp,
      isRead: notification.isRead,
      isCompleted: notification.isCompleted,
      type: notification.type,
      taskCreatedData:
        notification.type === 'task_created'
          ? {
              taskTitle:
                notification.taskCreatedData?.taskTitle ||
                notification.taskTitle,
              location:
                notification.taskCreatedData?.location || 'Task Management',
            }
          : undefined,
      taskAssignedData:
        notification.type === 'task_assigned'
          ? {
              taskTitle:
                notification.taskAssignedData?.taskTitle ||
                notification.taskTitle,
            }
          : undefined,
      taskStatusChangedData:
        notification.type === 'task_status_changed'
          ? {
              statusText: notification.statusText,
            }
          : undefined,
      documentsUploadedData:
        notification.type === 'documents_uploaded'
          ? {
              documentName: notification.documentName,
              documentType: 'Document',
            }
          : undefined,
      commentLeftData:
        notification.type === 'comment_left'
          ? {
              commentText: 'Left a comment on your task',
            }
          : undefined,
    };
  };

  if (notificationGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 text-gray-400">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notificationGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div className="relative flex items-center">
            <div className="flex-1 h-px bg-gray-200"></div>

            <div className="px-3 mx-2">
              <span className="bg-white px-2 text-xs text-gray-500 uppercase tracking-wide font-medium">
                {group.title}
              </span>
            </div>

            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div >
            {group.notifications.map((notification, notificationIndex) => {
              const isLast =
                notificationIndex === group.notifications.length - 1;
              const activity = convertNotificationToActivity(notification);

              return (
                <div
                  key={notification.id}
                  className="cursor-pointer"
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.isRead
                    )
                  }
                >
                  <ActivityItem
                    activity={activity}
                    isLast={isLast}
                    showConnectingLine={false}
                    showSeparator={true}
                    showUnreadIndicator={true}
                    showCompletionStatus={showCompletionStatus}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
