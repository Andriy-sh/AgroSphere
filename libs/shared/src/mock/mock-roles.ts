export interface Permission {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface Role {
  id: string;
  title: string;
  description: string;
  assignedUsers: Array<{
    id: string;
    initials: string;
    name?: string;
    avatarSrc?: string;
  }>;
  permissions: Permission[];
}

export const mockRoles: Role[] = [
  {
    id: '1',
    title: 'Administrator',
    description:
      'Full access to the entire system, including user management, role assignments, company settings, and integrations.',
    assignedUsers: [
      {
        id: '1',
        initials: 'TJ',
        name: 'Tom Johnson',
        avatarSrc:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
      { id: '2', initials: 'AS', name: 'Alice Smith' },
      {
        id: '3',
        initials: 'KW',
        name: 'Kate Wilson',
        avatarSrc:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      { id: '4', initials: 'CB', name: 'Chris Brown' },
    ],
    permissions: [
      {
        id: 'user-management',
        title: 'User management',
        description: 'Can add, edit, and remove users within the organisation',
        enabled: true,
      },
      {
        id: 'company-settings',
        title: 'Company settings',
        description:
          'Can modify company profile and system-wide configurations',
        enabled: true,
      },
      {
        id: 'task-management',
        title: 'Task management',
        description: 'Can create, assign, and manage all tasks and projects',
        enabled: true,
      },
      {
        id: 'farm-mapping',
        title: 'Farm mapping',
        description: 'Can access and modify farm boundaries and field data',
        enabled: true,
      },
      {
        id: 'soil-sample-collection',
        title: 'Soil sample collection',
        description: 'Can manage soil sampling schedules and results',
        enabled: true,
      },
      {
        id: 'connection-requests',
        title: 'Connection requests',
        description:
          'Can approve or reject connection requests from contractors',
        enabled: true,
      },
      {
        id: 'reporting-analytics',
        title: 'Reporting & Analytics',
        description: 'Can access all reports and analytics data',
        enabled: true,
      },
      {
        id: 'notifications-configuration',
        title: 'Notifications configuration',
        description: 'Can configure system-wide notification settings',
        enabled: true,
      },
      {
        id: 'subscription-billing',
        title: 'Subscription & Billing',
        description: 'Can manage subscription plans and billing information',
        enabled: true,
      },
    ],
  },
  {
    id: '2',
    title: 'Field advisor',
    description:
      'Access to contractor, order, and farmer information. Can create tasks and view reports but cannot change company settings.',
    assignedUsers: [
      {
        id: '5',
        initials: 'AD',
        name: 'Alex Davis',
        avatarSrc:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      { id: '6', initials: 'DW', name: 'David Wilson' },
      {
        id: '7',
        initials: 'KB',
        name: 'Kelly Brown',
        avatarSrc:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
    permissions: [
      {
        id: 'user-management',
        title: 'User management',
        description: 'Can add, edit, and remove users within the organisation',
        enabled: false,
      },
      {
        id: 'company-settings',
        title: 'Company settings',
        description:
          'Can modify company profile and system-wide configurations',
        enabled: false,
      },
      {
        id: 'task-management',
        title: 'Task management',
        description: 'Can create, assign, and manage all tasks and projects',
        enabled: true,
      },
      {
        id: 'farm-mapping',
        title: 'Farm mapping',
        description: 'Can access and modify farm boundaries and field data',
        enabled: true,
      },
      {
        id: 'soil-sample-collection',
        title: 'Soil sample collection',
        description: 'Can manage soil sampling schedules and results',
        enabled: true,
      },
      {
        id: 'connection-requests',
        title: 'Connection requests',
        description:
          'Can approve or reject connection requests from contractors',
        enabled: false,
      },
      {
        id: 'reporting-analytics',
        title: 'Reporting & Analytics',
        description: 'Can access all reports and analytics data',
        enabled: true,
      },
      {
        id: 'notifications-configuration',
        title: 'Notifications configuration',
        description: 'Can configure system-wide notification settings',
        enabled: false,
      },
      {
        id: 'subscription-billing',
        title: 'Subscription & Billing',
        description: 'Can manage subscription plans and billing information',
        enabled: false,
      },
    ],
  },
  {
    id: '3',
    title: 'Contractor manager',
    description:
      'Manages contractors, oversees their work and access to orders, but has no access to role or system-wide settings.',
    assignedUsers: [
      {
        id: '8',
        initials: 'AC',
        name: 'Anna Chen',
        avatarSrc:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
      { id: '9', initials: 'DL', name: 'Daniel Lee' },
      {
        id: '10',
        initials: 'JM',
        name: 'James Miller',
        avatarSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      { id: '11', initials: 'RG', name: 'Rachel Garcia' },
    ],
    permissions: [
      {
        id: 'user-management',
        title: 'User management',
        description: 'Can add, edit, and remove users within the organisation',
        enabled: false,
      },
      {
        id: 'company-settings',
        title: 'Company settings',
        description:
          'Can modify company profile and system-wide configurations',
        enabled: false,
      },
      {
        id: 'task-management',
        title: 'Task management',
        description: 'Can create, assign, and manage all tasks and projects',
        enabled: true,
      },
      {
        id: 'farm-mapping',
        title: 'Farm mapping',
        description: 'Can access and modify farm boundaries and field data',
        enabled: false,
      },
      {
        id: 'soil-sample-collection',
        title: 'Soil sample collection',
        description: 'Can manage soil sampling schedules and results',
        enabled: false,
      },
      {
        id: 'connection-requests',
        title: 'Connection requests',
        description:
          'Can approve or reject connection requests from contractors',
        enabled: true,
      },
      {
        id: 'reporting-analytics',
        title: 'Reporting & Analytics',
        description: 'Can access all reports and analytics data',
        enabled: true,
      },
      {
        id: 'notifications-configuration',
        title: 'Notifications configuration',
        description: 'Can configure system-wide notification settings',
        enabled: false,
      },
      {
        id: 'subscription-billing',
        title: 'Subscription & Billing',
        description: 'Can manage subscription plans and billing information',
        enabled: false,
      },
    ],
  },
  {
    id: '4',
    title: 'Viewer',
    description:
      'Read-only access to data without the ability to edit or create new entries, suitable for users who need to monitor information without making changes.',
    assignedUsers: [
      {
        id: '12',
        initials: 'AT',
        name: 'Andrew Taylor',
        avatarSrc:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      },
      { id: '13', initials: 'DM', name: 'Diana Martinez' },
      {
        id: '14',
        initials: 'KJ',
        name: 'Kevin Johnson',
        avatarSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      { id: '15', initials: 'LA', name: 'Lisa Anderson' },
      {
        id: '16',
        initials: 'OW',
        name: 'Olivia White',
        avatarSrc:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
      { id: '17', initials: 'MC', name: 'Michael Clark' },
    ],
    permissions: [
      {
        id: 'user-management',
        title: 'User management',
        description: 'Can add, edit, and remove users within the organisation',
        enabled: false,
      },
      {
        id: 'company-settings',
        title: 'Company settings',
        description:
          'Can modify company profile and system-wide configurations',
        enabled: false,
      },
      {
        id: 'task-management',
        title: 'Task management',
        description: 'Can create, assign, and manage all tasks and projects',
        enabled: false,
      },
      {
        id: 'farm-mapping',
        title: 'Farm mapping',
        description: 'Can access and modify farm boundaries and field data',
        enabled: false,
      },
      {
        id: 'soil-sample-collection',
        title: 'Soil sample collection',
        description: 'Can manage soil sampling schedules and results',
        enabled: false,
      },
      {
        id: 'connection-requests',
        title: 'Connection requests',
        description:
          'Can approve or reject connection requests from contractors',
        enabled: false,
      },
      {
        id: 'reporting-analytics',
        title: 'Reporting & Analytics',
        description: 'Can access all reports and analytics data',
        enabled: true,
      },
      {
        id: 'notifications-configuration',
        title: 'Notifications configuration',
        description: 'Can configure system-wide notification settings',
        enabled: false,
      },
      {
        id: 'subscription-billing',
        title: 'Subscription & Billing',
        description: 'Can manage subscription plans and billing information',
        enabled: false,
      },
    ],
  },
  {
    id: '5',
    title: 'Support',
    description:
      'User support role; can view orders and tickets, assist with issue resolution, but cannot manage users.',
    assignedUsers: [
      {
        id: '18',
        initials: 'JA',
        name: 'Jennifer Adams',
        avatarSrc:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      { id: '19', initials: 'RW', name: 'Robert Wilson' },
    ],
    permissions: [
      {
        id: 'user-management',
        title: 'User management',
        description: 'Can add, edit, and remove users within the organisation',
        enabled: false,
      },
      {
        id: 'company-settings',
        title: 'Company settings',
        description:
          'Can modify company profile and system-wide configurations',
        enabled: false,
      },
      {
        id: 'task-management',
        title: 'Task management',
        description: 'Can create, assign, and manage all tasks and projects',
        enabled: false,
      },
      {
        id: 'farm-mapping',
        title: 'Farm mapping',
        description: 'Can access and modify farm boundaries and field data',
        enabled: false,
      },
      {
        id: 'soil-sample-collection',
        title: 'Soil sample collection',
        description: 'Can manage soil sampling schedules and results',
        enabled: false,
      },
      {
        id: 'connection-requests',
        title: 'Connection requests',
        description:
          'Can approve or reject connection requests from contractors',
        enabled: false,
      },
      {
        id: 'reporting-analytics',
        title: 'Reporting & Analytics',
        description: 'Can access all reports and analytics data',
        enabled: true,
      },
      {
        id: 'notifications-configuration',
        title: 'Notifications configuration',
        description: 'Can configure system-wide notification settings',
        enabled: false,
      },
      {
        id: 'subscription-billing',
        title: 'Subscription & Billing',
        description: 'Can manage subscription plans and billing information',
        enabled: false,
      },
    ],
  },
];
