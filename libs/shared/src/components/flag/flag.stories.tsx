import type { Meta, StoryObj } from '@storybook/react';
import { Flag } from './flag';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

const meta: Meta<typeof Flag> = {
  component: Flag,
  title: 'Components/Flag',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A versatile flag component that displays priority indicators with customizable variants, sizes, and tooltip functionality. Perfect for task management, project tracking, and any interface requiring priority or status indicators.\n\n**Features:**\n- Multiple priority variants (normal, urgent, none)\n- Seven different sizes from extra small to extra large\n- Built-in tooltip functionality with customizable content\n- Optional text display alongside the flag icon\n- Accessibility features with proper ARIA labels\n- Consistent color coding (blue for normal, red for urgent)\n- Lucide React icon integration for crisp, scalable graphics\n\n**Usage:**\nUse the Flag component to indicate priority levels in task lists, project management tools, or any interface where visual priority indicators are needed. The component automatically provides tooltips and can display optional text labels.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'The priority variant of the flag',
      control: { type: 'select' },
      options: ['normal', 'urgent', 'none'],
      table: {
        type: { summary: "'normal' | 'urgent' | 'none'" },
        defaultValue: { summary: 'normal' },
      },
    },
    size: {
      description: 'The size of the flag icon',
      control: { type: 'select' },
      options: sizes,
      table: {
        type: { summary: 'FlagSize' },
        defaultValue: { summary: 'md' },
      },
    },
    tooltipContent: {
      description:
        'Custom tooltip content to override the default priority text',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    showText: {
      description: 'Whether to display text alongside the flag icon',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: 'Text content to display when showText is true',
      control: 'text',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    iconColor: {
      description: 'Custom color override for the flag icon',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional CSS classes for the flag container',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    variant: 'normal',
    size: 'md',
    tooltipContent: undefined,
    showText: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: { variant: 'normal', size: 'md' },
  parameters: {
    docs: {
      description: {
        story:
          'Default normal priority flag with medium size. Blue color indicates standard priority level.',
      },
    },
  },
};

export const High: Story = {
  args: { variant: 'high', size: 'md' },
  parameters: {
    docs: {
      description: {
        story:
          'High priority flag with medium size. Red color indicates high priority that requires immediate attention.',
      },
    },
  },
};

export const None: Story = {
  args: { variant: 'none', size: 'md' },
  parameters: {
    docs: {
      description: {
        story:
          'Invisible flag variant. Useful for maintaining layout consistency when no priority is set or for placeholder states.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">XS</span>
        <Flag variant="urgent" size="xs" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">SM</span>
        <Flag variant="urgent" size="sm" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">MD</span>
        <Flag variant="urgent" size="md" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">LG</span>
        <Flag variant="urgent" size="lg" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">XL</span>
        <Flag variant="urgent" size="xl" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">2XL</span>
        <Flag variant="urgent" size="2xl" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-gray-600">3XL</span>
        <Flag variant="urgent" size="3xl" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete size comparison showing all available flag sizes from extra small (XS) to 3XL. Each size is clearly labeled for easy reference.',
      },
    },
  },
};

export const WithText: Story = {
  args: {
    variant: 'urgent',
    size: 'md',
    showText: true,
    children: 'High Priority',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Flag with text label displayed alongside the icon. Useful when you want to provide explicit priority information or when the icon alone might not be clear enough.',
      },
    },
  },
};

export const WithCustomText: Story = {
  args: {
    variant: 'normal',
    size: 'lg',
    showText: true,
    children: 'Review Required',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Flag with custom text content. Demonstrates how to use the component with specific, contextual labels instead of generic priority terms.',
      },
    },
  },
};

export const CustomTooltip: Story = {
  args: {
    variant: 'normal',
    size: 'lg',
    tooltipContent: 'This task requires immediate attention from the team lead',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Flag with custom tooltip content. Demonstrates how to provide specific context instead of the default priority text. Hover over the flag to see the custom tooltip.',
      },
    },
  },
};

