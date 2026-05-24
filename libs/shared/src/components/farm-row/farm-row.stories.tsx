import type { Meta, StoryObj } from '@storybook/react';
import { FarmRow } from './farm-row';

const meta: Meta<typeof FarmRow> = {
  title: 'Components/FarmRow',
  component: FarmRow,
  argTypes: {
    item: { control: 'object' },
    isSelected: { control: 'boolean' },
    isExpanded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FarmRow>;

export const Default: Story = {
  args: {
    item: { id: '1', name: 'Farm 1', parcels: 5, area: 120 },
    isSelected: false,
    isExpanded: false,
  },
};
