import type { Meta, StoryObj } from '@storybook/react';
import { TabItem } from './tabs-item';
import { LayoutGrid, Users, Settings, Bell, Calendar } from 'lucide-react';
import { useState } from 'react';

type TabConfig = {
  id: string;
  label: string;
  icon: 'LayoutGrid' | 'Users' | 'Settings' | 'Bell' | 'Home' | 'Calendar';
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  indicatorClassName?: string;
};

const ICON_MAPPING = {
  LayoutGrid: <LayoutGrid size={24} />,
  Users: <Users size={24} />,
  Settings: <Settings size={24} />,
  Bell: <Bell size={24} />,
  Calendar: <Calendar size={24} />,
};

const meta: Meta<typeof TabItem> = {
  title: 'Components/TabItem',
  component: TabItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A professional tab item component designed for agricultural application navigation.

## Component Overview

The TabItem component provides a flexible and accessible way to create navigation tabs
with icons, labels, and interactive states optimized for farm management applications.

## Key Features
- **Icon support**: Lucide React icons for clear visual navigation
- **Active states**: Visual indication of current section
- **Customizable styling**: Flexible theming for all elements
- **Interactive feedback**: Smooth hover and click animations
- **Agricultural focus**: Optimized for farm management workflows
- **Accessibility**: Proper ARIA attributes and keyboard navigation

## Icon Options
- **LayoutGrid**: Dashboard and overview sections
- **Users**: Team management and collaboration
- **Settings**: Configuration and preferences
- **Bell**: Notifications and alerts
- **Calendar**: Scheduling and planning

## Usage Examples
- Farm dashboard navigation
- Equipment monitoring tabs
- Crop management sections
- Team collaboration interfaces
- Settings and configuration panels
- Weather and forecasting tabs
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: Object.keys(ICON_MAPPING),
      mapping: ICON_MAPPING,
      description:
        'Icon to display alongside the tab text for visual navigation',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '<LayoutGrid size={24} />' },
      },
    },
    label: {
      control: 'text',
      description: 'Text label displayed on the tab for navigation',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Table'" },
      },
    },
    isActive: {
      control: 'boolean',
      description:
        'Whether the tab is currently active (shows green indicator)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function triggered when the tab is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the root element',
      table: {
        type: { summary: 'string' },
      },
    },
    iconClassName: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the icon container',
      table: {
        type: { summary: 'string' },
      },
    },
    labelClassName: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the tab text',
      table: {
        type: { summary: 'string' },
      },
    },
    indicatorClassName: {
      control: 'text',
      description:
        'Additional Tailwind CSS classes for the bottom indicator bar',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    label: 'Dashboard',
    icon: <LayoutGrid size={24} />,
    isActive: false,
  },
};

export default meta;
type Story = StoryObj<typeof TabItem>;

export const Default: Story = {
  args: {
    label: 'Dashboard',
    icon: <LayoutGrid size={24} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic tab item with dashboard icon and label, representing the default state for farm management navigation.',
      },
    },
  },
};

export const Active: Story = {
  args: {
    label: 'Team Management',
    icon: <Users size={24} />,
    isActive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Active tab item showing the current section with visual indicator and enhanced styling for team management.',
      },
    },
  },
};

export const CustomStyled: Story = {
  args: {
    label: 'Equipment Settings',
    icon: <Settings size={24} />,
    className: 'bg-blue-100 hover:bg-blue-200',
    labelClassName: 'font-bold text-indigo-700',
    indicatorClassName: 'bg-purple-500',
    isActive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom styled tab item with unique colors and typography for equipment configuration sections.',
      },
    },
  },
};

