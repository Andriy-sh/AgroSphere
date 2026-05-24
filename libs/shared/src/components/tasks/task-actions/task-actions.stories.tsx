import type { Meta, StoryObj } from '@storybook/react';
import { TaskActions } from './task-actions';

const meta: Meta<typeof TaskActions> = {
  component: TaskActions,
  title: 'Components/Tasks/TaskActions',
  tags: ['autodocs'],
  argTypes: {
    taskId: {
      control: 'text',
      description: 'Unique identifier for the task',
    },
    flag: {
      control: { type: 'select' },
      options: ['normal', 'urgent', 'none'],
      description: 'Priority flag for the task',
    },
    status: {
      control: { type: 'select' },
      options: [
        'pending',
        'in_progress',
        'completed',
        'cancelled',
        'Not Started',
      ],
      description: 'Current status of the task',
    },
    isNew: {
      control: 'boolean',
      description: 'Whether the task is new',
    },
    isAccepted: {
      control: 'boolean',
      description: 'Whether the task has been accepted',
    },
    onUpdatePriority: {
      action: 'priority updated',
      description: 'Callback when task priority is updated',
    },
    onUpdateStatus: {
      action: 'status updated',
      description: 'Callback when task status is updated',
    },
    onAcceptTask: {
      action: 'task accepted',
      description: 'Callback when task is accepted',
    },
    onDeclineTask: {
      action: 'task declined',
      description: 'Callback when task is declined',
    },
    onDeleteTask: {
      action: 'task deleted',
      description: 'Callback when task is deleted',
    },
  },
  args: {
    taskId: 'task-123',
    flag: 'normal',
    status: 'pending',
    isNew: false,
    isAccepted: false,
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskActions>;

export const Default: Story = {
  args: {
    taskId: 'task-123',
    flag: 'normal',
    status: 'pending',
  },
};

export const UrgentTask: Story = {
  args: {
    taskId: 'task-456',
    flag: 'urgent',
    status: 'in_progress',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task with urgent priority flag',
      },
    },
  },
};

export const CompletedTask: Story = {
  args: {
    taskId: 'task-789',
    flag: 'normal',
    status: 'completed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task with completed status',
      },
    },
  },
};

export const CancelledTask: Story = {
  args: {
    taskId: 'task-101',
    flag: 'none',
    status: 'cancelled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Cancelled task with limited actions',
      },
    },
  },
};

export const NotStartedTask: Story = {
  args: {
    taskId: 'task-202',
    flag: 'normal',
    status: 'Not Started',
  },
  parameters: {
    docs: {
      description: {
        story: 'Not started task with accept action available',
      },
    },
  },
};

export const NewTask: Story = {
  args: {
    taskId: 'task-303',
    flag: 'urgent',
    status: 'pending',
    isNew: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'New task with urgent priority',
      },
    },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Pending
        </p>
        <TaskActions
          taskId="task-1"
          flag="normal"
          status="pending"
          onUpdatePriority={() => {}}
          onUpdateStatus={() => {}}
          onAcceptTask={() => {}}
          onDeclineTask={() => {}}
          onDeleteTask={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          In Progress
        </p>
        <TaskActions
          taskId="task-2"
          flag="urgent"
          status="in_progress"
          onUpdatePriority={() => {}}
          onUpdateStatus={() => {}}
          onAcceptTask={() => {}}
          onDeclineTask={() => {}}
          onDeleteTask={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Completed
        </p>
        <TaskActions
          taskId="task-3"
          flag="normal"
          status="completed"
          onUpdatePriority={() => {}}
          onUpdateStatus={() => {}}
          onAcceptTask={() => {}}
          onDeclineTask={() => {}}
          onDeleteTask={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Cancelled
        </p>
        <TaskActions
          taskId="task-4"
          flag="none"
          status="cancelled"
          onUpdatePriority={() => {}}
          onUpdateStatus={() => {}}
          onAcceptTask={() => {}}
          onDeclineTask={() => {}}
          onDeleteTask={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Not Started
        </p>
        <TaskActions
          taskId="task-5"
          flag="normal"
          status="Not Started"
          onUpdatePriority={() => {}}
          onUpdateStatus={() => {}}
          onAcceptTask={() => {}}
          onDeclineTask={() => {}}
          onDeleteTask={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All task status variants displayed together for comparison',
      },
    },
  },
};
