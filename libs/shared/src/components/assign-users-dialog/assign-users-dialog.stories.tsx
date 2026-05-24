import type { Meta, StoryObj } from '@storybook/react';
import { AssignUsersDialog, AssignableUser } from './assign-users-dialog';

const meta: Meta<typeof AssignUsersDialog> = {
  title: 'Components/AssignUsersDialog',
  component: AssignUsersDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    showUserRole: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    searchPlaceholder: {
      control: 'text',
    },
    saveButtonText: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUsers: AssignableUser[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Manager',
    avatar: '',
    initials: 'JD',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Developer',
    avatar: '',
    initials: 'JS',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    role: 'Designer',
    avatar: '',
    initials: 'BJ',
  },
  {
    id: '4',
    name: 'Alice Brown',
    role: 'QA',
    avatar: '',
    initials: 'AB',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    role: 'Product Manager',
    avatar: '',
    initials: 'CW',
  },
];

export const Default: Story = {
  args: {
    isOpen: true,
    users: mockUsers,
    selectedUserIds: ['1', '3'],
    onClose: () => console.log('Dialog closed'),
    onSelectionChange: (selectedIds: string[]) =>
      console.log('Selection changed:', selectedIds),
    onSave: () => console.log('Save clicked'),
  },
};
