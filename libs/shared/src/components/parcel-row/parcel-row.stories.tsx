import type { Meta, StoryObj } from '@storybook/react';
import { ParcelRow } from './parcel-row';

const meta: Meta<typeof ParcelRow> = {
  title: 'Components/ParcelRow',
  component: ParcelRow,
  argTypes: {
    item: { control: 'object' },
    isSelected: { control: 'boolean' },
    isExpanded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ParcelRow>;

export const Default: Story = {
  args: {
    item: { id: '1', name: 'Parcel 1', type: 'crop', area: 40 },
    isSelected: false,
    isExpanded: false,
  },
};
