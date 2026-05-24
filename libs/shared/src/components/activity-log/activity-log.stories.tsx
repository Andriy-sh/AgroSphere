import type { Meta, StoryObj } from '@storybook/react';
import { ActivityLog } from './activity-log';
import { ActivityComment } from './activity-comment';

const meta: Meta<typeof ActivityLog> = {
  title: 'Components/ActivityLog',
  component: ActivityLog,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showConnectingLine: {
      control: 'boolean',
      description: 'Show connecting lines between activities',
    },
    showSeparator: {
      control: 'boolean',
      description: 'Show separators between activities',
    },
    showUnreadIndicator: {
      control: 'boolean',
      description: 'Show unread indicators',
    },
    showCompletionStatus: {
      control: 'boolean',
      description: 'Show completion status',
    },
    currentUser: {
      control: 'object',
      description: 'Current user for comment actions',
    },
    onUpdateComment: {
      action: 'comment updated',
      description: 'Callback when comment is updated',
    },
    onDeleteComment: {
      action: 'comment deleted',
      description: 'Callback when comment is deleted',
    },
    onAddReaction: {
      action: 'reaction added',
      description: 'Callback when reaction is added',
    },
    onAddNewComment: {
      action: 'new comment added',
      description: 'Callback when new comment is added',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseActivityData = [
  {
    title: 'Today',
    activities: [
      {
        id: '1',
        user: { name: 'Alice Murphy', avatarInitials: 'AM' },
        timestamp: new Date('2025-05-14T09:00:00'),
        type: 'task_created' as const,
        taskCreatedData: {
          taskTitle: 'Soil Sampling',
          location: 'Field 3 at Homefarm',
        },
      },
      {
        id: '2',
        user: { name: 'James Nolan', avatarInitials: 'JN' },
        timestamp: new Date('2025-05-14T10:15:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'In Progress',
        },
      },
      {
        id: '3',
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
    ],
  },
];

const sampleComments: ActivityComment[] = [
  {
    id: 'comment-1',
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
  {
    id: 'comment-2',
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
];

const commentActivities = sampleComments.map((comment) => ({
  id: `comment-${comment.id}`,
  user: comment.user,
  timestamp: comment.timestamp,
  type: 'comment' as const,
  commentData: comment,
}));

const activityDataWithComments = [
  {
    title: 'Today',
    activities: [
      {
        id: '1',
        user: { name: 'Alice Murphy', avatarInitials: 'AM' },
        timestamp: new Date('2025-05-14T09:00:00'),
        type: 'task_created' as const,
        taskCreatedData: {
          taskTitle: 'Soil Sampling',
          location: 'Field 3 at Homefarm',
        },
      },
      {
        id: 'comment-1',
        user: {
          name: 'Wade Warren',
          avatarSrc: '',
        },
        timestamp: new Date('2025-05-14T09:30:00'),
        type: 'comment' as const,
        commentData: sampleComments[0],
      },
      {
        id: '2',
        user: { name: 'James Nolan', avatarInitials: 'JN' },
        timestamp: new Date('2025-05-14T10:15:00'),
        type: 'task_status_changed' as const,
        taskStatusChangedData: {
          statusText: 'In Progress',
        },
      },
      {
        id: 'comment-2',
        user: {
          name: 'Annette Black',
          avatarInitials: 'AB',
        },
        timestamp: new Date('2025-05-14T10:20:00'),
        type: 'comment' as const,
        commentData: sampleComments[1],
      },
      {
        id: '3',
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
    ],
  },
];

export const Default: Story = {
  args: {
    activityGroups: baseActivityData,
    showConnectingLine: true,
    showSeparator: false,
    showUnreadIndicator: false,
    showCompletionStatus: false,
  },
};

export const WithComments: Story = {
  args: {
    activityGroups: activityDataWithComments,
    showConnectingLine: true,
    showSeparator: false,
    showUnreadIndicator: false,
    showCompletionStatus: false,
    currentUser: {
      name: 'Wade Warren',
      avatarSrc: '',
    },
    onUpdateComment: (commentId: string, newText: string) => {
      console.log('Comment updated:', commentId, newText);
    },
    onDeleteComment: (commentId: string) => {
      console.log('Comment deleted:', commentId);
    },
    onAddReaction: (commentId: string, reactionType: 'thumbsUp' | 'heart') => {
      console.log('Reaction added:', commentId, reactionType);
    },
    onAddNewComment: (commentText: string) => {
      console.log('New comment added:', commentText);
    },
  },
};
