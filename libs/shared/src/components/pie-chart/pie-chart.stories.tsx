import type { Meta, StoryObj } from '@storybook/react';
import { ActivePieChart } from './pie-chart';

const meta: Meta<typeof ActivePieChart> = {
  title: 'Components/PieChart',
  component: ActivePieChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Current value displayed on the pie chart',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value for the pie chart range',
    },
    filledColor: {
      control: 'color',
      description: 'Color for the filled portion of the pie',
    },
    emptyColor: {
      control: 'color',
      description: 'Color for the empty portion of the pie',
    },
    width: {
      control: { type: 'number', min: 100, max: 800, step: 50 },
      description: 'Width of the chart',
    },
    height: {
      control: { type: 'number', min: 100, max: 800, step: 50 },
      description: 'Height of the chart',
    },
    innerRadius: {
      control: { type: 'number', min: 0, max: 100, step: 5 },
      description: 'Inner radius of the pie chart',
    },
    outerRadius: {
      control: { type: 'number', min: 0, max: 150, step: 5 },
      description: 'Outer radius of the pie chart',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Whether to show percentage label',
    },
    isAnimationActive: {
      control: 'boolean',
      description: 'Whether to animate the chart',
    },
    scale: {
      control: { type: 'number', min: 0.5, max: 2, step: 0.1 },
      description: 'Scale factor for the chart',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show tooltip on hover',
    },
    activeShape: {
      control: 'boolean',
      description: 'Whether to show active shape on hover (expands segment)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 300, height: 300 }}>
      <ActivePieChart {...args} />
    </div>
  ),
  args: {
    value: 65,
    max: 100,
    filledColor: '#FFC652',
    emptyColor: '#dbdee8',
    width: 300,
    height: 300,
    innerRadius: '60%',
    outerRadius: '80%',
    showPercentage: false,
    isAnimationActive: true,
    scale: 1,
    showTooltip: true,
  },
};

export const WithPercentage: Story = {
  render: (args) => (
    <div style={{ width: 300, height: 300 }}>
      <ActivePieChart {...args} />
    </div>
  ),
  args: {
    value: 75,
    max: 100,
    filledColor: '#10B981',
    emptyColor: '#E5E7EB',
    width: 300,
    height: 300,
    innerRadius: '60%',
    outerRadius: '80%',
    showPercentage: true,
    isAnimationActive: true,
    scale: 1,
    showTooltip: true,
  },
};

export const CustomColors: Story = {
  render: (args) => (
    <div style={{ width: 400, height: 400 }}>
      <ActivePieChart {...args} />
    </div>
  ),
  args: {
    value: 45,
    max: 100,
    filledColor: '#3B82F6',
    emptyColor: '#F3F4F6',
    width: 400,
    height: 400,
    innerRadius: '50%',
    outerRadius: '90%',
    showPercentage: true,
    isAnimationActive: true,
    scale: 1,
    showTooltip: true,
  },
};

export const WithActiveShape: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 500, padding: '20px' }}>
      <ActivePieChart {...args} />
    </div>
  ),
  args: {
    value: 70,
    max: 100,
    filledColor: '#10B981',
    emptyColor: '#E5E7EB',
    width: 500,
    height: 400,
    innerRadius: '60%',
    outerRadius: '80%',
    showPercentage: false,
    isAnimationActive: true,
    scale: 1,
    showTooltip: false,
    activeShape: true,
  },
};

