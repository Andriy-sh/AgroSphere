import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Settings,
  User,
  Home,
  Star,
} from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states. Supports icons, different visual styles, and can be used for various actions like forms, navigation, and user interactions. The button component is built with accessibility in mind and supports keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'cancel',
        'update',
        'complete',
      ],
      description: 'Visual style variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component using Radix Slot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content (text, icons, or other elements)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
      table: {
        type: { summary: 'function' },
      },
    },
    className: {
      description: 'Additional CSS classes to apply to the button',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Standard button with default styling. This is the primary button variant used for main actions and calls-to-action.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Destructive button variant used for dangerous actions like deleting items, canceling subscriptions, or other irreversible operations.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Outline button variant with a border and transparent background. Used for secondary actions that are less prominent than the primary action.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Secondary button variant with a subtle background color. Used for supporting actions that complement the primary action.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ghost button variant with minimal styling. Used for subtle actions, navigation, or when you want the button to blend into the background.',
      },
    },
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Link button variant that looks like a text link but behaves like a button. Used for actions that should appear less prominent than regular buttons.',
      },
    },
  },
};

export const Cancel: Story = {
  args: {
    variant: 'cancel',
    children: 'Cancel',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cancel button variant with neutral styling. Used for canceling operations, closing dialogs, or abandoning changes.',
      },
    },
  },
};

export const Update: Story = {
  args: {
    variant: 'update',
    children: 'Update',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Update button variant with positive styling. Used for saving changes, updating information, or confirming modifications.',
      },
    },
  },
};

export const Complete: Story = {
  args: {
    variant: 'complete',
    children: 'Complete',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete button variant with success styling. Used for finishing tasks, completing workflows, or marking items as done.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Small button size for compact layouts, toolbars, or when space is limited. Maintains readability while taking up less space.',
      },
    },
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <Plus />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon button size for buttons that contain only icons. Perfect for toolbars, action menus, or when you need compact icon-only buttons.',
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Edit />
        Edit
      </Button>
      <Button variant="destructive" size="sm">
        <Trash2 />
        Delete
      </Button>
      <Button variant="complete" size="sm">
        Complete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Group of buttons with different variants and icons for common item actions like edit, delete, and complete.',
      },
    },
  },
};

export const ActionButtons: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="default">
        <Plus />
        Create
      </Button>
      <Button variant="outline">
        <Upload />
        Import
      </Button>
      <Button variant="ghost">
        <Settings />
        Settings
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Common action buttons used in forms and toolbars with different priority levels and visual hierarchy.',
      },
    },
  },
};

export const NavigationButtons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm">
        <Home />
        Home
      </Button>
      <Button variant="ghost" size="sm">
        <User />
        Profile
      </Button>
      <Button variant="ghost" size="sm">
        <Star />
        Favorites
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation buttons with ghost variant and icons for sidebar navigation or header menus.',
      },
    },
  },
};

export const FormButtons: Story = {
  render: () => (
    <div className="flex gap-3 justify-end">
      <Button variant="cancel">Cancel</Button>
      <Button variant="update">Save Changes</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Typical form action buttons with cancel and save actions, commonly used at the bottom of forms.',
      },
    },
  },
};

export const DialogButtons: Story = {
  render: () => (
    <div className="flex gap-3 justify-end">
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dialog confirmation buttons with cancel and destructive actions for confirmation dialogs and modal windows.',
      },
    },
  },
};

export const InCard: Story = {
  render: () => (
    <div className="max-w-sm bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Task Card</h3>
      <p className="text-gray-600 mb-4">
        Complete the soil sampling in Field 3
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit />
          Edit
        </Button>
        <Button variant="complete" size="sm">
          Complete
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Buttons in a realistic card context showing how they integrate with content cards and task management interfaces.',
      },
    },
  },
};

export const InToolbar: Story = {
  render: () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            <Plus />
            New
          </Button>
          <Button variant="outline" size="sm">
            <Upload />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Settings />
          </Button>
          <Button variant="ghost" size="sm">
            <Search />
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Buttons in a toolbar layout with primary actions on the left and utility actions on the right, commonly used in data tables and management interfaces.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Default</h4>
          <Button variant="default">Default</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Destructive</h4>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Outline</h4>
          <Button variant="outline">Outline</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Secondary</h4>
          <Button variant="secondary">Secondary</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Ghost</h4>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Link</h4>
          <Button variant="link">Link</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Cancel</h4>
          <Button variant="cancel">Cancel</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Update</h4>
          <Button variant="update">Update</Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Complete</h4>
          <Button variant="complete">Complete</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of all available button variants in a grid layout. This helps designers and developers understand the visual differences between each variant.',
      },
    },
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Default Disabled</h4>
          <Button variant="default" disabled>
            Disabled
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Outline Disabled</h4>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Destructive Disabled</h4>
          <Button variant="destructive" disabled>
            Disabled
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Icon Disabled</h4>
          <Button variant="default" size="icon" disabled>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled button states for different variants. Disabled buttons are non-interactive and typically used when an action is not available or when form validation fails.',
      },
    },
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Icon</h4>
          <Button variant="default" size="icon">
            <Plus />
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Small</h4>
          <Button variant="default" size="sm">
            Small
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Default</h4>
          <Button variant="default" size="default">
            Default
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Large</h4>
          <Button variant="default" size="md">
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of all available button sizes. Choose the size that best fits your layout and content requirements.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button variant="default">
          <Plus />
          Add Item
        </Button>
        <Button variant="outline">
          <Edit />
          Edit
        </Button>
        <Button variant="destructive">
          <Trash2 />
          Delete
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" size="sm">
          <Settings />
          Settings
        </Button>
        <Button variant="ghost" size="sm">
          <User />
          Profile
        </Button>
        <Button variant="ghost" size="sm">
          <Search />
          Search
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Buttons with icons and text combinations. Icons help users quickly identify button actions and improve the overall user experience.',
      },
    },
  },
};
