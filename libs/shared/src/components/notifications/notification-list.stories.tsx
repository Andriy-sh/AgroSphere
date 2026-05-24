import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NotificationList } from './notification-list';
import {
  mockNotificationGroups,
  markAsRead,
} from '../../mock/mock-notifications';

const meta: Meta<typeof NotificationList> = {
  title: 'Components/NotificationList',
  component: NotificationList,
  parameters: {
    docs: {
      description: {
        component:
          'NotificationList component displays notifications grouped by time periods with custom styling and unread indicators. Now supports completion status indicators.',
      },
    },
  },
  argTypes: {
    notificationGroups: {
      description: 'Array of notification groups to display.',
      control: false,
    },
    onMarkAsRead: {
      description: 'Callback function to mark a specific notification as read.',
      action: 'markAsRead',
    },
    showCompletionStatus: {
      description:
        'Whether to show completion status indicators (red dots for incomplete items).',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationList>;

function NotificationListWithMockDataComponent() {
  const [notificationGroups, setNotificationGroups] = useState(
    mockNotificationGroups
  );

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    setNotificationGroups([...mockNotificationGroups]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <NotificationList
        notificationGroups={notificationGroups}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <NotificationListWithMockDataComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'NotificationList with realistic mock data showing different notification types and read/unread status.',
      },
    },
  },
};
