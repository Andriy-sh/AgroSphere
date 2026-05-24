import type { Meta, StoryObj } from '@storybook/react';
import { BulletChart } from './bullet-chart';

const meta: Meta<typeof BulletChart> = {
  title: 'Components/BulletChart',
  component: BulletChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed above the chart',
    },
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Current value displayed on the chart',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value for the chart range',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value for the chart range',
    },
    width: {
      control: { type: 'number', min: 100, max: 1200, step: 50 },
      description: 'Width of the chart',
    },
    height: {
      control: { type: 'number', min: 50, max: 200, step: 10 },
      description: 'Height of the chart',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 500, height: 300 }}>
      <BulletChart {...args} width={480} height={28} />
    </div>
  ),
  args: {
    title: 'Soil Quality',
    value: 45,
    min: 0,
    max: 100,
    minValueLabel: 'Low',
    maxValueLabel: 'High',
  },
};

export const WithCurrentValue: Story = {
  render: (args) => (
    <div style={{ width: 500, height: 300 }}>
      <BulletChart {...args} width={480} height={28} />
    </div>
  ),
  args: {
    title: 'pH Level',
    value: 6.5,
    min: 4.5,
    max: 7.5,
    minValueLabel: '<5.5',
    maxValueLabel: '>7.5',
    currentValueLabel: '6.5',
  },
};

export const WithTarget: Story = {
  render: (args) => (
    <div style={{ width: 500, height: 300 }}>
      <BulletChart {...args} width={480} height={28} />
    </div>
  ),
  args: {
    title: 'Target Achievement',
    value: 65,
    min: 0,
    max: 100,
    minValueLabel: '0%',
    maxValueLabel: '100%',
    targetValue: 80,
    targetLabel: 'Target: 80%',
  },
};

export const Complete: Story = {
  render: (args) => (
    <div style={{ width: 500, height: 300 }}>
      <BulletChart {...args} width={480} height={28} />
    </div>
  ),
  args: {
    title: 'Performance Metric',
    value: 55,
    min: 0,
    max: 100,
    minValueLabel: 'Start',
    maxValueLabel: 'Goal',
    currentValueLabel: '55%',
    targetValue: 75,
    targetLabel: 'Target 80',
  },
};

export const MultipleLabels: Story = {
  render: (args) => (
    <div style={{ width: 500, height: 300 }}>
      <BulletChart {...args} width={480} height={28} />
    </div>
  ),
  args: {
    title: 'P Index (Grassland)',
    value: 7,
    min: 0,
    max: 8,
    currentValueLabel: '7 mg/l',
    labels: [
      { value: 0, label: 'Index 1 (0.0-3.0)' },
      { value: 2.64, label: 'Index 2 (3.1-5.0)' },
      { value: 5.28, label: 'Index 3 (5.1-8.0)' },
      { value: 8, label: 'Index 4 (>8.0)' },
    ],
  },
};
