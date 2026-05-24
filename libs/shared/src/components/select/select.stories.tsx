
import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelect, SelectOption } from './select';

const meta: Meta<typeof CustomSelect> = {
  title: 'Components/CustomSelect',
  component: CustomSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `  
Perfect selector with automatic positioning using Popper.js.

## Key Features
- **Automatic positioning**: Uses Popper.js for dynamic determination of the best position
- **Flip modifier**: Automatically flips the menu if there's no space
- **Prevent overflow**: Prevents going beyond viewport boundaries
- **Adaptive positioning**: Works in any containers (tables, scrollable areas)
- **High performance**: Optimized for fast operation

## Usage
- In tables with automatic positioning
- In scrollable containers
- In modal windows
- In any complex layouts
        `,
      },
    },
  },
  argTypes: {
    options: {
      description: 'Array of options for selection',
      control: { type: 'object' },
    },
    value: {
      description: 'Current value',
      control: { type: 'text' },
    },
    placeholder: {
      description: 'Placeholder text',
      control: { type: 'text' },
    },
    disabled: {
      description: 'Is the selector disabled',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

const basicOptions: SelectOption[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'advisor', label: 'Field advisor' },
  { value: 'manager', label: 'Contractor manager' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'support', label: 'Support' },
];

export const Basic: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select role',
    onValueChange: (value) => console.log('Selected:', value),
  },
};

export const WithValue: Story = {
  args: {
    options: basicOptions,
    value: 'admin',
    placeholder: 'Select role',
    onValueChange: (value) => console.log('Selected:', value),
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    value: 'admin',
    placeholder: 'Select role',
    disabled: true,
    onValueChange: (value) => console.log('Selected:', value),
  },
};