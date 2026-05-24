import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TaskDetailTabs } from './task-detail-tabs';

/**
 * TaskDetailTabs Component
 *
 * A sophisticated tabbed navigation interface designed for agricultural task management
 * with dynamic tab switching, count indicators, and customizable styling options.
 *
 * Features:
 * - Dynamic tab navigation with active state management
 * - Optional count indicators for each tab
 * - Smooth transitions and hover effects
 * - Customizable styling through className prop
 * - Agricultural task context optimization
 * - Responsive design support
 *
 * Use Cases:
 * - Task detail navigation
 * - File and document organization
 * - Comment and discussion management
 * - Progress tracking interfaces
 * - Multi-section task views
 * - Agricultural workflow navigation
 */
const meta: Meta<typeof TaskDetailTabs> = {
  component: TaskDetailTabs,
  title: 'Components/TaskDetailTabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A sophisticated tabbed navigation component designed for agricultural task management and organization.

## Component Overview

The TaskDetailTabs component provides an intuitive navigation interface for organizing
and accessing different sections of agricultural task information with visual indicators
and smooth interactions optimized for farm management workflows.

## Key Features
- **Tab navigation**: Dynamic switching between different content sections
- **Count indicators**: Visual badges showing item counts for each tab
- **Active state management**: Clear indication of current active tab
- **Customizable styling**: Flexible appearance through className prop
- **Agricultural focus**: Optimized for farm task management workflows
- **Responsive design**: Adapts to different screen sizes and devices

## Interface Elements
- **Tab buttons**: Clickable navigation elements with labels
- **Count badges**: Optional numerical indicators for tab content
- **Active indicators**: Visual highlighting of current tab
- **Hover effects**: Interactive feedback for user engagement
- **Transition animations**: Smooth state changes and interactions

## Usage Examples
- Task overview and details navigation
- File and document organization
- Comment and discussion management
- Progress tracking and reporting
- Multi-section agricultural workflows
- Team collaboration interfaces
        `,
      },
    },
  },
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['overview', 'details', 'comments', 'files'],
      description: 'Currently active tab identifier',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'overview'" },
      },
    },
    onTabChange: {
      action: 'tab changed',
      description: 'Callback function triggered when tab is changed',
      table: {
        type: { summary: '(tabId: string) => void' },
      },
    },
    tabItems: {
      control: 'object',
      description: 'Array of tab items with id, label, and optional count',
      table: {
        type: { summary: 'TabItem[]' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    activeTab: 'overview',
    tabItems: [
      { id: 'overview', label: 'Overview', count: 3 },
      { id: 'details', label: 'Details', count: 5 },
      { id: 'comments', label: 'Comments', count: 12 },
      { id: 'files', label: 'Files', count: 2 },
    ],
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
  },
};

export default meta;
type Story = StoryObj<typeof TaskDetailTabs>;

const defaultTabItems = [
  { id: 'overview', label: 'Overview', count: 3 },
  { id: 'details', label: 'Details', count: 5 },
  { id: 'comments', label: 'Comments', count: 12 },
  { id: 'files', label: 'Files', count: 2 },
];

const InteractiveComponent: React.FC<{ args: any }> = ({ args }) => {
  const [activeTab, setActiveTab] = React.useState(args.activeTab);

  return (
    <div className="space-y-4">
      <TaskDetailTabs
        {...args}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    activeTab: 'overview',
    tabItems: defaultTabItems,
  },
  render: (args) => <InteractiveComponent args={args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive tab demonstration with state management, showing real-time tab switching and user interaction feedback for agricultural task navigation.',
      },
    },
  },
};
