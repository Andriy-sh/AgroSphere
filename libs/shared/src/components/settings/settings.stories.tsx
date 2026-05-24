import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SettingsTabs } from './tabs';
import { SectionHeader } from './section-header';
import { SimpleSectionHeader } from './simple-section-header';
import { SettingsTabHeader } from './settings-tab-header';
import { PreferenceOption } from './preference-option';
import { Button } from '../button/button';

const meta: Meta = {
  title: 'Components/Settings',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const SettingsTabsDemo = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'person', group: 'default' },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications',
      group: 'default',
    },
    { id: 'security', label: 'Security', icon: 'security', group: 'default' },
    {
      id: 'company',
      label: 'Company',
      icon: 'business',
      group: 'Organisation settings',
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: 'credit_card',
      group: 'Organisation settings',
    },
  ];

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-xl h-[90vh]">
      <SettingsTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

const SectionHeaderDemo = () => (
  <div className="bg-white border border-gray-200 rounded-lg">
    <SectionHeader title="Personal Information">
      <Button variant="outline" size="sm">
        Edit
      </Button>
    </SectionHeader>
    <div className="p-6">
      <p className="text-gray-600">Content goes here...</p>
    </div>
  </div>
);

const SimpleSectionHeaderDemo = () => (
  <div className="bg-white border border-gray-200 rounded-lg">
    <SimpleSectionHeader title="Notification Preferences" />
    <div className="p-6">
      <p className="text-gray-600">Content goes here...</p>
    </div>
  </div>
);

const PreferenceOptionDemo = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  return (
    <div className="max-w-md bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <PreferenceOption
        icon="notifications"
        title="Push Notifications"
        description="Receive notifications about important updates and activities"
        enabled={notificationsEnabled}
        onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
      />

      <PreferenceOption
        icon="email"
        title="Email Notifications"
        description="Get notified via email about system updates"
        enabled={emailEnabled}
        onToggle={() => setEmailEnabled(!emailEnabled)}
      />

      <PreferenceOption
        title="Dark Mode"
        description="Switch between light and dark theme"
        enabled={darkModeEnabled}
        onToggle={() => setDarkModeEnabled(!darkModeEnabled)}
      />
    </div>
  );
};

export const SettingsTabsStory: Story = {
  render: () => <SettingsTabsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'SettingsTabs component provides navigation between different settings sections. It supports grouping tabs and shows the active tab with green color.',
      },
    },
  },
};


export const SectionHeaderStory: Story = {
  render: () => <SectionHeaderDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'SectionHeader component displays a section title with optional action buttons on the right side.',
      },
    },
  },
};

export const SimpleSectionHeaderStory: Story = {
  render: () => <SimpleSectionHeaderDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'SimpleSectionHeader component displays a simple section title without any action buttons.',
      },
    },
  },
};

export const PreferenceOptionStory: Story = {
  render: () => (
    <div className=" bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <PreferenceOption
        icon="notifications"
        title="Push Notifications"
        description="Receive notifications about important updates and activities"
        enabled={true}
        onToggle={() => undefined}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'PreferenceOption component displays a toggleable setting with optional icon, title, description, and toggle switch.',
      },
    },
  },
};
