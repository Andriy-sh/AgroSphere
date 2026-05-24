import type { Meta, StoryObj } from '@storybook/react';
import { DetailRow } from './detail-row';
import { Avatar } from '../avatar/avatar';

const meta: Meta<typeof DetailRow> = {
  title: 'Components/DetailRow',
  component: DetailRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    value: {
      control: 'text',
      description: 'Value to display',
    },
    valueClass: {
      control: 'text',
      description: 'Additional CSS classes for value',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'person',
    label: 'Name:',
    value: 'John Doe',
  },
};

export const WithCustomValue: Story = {
  args: {
    icon: 'email',
    label: 'Email:',
    value: 'john.doe@example.com',
    valueClass: 'text-blue-600',
  },
};

export const WithComplexValue: Story = {
  args: {
    icon: 'person',
    label: 'Assigned consultant:',
    children: (
      <div className="flex items-center gap-3">
        <Avatar
          className="rounded-md"
          row={{
            original: {
              client: {
                name: 'John Doe',
                surname: '',
                avatarSrc: '',
              },
            },
          }}
          size="sm"
          tooltipText="John Doe"
        />
        <span className="text-black font-medium">John Doe</span>
      </div>
    ),
  },
};

export const WithTags: Story = {
  args: {
    icon: 'label',
    label: 'Tags:',
    children: (
      <div className="flex gap-2 flex-wrap">
        <span className="bg-[#F3F4F6] text-gray-700 px-2 py-1 text-sm font-medium">
          Premium
        </span>
        <span className="bg-[#F3F4F6] text-gray-700 px-2 py-1 text-sm font-medium">
          Active
        </span>
      </div>
    ),
  },
};

export const EmptyValue: Story = {
  args: {
    icon: 'phone',
    label: 'Phone:',
    value: '---',
  },
};
