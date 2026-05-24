import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimezoneSelect } from './timezone-select';

const meta: Meta<typeof TimezoneSelect> = {
  title: 'Components/TimezoneSelect',
  component: TimezoneSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected timezone value',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when timezone selection changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no timezone is selected',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimezoneSelect>;

const InteractiveStory = () => {
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Timezone
          </label>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            placeholder="Choose your timezone"
            className="w-52"
          />
        </div>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing the timezone selector with search functionality, current timezone detection, and dynamic timezone selection.',
      },
    },
  },
};
