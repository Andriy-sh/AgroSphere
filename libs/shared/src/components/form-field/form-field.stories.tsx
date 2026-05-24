import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './form-field';
import { Input } from '../input/input';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    required: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Field Label',
    children: <Input placeholder="Enter value" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    children: <Input placeholder="Enter value" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Field with Error',
    error: 'This field is required',
    children: <Input placeholder="Enter value" />,
  },
};

export const WithWarning: Story = {
  args: {
    label: 'Field with Warning',
    warning: 'This value might be incorrect',
    children: <Input placeholder="Enter value" />,
  },
};

export const WithErrorAndWarning: Story = {
  args: {
    label: 'Field with Error and Warning',
    error: 'This field is required',
    warning: 'This value might be incorrect',
    children: <Input placeholder="Enter value" />,
  },
};