export const FarmDashboardTabs: Story = {
  render: (args) => {
    function FarmDashboardTabsComponent() {
      const farmTabs: TabConfig[] = [
        { id: 'overview', label: 'Overview', icon: 'LayoutGrid' },
        { id: 'crops', label: 'Crop Management', icon: 'Users' },
        { id: 'equipment', label: 'Equipment', icon: 'Settings' },
        { id: 'weather', label: 'Weather', icon: 'Bell' },
        { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
      ];

      const [activeTab, setActiveTab] = useState('overview');

      const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        args.onClick && args.onClick();
      };

      return (
        <div className="flex border rounded-lg overflow-hidden shadow">
          {farmTabs.map((tab) => (
            <TabItem
              key={tab.id}
              {...args}
              label={tab.label}
              icon={ICON_MAPPING[tab.icon as keyof typeof ICON_MAPPING]}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>
      );
    }
    return <FarmDashboardTabsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete farm dashboard navigation with all major sections including overview, crop management, equipment, weather, and scheduling.',
      },
    },
  },
};

export const EquipmentMonitoringTabs: Story = {
  render: (args) => {
    function EquipmentMonitoringTabsComponent() {
      const equipmentTabs: TabConfig[] = [
        { id: 'tractors', label: 'Tractors', icon: 'LayoutGrid' },
        { id: 'harvesters', label: 'Harvesters', icon: 'Users' },
        { id: 'irrigation', label: 'Irrigation', icon: 'Settings' },
        { id: 'alerts', label: 'Alerts', icon: 'Bell' },
        { id: 'maintenance', label: 'Maintenance', icon: 'Calendar' },
      ];

      const [activeTab, setActiveTab] = useState('tractors');

      const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        args.onClick && args.onClick();
      };

      return (
        <div className="flex border rounded-lg overflow-hidden shadow">
          {equipmentTabs.map((tab) => (
            <TabItem
              key={tab.id}
              {...args}
              label={tab.label}
              icon={ICON_MAPPING[tab.icon as keyof typeof ICON_MAPPING]}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>
      );
    }
    return <EquipmentMonitoringTabsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Equipment monitoring interface with tabs for different machinery types, alerts, and maintenance scheduling.',
      },
    },
  },
};

export const CropManagementTabs: Story = {
  render: (args) => {
    function CropManagementTabsComponent() {
      const cropTabs: TabConfig[] = [
        { id: 'fields', label: 'Fields', icon: 'LayoutGrid' },
        { id: 'planting', label: 'Planting', icon: 'Users' },
        { id: 'growth', label: 'Growth', icon: 'Settings' },
        { id: 'harvest', label: 'Harvest', icon: 'Bell' },
        { id: 'analytics', label: 'Analytics', icon: 'Calendar' },
      ];

      const [activeTab, setActiveTab] = useState('fields');

      const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        args.onClick && args.onClick();
      };

      return (
        <div className="flex border rounded-lg overflow-hidden shadow">
          {cropTabs.map((tab) => (
            <TabItem
              key={tab.id}
              {...args}
              label={tab.label}
              icon={ICON_MAPPING[tab.icon as keyof typeof ICON_MAPPING]}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>
      );
    }
    return <CropManagementTabsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Crop management navigation with sections for field overview, planting schedules, growth monitoring, harvest planning, and analytics.',
      },
    },
  },
};

export const TeamCollaborationTabs: Story = {
  render: (args) => {
    function TeamCollaborationTabsComponent() {
      const teamTabs: TabConfig[] = [
        { id: 'members', label: 'Team Members', icon: 'Users' },
        { id: 'tasks', label: 'Tasks', icon: 'LayoutGrid' },
        { id: 'notifications', label: 'Notifications', icon: 'Bell' },
        { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
        { id: 'settings', label: 'Settings', icon: 'Settings' },
      ];

      const [activeTab, setActiveTab] = useState('members');

      const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        args.onClick && args.onClick();
      };

      return (
        <div className="flex border rounded-lg overflow-hidden shadow">
          {teamTabs.map((tab) => (
            <TabItem
              key={tab.id}
              {...args}
              label={tab.label}
              icon={ICON_MAPPING[tab.icon as keyof typeof ICON_MAPPING]}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>
      );
    }
    return <TeamCollaborationTabsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Team collaboration interface with tabs for member management, task assignment, notifications, scheduling, and team settings.',
      },
    },
  },
};

export const WeatherMonitoringTabs: Story = {
  render: (args) => {
    function WeatherMonitoringTabsComponent() {
      const weatherTabs: TabConfig[] = [
        { id: 'current', label: 'Current', icon: 'LayoutGrid' },
        { id: 'forecast', label: 'Forecast', icon: 'Calendar' },
        { id: 'alerts', label: 'Alerts', icon: 'Bell' },
        { id: 'history', label: 'History', icon: 'Users' },
        { id: 'settings', label: 'Settings', icon: 'Settings' },
      ];

      const [activeTab, setActiveTab] = useState('current');

      const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        args.onClick && args.onClick();
      };

      return (
        <div className="flex border rounded-lg overflow-hidden shadow">
          {weatherTabs.map((tab) => (
            <TabItem
              key={tab.id}
              {...args}
              label={tab.label}
              icon={ICON_MAPPING[tab.icon as keyof typeof ICON_MAPPING]}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>
      );
    }
    return <WeatherMonitoringTabsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Weather monitoring interface with tabs for current conditions, forecasts, weather alerts, historical data, and monitoring settings.',
      },
    },
  },
};
