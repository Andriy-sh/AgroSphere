import type { Meta, StoryObj } from '@storybook/react';
import { RoleDialog } from './role-dialog';

const meta: Meta<typeof RoleDialog> = {
  title: 'Components/RoleDialog',
  component: RoleDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['create', 'edit'],
    },
    isOpen: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvailableUsers = [
  {
    id: '1',
    name: 'Theresa Walker',
    initials: 'TW',
    avatarSrc:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Albert Ford',
    initials: 'AF',
  },
  {
    id: '3',
    name: 'Kristin Wilson',
    initials: 'KW',
    avatarSrc:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Cameron Williams',
    initials: 'CW',
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    initials: 'SJ',
  },
];

const mockRole = {
  id: '1',
  title: 'Administrator',
  description:
    'Full access to the entire system, including user management, role assignments, company settings, and integrations.',
  assignedUsers: [
    {
      id: '1',
      name: 'Theresa Walker',
      initials: 'TW',
      avatarSrc:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Albert Ford',
      initials: 'AF',
    },
    {
      id: '3',
      name: 'Kristin Wilson',
      initials: 'KW',
      avatarSrc:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'Cameron Williams',
      initials: 'CW',
    },
  ],
};


export const CreateMode: Story = {
  args: {
    isOpen: true,
    mode: 'create',
    availableUsers: mockAvailableUsers,
    onClose: () => console.log('Dialog closed'),
    onSave: (roleData: {
      title: string;
      description: string;
      assignedUsers: any[];
    }) => console.log('Role saved:', roleData),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog for creating a new role with empty form fields.',
      },
    },
  },
};

export const EditMode: Story = {
  args: {
    isOpen: true,
    mode: 'edit',
    role: mockRole,
    availableUsers: mockAvailableUsers,
    onClose: () => console.log('Dialog closed'),
    onSave: (roleData: {
      title: string;
      description: string;
      assignedUsers: any[];
    }) => console.log('Role updated:', roleData),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dialog for editing an existing role with pre-filled form fields and assigned users.',
      },
    },
  },
};
