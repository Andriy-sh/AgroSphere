import  { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NotificationsDialog } from './notifications-dialog';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '../button/button';
import { Badge } from '../badge/badge';

const meta: Meta<typeof NotificationsDialog> = {
  title: 'Components/NotificationsDialog',
  component: NotificationsDialog,
  parameters: {
    docs: {
      description: {
        component:
          'NotificationsDialog is a specialized dialog component for displaying notifications. It uses base-ui directly and is positioned relative to the sidebar. It provides a custom layout optimized for notification content with proper z-index management.',
      },
    },
  },
  argTypes: {
    isOpen: {
      description:
        'Controls whether the notifications dialog is open (visible) or closed.',
      control: 'boolean',
    },
    onClose: {
      description:
        'Callback function called when the dialog requests to close.',
      action: 'closed',
    },
    sidebarWidth: {
      description: 'Width of the sidebar to calculate proper positioning.',
      control: 'number',
    },
    children: {
      description:
        'Dialog content. Typically includes notification header, tabs, and list.',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationsDialog>;

function BasicNotificationsDialogComponent() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const unreadCount = 3;

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Open Notifications
      </button>
      <NotificationsDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        sidebarWidth={280}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('Mark all as read')}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex p-2 bg-gray-100 rounded-lg mx-4 my-4">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md flex items-center justify-center gap-2 ${
              activeTab === 'unread'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
            {unreadCount > 0 && (
              <Badge
                variant="notification"
                size="xs"
                className="bg-gray-200 text-gray-600"
              >
                {unreadCount}
              </Badge>
            )}
          </button>
        </div>

        <div className="h-[400px] overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">John Doe</span> assigned you a
                  new task
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Soil sampling - Field A
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JS
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Jane Smith</span> uploaded
                  documents
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  soil_analysis_report.pdf
                </p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                MJ
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Mike Johnson</span> commented on
                  your task
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  "Great work on the soil analysis!"
                </p>
                <p className="text-xs text-gray-400 mt-1">30 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </NotificationsDialog>
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicNotificationsDialogComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Basic notifications dialog with header, tabs, and sample notification items. Demonstrates the typical usage pattern.',
      },
    },
  },
};

function EmptyNotificationsDialogComponent() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Open Empty Notifications
      </button>
      <NotificationsDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        sidebarWidth={280}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-gray-900 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'text-gray-900 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
          <img
            src="/notification-error.svg"
            alt="No notifications"
            className="w-32 h-32 mb-4 opacity-60"
          />
          <p className="text-lg font-medium text-center">No notifications</p>
          <p className="text-sm text-center">
            {activeTab === 'unread'
              ? 'All notifications are read'
              : "You're all caught up"}
          </p>
        </div>
      </NotificationsDialog>
    </div>
  );
}

export const Empty: Story = {
  render: () => <EmptyNotificationsDialogComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Notifications dialog showing empty state when there are no notifications to display.',
      },
    },
  },
};

function CustomPositioningComponent() {
  const [open, setOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Open Notifications
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sidebar Width:</label>
          <input
            type="range"
            min="200"
            max="400"
            value={sidebarWidth}
            onChange={(e) => setSidebarWidth(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600">{sidebarWidth}px</span>
        </div>
      </div>

      <div className="w-full h-4 bg-gray-200 rounded relative">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded"
          style={{ width: `${sidebarWidth}px` }}
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-gray-600">
          Sidebar: {sidebarWidth}px | Notifications dialog will appear to the
          right
        </div>
      </div>

      <NotificationsDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        sidebarWidth={sidebarWidth}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600">
            This dialog is positioned {sidebarWidth + 8}px from the left edge of
            the screen.
          </p>
        </div>
      </NotificationsDialog>
    </div>
  );
}

export const CustomPositioning: Story = {
  render: () => <CustomPositioningComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how the notifications dialog positioning adapts to different sidebar widths.',
      },
    },
  },
};
