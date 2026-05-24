import type { Meta, StoryObj } from '@storybook/react';
import { TaskAssignment } from './task-assignment';

const noop = () => undefined;

const meta: Meta<typeof TaskAssignment> = {
  component: TaskAssignment,
  title: 'Components/Tasks/TaskAssignment',
  tags: ['autodocs'],
  argTypes: {
    assignedTo: {
      control: 'object',
      description:
        'User assigned to the task with name, surname, and image URL',
    },
    isAccepted: {
      control: 'boolean',
      description: 'Whether the task has been accepted',
    },
    onAssign: {
      action: 'assign clicked',
      description: 'Callback function when assign button is clicked',
    },
  },
  args: {
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
type Story = StoryObj<typeof TaskAssignment>;

export const Default: Story = {
  args: {
    isAccepted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - no assignment and not accepted',
      },
    },
  },
};

export const AssignedUser: Story = {
  args: {
    assignedTo: {
      name: 'John',
      surname: 'Doe',
      imgUrl: 'https://i.pravatar.cc/40?img=1',
    },
    isAccepted: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Task assigned to a specific user with avatar',
      },
    },
  },
};

export const UnassignedAccepted: Story = {
  args: {
    assignedTo: undefined,
    isAccepted: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Task accepted but not yet assigned to anyone - shows assign button',
      },
    },
  },
};

export const UnassignedNotAccepted: Story = {
  args: {
    assignedTo: undefined,
    isAccepted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Task not accepted and not assigned - shows placeholder',
      },
    },
  },
};

export const AssignedNotAccepted: Story = {
  args: {
    assignedTo: {
      name: 'Jane',
      surname: 'Smith',
      imgUrl: 'https://i.pravatar.cc/40?img=2',
    },
    isAccepted: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Task assigned but not yet accepted',
      },
    },
  },
};

export const AllStates: Story = {
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
          Unassigned Not Accepted
        </p>
        <TaskAssignment
          assignedTo={undefined}
          isAccepted={false}
          onAssign={noop}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Unassigned Accepted
        </p>
        <TaskAssignment
          assignedTo={undefined}
          isAccepted={true}
          onAssign={noop}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Assigned User
        </p>
        <TaskAssignment
          assignedTo={{
            name: 'John',
            surname: 'Doe',
            imgUrl: 'https://i.pravatar.cc/40?img=1',
          }}
          isAccepted={true}
          onAssign={noop}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Assigned Not Accepted
        </p>
        <TaskAssignment
          assignedTo={{
            name: 'Jane',
            surname: 'Smith',
            imgUrl: 'https://i.pravatar.cc/40?img=2',
          }}
          isAccepted={false}
          onAssign={noop}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible states of task assignment displayed together',
      },
    },
  },
};
