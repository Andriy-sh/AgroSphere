import { NotificationGroup } from '../components/notifications/notifications';

export const mockNotificationGroups: NotificationGroup[] = [
  {
    title: 'Today',
    notifications: [
      {
        id: '1',
        user: {
          name: 'James Nolan',
          avatarInitials: 'JN',
        },
        type: 'task_assigned',
        message: 'assigned you a new task',
        timestamp: new Date('2025-01-23T14:30:00'),
        isRead: false,
        isCompleted: false,
        taskTitle: 'Soil sampling - Field A',
      },
      {
        id: '2',
        user: {
          name: 'Alice Murphy',
          avatarInitials: 'AM',
        },
        type: 'documents_uploaded',
        message: 'uploaded documents',
        timestamp: new Date('2025-01-23T13:15:00'),
        isRead: false,
        isCompleted: true,
        documentName: 'soil_analysis_report.pdf',
      },
      {
        id: '3',
        user: {
          name: 'Diana Mills',
          avatarSrc:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        },
        type: 'comment_left',
        message: 'left a comment on your task',
        timestamp: new Date('2025-01-23T12:45:00'),
        isRead: true,
        isCompleted: false,
      },
      {
        id: '4',
        user: {
          name: 'Mike Johnson',
          avatarInitials: 'MJ',
        },
        type: 'task_status_changed',
        message: 'updated task status',
        timestamp: new Date('2025-01-23T11:20:00'),
        isRead: true,
        isCompleted: true,
        statusText: 'In progress',
      },
      {
        id: '5',
        user: {
          name: 'Sarah Wilson',
          avatarInitials: 'SW',
        },
        type: 'task_assigned',
        message: 'assigned you a new task',
        timestamp: new Date('2025-01-23T10:00:00'),
        isRead: false,
        isCompleted: false,
        taskTitle: 'Water quality testing',
      },
      {
        id: '6',
        user: {
          name: 'Alice Murphy',
          avatarSrc: '/path/to/avatar.jpg',
        },
        type: 'task_created',
        message: 'created a new task',
        timestamp: new Date('2025-07-05T09:12:00'),
        isRead: false,
        isCompleted: false,
        taskCreatedData: {
          taskTitle: 'Soil sampling',
          location: 'Field 3 at Homefarm',
        },
      },
      {
        id: '7',
        user: {
          name: 'Bob Wilson',
          avatarInitials: 'BW',
        },
        type: 'task_assigned',
        message: 'assigned you a new task',
        timestamp: new Date('2025-07-05T10:30:00'),
        isRead: false,
        isCompleted: false,
        taskAssignedData: {
          taskTitle: 'Water quality testing',
        },
      },
    ],
  },
  {
    title: 'Yesterday',
    notifications: [
      {
        id: '6',
        user: {
          name: 'Robert Chen',
          avatarInitials: 'RC',
        },
        type: 'documents_uploaded',
        message: 'uploaded documents',
        timestamp: new Date('2025-01-22T16:30:00'),
        isRead: false,
        isCompleted: true,
        documentName: 'water_test_results.pdf',
      },
      {
        id: '7',
        user: {
          name: 'Emma Davis',
          avatarInitials: 'ED',
        },
        type: 'task_status_changed',
        message: 'updated task status',
        timestamp: new Date('2025-01-22T15:15:00'),
        isRead: true,
        isCompleted: true,
        statusText: 'Completed',
      },
      {
        id: '8',
        user: {
          name: 'Tom Anderson',
          avatarInitials: 'TA',
        },
        type: 'comment_left',
        message: 'left a comment on your task',
        timestamp: new Date('2025-01-22T14:00:00'),
        isRead: true,
        isCompleted: false,
      },
      {
        id: '9',
        user: {
          name: 'Lisa Brown',
          avatarSrc:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        },
        type: 'task_assigned',
        message: 'assigned you a new task',
        timestamp: new Date('2025-01-22T12:30:00'),
        isRead: true,
        isCompleted: false,
        taskTitle: 'Crop monitoring - Field B',
      },
    ],
  },
  {
    title: 'Last 7 days',
    notifications: [
      {
        id: '10',
        user: {
          name: 'David Wilson',
          avatarInitials: 'DW',
        },
        type: 'documents_uploaded',
        message: 'uploaded documents',
        timestamp: new Date('2025-01-20T10:15:00'),
        isRead: true,
        isCompleted: true,
        documentName: 'crop_analysis.pdf',
      },
      {
        id: '11',
        user: {
          name: 'Jennifer Lee',
          avatarInitials: 'JL',
        },
        type: 'task_status_changed',
        message: 'updated task status',
        timestamp: new Date('2025-01-19T16:45:00'),
        isRead: true,
        isCompleted: false,
        statusText: 'Not started',
      },
      {
        id: '12',
        user: {
          name: 'Chris Martinez',
          avatarSrc:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        },
        type: 'comment_left',
        message: 'left a comment on your task',
        timestamp: new Date('2025-01-18T09:30:00'),
        isRead: true,
        isCompleted: true,
      },
      {
        id: '13',
        user: {
          name: 'Maria Garcia',
          avatarInitials: 'MG',
        },
        type: 'task_assigned',
        message: 'assigned you a new task',
        timestamp: new Date('2025-01-17T14:20:00'),
        isRead: true,
        isCompleted: false,
        taskTitle: 'Equipment maintenance',
      },
      {
        id: '14',
        user: {
          name: 'Alex Thompson',
          avatarInitials: 'AT',
        },
        type: 'documents_uploaded',
        message: 'uploaded documents',
        timestamp: new Date('2025-01-16T11:00:00'),
        isRead: true,
        isCompleted: true,
        documentName: 'maintenance_log.pdf',
      },
    ],
  },
  {
    title: 'Older',
    notifications: [
      {
        id: '15',
        user: {
          name: 'Rachel Green',
          avatarInitials: 'RG',
        },
        type: 'task_status_changed',
        message: 'updated task status',
        timestamp: new Date('2025-01-15T13:45:00'),
        isRead: true,
        isCompleted: true,
        statusText: 'Completed',
      },
      {
        id: '16',
        user: {
          name: "Kevin O'Brien",
          avatarSrc:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        },
        type: 'comment_left',
        message: 'left a comment on your task',
        timestamp: new Date('2025-01-14T08:15:00'),
        isRead: true,
        isCompleted: false,
      },
      {
        id: '17',
        user: {
          name: 'Sophie Turner',
          avatarInitials: 'ST',
        },
        type: 'task_assigned',
        message: 'assigned you a new task',
        timestamp: new Date('2025-01-13T15:30:00'),
        isRead: true,
        isCompleted: true,
        taskTitle: 'Harvest planning',
      },
      {
        id: '18',
        user: {
          name: 'Michael Scott',
          avatarInitials: 'MS',
        },
        type: 'documents_uploaded',
        message: 'uploaded documents',
        timestamp: new Date('2025-01-12T12:00:00'),
        isRead: true,
        isCompleted: false,
        documentName: 'harvest_schedule.pdf',
      },
    ],
  },
];

export const getUnreadCount = (): number => {
  return mockNotificationGroups.reduce((total, group) => {
    return (
      total +
      group.notifications.filter((notification) => !notification.isRead).length
    );
  }, 0);
};

export const markAllAsRead = (): void => {
  mockNotificationGroups.forEach((group) => {
    group.notifications.forEach((notification) => {
      notification.isRead = true;
    });
  });
};

export const markAsRead = (notificationId: string): void => {
  mockNotificationGroups.forEach((group) => {
    const notification = group.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.isRead = true;
    }
  });
};
