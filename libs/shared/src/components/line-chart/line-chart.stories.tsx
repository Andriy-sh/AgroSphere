import type { Meta, StoryObj } from '@storybook/react';
import { LineChart, LineChartDataItem } from './line-chart';

const meta: Meta<typeof LineChart> = {
  title: 'Components/LineChart',
  component: LineChart,
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
    xAxisLabel: {
      control: 'text',
      description: 'Label for X axis',
    },
    yAxisLabel: {
      control: 'text',
      description: 'Label for Y axis',
    },
    strokeColor: {
      control: 'color',
      description: 'Color for the stroke line',
    },
    showGrid: {
      control: 'boolean',
      description: 'Show/hide grid',
    },
    hideAxisLines: {
      control: 'boolean',
      description: 'Hide axis lines',
    },
    hideTickLines: {
      control: 'boolean',
      description: 'Hide tick lines',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData1: LineChartDataItem[] = [
  { month: 'Jan', value: 85 },
  { month: 'Feb', value: 87 },
  { month: 'Mar', value: 89 },
  { month: 'Apr', value: 91 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 92 },
];

const sampleData2: LineChartDataItem[] = [
  { month: 'Winter', value: 91.2 },
  { month: 'Spring', value: 95.0 },
  { month: 'Summer', value: 88.8 },
  { month: 'Autumn', value: 85.9 },
];

const sampleData3: LineChartDataItem[] = [
  { x: 1, y: 75 },
  { x: 2, y: 78 },
  { x: 3, y: 82 },
  { x: 4, y: 85 },
  { x: 5, y: 88 },
  { x: 6, y: 90 },
  { x: 7, y: 92 },
  { x: 8, y: 95 },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <LineChart {...args} />
    </div>
  ),
  args: {
    data: sampleData1,
    height: 300,
    xAxisDataKey: 'month',
    yAxisDataKey: 'value',
    strokeColor: '#3B82F6',
    tooltipFormatter: (value: number) => [`${value}%`, 'NUE'],
  },
};

export const WithoutGrid: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <LineChart {...args} />
    </div>
  ),
  args: {
    data: sampleData2,
    height: 300,
    xAxisDataKey: 'month',
    yAxisDataKey: 'value',
    yAxisDomain: [75, 100],
    strokeColor: '#3B82F6',
    showGrid: false,
    hideAxisLines: true,
    hideTickLines: true,
    axisTickStyle: { fontSize: 12, fill: '#9ca3af' },
    tooltipFormatter: (value: number) => [`${value}%`, 'Performance'],
  },
};

export const CustomDomain: Story = {
  render: (args) => (
    <div style={{ width: 700, height: 400 }}>
      <LineChart {...args} />
    </div>
  ),
  args: {
    data: sampleData3,
    height: 400,
    xAxisDataKey: 'x',
    yAxisDataKey: 'y',
    xAxisDomain: [0, 9],
    yAxisDomain: [70, 100],
    strokeColor: '#10B981',
    showGrid: true,
    tooltipFormatter: (value: number) => [`${value}%`, 'NUE'],
  },
};

export const WithoutDots: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <LineChart {...args} />
    </div>
  ),
  args: {
    data: sampleData1,
    height: 300,
    xAxisDataKey: 'month',
    yAxisDataKey: 'value',
    strokeColor: '#8B5CF6',
    showDot: false,
    tooltipFormatter: (value: number) => [`${value}%`, 'NUE'],
  },
};

