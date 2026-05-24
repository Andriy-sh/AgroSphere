import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'Dialog is a modal component for displaying content above an overlay. It is used for confirmations, forms, notifications, and custom content. The Dialog component is accessible, supports keyboard navigation, focus trapping, and can be closed with the Escape key or by clicking outside. It is highly customizable and suitable for a wide range of use cases in modern web applications.',
      },
    },
  },
  argTypes: {
    isOpen: {
      description: 'Controls whether the dialog is open (visible) or closed.',
      control: 'boolean',
    },
    onClose: {
      description:
        'Callback function called when the dialog requests to close (e.g., overlay click, Escape key).',
      action: 'closed',
    },
    title: {
      description: 'Title text displayed at the top of the dialog.',
      control: 'text',
    },
    children: {
      description: 'Dialog content. Can be any valid React node.',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function PlaygroundComponent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Open Dialog
      </button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Welcome to LiveFarm!"
      >
        <div className="space-y-4 text-gray-700">
          <p>
            Thank you for joining the LiveFarm platform. Here you can manage
            your tasks, monitor field activity, and collaborate with your team.
          </p>
          <ul className="list-disc pl-5">
            <li>📍 Track soil sampling and reports</li>
            <li>👥 Assign team members</li>
            <li>📅 Real-time updates</li>
          </ul>
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Got it!
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'A general-purpose dialog for displaying welcome messages, onboarding, or any custom content. Demonstrates basic usage and closing the dialog.',
      },
    },
  },
};

function FormDialogComponent() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Open Form
      </button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Subscribe to Newsletter"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Subscribed with ${email}`);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export const FormDialog: Story = {
  render: () => <FormDialogComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Dialog with a form for user input. Useful for newsletter subscriptions, login forms, or any modal form interaction.',
      },
    },
  },
};

function DatePickerDialogComponent() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Pick a Date
      </button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Select a date for inspection"
      >
        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                alert(`Selected date: ${date}`);
                setOpen(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export const DatePickerDialog: Story = {
  render: () => <DatePickerDialogComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Dialog with a date picker input. Useful for scheduling, booking, or selecting dates in a modal context.',
      },
    },
  },
};

function TextOnlyDialogComponent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Show Info
      </button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="About this system"
      >
        <div className="text-gray-700 space-y-2">
          <p>
            This system is designed to help farmers keep track of their field
            activities.
          </p>
          <p>
            You can create tasks, assign workers, and analyze results in one
            place.
          </p>
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export const TextOnlyDialog: Story = {
  render: () => <TextOnlyDialogComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Dialog for displaying informational text. Useful for help dialogs, about sections, or system messages.',
      },
    },
  },
};

function ConfirmationDialogComponent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Task
      </button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Are you sure?"
      >
        <div className="text-gray-700 space-y-4">
          <p>
            This action will permanently delete the selected task. This cannot
            be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Task deleted');
                setOpen(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export const ConfirmationDialog: Story = {
  render: () => <ConfirmationDialogComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Confirmation dialog for destructive actions. Useful for delete confirmations, irreversible changes, or critical user decisions.',
      },
    },
  },
};
