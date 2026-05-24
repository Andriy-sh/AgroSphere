import type { Meta, StoryObj } from '@storybook/react';
import { TaskAcceptDecline } from './task-accept-decline';

const meta: Meta<typeof TaskAcceptDecline> = {
  component: TaskAcceptDecline,
  title: 'Components/Tasks/TaskAcceptDecline',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the accept/decline buttons',
    },
    onAccept: {
      action: 'accepted',
      description: 'Callback function when accept button is clicked',
    },
    onDecline: {
      action: 'declined',
      description: 'Callback function when decline button is clicked',
    },
  },
  args: {
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskAcceptDecline>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant of the accept/decline buttons',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant of the accept/decline buttons',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div>
        <p style={{ marginBottom: '10px', fontSize: '14px' }}>Small</p>
        <TaskAcceptDecline size="sm" onAccept={() => {}} onDecline={() => {}} />
      </div>
      <div>
        <p style={{ marginBottom: '10px', fontSize: '14px' }}>Medium</p>
        <TaskAcceptDecline size="md" onAccept={() => {}} onDecline={() => {}} />
      </div>
      <div>
        <p style={{ marginBottom: '10px', fontSize: '14px' }}>Large</p>
        <TaskAcceptDecline size="lg" onAccept={() => {}} onDecline={() => {}} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All size variants displayed together for comparison',
      },
    },
  },
}; 