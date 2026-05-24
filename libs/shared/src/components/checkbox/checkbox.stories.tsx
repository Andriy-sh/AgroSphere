import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'Components/Checkbox',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable checkbox component that supports both controlled and uncontrolled states. Built with accessibility in mind, it includes proper ARIA attributes, keyboard navigation, and screen reader support. The checkbox can be styled with custom CSS classes and integrates seamlessly with form libraries.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required for form validation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'Value attribute for form submission',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    onCheckedChange: {
      action: 'changed',
      description: 'Callback function called when the checkbox state changes',
      table: {
        type: { summary: 'function' },
      },
    },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default unchecked state of the checkbox. This is the initial state when no value has been selected.',
      },
    },
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Checked state of the checkbox. This represents when a user has selected the option.',
      },
    },
  },
};

const ControlledCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      <span>{checked ? 'Checked' : 'Unchecked'}</span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledCheckbox />,
  parameters: {
    docs: {
      description: {
        story:
          'Controlled checkbox example with React state management. The checkbox state is managed by the parent component and updates in real-time.',
      },
    },
  },
};

export const WithStyle: Story = {
  args: {
    checked: false,
    className: 'border-red-500 bg-red-100',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox with custom styling applied through CSS classes. This demonstrates how to customize the appearance of the checkbox component.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled checkbox state. Disabled checkboxes are non-interactive and typically used when the option is not available or when form validation prevents interaction.',
      },
    },
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled checkbox in checked state. This shows how disabled checkboxes appear when they are checked but cannot be modified.',
      },
    },
  },
};

export const Required: Story = {
  args: {
    checked: false,
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Required checkbox for form validation. Required checkboxes must be checked for the form to be considered valid.',
      },
    },
  },
};

const CheckboxGroupComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions((prev) => [...prev, value]);
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== value));
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Select your preferences:</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedOptions.includes('email')}
            onCheckedChange={(checked) =>
              handleOptionChange('email', checked as boolean)
            }
          />
          <span>Receive email notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedOptions.includes('sms')}
            onCheckedChange={(checked) =>
              handleOptionChange('sms', checked as boolean)
            }
          />
          <span>Receive SMS notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedOptions.includes('push')}
            onCheckedChange={(checked) =>
              handleOptionChange('push', checked as boolean)
            }
          />
          <span>Receive push notifications</span>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Selected:{' '}
        {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'None'}
      </p>
    </div>
  );
};

export const CheckboxGroup: Story = {
  render: () => <CheckboxGroupComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox group example showing multiple checkboxes with state management. This demonstrates how to handle multiple checkbox selections in a form.',
      },
    },
  },
};

const FormIntegrationComponent = () => {
  const [formData, setFormData] = useState({
    terms: false,
    newsletter: false,
    marketing: false,
  });

  const handleChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  return (
    <div className="space-y-4 max-w-md">
      <h3 className="text-lg font-medium">Registration Form</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.terms}
            required
            onCheckedChange={(checked) =>
              handleChange('terms', checked as boolean)
            }
          />
          <span>I agree to the Terms and Conditions *</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.newsletter}
            onCheckedChange={(checked) =>
              handleChange('newsletter', checked as boolean)
            }
          />
          <span>Subscribe to our newsletter</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.marketing}
            onCheckedChange={(checked) =>
              handleChange('marketing', checked as boolean)
            }
          />
          <span>Receive marketing communications</span>
        </div>
      </div>
      <div className="pt-2 border-t">
        <p className="text-sm text-gray-600">
          Form valid: {formData.terms ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
};

export const FormIntegration: Story = {
  render: () => <FormIntegrationComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Real-world form integration example showing how checkboxes work in a registration form with validation and multiple options.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Unchecked</h4>
          <Checkbox checked={false} />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Checked</h4>
          <Checkbox checked={true} />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Disabled Unchecked</h4>
          <Checkbox checked={false} disabled />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Disabled Checked</h4>
          <Checkbox checked={true} disabled />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Required</h4>
          <Checkbox checked={false} required />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Custom Styled</h4>
          <Checkbox checked={false} className="border-blue-500 bg-blue-50" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of all checkbox states and variations. This helps designers and developers understand the different visual states available.',
      },
    },
  },
};
