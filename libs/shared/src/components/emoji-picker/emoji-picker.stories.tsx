import type { Meta, StoryObj } from '@storybook/react';
import { EmojiPickerComponent } from './emoji-picker';

const meta: Meta<typeof EmojiPickerComponent> = {
  title: 'Components/EmojiPicker',
  component: EmojiPickerComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onEmojiSelect: { action: 'emoji selected' },
    height: { control: { type: 'number', min: 200, max: 600 } },
    width: { control: { type: 'number', min: 200, max: 600 } },
    emojiStyle: {
      control: { type: 'select' },
      options: ['NATIVE', 'APPLE', 'GOOGLE', 'TWITTER', 'FACEBOOK'],
    },
    suggestedEmojisMode: {
      control: { type: 'select' },
      options: ['RECENT', 'FREQUENT'],
    },
    searchDisabled: { control: 'boolean' },
    compact: { control: 'boolean' },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    height: 250,
    width: 300,
    searchPlaceholder: 'Search emojis...',
    position: 'top',
  },
};
