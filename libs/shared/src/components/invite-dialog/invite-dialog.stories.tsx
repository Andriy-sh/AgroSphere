import type { Meta, StoryObj } from '@storybook/react';
import { InviteDialog } from './invite-dialog';
import { User, Users } from 'lucide-react';

const meta: Meta<typeof InviteDialog> = {
  title: 'Components/InviteDialog',
  component: InviteDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
    },
    showRoleSelector: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockRoleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'field-advisor', label: 'Field Advisor' },
  { value: 'contractor-manager', label: 'Contractor Manager' },
  { value: 'support', label: 'Support' },
  { value: 'viewer', label: 'Viewer' },
];

export const InviteUsers: Story = {
  args: {
    isOpen: true,
    title: 'Invite team members',
    icon: (
      <div className="w-8 h-8 bg-basic-green rounded-lg flex items-center justify-center">
        <Users className="w-5 h-5 text-white" />
      </div>
    ),
    showRoleSelector: true,
    roleOptions: mockRoleOptions,
    onClose: () => console.log('Dialog closed'),
    onInvite: (items: Array<{ id: string; email: string; role?: string }>) =>
      console.log('Inviting users:', items),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog for inviting team members with role selection.',
      },
    },
  },
};
