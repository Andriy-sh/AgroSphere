import type { Meta, StoryObj } from '@storybook/react';
import { StatusIndicator, type TaskStatus } from './status-indicator';

const statuses: TaskStatus[] = [
  'completed',
  'cancelled',
  'in_progress',
  'assigned',
  'pending',
  'not_started',
  'priority-normal',
  'unknown',
];

const meta: Meta<typeof StatusIndicator> = {
  component: StatusIndicator,
  title: 'Components/StatusIndicator',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A sophisticated status indicator component designed for agricultural task management.

## Component Overview

The StatusIndicator provides visual representation of task states with intuitive icons,
color coding, and interactive tooltips to enhance user understanding of task progress.

## Key Features
- **Visual status representation**: Distinct icons and colors for each status type
- **Interactive tooltips**: Detailed information on hover
- **Customizable styling**: Flexible sizing and appearance options
- **Accessibility support**: Text labels and screen reader compatibility
- **Agricultural focus**: Optimized for farm management workflows

## Status Types
- **Completed**: Finished tasks with green checkmark
- **In Progress**: Currently active tasks with animated indicator
- **Assigned**: Tasks assigned to team members
- **Pending**: Tasks waiting for action or approval
- **Not Started**: Tasks that haven't been initiated yet
- **Cancelled**: Terminated tasks with clear visual indication
- **Priority Normal**: Standard priority level tasks
- **Unknown**: Unspecified or error states

## Usage Examples
- Crop management task tracking
- Equipment maintenance status
- Harvest planning progress
- Team assignment visualization
- Project milestone tracking
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: statuses,
      description:
        'Task status that determines icon, color, and default tooltip text',
      table: {
        type: { summary: 'TaskStatus' },
        defaultValue: { summary: "'completed'" },
      },
    },
    tooltip: {
      control: 'text',
      description:
        'Custom tooltip text that overrides the default status description',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling and sizing',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    showText: {
      control: 'boolean',
      description:
        'Whether to display status text label next to the icon for better accessibility',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    status: 'completed',
    tooltip: undefined,
    className: '',
    showText: false,
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'completed',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic status indicator showing a completed task with default styling and tooltip.',
      },
    },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <StatusIndicator status="completed" />
      <StatusIndicator status="cancelled" />
      <StatusIndicator status="in_progress" />
      <StatusIndicator status="assigned" />
      <StatusIndicator status="pending" />
      <StatusIndicator status="not_started" />
      <StatusIndicator status="priority-normal" />
      <StatusIndicator status="unknown" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of all available status types with their distinct visual representations and color schemes.',
      },
    },
  },
};

export const WithText: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <StatusIndicator status="completed" showText={true} />
      <StatusIndicator status="in_progress" showText={true} />
      <StatusIndicator status="assigned" showText={true} />
      <StatusIndicator status="pending" showText={true} />
      <StatusIndicator status="not_started" showText={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status indicators with text labels for enhanced accessibility and clearer communication of task states.',
      },
    },
  },
};
