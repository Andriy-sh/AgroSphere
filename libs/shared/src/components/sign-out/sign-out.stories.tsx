import type { Meta, StoryObj } from '@storybook/react';
import { LogoutButton } from './sign-out.mock';
const sizes = [16, 24, 32, 40] as const;

const meta: Meta<typeof LogoutButton> = {
  component: LogoutButton,
  title: 'Primitives/LogoutButton',
  tags: ['autodocs'],
  argTypes: {
    iconSize: {
      control: { type: 'select' },
      options: sizes,
    },
    onClick: { action: 'clicked' },
    className: { control: 'text' },
  },
  args: {
    iconSize: 24,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Size16_Light: Story = {
  args: { iconSize: 16, className: 'text-gray-500 hover:text-gray-700' },
};
export const Size16_Dark: Story = {
  args: {
    iconSize: 16,
    className: 'text-gray-400 dark:text-gray-200 hover:text-gray-100',
  },
};

export const Size24_Light: Story = {
  args: { iconSize: 24, className: 'text-gray-500 hover:text-gray-700' },
};
export const Size24_Dark: Story = {
  args: {
    iconSize: 24,
    className: 'text-gray-400 dark:text-gray-200 hover:text-gray-100',
  },
};

export const Size32_Light: Story = {
  args: { iconSize: 32, className: 'text-gray-500 hover:text-gray-700' },
};
export const Size32_Dark: Story = {
  args: {
    iconSize: 32,
    className: 'text-gray-400 dark:text-gray-200 hover:text-gray-100',
  },
};

export const Size40_Light: Story = {
  args: { iconSize: 40, className: 'text-gray-500 hover:text-gray-700' },
};
export const Size40_Dark: Story = {
  args: {
    iconSize: 40,
    className: 'text-gray-400 dark:text-gray-200 hover:text-gray-100',
  },
};
