import type { Meta, StoryObj } from '@storybook/react';
import { BarChart, BarChartDataItem } from './bar-chart';

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Array of data items for the chart',
    },
    height: {
      control: { type: 'number', min: 100, max: 800, step: 50 },
      description: 'Height of the chart',
    },
    colorScheme: {
      control: 'select',
      options: ['default', 'black', 'blue', 'green'],
      description: 'Color scheme variant for the bars',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show tooltip on hover',
    },
    showBorder: {
      control: 'boolean',
      description: 'Whether to show border around the chart',
    },
    xAxisAngle: {
      control: { type: 'number', min: -90, max: 90, step: 15 },
      description: 'Angle of x-axis labels',
    },
    barWidth: {
      control: { type: 'number', min: 10, max: 100, step: 5 },
      description: 'Width of each bar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData1: BarChartDataItem[] = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 3000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const sampleData2: BarChartDataItem[] = [
  { name: 'Wheat', value: 4500, fill: '#10B981' },
  { name: 'Corn', value: 3200, fill: '#3B82F6' },
  { name: 'Soybeans', value: 2800, fill: '#F59E0B' },
  { name: 'Rice', value: 2100, fill: '#EF4444' },
  { name: 'Barley', value: 1800, fill: '#8B5CF6' },
];

const sampleData3: BarChartDataItem[] = [
  { name: 'Field A', value: 95 },
  { name: 'Field B', value: 87 },
  { name: 'Field C', value: 92 },
  { name: 'Field D', value: 78 },
  { name: 'Field E', value: 88 },
  { name: 'Field F', value: 91 },
  { name: 'Field G', value: 85 },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData1,
    height: 256,
    colorScheme: 'default',
    showTooltip: true,
    showBorder: false,
    xAxisAngle: -45,
    labelTruncate: true,
  },
};

export const WithCustomColors: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData2,
    height: 300,
    colorScheme: 'green',
    showTooltip: true,
    showBorder: true,
    xAxisAngle: -45,
    labelTruncate: false,
  },
};

export const PerformanceMetrics: Story = {
  render: (args) => (
    <div style={{ width: 700, height: 350 }}>
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData3,
    height: 300,
    colorScheme: 'blue',
    showTooltip: true,
    showBorder: false,
    xAxisAngle: 0,
    labelTruncate: true,
    barWidth: 50,
    minChartWidth: 500,
    yAxisDomain: [0, 100],
    yAxisTickFormatter: (value) => `${value}%`,
  },
};

