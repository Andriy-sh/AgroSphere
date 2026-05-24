import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiSelect } from './multi-select';

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    values: {
      control: 'multi-select',
      options: [
        'react',
        'typescript',
        'javascript',
        'nodejs',
        'nextjs',
        'tailwind',
        'storybook',
        'jest',
        'cypress',
        'docker',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'storybook', label: 'Storybook' },
  { value: 'jest', label: 'Jest' },
  { value: 'cypress', label: 'Cypress' },
  { value: 'docker', label: 'Docker' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    values: [],
    onChange: (values: string[]) => console.log('Selected values:', values),
    placeholder: 'Select technologies...',
  },
};

export const WithPreselectedValues: Story = {
  args: {
    options: sampleOptions,
    values: ['react', 'typescript'],
    onChange: (values: string[]) => console.log('Selected values:', values),
    placeholder: 'Select technologies...',
  },
};

const InteractiveMultiSelect = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    'react',
    'typescript',
  ]);

  return (
    <div className="space-y-4">
      <MultiSelect
        options={sampleOptions}
        values={selectedValues}
        onChange={setSelectedValues}
        placeholder="Select technologies..."
        className="w-[350px]"
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveMultiSelect />,
};
