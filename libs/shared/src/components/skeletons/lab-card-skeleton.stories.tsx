import type { Meta, StoryObj } from '@storybook/react';
import { LabCardSkeleton } from './lab-card-skeleton';

const meta: Meta<typeof LabCardSkeleton> = {
  title: 'Components/Skeletons/LabCardSkeleton',
  component: LabCardSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of skeleton cards to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 6,
  },
};

export const SingleCard: Story = {
  args: {
    count: 1,
  },
};

export const ManyCards: Story = {
  args: {
    count: 12,
  },
};

export const CustomStyling: Story = {
  args: {
    count: 3,
    className: 'p-8 bg-gray-50',
  },
};
