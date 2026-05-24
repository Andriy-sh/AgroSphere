import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, RecoveryKeyRow } from './collapsible';
import { User, Settings, FileText, Calendar } from 'lucide-react';

const meta: Meta<typeof Collapsible> = {
  component: Collapsible,
  title: 'Components/Collapsible',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile collapsible component for creating expandable and collapsible content sections with smooth animations. Supports icons, custom styling, and can be used for organizing content into collapsible groups. Built with accessibility in mind, it includes proper ARIA attributes and keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title text displayed in the collapsible header',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Collapsible Section' },
      },
    },
    icon: {
      control: 'object',
      description:
        'Icon component to display next to the title for visual identification',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description:
        'Additional CSS classes to apply to the collapsible container',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the collapsible section is expanded by default',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    children: {
      description: 'Content to display inside the collapsible section',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Collapsible title="Basic Information" defaultOpen={true}>
        <div>This is the content inside the collapsible section.</div>
        <div>You can put any content here.</div>
      </Collapsible>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Basic collapsible section with simple content. This demonstrates the fundamental functionality of expanding and collapsing content.',
      },
    },
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Collapsible
        title="User Profile"
        icon={<User className="w-4 h-4" />}
        defaultOpen={true}
      >
        <div>Name: John Doe</div>
        <div>Email: john@example.com</div>
        <div>Role: Developer</div>
      </Collapsible>

      <Collapsible
        title="Settings"
        icon={<Settings className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div>Theme: Dark</div>
        <div>Notifications: Enabled</div>
        <div>Language: English</div>
      </Collapsible>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple collapsible sections with icons for better visual identification and improved user experience. Icons help users quickly identify the type of content in each section.',
      },
    },
  },
};
