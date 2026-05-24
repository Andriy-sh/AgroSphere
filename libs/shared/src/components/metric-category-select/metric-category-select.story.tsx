import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MetricCategorySelect, MetricCategory } from './metric-category-select';

const meta: Meta<typeof MetricCategorySelect> = {
  title: 'Components/MetricCategorySelect',
  component: MetricCategorySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the select trigger',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCategories: MetricCategory[] = [
  {
    value: 'soil-health',
    label: 'Soil Health',
    metrics: [
      { value: 'ph-level', label: 'pH Level' },
      { value: 'organic-matter', label: 'Organic Matter' },
      { value: 'nitrogen', label: 'Nitrogen' },
      { value: 'phosphorus', label: 'Phosphorus' },
      { value: 'potassium', label: 'Potassium' },
    ],
  },
  {
    value: 'crop-metrics',
    label: 'Crop Metrics',
    metrics: [
      { value: 'yield', label: 'Yield' },
      { value: 'growth-rate', label: 'Growth Rate' },
      { value: 'biomass', label: 'Biomass' },
      { value: 'canopy-cover', label: 'Canopy Cover' },
      { value: 'plant-height', label: 'Plant Height' },
    ],
  },
];

const InteractiveMetricCategorySelect = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<
    Record<string, string[]>
  >({
    'soil-health': ['ph-level', 'nitrogen'],
    'crop-metrics': [],
  });
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const handleSelectionChange = (
    categoryValue: string,
    selectedMetricValues: string[]
  ) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [categoryValue]: selectedMetricValues,
    }));
  };

  return (
    <div className="w-[400px]">
      <MetricCategorySelect
        categories={sampleCategories}
        selectedMetrics={selectedMetrics}
        onSelectionChange={handleSelectionChange}
        value={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeholder="Search metric"
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveMetricCategorySelect />,
};
