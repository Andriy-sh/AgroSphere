import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart, AreaChartDataItem } from './area-chart';

const meta: Meta<typeof AreaChart> = {
  title: 'Components/AreaChart',
  component: AreaChart,
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
    fillColor: {
      control: 'color',
      description: 'Color for the fill gradient',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData1: AreaChartDataItem[] = [
  { input: 50, output: 120, field: 'Field A' },
  { input: 100, output: 180, field: 'Field B' },
  { input: 150, output: 220, field: 'Field C' },
  { input: 200, output: 280, field: 'Field D' },
  { input: 250, output: 320, field: 'Field E' },
  { input: 300, output: 350, field: 'Field F' },
];

const sampleData2: AreaChartDataItem[] = [
  { input: 20, output: 45, field: 'Wheat Field 1' },
  { input: 40, output: 85, field: 'Wheat Field 2' },
  { input: 60, output: 120, field: 'Corn Field 1' },
  { input: 80, output: 150, field: 'Corn Field 2' },
  { input: 100, output: 180, field: 'Soybean Field' },
];

const sampleData3: AreaChartDataItem[] = [
  { input: 10, output: 25, field: 'Small Field A' },
  { input: 30, output: 65, field: 'Small Field B' },
  { input: 50, output: 95, field: 'Medium Field A' },
  { input: 70, output: 125, field: 'Medium Field B' },
  { input: 90, output: 155, field: 'Large Field A' },
  { input: 110, output: 185, field: 'Large Field B' },
  { input: 130, output: 215, field: 'Large Field C' },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <AreaChart {...args} />
    </div>
  ),
  args: {
    data: sampleData1,
    height: 300,
    xAxisLabel: 'N Input (kg/ha)',
    yAxisLabel: 'N Output (kg)',
    strokeColor: '#3B82F6',
    fillColor: '#3B82F6',
    tooltipFormatter: (value: number) => [
      `${value.toFixed(1)} kg`,
      'N Output',
    ],
    tooltipLabelFormatter: (label, payload) => {
      const fieldName = payload?.[0]?.payload?.field || '';
      return `Field: ${fieldName} | N Input: ${label} kg/ha`;
    },
  },
};

export const GreenTheme: Story = {
  render: (args) => (
    <div style={{ width: 600, height: 300 }}>
      <AreaChart {...args} />
    </div>
  ),
  args: {
    data: sampleData2,
    height: 300,
    xAxisLabel: 'N Input (kg/ha)',
    yAxisLabel: 'N Output (kg)',
    strokeColor: '#10B981',
    fillColor: '#10B981',
    tooltipFormatter: (value: number) => [
      `${value.toFixed(1)} kg`,
      'N Output',
    ],
    tooltipLabelFormatter: (label, payload) => {
      const fieldName = payload?.[0]?.payload?.field || '';
      return `Field: ${fieldName} | N Input: ${label} kg/ha`;
    },
  },
};

export const CustomDomain: Story = {
  render: (args) => (
    <div style={{ width: 700, height: 350 }}>
      <AreaChart {...args} />
    </div>
  ),
  args: {
    data: sampleData3,
    height: 350,
    xAxisLabel: 'N Input (kg/ha)',
    yAxisLabel: 'N Output (kg)',
    strokeColor: '#8B5CF6',
    fillColor: '#8B5CF6',
    xAxisDomain: [0, 150],
    yAxisDomain: [0, 250],
    tooltipFormatter: (value: number) => [
      `${value.toFixed(1)} kg`,
      'N Output',
    ],
    tooltipLabelFormatter: (label, payload) => {
      const fieldName = payload?.[0]?.payload?.field || '';
      return `Field: ${fieldName} | N Input: ${label} kg/ha`;
    },
  },
};

