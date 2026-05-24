import type { Meta, StoryObj } from '@storybook/react';
import { CommentForm } from './comment-form';

const meta: Meta<typeof CommentForm> = {
  title: 'Components/CommentForm',
  component: CommentForm,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSubmit: {
      action: 'comment submitted',
      description: 'Callback when a comment is submitted',
    },
    onCancelEdit: {
      action: 'edit cancelled',
      description: 'Callback when editing is cancelled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    isEditing: {
      control: 'boolean',
      description: 'Whether the form is in editing mode',
    },
    editingCommentText: {
      control: 'text',
      description: 'Text to pre-fill when editing',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  name: 'Wade Warren',
  avatarSrc: '',
};

export const Default: Story = {
  args: {
    currentUser: mockUser,
    onSubmit: (text: string) => {
      console.log('Comment submitted:', text);
    },
    placeholder: 'Type a message...',
  },
};

export const EditingMode: Story = {
  args: {
    currentUser: mockUser,
    onSubmit: (text: string) => {
      console.log('Comment updated:', text);
    },
    onCancelEdit: () => {
      console.log('Edit cancelled');
    },
    isEditing: true,
    editingCommentText:
      'This is a comment that is being edited. The user can modify this text and then save or cancel the changes.',
    placeholder: 'Type a message...',
  },
};

export const EditingModeWithLongText: Story = {
  args: {
    currentUser: mockUser,
    onSubmit: (text: string) => {
      console.log('Comment updated:', text);
    },
    onCancelEdit: () => {
      console.log('Edit cancelled');
    },
    isEditing: true,
    editingCommentText:
      'This is a very long comment that demonstrates how the form handles longer text content when in editing mode. The textarea should expand to accommodate the content while maintaining good readability and the overall layout should remain clean and organized.',
    placeholder: 'Type a message...',
  },
};
