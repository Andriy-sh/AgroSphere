import type { Meta, StoryObj } from '@storybook/react';
import { Theme, ThemeSwitcher } from './themeswitcher';

const meta: Meta<typeof ThemeSwitcher> = {
  component: ThemeSwitcher,
  title: 'Primitives/ThemeSwitcher',
  tags: ['autodocs'],
  argTypes: {
    initialTheme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'] as Theme[],
      description: 'Theme set by default',
    },
    darkModeClass: {
      control: 'text',
      description: 'CSS class for enabling dark-mode on <html>',
    },
    className: {
      control: 'text',
      description: 'Additional CSS for component container',
    },
  },
  args: {
    initialTheme: 'system',
    darkModeClass: 'dark',
    className: '',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialTheme: 'system',
  },
};

export const AllThemes: Story = {
  args: {
    className: '',
  },

  parameters: {
    variants: {
      enable: true,
      include: ['initialTheme'],
    },
  },
};
