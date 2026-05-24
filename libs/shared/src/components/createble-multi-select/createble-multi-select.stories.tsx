import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CreatableMultiSelect } from './createble-multi-select';

const meta: Meta<typeof CreatableMultiSelect> = {
  title: 'Components/CreatableMultiSelect',
  component: CreatableMultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CreatableMultiSelectWithState = ({
  options,
  initialValues = [],
  ...props
}: any) => {
  const [values, setValues] = useState<string[]>(initialValues);
  const [allOptions, setAllOptions] = useState(options);

  const handleCreateOption = (newOption: string) => {
    const newOptionObj = {
      value: newOption.toLowerCase().replace(/\s+/g, '-'),
      label: newOption,
    };
    setAllOptions([...allOptions, newOptionObj]);
    setValues([...values, newOptionObj.value]);
  };

  return (
    <CreatableMultiSelect
      options={allOptions}
      values={values}
      onChange={setValues}
      onCreateOption={handleCreateOption}
      {...props}
    />
  );
};

export const Default: Story = {
  render: (args) => (
    <div className="w-[500px] p-8">
      <CreatableMultiSelectWithState
        options={[
          { value: 'organic', label: 'Organic' },
          { value: 'multi-location', label: 'Multi-location' },
          { value: 'trial-user', label: 'Trial User' },
          { value: 'lab-partner', label: 'Lab Partner' },
          { value: 'new-client', label: 'New Client' },
          { value: 'organic-certified', label: 'Organic Certified' },
          { value: 'pilot-program', label: 'Pilot Program' },
          { value: 'regenerative-farming', label: 'Regenerative Farming' },
          { value: 'health-focus', label: 'Health Focus' },
          { value: 'large-fields', label: 'Large Fields' },
        ]}
        {...args}
      />
    </div>
  ),
  args: {
    placeholder: 'Select an option or create one',
  },
};

export const WithPreselectedValues: Story = {
  render: (args) => (
    <div className="w-[500px] p-8">
      <CreatableMultiSelectWithState
        initialValues={['organic', 'multi-location']}
        options={[
          { value: 'organic', label: 'Organic' },
          { value: 'multi-location', label: 'Multi-location' },
          { value: 'trial-user', label: 'Trial User' },
          { value: 'lab-partner', label: 'Lab Partner' },
          { value: 'new-client', label: 'New Client' },
          { value: 'organic-certified', label: 'Organic Certified' },
          { value: 'pilot-program', label: 'Pilot Program' },
          { value: 'regenerative-farming', label: 'Regenerative Farming' },
          { value: 'health-focus', label: 'Health Focus' },
          { value: 'large-fields', label: 'Large Fields' },
        ]}
        {...args}
      />
    </div>
  ),
  args: {
    placeholder: 'Select an option or create one',
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const button = canvas.querySelector('button');
    if (button) {
      button.click();
    }
  },
};

export const ManySelectedValues: Story = {
  render: (args) => (
    <div className="w-[500px] p-8">
      <CreatableMultiSelectWithState
        initialValues={[
          'organic',
          'multi-location',
          'trial-user',
          'lab-partner',
          'new-client',
        ]}
        options={[
          { value: 'organic', label: 'Organic' },
          { value: 'multi-location', label: 'Multi-location' },
          { value: 'trial-user', label: 'Trial User' },
          { value: 'lab-partner', label: 'Lab Partner' },
          { value: 'new-client', label: 'New Client' },
          { value: 'organic-certified', label: 'Organic Certified' },
          { value: 'pilot-program', label: 'Pilot Program' },
          { value: 'regenerative-farming', label: 'Regenerative Farming' },
          { value: 'health-focus', label: 'Health Focus' },
          { value: 'large-fields', label: 'Large Fields' },
        ]}
        {...args}
      />
    </div>
  ),
  args: {
    placeholder: 'Select an option or create one',
  },
};

export const ManyOptions: Story = {
  render: (args) => (
    <div className="w-[500px] p-8">
      <CreatableMultiSelectWithState
        options={[
          { value: 'organic', label: 'Organic' },
          { value: 'multi-location', label: 'Multi-location' },
          { value: 'trial-user', label: 'Trial User' },
          { value: 'lab-partner', label: 'Lab Partner' },
          { value: 'new-client', label: 'New Client' },
          { value: 'organic-certified', label: 'Organic Certified' },
          { value: 'pilot-program', label: 'Pilot Program' },
          { value: 'regenerative-farming', label: 'Regenerative Farming' },
          { value: 'health-focus', label: 'Health Focus' },
          { value: 'large-fields', label: 'Large Fields' },
          { value: 'small-farm', label: 'Small Farm' },
          { value: 'family-owned', label: 'Family Owned' },
          { value: 'corporate', label: 'Corporate' },
          { value: 'cooperative', label: 'Cooperative' },
          { value: 'certified-organic', label: 'Certified Organic' },
          { value: 'transitional', label: 'Transitional' },
          { value: 'conventional', label: 'Conventional' },
          { value: 'biodynamic', label: 'Biodynamic' },
          { value: 'permaculture', label: 'Permaculture' },
          { value: 'vertical-farming', label: 'Vertical Farming' },
          { value: 'hydroponics', label: 'Hydroponics' },
          { value: 'aquaponics', label: 'Aquaponics' },
          { value: 'greenhouse', label: 'Greenhouse' },
          { value: 'outdoor', label: 'Outdoor' },
          { value: 'mixed', label: 'Mixed' },
        ]}
        {...args}
      />
    </div>
  ),
  args: {
    placeholder: 'Select an option or create one',
  },
};

export const CustomPlaceholder: Story = {
  render: (args) => (
    <div className="w-[500px] p-8">
      <CreatableMultiSelectWithState
        options={[
          { value: 'organic', label: 'Organic' },
          { value: 'multi-location', label: 'Multi-location' },
          { value: 'trial-user', label: 'Trial User' },
          { value: 'lab-partner', label: 'Lab Partner' },
          { value: 'new-client', label: 'New Client' },
        ]}
        {...args}
      />
    </div>
  ),
  args: {
    placeholder: 'Choose or add new tags...',
  },
};

export const EmptyState: Story = {
  render: (args) => (
    <div className="w-[500px] p-8">
      <CreatableMultiSelectWithState options={[]} {...args} />
    </div>
  ),
  args: {
    placeholder: 'Start by creating your first tag',
  },
};
