import type { Meta, StoryObj } from '@storybook/react';
import { TaskInfoRow } from './task-info';

const meta: Meta<typeof TaskInfoRow> = {
  title: 'Components/TaskInfoRow',
  component: TaskInfoRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A sophisticated information row component designed for agricultural task management and data presentation.

## Component Overview

The TaskInfoRow component provides a flexible and consistent way to display
key-value information pairs with optional icons, custom content, and styling
optimized for agricultural task management workflows.

## Key Features
- **Label-value pairs**: Clear information structure with descriptive labels
- **Icon support**: Optional visual indicators for enhanced information display
- **Flexible content**: Support for text, numbers, custom components, and complex layouts
- **Customizable styling**: Multiple styling options for different use cases
- **Responsive design**: Proper text wrapping and layout adaptation
- **Agricultural focus**: Optimized for farm task management information display

## Interface Elements
- **Label section**: Descriptive text for the information type
- **Value section**: Content display area with flexible rendering
- **Icon area**: Optional visual indicator with customizable styling
- **Container**: Main wrapper with customizable styling options

## Usage Examples
- Task status and progress indicators
- User assignment and team information
- Date, time, and scheduling data
- Priority levels and categories
- Progress tracking and completion status
- Agricultural data and measurements
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text to display for the information row',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description: 'Value to display (string or number)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
      },
    },
    children: {
      description: 'Custom content to render instead of value prop',
      control: { type: 'object' },
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    icon: {
      description: 'Optional icon element to display with the information',
      control: { type: 'object' },
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    className: {
      description: 'Additional CSS classes for the main container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    labelClassName: {
      description: 'Additional CSS classes for the label element',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    valueContainerClassName: {
      description: 'Additional CSS classes for the value container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    iconContainerClassName: {
      description: 'Additional CSS classes for the icon container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    label: 'Task Status',
    value: 'In Progress',
  },
};

export default meta;
type Story = StoryObj<typeof TaskInfoRow>;

export const Default: Story = {
  args: {
    label: 'Status',
    value: 'In Progress',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic task information row with status label and value display for agricultural task management.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Priority',
    value: 'High',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Task information row with priority indicator and visual icon for enhanced information display.',
      },
    },
  },
};

export const WithCustomChildren: Story = {
  args: {
    label: 'Assignee',
    children: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          JS
        </div>
        <span>John Smith</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom content display with user avatar and name for team assignment information in agricultural tasks.',
      },
    },
  },
};

export const WithDifferentIcons: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <TaskInfoRow
        label="Status"
        value="Completed"
        icon={
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      <TaskInfoRow
        label="Priority"
        value="High"
        icon={
          <svg
            className="w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      <TaskInfoRow
        label="Due Date"
        value="2024-01-15"
        icon={
          <svg
            className="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple task information rows with different colored icons for status, priority, and date information in agricultural task management.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    label: 'Custom Style',
    value: 'Styled Value',
    className: 'bg-gray-50 p-4 rounded-lg',
    labelClassName: 'text-blue-600 font-bold',
    valueContainerClassName: 'text-green-600 font-semibold',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Customized styling example with background, padding, and colored text for specialized agricultural task information display.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    label: 'Description',
    value:
      'This is a very long description that might wrap to multiple lines and should be handled properly by the component layout for agricultural task details.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Long content handling with proper text wrapping for detailed agricultural task descriptions and notes.',
      },
    },
  },
};

export const NumberValue: Story = {
  args: {
    label: 'Progress',
    value: 75,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Numeric value display for progress tracking and completion percentages in agricultural task management.',
      },
    },
  },
};

export const BadgeValue: Story = {
  args: {
    label: 'Category',
    children: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Soil Sampling
      </span>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge-style category indicator for agricultural task classification and organization.',
      },
    },
  },
};

export const MultipleValues: Story = {
  args: {
    label: 'Tags',
    children: (
      <div className="flex flex-wrap gap-1">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Wheat
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Irrigation
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
          Monitoring
        </span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple tag display for agricultural task categorization with crop types, operations, and monitoring activities.',
      },
    },
  },
};

export const WithLink: Story = {
  args: {
    label: 'Documentation',
    children: (
      <a
        href="https://example.com/soil-sampling-guide"
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Soil Sampling Guide
      </a>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Link display for agricultural documentation and reference materials in task management interfaces.',
      },
    },
  },
};

export const StatusIndicator: Story = {
  args: {
    label: 'Status',
    children: (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Active</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Visual status indicator with colored dot for real-time task status display in agricultural workflows.',
      },
    },
  },
};

export const AvatarAndName: Story = {
  args: {
    label: 'Created by',
    children: (
      <div className="flex items-center gap-2">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
          alt="User avatar"
          className="w-6 h-6 rounded-full"
        />
        <span>John Smith</span>
        <span className="text-gray-500 text-xs">2 hours ago</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'User information display with avatar, name, and timestamp for task creation and assignment tracking.',
      },
    },
  },
};

export const ProgressBar: Story = {
  args: {
    label: 'Completion',
    children: (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>75%</span>
          <span>3 of 4 tasks</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Progress bar display with percentage and task count for agricultural project completion tracking.',
      },
    },
  },
};

export const CustomIconContainer: Story = {
  args: {
    label: 'Custom Icon',
    value: 'Value with custom icon styling',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconContainerClassName: 'text-purple-500 bg-purple-100 p-1 rounded',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom icon container styling with background color and padding for enhanced visual presentation.',
      },
    },
  },
};

export const SoilSamplingInfo: Story = {
  render: () => (
    <div className="space-y-4 w-96 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Soil Sampling Task</h3>

      <TaskInfoRow
        label="Status"
        value="In Progress"
        icon={
          <svg
            className="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Priority"
        children={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            High
          </span>
        }
        icon={
          <svg
            className="w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Soil Sampler"
        children={
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="User avatar"
              className="w-6 h-6 rounded-full"
            />
            <span>Sarah Wilson</span>
          </div>
        }
        icon={
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Samples Required"
        value="25"
        icon={
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Progress"
        children={
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>60%</span>
              <span>15 of 25 samples</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: '60%' }}
              ></div>
            </div>
          </div>
        }
        icon={
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete soil sampling task information display with status, priority, assigned sampler, sample count, and progress tracking for agricultural analysis workflows.',
      },
    },
  },
};

export const CropMonitoringInfo: Story = {
  render: () => (
    <div className="space-y-4 w-96 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Crop Monitoring Task</h3>

      <TaskInfoRow
        label="Crop Type"
        value="Wheat"
        icon={
          <svg
            className="w-4 h-4 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Growth Stage"
        children={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Flowering
          </span>
        }
        icon={
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Field Size"
        value="150 acres"
        icon={
          <svg
            className="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        }
      />

      <TaskInfoRow
        label="Health Status"
        children={
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Excellent</span>
          </div>
        }
        icon={
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Crop monitoring task information with crop type, growth stage, field size, and health status for agricultural crop management workflows.',
      },
    },
  },
};
