import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './search-input';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isActive: true,
    searchTerm: '',
    onSearchChange: (e) => console.log('Search Term:', e.target.value),
    onClose: () => console.log('Search Overlay Closed'),
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        console.log(
          'Enter pressed with search term:',
          (e.target as HTMLInputElement).value
        );
      }
      if (e.key === 'Escape') {
        console.log('Escape pressed');
      }
    },
  },

  argTypes: {
    isActive: { control: 'boolean' },
    searchTerm: { control: 'text' },
    onSearchChange: { action: 'onSearchChange' },
    onClose: { action: 'onClose' },
    onKeyDown: { action: 'onKeyDown' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    isActive: true,
    searchTerm: '',
  },
};

export const WithText: Story = {
  args: {
    isActive: true,
    searchTerm: 'Some search query',
  },
};

export const Inactive: Story = {
  args: {
    isActive: false,
  },
};

export const ClosingBehavior: Story = {
  args: {
    isActive: true,
    searchTerm: 'Test closing',
    onClose: () => alert('Search overlay is trying to close!'),
  },
};
