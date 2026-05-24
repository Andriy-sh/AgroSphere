import type { Meta, StoryObj } from '@storybook/react';
import { CountrySelect } from './country-select';
import { useState } from 'react';

const meta: Meta<typeof CountrySelect> = {
  title: 'Components/CountrySelect',
  component: CountrySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected country value (ISO code)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when country selection changes',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no country is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    warning: {
      control: 'text',
      description: 'Warning message to display',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CountrySelectWithState = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

  return (
    <div className="space-y-4">
      <CountrySelect
        value={selectedCountry}
        onChange={setSelectedCountry}
        placeholder="Select a country"
        className="w-52"
      />
    </div>
  );
};

export const WithStateManagement: Story = {
  render: () => <CountrySelectWithState />,
  parameters: {
    docs: {
      description: {
        story:
          'This example shows how the CountrySelect component works with proper state management. When you select a country, the selected value will be displayed below.',
      },
    },
  },
};
