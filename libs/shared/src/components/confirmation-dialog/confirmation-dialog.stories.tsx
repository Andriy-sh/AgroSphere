import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationDialog } from './confirmation-dialog';
import { Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const meta: Meta<typeof ConfirmationDialog> = {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
    },
    confirmButtonVariant: {
      control: { type: 'select' },
      options: ['danger', 'primary'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DeleteConfirmation: Story = {
  args: {
    isOpen: true,
    title: 'Delete user!',
    message:
      'Are you sure you want to delete this user? This action is irreversible.',
    confirmText: 'Delete',
    confirmButtonVariant: 'danger',
    icon: (
      <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
        <Trash2 className="w-5 h-5 text-red-600" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('User deleted'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for deleting a user with danger variant.',
      },
    },
  },
};

export const DeactivateUser: Story = {
  args: {
    isOpen: true,
    title: 'Deactivate user!',
    message:
      'Are you sure you want to deactivate this user? After deactivation, the user will no longer be able to log in to the system.',
    confirmText: 'Deactivate',
    confirmButtonVariant: 'danger',
    icon: (
      <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-red-600" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('User deactivated'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for deactivating a user.',
      },
    },
  },
};

export const ActivateConnection: Story = {
  args: {
    isOpen: true,
    title: 'Activate connection!',
    message:
      'This will reactivate your connection with John Doe. You will be able to assign new tasks and receive task requests again.',
    confirmText: 'Activate',
    confirmButtonVariant: 'primary',
    icon: (
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-green-500" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Connection activated'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Confirmation dialog for activating a connection with primary variant.',
      },
    },
  },
};

export const RemoveConnection: Story = {
  args: {
    isOpen: true,
    title: 'Remove connection!',
    message:
      'This will permanently remove your connection with Jane Smith. You will no longer be able to assign new tasks or receive task requests.',
    confirmText: 'Remove',
    confirmButtonVariant: 'danger',
    icon: (
      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <Trash2 className="w-6 h-6 text-red-500" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Connection removed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for removing a connection.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    isOpen: true,
    title: 'Confirm action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Yes',
    size: 'sm',
    icon: (
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <Info className="w-4 h-4 text-blue-600" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Action confirmed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size confirmation dialog.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    title: 'Important System Update',
    message:
      'This update will restart the system and may cause temporary downtime. All unsaved work will be lost. Are you sure you want to proceed with the update?',
    confirmText: 'Update Now',
    size: 'lg',
    icon: (
      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-orange-600" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('System update started'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size confirmation dialog for important actions.',
      },
    },
  },
};

export const NoIcon: Story = {
  args: {
    isOpen: true,
    title: 'Simple Confirmation',
    message: 'Do you want to save your changes?',
    confirmText: 'Save',
    confirmButtonVariant: 'primary',
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Changes saved'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog without an icon.',
      },
    },
  },
};

export const CustomCancelText: Story = {
  args: {
    isOpen: true,
    title: 'Discard Changes',
    message: 'You have unsaved changes. Are you sure you want to discard them?',
    confirmText: 'Discard',
    cancelText: 'Keep Editing',
    confirmButtonVariant: 'danger',
    icon: (
      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Changes discarded'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog with custom cancel button text.',
      },
    },
  },
};
