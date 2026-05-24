import type { Meta, StoryObj } from '@storybook/react';
import { RoleCard } from './role-card';

const meta: Meta<typeof RoleCard> = {
  component: RoleCard,
  title: 'Components/RoleCard',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RoleCard component for displaying role information with assigned users. Shows role title, description, and list of users assigned to the role.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the role',
    },
    description: {
      control: 'text',
      description: 'Description of the role (truncated to 2 lines)',
    },
    assignedUsers: {
      control: 'object',
      description: 'Array of users assigned to this role',
    },
    onEdit: {
      action: 'edit clicked',
      description: 'Callback when edit button is clicked',
    },
    onAddUser: {
      action: 'add user clicked',
      description: 'Callback when add user button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Administrator',
    description:
      'Full access to the entire system, including user management, role assignments, company settings, and integrations.',
    assignedUsers: [
      {
        id: '1',
        initials: 'TJ',
        name: 'Tom Johnson',
        avatarSrc:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
      { id: '2', initials: 'AS', name: 'Alice Smith' },
      {
        id: '3',
        initials: 'KW',
        name: 'Kate Wilson',
        avatarSrc:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      { id: '4', initials: 'CB', name: 'Chris Brown' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default role card with title, description, and assigned users (mix of avatars and initials).',
      },
    },
  },
};

export const WithEditAndAdd: Story = {
  args: {
    title: 'Field advisor',
    description:
      'Access to contractor, order, and farmer information. Can create tasks and view reports but cannot change company settings.',
    assignedUsers: [
      {
        id: '1',
        initials: 'AD',
        name: 'Alex Davis',
        avatarSrc:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      { id: '2', initials: 'DW', name: 'David Wilson' },
      {
        id: '3',
        initials: 'KB',
        name: 'Kelly Brown',
        avatarSrc:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
    onEdit: () => console.log('Edit clicked'),
    onAddUser: () => console.log('Add user clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Role card with edit and add user functionality enabled.',
      },
    },
  },
};

export const SingleUser: Story = {
  args: {
    title: 'Viewer',
    description:
      'Read-only access to view projects and reports. Cannot make changes or assign tasks.',
    assignedUsers: [{ id: '1', initials: 'V', name: 'Victor Chen' }],
  },
  parameters: {
    docs: {
      description: {
        story: 'Role card with only one assigned user.',
      },
    },
  },
};

export const NoUsers: Story = {
  args: {
    title: 'Guest',
    description:
      'Limited access for temporary users. Can only view specific projects and cannot access sensitive information.',
    assignedUsers: [],
    onAddUser: () => console.log('Add user clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Role card with no assigned users, showing add user button.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Super Admin',
    description:
      'This is a very long description that demonstrates how the component handles text that exceeds the maximum allowed length. The description will be truncated with ellipsis to maintain the card layout and prevent overflow issues. This ensures all cards have consistent height regardless of content length.',
    assignedUsers: [{ id: '1', initials: 'S', name: 'Super Admin' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Role card with a long description that gets truncated while maintaining consistent card height.',
      },
    },
  },
};

export const ShortDescription: Story = {
  args: {
    title: 'Basic User',
    description: 'Limited access with basic permissions.',
    assignedUsers: [
      { id: '1', initials: 'BU', name: 'Basic User' },
      { id: '2', initials: 'TU', name: 'Test User' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Role card with short description - demonstrates consistent height.',
      },
    },
  },
};

export const MultipleUsers: Story = {
  args: {
    title: 'Viewer',
    description:
      'Read-only access to data without the ability to edit or create new entries, suitable for users who need to monitor information without making changes.',
    assignedUsers: [
      { id: '1', initials: 'A', name: 'Andrew Taylor' },
      { id: '2', initials: 'D', name: 'Diana Martinez' },
      { id: '3', initials: 'K', name: 'Kevin Johnson' },
      { id: '4', initials: 'L', name: 'Lisa Anderson' },
      { id: '5', initials: 'O', name: 'Olivia White' },
      { id: '6', initials: 'M', name: 'Michael Clark' },
      { id: '7', initials: 'S', name: 'Sarah Wilson' },
      { id: '8', initials: 'T', name: 'Thomas Brown' },
      { id: '9', initials: 'E', name: 'Emily Davis' },
      { id: '10', initials: 'R', name: 'Ryan Miller' },
      { id: '11', initials: 'J', name: 'Jessica Lee' },
      { id: '12', initials: 'C', name: 'Christopher Garcia' },
    ],
    maxVisibleUsers: 6,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Role card with many assigned users, showing +N indicator for overflow.',
      },
    },
  },
};
