import type { Meta, StoryObj } from '@storybook/react';
import { GroupRow } from './group-row';

const meta: Meta<typeof GroupRow> = {
  title: 'Components/GroupRow',
  component: GroupRow,
  argTypes: {
    item: { control: 'object' },
    isSelected: { control: 'boolean' },
    isExpanded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof GroupRow>;

export const Default: Story = {
  args: {
    item: { id: '1', name: 'Group 1', area: 60 },
    isSelected: false,
    isExpanded: false,
  },
};
