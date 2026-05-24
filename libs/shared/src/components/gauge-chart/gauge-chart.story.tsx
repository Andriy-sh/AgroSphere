import type { Meta, StoryObj } from '@storybook/react';
import { GaugeChart } from './gauge-chart';

const meta: Meta<typeof GaugeChart> = {
  title: 'Components/GaugeChart',
  component: GaugeChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['default', 'redToGreen', 'redToBlue', 'greenToRed'],
      description: 'Color scheme variant for the gauge',
    },
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Current value displayed on the gauge',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value for the gauge range',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value for the gauge range',
    },
    showValueLabel: {
      control: 'boolean',
      description: 'Whether to show the value label',
    },
    showPointer: {
      control: 'boolean',
      description: 'Whether to show the pointer indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    colorScheme: 'default',
    value: 70,
    min: 0,
    max: 100,
    showValueLabel: true,
    valueSuffix: '%',
    subLabel: '',
    showPointer: true,
    width: 400,
    height: 250,
  },
};

export const RedToGreen: Story = {
  args: {
    colorScheme: 'redToGreen',
    value: 100,
    min: 0,
    max: 100,
    showValueLabel: true,
    valueSuffix: '%',
    subLabel: 'Organic Matter',
    showPointer: true,
    width: 400,
    height: 250,
  },
};

export const RedToBlue: Story = {
  args: {
    colorScheme: 'redToBlue',
    value: 100,
    min: 0,
    max: 100,
    showValueLabel: true,
    valueSuffix: '%',
    subLabel: 'pH Level',
    showPointer: true,
    width: 400,
    height: 250,
  },
};

export const GreenToRed: Story = {
  args: {
    colorScheme: 'greenToRed',
    value: 10,
    min: 0,
    max: 10,
    showValueLabel: true,
    valueSuffix: ' t/ha',
    subLabel: 'Lime Requirement',
    showPointer: true,
    width: 400,
    height: 250,
  },
};

export const WithLabels: Story = {
  args: {
    colorScheme: 'redToGreen',
    value: 100,
    min: 0,
    max: 100,
    showValueLabel: true,
    valueSuffix: '%',
    subLabel: 'TOP 10% nationally',
    showPointer: true,
    width: 400,
    height: 250,
    labels: [
      { value: 0, label: 'Very low' },
      { value: 20, label: 'Low' },
      { value: 50, label: 'Normal' },
      { value: 80, label: 'High' },
      { value: 100, label: 'Very high' },
    ],
  },
};
