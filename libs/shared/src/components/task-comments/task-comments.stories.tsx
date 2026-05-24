import { TaskComments } from './task-comments';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * TaskComments Component
 *
 * A comprehensive task comments and collaboration interface designed for
 * agricultural task management with user avatars, timestamps, and interactive features.
 *
 * Features:
 * - User comment display with avatars and initials
 * - Interactive comment submission
 * - Real-time collaboration support
 * - Agricultural task context
 * - Comment editing and deletion capabilities
 *
 * Use Cases:
 * - Farm task collaboration
 * - Equipment maintenance notes
 * - Crop monitoring updates
 * - Team communication
 * - Progress tracking
 * - Issue reporting
 */
const meta: Meta<typeof TaskComments> = {
  title: 'Components/TaskComments',
  component: TaskComments,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A sophisticated task comments component designed for agricultural collaboration and communication.

## Component Overview

The TaskComments component provides a complete interface for team collaboration
on agricultural tasks with user avatars, comment threading, and interactive features
optimized for farm management workflows.

## Key Features
- **User identification**: Avatar images and initials for team members
- **Comment threading**: Organized discussion with timestamps
- **Interactive submission**: Real-time comment posting
- **Comment management**: Edit and delete capabilities
- **Agricultural focus**: Optimized for farm task management

## Interface Elements
- **Comment list**: User comments with avatars and dates
- **Comment form**: New comment submission interface
- **User actions**: Edit and delete comment options

## Usage Examples
- Crop monitoring task discussions
- Equipment maintenance collaboration
- Field operation updates
- Team coordination and planning
- Issue reporting and resolution
- Progress tracking and updates
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    commentsData: {
      control: 'object',
      description: 'Array of comment objects with user info, dates, and text',
      table: {
        type: { summary: 'Comment[]' },
      },
    },
    currentUser: {
      control: 'object',
      description: 'Current user information for comment submission',
      table: {
        type: { summary: 'User' },
      },
    },
    onCommentSubmit: {
      action: 'onCommentSubmit',
      description: 'Callback function when a new comment is submitted',
      table: {
        type: { summary: '(comment: string) => void' },
      },
    },
    onCommentUpdate: {
      action: 'onCommentUpdate',
      description: 'Callback function when a comment is updated',
      table: {
        type: { summary: '(commentId: string, newText: string) => void' },
      },
    },
    onCommentDelete: {
      action: 'onCommentDelete',
      description: 'Callback function when a comment is deleted',
      table: {
        type: { summary: '(commentId: string) => void' },
      },
    },
  },
  args: {
    commentsData: [],
    currentUser: {
      name: 'Current User',
      avatarSrc: 'https://images.unsplash.com/photo-1579613832107-5775608b4760',
    },
    onCommentSubmit: (comment) => console.log('Submit comment:', comment),
    onCommentUpdate: (commentId, newText) =>
      console.log('Update comment:', commentId, newText),
    onCommentDelete: (commentId) => console.log('Delete comment:', commentId),
  },
};

export default meta;

type Story = StoryObj<typeof TaskComments>;

const mockComments = [
  {
    id: '1',
    user: {
      name: 'Wade Warren',
      avatarSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    date: new Date('2025-05-04'),
    commentText:
      'Started soil sampling in Field 3. Initial pH readings show slightly acidic conditions. Will continue with nutrient analysis tomorrow.',
  },
  {
    id: '2',
    user: {
      name: 'Annette Black',
      avatarInitials: 'AB',
    },
    date: new Date('2025-05-10'),
    commentText:
      'Observed crop stress near drainage areas. Recommend additional soil testing in those sections to identify potential issues.',
  },
  {
    id: '3',
    user: {
      name: 'John Smith',
      avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    date: new Date('2025-05-12'),
    commentText:
      'Completed nutrient analysis. Nitrogen levels are optimal, but phosphorus is below recommended levels. Suggest fertilizer application.',
  },
];

export const Default: Story = {
  args: {
    commentsData: mockComments,
    currentUser: {
      name: 'Current User',
      avatarSrc: 'https://images.unsplash.com/photo-1579613832107-5775608b4760',
    },
    onCommentSubmit: (comment) => console.log('Submit comment:', comment),
    onCommentUpdate: (commentId, newText) =>
      console.log('Update comment:', commentId, newText),
    onCommentDelete: (commentId) => console.log('Delete comment:', commentId),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic task comments interface with multiple user comments for soil sampling task collaboration.',
      },
    },
  },
};
