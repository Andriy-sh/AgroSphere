import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A custom radio component designed for form inputs with consistent styling and accessibility features.

## Features
- **Custom styling**: Consistent with design system
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Layout options**: Single column or two-column layout
- **Error handling**: Built-in error display
- **Disabled state**: Support for disabled options
- **Responsive design**: Works on all screen sizes

## Usage
Use this component for single-choice selections in forms, such as:
- User type selection
- Business category selection
- Preference settings
- Role selection
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the radio group',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'radio-group'" },
      },
    },
    options: {
      control: 'object',
      description: 'Array of radio options',
      table: {
        type: { summary: 'RadioOption[]' },
        defaultValue: {
          summary: "[{ value: 'option1', label: 'Option 1' }]",
        },
      },
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'option1'" },
      },
    },
    label: {
      control: 'text',
      description: 'Label for the radio group',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Select an option'" },
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
    layout: {
      control: 'select',
      options: ['single-column', 'two-columns'],
      description: 'Layout arrangement for options',
      table: {
        type: { summary: "'single-column' | 'two-columns'" },
        defaultValue: { summary: "'single-column'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio group is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    name: 'radio-group',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: 'option1',
    label: 'Select an option',
    layout: 'single-column',
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    name: 'default-radio',
    options: [
      { value: 'farmer', label: "I'm a farmer" },
      { value: 'advisor', label: "I'm an advisor" },
      { value: 'contractor', label: "I'm a contractor" },
    ],
    value: 'farmer',
    label: 'Please select your role',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic radio component with role selection options.',
      },
    },
  },
};

export const TwoColumns: Story = {
  args: {
    name: 'two-column-radio',
    options: [
      { value: 'dairy', label: 'Dairy' },
      { value: 'beef', label: 'Beef' },
      { value: 'tillage', label: 'Tillage' },
      { value: 'mixed', label: 'Mixed livestock' },
    ],
    value: 'dairy',
    label: 'Select your farm category',
    layout: 'two-columns',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio component with two-column layout for better space utilization.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    name: 'error-radio',
    options: [
      { value: 'solo', label: 'Solo trader' },
      { value: 'partnership', label: 'Farm partnership' },
      { value: 'limited', label: 'Limited company' },
    ],
    value: '',
    label: 'Please select your business type',
    error: 'This field is required',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio component displaying an error message when validation fails.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled-radio',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: 'option1',
    label: 'Disabled radio group',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio component in disabled state with reduced opacity and disabled interactions.',
      },
    },
  },
};

export const BusinessTypeSelection: Story = {
  args: {
    name: 'business-type',
    options: [
      { value: 'Solo trader', label: 'Solo trader' },
      { value: 'Limited company', label: 'Limited company' },
      { value: 'Partnership', label: 'Partnership' },
      { value: 'Other', label: 'Other' },
    ],
    value: 'Solo trader',
    label: 'Please select your business type',
    layout: 'two-columns',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Business type selection with two-column layout for better organization.',
      },
    },
  },
};

const InteractiveComponent = () => {
  const [selectedValue, setSelectedValue] = useState('farmer');

  return (
    <div className="space-y-6">
      <Radio
        name="interactive-role"
        options={[
          { value: 'farmer', label: "I'm a farmer" },
          { value: 'advisor', label: "I'm an advisor" },
          { value: 'contractor', label: "I'm a contractor" },
        ]}
        value={selectedValue}
        onChange={setSelectedValue}
        label="Please select your role"
      />

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          Selected value: <strong>{selectedValue}</strong>
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
          'Interactive radio component with state management. Click on different options to see the selection change.',
      },
    },
  },
};

const MultipleGroupsComponent = () => {
  const [userType, setUserType] = useState('farmer');
  const [businessType, setBusinessType] = useState('Solo trader');

  return (
    <div className="space-y-6 max-w-md">
      <Radio
        name="user-type"
        options={[
          { value: 'farmer', label: "I'm a farmer" },
          { value: 'advisor', label: "I'm an advisor" },
          { value: 'contractor', label: "I'm a contractor" },
        ]}
        value={userType}
        onChange={setUserType}
        label="Please select your role"
      />

      <Radio
        name="business-type"
        options={[
          { value: 'Solo trader', label: 'Solo trader' },
          { value: 'Limited company', label: 'Limited company' },
          { value: 'Partnership', label: 'Partnership' },
          { value: 'Other', label: 'Other' },
        ]}
        value={businessType}
        onChange={setBusinessType}
        label="Please select your business type"
        layout="two-columns"
      />

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          User Type: <strong>{userType}</strong>
        </p>
        <p className="text-sm text-gray-600">
          Business Type: <strong>{businessType}</strong>
        </p>
      </div>
    </div>
  );
};

export const MultipleGroups: Story = {
  render: () => <MultipleGroupsComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Multiple radio groups working together. Each group maintains its own state independently.',
      },
    },
  },
};
