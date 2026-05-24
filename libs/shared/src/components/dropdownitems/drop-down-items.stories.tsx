import type { Meta, StoryObj } from '@storybook/react';
import { DropdownActionsNoLib, DropdownActionItem } from './dropdownitems';
import {
  Eye,
  Edit,
  MapPin,
  Info,
  Copy,
  Trash2,
  Trophy,
  Clock,
  CheckCircle2,
  Flag as FlagIcon,
  MoreHorizontal,
} from 'lucide-react';

const meta: Meta<typeof DropdownActionsNoLib> = {
  component: DropdownActionsNoLib,
  title: 'Components/DropdownActionsNoLib',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible, accessible dropdown actions menu for React applications. Supports custom icons, separators, nested submenus, disabled states, custom sections, and external links. Designed for use in toolbars, tables, cards, and anywhere contextual actions are needed.\n\n**Features:**\n- Keyboard navigation and focus management for accessibility\n- Customizable trigger icon and menu styling\n- Supports custom React components as menu sections\n- Nested submenus for grouped actions\n- Disabled and destructive action states\n- Handles click outside and escape to close\n- Responsive positioning (opens up or down, submenu left or right)\n\n**Usage:**\nPass an array of `DropdownActionItem` objects to the `items` prop. Each item can be an action, separator, submenu, or custom section. Optionally customize the trigger icon and menu appearance.\n',
      },
    },
  },
  argTypes: {
    items: {
      description:
        'Array of DropdownActionItem objects defining the menu structure. Supports actions, separators, submenus, and custom sections.',
      control: { type: 'object' },
      table: {
        type: {
          summary: 'DropdownActionItem[]',
        },
      },
    },
    triggerIcon: {
      description:
        'Custom React node for the dropdown trigger button (default: vertical dots icon).',
      control: { type: 'object' },
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: '<MoreVertical size={20} />' },
      },
    },
    triggerClassName: {
      description: 'Optional className for the trigger button.',
      control: { type: 'text' },
      table: { type: { summary: 'string' } },
    },
    contentClassName: {
      description: 'Optional className for the dropdown menu container.',
      control: { type: 'text' },
      table: { type: { summary: 'string' } },
    },
    className: {
      description: 'Optional className for the root container.',
      control: { type: 'text' },
      table: { type: { summary: 'string' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownActionsNoLib>;

const PrioritySection = () => (
  <div>
    <div className="text-xs text-gray-400 mb-1">Priority</div>
    <div className="flex gap-2">
      <FlagIcon className="text-red-500" />
      <FlagIcon className="text-blue-400" />
    </div>
  </div>
);

const statusMenu: DropdownActionItem[] = [
  {
    id: 'not_started',
    label: 'Not started',
    icon: <Trophy className="text-yellow-500" />,
  },
  {
    id: 'in_progress',
    label: 'In progress',
    icon: <Clock className="text-blue-500" />,
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: <CheckCircle2 className="text-green-500" />,
  },
];

const dropdownItems: DropdownActionItem[] = [
  { id: 'priority', customComponent: <PrioritySection /> },
  { id: 'separator1', isSeparator: true },
  { id: 'view', label: 'View details', icon: <Eye /> },
  { id: 'edit', label: 'Edit', icon: <Edit /> },
  { id: 'map', label: 'View on map', icon: <MapPin />, href: '#' },
  {
    id: 'status',
    label: 'Status',
    icon: <Info />,
    children: statusMenu,
  },
  { id: 'duplicate', label: 'Duplicate', icon: <Copy /> },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 />,
    className: 'text-red-600',
  },
];

const onlyActions: DropdownActionItem[] = [
  { id: 'view', label: 'View details', icon: <Eye /> },
  { id: 'edit', label: 'Edit', icon: <Edit /> },
  { id: 'map', label: 'View on map', icon: <MapPin />, href: '#' },
  { id: 'duplicate', label: 'Duplicate', icon: <Copy /> },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 />,
    className: 'text-red-600',
  },
];

const onlySubmenu: DropdownActionItem[] = [
  {
    id: 'status',
    label: 'Status',
    icon: <Info />,
    children: statusMenu,
  },
];

const onlyCustomSection: DropdownActionItem[] = [
  { id: 'priority', customComponent: <PrioritySection /> },
];

const disabledItems: DropdownActionItem[] = [
  { id: 'view', label: 'View details', icon: <Eye />, isDisabled: true },
  { id: 'edit', label: 'Edit', icon: <Edit /> },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 />,
    className: 'text-red-600',
    isDisabled: true,
  },
];

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DropdownActionsNoLib items={dropdownItems} />
    </div>
  ),
};

export const OnlyActions: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DropdownActionsNoLib items={onlyActions} />
    </div>
  ),
};

export const OnlySubmenu: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DropdownActionsNoLib items={onlySubmenu} />
    </div>
  ),
};

export const OnlyCustomSection: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DropdownActionsNoLib items={onlyCustomSection} />
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DropdownActionsNoLib items={disabledItems} />
    </div>
  ),
};

export const CustomTriggerIcon: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <DropdownActionsNoLib
        items={dropdownItems}
        triggerIcon={<MoreHorizontal size={28} />}
      />
    </div>
  ),
};
