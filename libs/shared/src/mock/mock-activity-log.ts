export const mockActivityLog = () => [
  {
    title: 'Today',
    activities: [
      {
        id: 'today-1',
        user: { name: 'Alice Murphy', avatarInitials: 'AM' },
        timestamp: new Date('2025-05-14T09:00:00'),
        type: 'task_created' as const,
        taskCreatedData: {
          taskTitle: 'Soil Sampling',
          location: 'Field 3 at Homefarm',
        },
      },
      {
        id: 'comment-today-1',
        user: {
          name: 'Wade Warren',
          avatarSrc: '',
        },
        timestamp: new Date('2025-05-14T09:30:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-today-1',
          user: {
            name: 'Wade Warren',
            avatarSrc: '',
          },
          timestamp: new Date('2025-05-14T09:30:00'),
          commentText:
            'Task created successfully. Ready to begin soil sampling procedures.',
          reactions: {
            thumbsUp: 2,
            heart: 1,
          },
        },
      },
      {
        id: 'today-2',
        user: { name: 'James Nolan', avatarInitials: 'JN' },
        timestamp: new Date('2025-05-14T10:15:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'Not Started',
        },
      },
      {
        id: 'comment-today-2',
        user: {
          name: 'Annette Black',
          avatarInitials: 'AB',
        },
        timestamp: new Date('2025-05-14T10:20:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-today-2',
          user: {
            name: 'Annette Black',
            avatarInitials: 'AB',
          },
          timestamp: new Date('2025-05-14T10:20:00'),
          commentText:
            'Observed crop stress near drainage area. Will need additional samples from this zone.',
          reactions: {
            thumbsUp: 0,
            heart: 1,
          },
        },
      },
      {
        id: 'today-3',
        user: {
          name: 'Diana Mills',
          avatarSrc:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        timestamp: new Date('2025-05-14T10:30:00'),
        type: 'documents_uploaded' as const,
        documentsUploadedData: {
          documentName: 'Field Photos.jpg',
          documentType: 'image',
        },
      },
      {
        id: 'comment-today-3',
        user: {
          name: 'Jenny Wilson',
          avatarSrc: '',
        },
        timestamp: new Date('2025-05-14T10:45:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-today-3',
          user: {
            name: 'Jenny Wilson',
            avatarSrc: '',
          },
          timestamp: new Date('2025-05-14T10:45:00'),
          commentText:
            'Completed GPS mapping for all sample points. Coordinates uploaded to the system.',
          reactions: {
            thumbsUp: 2,
            heart: 1,
          },
        },
      },
      {
        id: 'today-4',
        user: {
          name: 'Diana Mills',
          avatarSrc:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        timestamp: new Date('2025-05-14T10:55:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Started soil sampling in Field 3, beginning from the southern section. Each sample is labeled with a unique Sample ID and GPS coordinates.',
        },
      },
      {
        id: 'today-5',
        user: { name: 'James Nolan', avatarInitials: 'JN' },
        timestamp: new Date('2025-05-14T11:15:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'In Progress',
        },
      },
      {
        id: 'comment-today-4',
        user: {
          name: 'LifeFarm',
          avatarInitials: 'LF',
        },
        timestamp: new Date('2025-05-14T11:30:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-today-4',
          user: {
            name: 'LifeFarm',
            avatarInitials: 'LF',
          },
          timestamp: new Date('2025-05-14T11:30:00'),
          commentText:
            'Lab submission prepared. All samples properly labeled and packaged.',
          reactions: {
            thumbsUp: 0,
            heart: 0,
          },
        },
      },
      {
        id: 'today-6',
        user: {
          name: 'Robert Fox',
          avatarSrc:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        timestamp: new Date('2025-05-14T15:12:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Completed the soil sampling in the northern section. All samples have been properly documented and are ready for lab analysis.',
        },
      },
    ],
  },
  {
    title: 'Last 7 days',
    activities: [
      {
        id: 'week-1',
        user: { name: 'Sarah Wilson', avatarInitials: 'SW' },
        timestamp: new Date('2025-05-13T14:20:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'Completed',
        },
      },
      {
        id: 'comment-week-1',
        user: {
          name: 'Mike Johnson',
          avatarInitials: 'MJ',
        },
        timestamp: new Date('2025-05-13T14:45:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-week-1',
          user: {
            name: 'Mike Johnson',
            avatarInitials: 'MJ',
          },
          timestamp: new Date('2025-05-13T14:45:00'),
          commentText:
            'Excellent work on completing this task. The results look promising.',
          reactions: {
            thumbsUp: 3,
            heart: 2,
          },
        },
      },
      {
        id: 'week-2',
        user: { name: 'Annette Black', avatarInitials: 'AB' },
        timestamp: new Date('2025-05-12T16:45:00'),
        type: 'documents_uploaded' as const,
        documentsUploadedData: {
          documentName: 'Soil Analysis Report.pdf',
          documentType: 'pdf',
        },
      },
      {
        id: 'week-3',
        user: { name: 'Annette Black', avatarInitials: 'AB' },
        timestamp: new Date('2025-05-12T15:30:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Observed crop stress near drainage area. Will need additional samples from this zone.',
        },
      },
      {
        id: 'week-4',
        user: { name: 'Mike Johnson', avatarInitials: 'MJ' },
        timestamp: new Date('2025-05-11T11:00:00'),
        type: 'task_created' as const,
        taskCreatedData: {
          taskTitle: 'Water Quality Test',
          location: 'River upstream',
        },
      },
      {
        id: 'comment-week-2',
        user: {
          name: 'Emma Davis',
          avatarInitials: 'ED',
        },
        timestamp: new Date('2025-05-11T11:30:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-week-2',
          user: {
            name: 'Emma Davis',
            avatarInitials: 'ED',
          },
          timestamp: new Date('2025-05-11T11:30:00'),
          commentText:
            "Water quality testing is crucial for this area. I'll coordinate with the lab team.",
          reactions: {
            thumbsUp: 1,
            heart: 0,
          },
        },
      },
      {
        id: 'week-5',
        user: { name: 'Wade Warren', avatarInitials: 'WW' },
        timestamp: new Date('2025-05-10T10:00:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Started soil sampling in Field 3. Weather conditions are good for sampling.',
        },
      },
      {
        id: 'week-6',
        user: { name: 'Jenny Wilson', avatarInitials: 'JW' },
        timestamp: new Date('2025-05-09T09:15:00'),
        type: 'documents_uploaded' as const,
        documentsUploadedData: {
          documentName: 'GPS Coordinates.csv',
          documentType: 'csv',
        },
      },
      {
        id: 'comment-week-3',
        user: {
          name: 'Tom Anderson',
          avatarInitials: 'TA',
        },
        timestamp: new Date('2025-05-09T09:45:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-week-3',
          user: {
            name: 'Tom Anderson',
            avatarInitials: 'TA',
          },
          timestamp: new Date('2025-05-09T09:45:00'),
          commentText:
            'GPS coordinates look accurate. This will help with precise sampling locations.',
          reactions: {
            thumbsUp: 2,
            heart: 0,
          },
        },
      },
      {
        id: 'week-7',
        user: { name: 'LifeFarm', avatarInitials: 'LF' },
        timestamp: new Date('2025-05-08T16:45:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Lab submission prepared. All samples properly labeled and packaged.',
        },
      },
    ],
  },
  {
    title: 'Last 30 days',
    activities: [
      {
        id: 'month-1',
        user: { name: 'Marvin McKinney', avatarInitials: 'MM' },
        timestamp: new Date('2025-05-07T13:20:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'In Progress',
        },
      },
      {
        id: 'comment-month-1',
        user: {
          name: 'Lisa Chen',
          avatarInitials: 'LC',
        },
        timestamp: new Date('2025-05-07T13:45:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-month-1',
          user: {
            name: 'Lisa Chen',
            avatarInitials: 'LC',
          },
          timestamp: new Date('2025-05-07T13:45:00'),
          commentText:
            'Progress is looking good. The team is working efficiently on this project.',
          reactions: {
            thumbsUp: 4,
            heart: 1,
          },
        },
      },
      {
        id: 'month-2',
        user: { name: 'Emma Davis', avatarInitials: 'ED' },
        timestamp: new Date('2025-05-06T10:30:00'),
        type: 'documents_uploaded' as const,
        documentsUploadedData: {
          documentName: 'Field Survey Report.docx',
          documentType: 'doc',
        },
      },
      {
        id: 'month-3',
        user: { name: 'Emma Davis', avatarInitials: 'ED' },
        timestamp: new Date('2025-05-06T10:15:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Field survey completed. Soil conditions are optimal for sampling.',
        },
      },
      {
        id: 'month-4',
        user: { name: 'Marvin McKinney', avatarInitials: 'MM' },
        timestamp: new Date('2025-05-05T09:00:00'),
        type: 'task_created' as const,
        taskCreatedData: {
          taskTitle: 'Plant Monitoring',
          location: 'Greenhouse A',
        },
      },
      {
        id: 'comment-month-2',
        user: {
          name: 'David Brown',
          avatarInitials: 'DB',
        },
        timestamp: new Date('2025-05-05T09:30:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-month-2',
          user: {
            name: 'David Brown',
            avatarInitials: 'DB',
          },
          timestamp: new Date('2025-05-05T09:30:00'),
          commentText:
            'Plant monitoring in Greenhouse A is essential for tracking growth patterns.',
          reactions: {
            thumbsUp: 1,
            heart: 1,
          },
        },
      },
      {
        id: 'month-5',
        user: { name: 'Tom Anderson', avatarInitials: 'TA' },
        timestamp: new Date('2025-05-04T14:45:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'Completed',
        },
      },
      {
        id: 'month-6',
        user: { name: 'Lisa Chen', avatarInitials: 'LC' },
        timestamp: new Date('2025-05-03T11:20:00'),
        type: 'documents_uploaded' as const,
        documentsUploadedData: {
          documentName: 'Equipment Checklist.pdf',
          documentType: 'pdf',
        },
      },
      {
        id: 'month-7',
        user: { name: 'Lisa Chen', avatarInitials: 'LC' },
        timestamp: new Date('2025-05-03T11:00:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Equipment inspection completed. All tools are ready for the sampling process.',
        },
      },
      {
        id: 'month-8',
        user: { name: 'Marvin McKinney', avatarInitials: 'MM' },
        timestamp: new Date('2025-05-02T11:20:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'In Progress',
        },
      },
      {
        id: 'comment-month-3',
        user: {
          name: 'Sarah Wilson',
          avatarInitials: 'SW',
        },
        timestamp: new Date('2025-05-02T11:45:00'),
        type: 'comment' as const,
        commentData: {
          id: 'comment-month-3',
          user: {
            name: 'Sarah Wilson',
            avatarInitials: 'SW',
          },
          timestamp: new Date('2025-05-02T11:45:00'),
          commentText:
            'Great to see this task moving forward. The team is making excellent progress.',
          reactions: {
            thumbsUp: 2,
            heart: 1,
          },
        },
      },
      {
        id: 'month-9',
        user: { name: 'Marvin McKinney', avatarInitials: 'MM' },
        timestamp: new Date('2025-05-01T09:00:00'),
        type: 'task_created' as const,
        taskCreatedData: {
          taskTitle: 'Soil Sampling in Field 3',
          location: 'Field 3 at Homefarm',
        },
      },
      {
        id: 'month-10',
        user: { name: 'David Brown', avatarInitials: 'DB' },
        timestamp: new Date('2025-04-30T16:30:00'),
        type: 'comment_left' as const,
        commentLeftData: {
          commentText:
            'Initial site assessment completed. Ready to begin soil sampling procedures.',
        },
      },
      {
        id: 'month-11',
        user: { name: 'David Brown', avatarInitials: 'DB' },
        timestamp: new Date('2025-04-30T16:15:00'),
        type: 'documents_uploaded' as const,
        documentsUploadedData: {
          documentName: 'Site Assessment.pdf',
          documentType: 'pdf',
        },
      },
    ],
  },
];
