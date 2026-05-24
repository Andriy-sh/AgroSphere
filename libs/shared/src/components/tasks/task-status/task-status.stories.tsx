import type { Meta, StoryObj } from '@storybook/react';
import { TaskStatus } from './task-status';

const noop = () => undefined;

const meta: Meta<typeof TaskStatus> = {
  component: TaskStatus,
  title: 'Components/Tasks/TaskStatus',
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending', 'in_progress', 'completed', 'cancelled'],
      description: 'Current status of the task',
    },
    isNew: {
      control: 'boolean',
      description: 'Whether the task is new and requires acceptance',
    },
    showActions: {
      control: 'boolean',
      description: 'Whether to show accept/decline actions for new tasks',
    },
    onAccept: {
      action: 'task accepted',
      description: 'Callback function when task is accepted',
    },
    onDecline: {
      action: 'task declined',
      description: 'Callback function when task is declined',
    },
  },
  args: {
    status: 'pending',
    isNew: false,
    showActions: false,
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
type Story = StoryObj<typeof TaskStatus>;

export const Default: Story = {
  args: {
    status: 'pending',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default task status display',
      },
    },
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task with pending status',
      },
    },
  },
};

export const InProgress: Story = {
  args: {
    status: 'in_progress',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task currently in progress',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    status: 'complete',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task that has been completed',
      },
    },
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task that has been cancelled',
      },
    },
  },
};

export const NewTaskWithActions: Story = {
  args: {
    status: 'pending',
    isNew: true,
    showActions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'New task that shows accept/decline actions',
      },
    },
  },
};

export const NewTaskWithoutActions: Story = {
  args: {
    status: 'pending',
    isNew: true,
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'New task without showing actions (shows status indicator instead)',
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
        <TaskStatus
          status="pending"
          onAccept={() => undefined}
          onDecline={() => undefined}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          In Progress
        </p>
        <TaskStatus
          status="in_progress"
          onAccept={() => undefined}
          onDecline={() => undefined}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Completed
        </p>
        <TaskStatus
          status="complete"
          onAccept={() => undefined}
          onDecline={() => undefined}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Cancelled
        </p>
        <TaskStatus status="cancelled" onAccept={noop} onDecline={noop} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All task status variants displayed together',
      },
    },
  },
};

export const NewTaskComparison: Story = {
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
          New Task with Actions
        </p>
        <TaskStatus
          status="pending"
          isNew={true}
          showActions={true}
          onAccept={noop}
          onDecline={noop}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          New Task without Actions
        </p>
        <TaskStatus
          status="pending"
          isNew={true}
          showActions={false}
          onAccept={noop}
          onDecline={noop}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Regular Task
        </p>
        <TaskStatus
          status="pending"
          isNew={false}
          showActions={false}
          onAccept={noop}
          onDecline={noop}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison between new tasks with/without actions and regular tasks',
      },
    },
  },
};
