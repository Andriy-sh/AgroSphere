import type { Meta, StoryObj } from '@storybook/react';
import { SelectionBar } from './selection-bar';

const meta: Meta<typeof SelectionBar> = {
  title: 'Components/SelectionBar',
  component: SelectionBar,
  argTypes: {
    selectedCount: { control: 'number' },
    totalCount: { control: 'number' },
    allSelected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SelectionBar>;

export const Default: Story = {
  args: {
    selectedCount: 0,
    totalCount: 10,
    allSelected: false,
  },
};
