import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Components/Badge',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile badge component for displaying status indicators, notifications, labels, and counts. Supports multiple variants and sizes for different use cases. The badge can be used to highlight important information, show status, or display numerical indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant of the badge',
      control: { type: 'select' },
      options: ['default', 'ghost', 'notification'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'Size of the badge component',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      description: 'Content to display inside the badge',
      control: 'text',
      defaultValue: 'Badge',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      description: 'Additional CSS classes to apply to the badge',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: '42',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing different badge configurations. Use the controls panel to experiment with variants, sizes, and content.',
      },
    },
  },
};

export const AllVariants: Story = {
  args: {
    children: '52',
  },
  argTypes: {
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
    children: {
      name: 'Badge Text',
      control: { type: 'text' },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {['default', 'ghost', 'notification'].map((variant) => (
        <div key={variant} className="flex flex-wrap gap-2 items-center">
          {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
            <Badge key={size} variant={variant as any} size={size as any}>
              {args.children}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive view of all badge variants and sizes. This demonstrates the complete range of styling options available for the badge component.',
      },
    },
  },
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Badge variant="default" size="md">
        23
      </Badge>
      <Badge variant="ghost" size="md">
        15
      </Badge>
      <Badge variant="notification" size="md">
        42
      </Badge>
      <Badge variant="default" size="sm">
        8
      </Badge>
      <Badge variant="ghost" size="sm">
        12
      </Badge>
      <Badge variant="notification" size="sm">
        31
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Common use case for badges as status indicators. Different variants can represent different states or priorities.',
      },
    },
  },
};

export const NotificationCounts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative">
        <span className="text-lg">Messages</span>
        <Badge
          variant="notification"
          size="xs"
          className="absolute -top-2 -right-2"
        >
          7
        </Badge>
      </div>
      <div className="relative">
        <span className="text-lg">Tasks</span>
        <Badge
          variant="notification"
          size="sm"
          className="absolute -top-1 -right-1"
        >
          23
        </Badge>
      </div>
      <div className="relative">
        <span className="text-lg">Updates</span>
        <Badge
          variant="notification"
          size="md"
          className="absolute -top-2 -right-2"
        >
          156
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges used as notification counters. The notification variant is particularly useful for highlighting unread counts or important numbers.',
      },
    },
  },
};

export const TaskPriorities: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>High Priority:</span>
        <Badge variant="notification" size="md">
          5
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Medium Priority:</span>
        <Badge variant="default" size="md">
          12
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Low Priority:</span>
        <Badge variant="ghost" size="md">
          28
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Using badges to indicate task priorities. Different variants help users quickly identify the importance level of tasks.',
      },
    },
  },
};

export const UserRoles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="notification" size="sm">
        3
      </Badge>
      <Badge variant="default" size="sm">
        7
      </Badge>
      <Badge variant="ghost" size="sm">
        15
      </Badge>
      <Badge variant="notification" size="sm">
        2
      </Badge>
      <Badge variant="default" size="sm">
        9
      </Badge>
      <Badge variant="ghost" size="sm">
        24
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges used to display user roles and permissions. This helps in user management interfaces and access control displays.',
      },
    },
  },
};

export const DocumentStatus: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span>Document Status:</span>
        <Badge variant="notification" size="sm">
          18
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Review Status:</span>
        <Badge variant="default" size="sm">
          6
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Version:</span>
        <Badge variant="ghost" size="sm">
          21
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Badges in document management systems to show publication status, review state, and version information.',
      },
    },
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">Extra Small:</span>
        <Badge variant="default" size="xs">
          8
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">Small:</span>
        <Badge variant="default" size="sm">
          16
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">Medium:</span>
        <Badge variant="default" size="md">
          32
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">Large:</span>
        <Badge variant="default" size="lg">
          64
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">Extra Large:</span>
        <Badge variant="default" size="xl">
          128
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">2XL:</span>
        <Badge variant="default" size="2xl">
          256
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of all available badge sizes. This helps in choosing the appropriate size for different contexts and content lengths.',
      },
    },
  },
};
