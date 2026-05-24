import type { Meta, StoryObj } from '@storybook/react';
import { ZoneRow } from './zone-row';

const meta: Meta<typeof ZoneRow> = {
  title: 'Components/ZoneRow',
  component: ZoneRow,
  argTypes: {
    item: { control: 'object' },
    isSelected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ZoneRow>;

export const Default: Story = {
  args: {
    item: { id: '1', name: 'Zone 1', area: 20 },
    isSelected: false,
  },
};
