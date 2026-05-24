'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@@agrosphere/shared';
import { SplitCard } from '@@agrosphere/shared';
import { ActivityItem } from '@@agrosphere/shared';
import { Activity } from '@@agrosphere/shared';
import { useNotificationStore } from '@@agrosphere/shared';

interface NotificationBarProps {
  className?: string;
  activities?: Activity[];
  onViewAllNotifications?: () => void;
  onNotificationClick?: (activityId: string) => void;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'James Nolan',
      avatarInitials: 'JN',
    },
    timestamp: new Date('2025-07-07T12:42:00'),
    type: 'task_status_changed',
    taskStatusChangedData: {
      statusText: 'updated client contact details',
    },
  },
  {
    id: '2',
    user: {
      name: 'Alice Murphy',
      avatarInitials: 'AM',
    },
    timestamp: new Date('2025-07-05T10:00:00'),
    type: 'task_created',
    taskCreatedData: {
      taskTitle: 'Soil sampling',
      location: 'assigned task',
    },
  },
  {
    id: '3',
    user: {
      name: 'Diana Mills',
      avatarInitials: 'DM',
      avatarSrc:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    },
    timestamp: new Date('2025-07-05T11:40:00'),
    type: 'documents_uploaded',
    documentsUploadedData: {
      documentName: 'PDF Document 1.pdf',
      documentType: 'pdf',
    },
  },
];

export const NotificationBar: React.FC<NotificationBarProps> = ({
  className,
  activities = [],
  onViewAllNotifications,
  onNotificationClick,
}) => {
  const { open: openNotifications } = useNotificationStore();
  const displayedActivities = activities.length ? activities : mockActivities;

  const handleViewAllNotifications = () => {
    if (onViewAllNotifications) {
      onViewAllNotifications();
    } else {
      openNotifications();
    }
  };

  return (
    <SplitCard
      className={cn('max-h-[370px] text-basic-black', className)}
      topContent={
        <div>
          <h2 className="text-base font-semibold text-basic-black">
            Notification bar
          </h2>
        </div>
      }
      bottomContent={
        <div>
          <div className="space-y-0">
            {displayedActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className={index === 0 ? '' : 'pt-4'}>
                  <ActivityItem
                    activity={activity}
                    isLast={index === displayedActivities.length - 1}
                    showConnectingLine={false}
                    showSeparator={false}
                    showUnreadIndicator={false}
                    showCompletionStatus={false}
                  />
                </div>
                {index < displayedActivities.length - 1 && (
                  <div className="h-px bg-basic-white" />
                )}
              </div>
            ))}

            <div className="h-px bg-basic-white" />
          </div>

          <div className="pt-4">
            <button
              onClick={handleViewAllNotifications}
              className="flex items-center gap-1 text-basic-green hover:text-basic-green/90 transition-colors text-sm font-medium"
            >
              <span>View all notifications</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      }
    />
  );
};