export const DetailedTooltip: Story = {
  args: {
    variant: 'urgent',
    size: 'md',
    tooltipContent: 'Due date: Today | Assigned to: John Doe | Impact: High',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Flag with detailed tooltip containing multiple pieces of information. Useful for providing comprehensive context without cluttering the interface.',
      },
    },
  },
};

export const TaskListExample: Story = {
  render: () => (
    <div className="space-y-2 p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
        <Flag variant="urgent" size="sm" />
        <span className="text-sm font-medium">
          Fix critical bug in payment system
        </span>
        <span className="text-xs text-gray-500 ml-auto">Due: Today</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
        <Flag variant="normal" size="sm" />
        <span className="text-sm font-medium">Update user documentation</span>
        <span className="text-xs text-gray-500 ml-auto">Due: Friday</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
        <Flag variant="none" size="sm" />
        <span className="text-sm font-medium text-gray-400">
          Add new feature (no priority set)
        </span>
        <span className="text-xs text-gray-500 ml-auto">Due: Next week</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example showing how flags are used in a task list. Demonstrates the visual hierarchy and how different priority levels help users quickly identify important items.',
      },
    },
  },
};

export const ProjectDashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <Flag variant="urgent" size="md" />
          <h3 className="font-semibold text-lg">Critical Issues</h3>
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            3
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Tasks requiring immediate attention
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <Flag variant="normal" size="md" />
          <h3 className="font-semibold text-lg">In Progress</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            12
          </span>
        </div>
        <p className="text-sm text-gray-600">Tasks currently being worked on</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard example showing how flags can be used to categorize and display project statistics. The flags provide immediate visual context for different task categories.',
      },
    },
  },
};

export const PriorityComparison: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4 bg-white rounded-lg border">
      <div className="flex flex-col items-center gap-2">
        <Flag variant="normal" size="lg" />
        <span className="text-sm font-medium text-blue-600">Normal</span>
        <span className="text-xs text-gray-500">Standard priority</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Flag variant="urgent" size="lg" />
        <span className="text-sm font-medium text-red-600">Urgent</span>
        <span className="text-xs text-gray-500">High priority</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
          <span className="text-gray-400 text-xs">None</span>
        </div>
        <span className="text-sm font-medium text-gray-600">None</span>
        <span className="text-xs text-gray-500">No priority</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of all flag variants with descriptions. Shows the visual differences and helps users understand when to use each priority level.',
      },
    },
  },
};

export const ResponsiveSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Mobile/Compact View</h4>
        <div className="flex items-center gap-2">
          <Flag variant="urgent" size="xs" />
          <span className="text-sm">Critical task</span>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Desktop/Standard View</h4>
        <div className="flex items-center gap-2">
          <Flag variant="urgent" size="md" />
          <span className="text-base">Critical task</span>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Large Display/Emphasis</h4>
        <div className="flex items-center gap-2">
          <Flag variant="urgent" size="xl" />
          <span className="text-lg font-medium">Critical task</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Responsive design example showing how different flag sizes can be used across different screen sizes and contexts. Demonstrates the flexibility of the component.',
      },
    },
  },
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
      <Flag variant="normal" size="lg" iconColor="#8B5CF6" />
      <span className="text-sm">Custom purple color</span>
      <Flag variant="urgent" size="lg" iconColor="#059669" />
      <span className="text-sm">Custom green color</span>
      <Flag variant="normal" size="lg" iconColor="#F59E0B" />
      <span className="text-sm">Custom orange color</span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of using custom colors with the iconColor prop. Useful when you need to match specific brand colors or create custom priority systems.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => (
    <div className="p-6 bg-gray-50 rounded-lg text-center">
      <Flag variant="none" size="xl" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        No Priority Set
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        This item doesn't have a priority level assigned yet.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Empty state example showing how the none variant can be used to indicate missing or unset priority levels. Useful for onboarding or placeholder states.',
      },
    },
  },
};
