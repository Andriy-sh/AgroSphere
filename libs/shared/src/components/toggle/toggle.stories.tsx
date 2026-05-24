import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ToggleWithState = ({
  size = 'md',
  disabled = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Toggle
        checked={checked}
        onCheckedChange={setChecked}
        size={size}
        disabled={disabled}
      />
      <span className="text-sm text-gray-600">
        {checked ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
};

export const Default: Story = {
  render: () => <ToggleWithState />,
};

export const Small: Story = {
  render: () => <ToggleWithState size="sm" />,
};

export const Large: Story = {
  render: () => <ToggleWithState size="lg" />,
};

export const Disabled: Story = {
  render: () => <ToggleWithState disabled={true} />,
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    onCheckedChange: () => console.log('Toggle clicked'),
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    onCheckedChange: () => console.log('Toggle clicked'),
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
    onCheckedChange: () => console.log('Toggle clicked'),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Small:</span>
        <Toggle
          checked={true}
          onCheckedChange={() => console.log('Small toggle clicked')}
          size="sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Medium:</span>
        <Toggle
          checked={true}
          onCheckedChange={() => console.log('Medium toggle clicked')}
          size="md"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Large:</span>
        <Toggle
          checked={true}
          onCheckedChange={() => console.log('Large toggle clicked')}
          size="lg"
        />
      </div>
    </div>
  ),
};
