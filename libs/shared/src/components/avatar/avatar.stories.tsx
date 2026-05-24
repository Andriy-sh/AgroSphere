import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Components/Avatar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Avatar component for displaying user profile images with fallback to initials. Supports different sizes and tooltip functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
      defaultValue: 'md',
    },
    avatarSrc: {
      control: 'text',
      description: 'URL of the avatar image',
    },
    tooltipText: {
      control: 'text',
      description: 'Custom tooltip text (defaults to client name)',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius of the avatar',
      defaultValue: 'none',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    row: {
      original: {
        client: {
          name: 'John',
          surname: 'Doe',
          avatarSrc:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        },
      },
    },
    size: 'md',
    tooltipText: 'John Doe',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default avatar with user image and custom tooltip.',
      },
    },
  },
};

export const WithInitials: Story = {
  args: {
    row: {
      original: {
        client: {
          name: 'Alice',
          surname: 'Johnson',
        },
      },
    },
    size: 'md',
    tooltipText: 'Alice Johnson',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar showing initials when no image is provided.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        row={{
          original: {
            client: {
              name: 'Small',
              surname: 'User',
              avatarSrc:
                'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="sm"
        tooltipText="Small User"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Medium',
              surname: 'User',
              avatarSrc:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        tooltipText="Medium User"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Large',
              surname: 'User',
              avatarSrc:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="lg"
        tooltipText="Large User"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Extra',
              surname: 'Large',
              avatarSrc:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="xl"
        tooltipText="Extra Large User"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available avatar sizes: sm, md, lg, xl.',
      },
    },
  },
};

export const InitialsSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        row={{
          original: {
            client: {
              name: 'Alice',
              surname: 'Brown',
            },
          },
        }}
        size="sm"
        tooltipText="Alice Brown"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Bob',
              surname: 'Wilson',
            },
          },
        }}
        size="md"
        tooltipText="Bob Wilson"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Carol',
              surname: 'Davis',
            },
          },
        }}
        size="lg"
        tooltipText="Carol Davis"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'David',
              surname: 'Miller',
            },
          },
        }}
        size="xl"
        tooltipText="David Miller"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars with initials fallback in different sizes.',
      },
    },
  },
};

export const AvatarList: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <Avatar
          row={{
            original: {
              client: {
                name: 'John',
                surname: 'Doe',
                avatarSrc:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
              },
            },
          }}
          size="sm"
          tooltipText="John Doe"
        />
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-sm text-gray-500">Project Manager</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <Avatar
          row={{
            original: {
              client: {
                name: 'Jane',
                surname: 'Smith',
              },
            },
          }}
          size="sm"
          tooltipText="Jane Smith"
        />
        <div>
          <div className="font-medium">Jane Smith</div>
          <div className="text-sm text-gray-500">Developer</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <Avatar
          row={{
            original: {
              client: {
                name: 'Mike',
                surname: 'Johnson',
                avatarSrc:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              },
            },
          }}
          size="sm"
          tooltipText="Mike Johnson"
        />
        <div>
          <div className="font-medium">Mike Johnson</div>
          <div className="text-sm text-gray-500">Designer</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatars used in a user list with names and roles.',
      },
    },
  },
};

export const CustomTooltip: Story = {
  args: {
    row: {
      original: {
        client: {
          name: 'Sarah',
          surname: 'Wilson',
          avatarSrc:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        },
      },
    },
    size: 'md',
    tooltipText: 'Sarah Wilson - Senior Developer',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Avatar with custom tooltip text showing additional information.',
      },
    },
  },
};

export const FallbackOnly: Story = {
  args: {
    row: {
      original: {
        client: {
          name: 'Alex',
          surname: 'Taylor',
        },
      },
    },
    size: 'md',
    tooltipText: 'Alex Taylor',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar showing only initials when no image is available.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        Hover over avatars to see tooltips:
      </div>
      <div className="flex items-center gap-4">
        <Avatar
          row={{
            original: {
              client: {
                name: 'Emma',
                surname: 'Davis',
                avatarSrc:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
              },
            },
          }}
          size="md"
          tooltipText="Emma Davis - Product Owner"
        />
        <Avatar
          row={{
            original: {
              client: {
                name: 'Tom',
                surname: 'Anderson',
              },
            },
          }}
          size="md"
          tooltipText="Tom Anderson - QA Engineer"
        />
        <Avatar
          row={{
            original: {
              client: {
                name: 'Lisa',
                surname: 'Garcia',
                avatarSrc:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              },
            },
          }}
          size="md"
          tooltipText="Lisa Garcia - UX Designer"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive avatars with hover tooltips showing user information.',
      },
    },
  },
};

export const RoundedVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        row={{
          original: {
            client: {
              name: 'No',
              surname: 'Rounded',
              avatarSrc:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        rounded="none"
        tooltipText="No rounded"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Small',
              surname: 'Rounded',
              avatarSrc:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        rounded="sm"
        tooltipText="Small rounded"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Medium',
              surname: 'Rounded',
              avatarSrc:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        rounded="md"
        tooltipText="Medium rounded"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Large',
              surname: 'Rounded',
              avatarSrc:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        rounded="lg"
        tooltipText="Large rounded"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'XL',
              surname: 'Rounded',
              avatarSrc:
                'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        rounded="xl"
        tooltipText="XL rounded"
      />
      <Avatar
        row={{
          original: {
            client: {
              name: 'Full',
              surname: 'Rounded',
              avatarSrc:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            },
          },
        }}
        size="md"
        rounded="full"
        tooltipText="Full rounded"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Avatar with all border radius variants: none, sm, md, lg, xl, full.',
      },
    },
  },
};
