import type { Meta, StoryObj } from '@storybook/react';
import { CommentItem } from './comment-item';

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comment item component for displaying individual comments in discussion threads, task conversations, and collaborative environments. Features user avatar display, timestamp formatting, and responsive text layout. Built with accessibility in mind and designed to work seamlessly with comment forms and discussion systems.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'object',
      description:
        'User details including name, avatar image URL, and avatar initials for display',
      table: {
        type: { summary: 'User' },
        defaultValue: { summary: '{ name: "John Doe", avatarSrc: "..." }' },
      },
    },
    date: {
      control: 'date',
      description: 'Date and time when the comment was posted',
      table: {
        type: { summary: 'Date' },
        defaultValue: { summary: 'new Date()' },
      },
    },
    commentText: {
      control: 'text',
      description: 'The actual text content of the comment to be displayed',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Sample comment text' },
      },
    },
    className: {
      control: 'text',
      description:
        'Additional CSS classes to apply to the comment item container for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    user: {
      name: 'John Doe',
      avatarSrc: 'https://i.pravatar.cc/150?img=68',
    },
    date: new Date('2024-06-20T10:00:00Z'),
    commentText:
      'This is a sample comment from John Doe about the task progress. Everything looks good so far!',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Standard comment item with user avatar, timestamp, and comment text. This demonstrates the basic layout and functionality of the component.',
      },
    },
  },
};

export const WithInitialsAvatar: Story = {
  args: {
    user: {
      name: 'Jane Smith',
      avatarInitials: 'JS',
      avatarSrc: undefined,
    },
    commentText:
      'Jane commented on the latest update. The changes are very helpful!',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comment item using avatar initials instead of an image. This is useful when user profile pictures are not available or when you prefer a text-based avatar display.',
      },
    },
  },
};

export const LongComment: Story = {
  args: {
    commentText: `This is a much longer comment that spans multiple lines to demonstrate how the text wraps within the comment item.
    It's important to ensure that long texts are displayed correctly and are readable without overflowing the container.
    This also tests the leading-relaxed class for line spacing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.`,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comment item with extended text content to demonstrate text wrapping and line spacing. This shows how the component handles longer comments while maintaining readability.',
      },
    },
  },
};

export const DifferentDate: Story = {
  args: {
    date: new Date('2023-11-15T14:30:00Z'),
    commentText: 'A comment from last year, demonstrating date formatting.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comment item with a different date to demonstrate timestamp formatting and how the component handles various date ranges.',
      },
    },
  },
};

export const AnonymousUser: Story = {
  args: {
    user: {
      name: 'Anonymous User',
      avatarSrc: undefined,
      avatarInitials: 'AU',
    },
    commentText: 'This comment was left by an unknown user.',
  },
  parameters: {
    docs: {
      description: {
        story:
          "Comment item for anonymous users without avatar images. This demonstrates the component's graceful handling of users without profile pictures.",
      },
    },
  },
};

export const CustomClassName: Story = {
  args: {
    className: 'bg-blue-50 border-blue-200',
    commentText: 'This comment has custom background and border colors.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comment item with custom styling applied through CSS classes. This demonstrates how to integrate the component into different design contexts and color schemes.',
      },
    },
  },
};

export const RecentComment: Story = {
  args: {
    user: {
      name: 'Sarah Wilson',
      avatarSrc: 'https://i.pravatar.cc/150?img=32',
    },
    date: '2024-05-10',
    commentText:
      'Just posted this comment a moment ago. The timestamp should show "just now" or similar.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comment item with a very recent timestamp to demonstrate how the component handles current time formatting and relative time display.',
      },
    },
  },
};

export const CommentThread: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <CommentItem
        user={{
          name: 'Alice Johnson',
          avatarSrc: 'https://i.pravatar.cc/150?img=1',
        }}
        date={new Date('2024-06-20T09:00:00Z')}
        commentText="Great work on the soil sampling project! The results look promising."
      />
      <CommentItem
        user={{
          name: 'Bob Smith',
          avatarInitials: 'BS',
        }}
        date={new Date('2024-06-20T09:30:00Z')}
        commentText="Thanks Alice! I noticed some areas that might need additional attention though."
      />
      <CommentItem
        user={{
          name: 'Carol Davis',
          avatarSrc: 'https://i.pravatar.cc/150?img=5',
        }}
        date={new Date('2024-06-20T10:00:00Z')}
        commentText="I agree with Bob. Let's schedule a follow-up inspection for those areas."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple comment items in a discussion thread. This demonstrates how the component works in a conversation context with multiple participants.',
      },
    },
  },
};

export const TaskComments: Story = {
  render: () => (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Task: Soil Sampling - Field 3
        </h3>
        <div className="space-y-4">
          <CommentItem
            user={{
              name: 'Project Manager',
              avatarInitials: 'PM',
            }}
            date={new Date('2024-06-20T08:00:00Z')}
            commentText="Task assigned to the field team. Please complete soil sampling in Field 3 by end of day."
          />
          <CommentItem
            user={{
              name: 'Field Technician',
              avatarSrc: 'https://i.pravatar.cc/150?img=8',
            }}
            date={new Date('2024-06-20T11:00:00Z')}
            commentText="Started the sampling process. Weather conditions are good, should be completed by 3 PM."
          />
          <CommentItem
            user={{
              name: 'Lab Assistant',
              avatarInitials: 'LA',
            }}
            date={new Date('2024-06-20T15:30:00Z')}
            commentText="Samples received and logged. Will begin analysis tomorrow morning."
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comment items in a task management context. This shows how the component integrates into project management workflows with different user roles.',
      },
    },
  },
};