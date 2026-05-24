import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UserSelect, UserSelectOption } from './user-select';

const meta: Meta<typeof UserSelect> = {
  title: 'Components/UserSelect',
  component: UserSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
User selection component with search and avatars.

## Features:
- 🔍 Search by user name
- 👤 Support for avatars and initials
- 🎯 Selection from options list
- 📱 Responsive design
- ⌨️ Keyboard navigation
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'Array of options to choose from',
      control: { type: 'object' },
    },
    value: {
      description: 'Current value',
      control: { type: 'text' },
    },
    onChange: {
      description: 'Callback when value changes',
      action: 'changed',
    },
    placeholder: {
      description: 'Placeholder text',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserSelect>;

const sampleUsers: UserSelectOption[] = [
  {
    value: '1',
    label: 'John Smith',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    initials: 'JS',
  },
  {
    value: '2',
    label: 'Sarah Johnson',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    initials: 'SJ',
  },
  {
    value: '3',
    label: 'Michael Brown',
    initials: 'MB',
  },
  {
    value: '4',
    label: 'Emily Davis',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    initials: 'ED',
  },
  {
    value: '5',
    label: 'David Wilson ',
    initials: 'DW',
  },
  {
    value: '6',
    label: 'Lisa Anderson',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    initials: 'LA',
  },
];

const UserSelectDemo = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  return (
    <div style={{ width: '100px ' }}>
      <UserSelect
        options={sampleUsers}
        value={selectedValue}
        onChange={setSelectedValue}
        triggerClassName="w-[200px]"
        placeholder="Select user"
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <UserSelectDemo />,
};
