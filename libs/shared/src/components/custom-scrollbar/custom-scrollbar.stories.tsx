import { Meta, StoryObj } from '@storybook/react';
import { CustomScrollbar } from './custom-scrollbar';

const meta: Meta<typeof CustomScrollbar> = {
  title: 'Components/CustomScrollbar',
  component: CustomScrollbar,
  parameters: {
    docs: {
      description: {
        component:
          'A custom scrollbar component with smooth animations and hover effects. Supports drag-to-scroll and click-to-scroll functionality.',
      },
    },
  },
  argTypes: {
    className: {
      description: 'Additional CSS classes for the container.',
      control: 'text',
    },
    scrollbarClassName: {
      description: 'CSS classes for the scrollbar track.',
      control: 'text',
    },
    thumbClassName: {
      description: 'CSS classes for the scrollbar thumb.',
      control: 'text',
    },
    showOnHover: {
      description: 'Whether to show scrollbar only on hover.',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomScrollbar>;

const generateContent = (count: number) => {
  return Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-2">Item {i + 1}</h3>
      <p className="text-gray-600">
        This is content for item {i + 1}. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua.
      </p>
      <div className="mt-2 flex gap-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Tag 1
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
          Tag 2
        </span>
      </div>
    </div>
  ));
};

export const Default: Story = {
  args: {
    className: 'h-96 w-80 border border-gray-200 rounded-lg p-4',
    children: generateContent(20),
  },
};

export const AlwaysVisible: Story = {
  args: {
    className: 'h-96 w-80 border border-gray-200 rounded-lg p-4',
    showOnHover: false,
    children: generateContent(20),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CustomScrollbar with always visible scrollbar (showOnHover=false).',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'h-96 w-80 border border-gray-200 rounded-lg p-4',
    scrollbarClassName: 'bg-blue-100',
    thumbClassName: 'bg-blue-500 hover:bg-blue-600',
    children: generateContent(20),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CustomScrollbar with custom blue styling for scrollbar track and thumb.',
      },
    },
  },
};

export const ShortContent: Story = {
  args: {
    className: 'h-96 w-80 border border-gray-200 rounded-lg p-4',
    children: generateContent(3),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CustomScrollbar with short content - scrollbar should not appear.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    className: 'h-96 w-80 border border-gray-200 rounded-lg p-4',
    children: generateContent(50),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CustomScrollbar with very long content to test scrolling behavior.',
      },
    },
  },
};
