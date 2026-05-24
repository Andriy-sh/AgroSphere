import type { Meta, StoryObj } from '@storybook/react';
import { LabDataRow } from './lab-data-row';
import { Beaker, User, Calendar } from 'lucide-react';

const meta: Meta<typeof LabDataRow> = {
  title: 'Components/LabDataRow',
  component: LabDataRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    icon: <Beaker size={16} />,
    label: 'Lab',
    children: <span className="text-sm font-medium text-gray-900">LabNº1</span>,
  },
};

export const WithUser: Story = {
  args: {
    icon: <User size={16} />,
    label: 'Client',
    children: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-medium">
          K
        </div>
        <span className="text-sm text-gray-700">Kristin Wood</span>
      </div>
    ),
  },
};

export const WithDate: Story = {
  args: {
    icon: <Calendar size={16} />,
    label: 'Sample date',
    children: (
      <span className="text-sm font-medium text-gray-900">June 25, 2025</span>
    ),
  },
};

export const WithoutIcon: Story = {
  args: {
    label: 'Custom field',
    children: (
      <span className="text-sm font-medium text-gray-900">Custom value</span>
    ),
  },
};
