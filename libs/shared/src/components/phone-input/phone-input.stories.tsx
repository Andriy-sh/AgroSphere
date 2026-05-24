import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './phone-input';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A comprehensive phone input component with country selection, formatting, and validation.

## Features
- **Country selection**: Choose from predefined countries with flags and dial codes
- **Auto-formatting**: Automatically formats phone numbers based on country format
- **Validation**: Built-in error and warning message display
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Customizable**: Configurable countries, styling, and behavior
- **Responsive design**: Works on all screen sizes

## Usage
Use this component for phone number inputs in forms, such as:
- User registration forms
- Contact information forms
- Business contact forms
- Profile settings
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current phone number value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    onChange: {
      description: 'Callback when phone number changes',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    defaultCountry: {
      control: 'select',
      options: ['ie', 'gb', 'us', 'ca', 'au', 'de', 'fr', 'nl'],
      description: 'Default country code',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'ie'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Enter phone number'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'text',
      description: 'Error message to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    warning: {
      control: 'text',
      description: 'Warning message to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    preferredCountries: {
      control: 'object',
      description: 'List of preferred countries to show first',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: "['ie', 'gb', 'us']" },
      },
    },
  },
  args: {
    value: '',
    defaultCountry: 'ie',
    placeholder: 'Enter phone number',
    disabled: false,
    required: false,
    preferredCountries: ['ie', 'gb', 'us'],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    defaultCountry: 'ie',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic phone input with Ireland as the default country.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    value: '+353 85 123 4567',
    defaultCountry: 'ie',
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone input with a pre-filled value.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    value: '123',
    defaultCountry: 'ie',
    error: 'Please enter a valid phone number',
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone input displaying an error message.',
      },
    },
  },
};

export const WithWarning: Story = {
  args: {
    value: '+353 85 123 456',
    defaultCountry: 'ie',
    warning: 'This number format might be incorrect',
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone input displaying a warning message.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    value: '+353 85 123 4567',
    defaultCountry: 'ie',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled phone input.',
      },
    },
  },
};

export const Required: Story = {
  args: {
    value: '',
    defaultCountry: 'ie',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Required phone input field.',
      },
    },
  },
};

export const DifferentCountry: Story = {
  args: {
    value: '',
    defaultCountry: 'us',
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone input with United States as the selected country.',
      },
    },
  },
};

const InteractiveComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="space-y-4 w-80">
      <PhoneInput
        value={phoneNumber}
        onChange={setPhoneNumber}
        defaultCountry="ie"
        placeholder="Enter your phone number"
      />

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          Phone Number: <strong>{phoneNumber || 'Not entered'}</strong>
        </p>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive phone input with country selection. Try changing the country and entering different phone numbers to see the formatting in action.',
      },
    },
  },
};
