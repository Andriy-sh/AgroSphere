import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { Pagination } from './pagination';

const DemoWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100px',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

const PaginationWrapper: React.FC<any> = (args) => {
  const [page, setPage] = useState(args.currentPage);

  useEffect(() => {
    setPage(args.currentPage);
  }, [args.currentPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    args.onPageChange?.(newPage);
  };

  return (
    <Pagination {...args} currentPage={page} onPageChange={handlePageChange} />
  );
};

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A flexible and accessible pagination component that provides navigation through large datasets.

## Features
- **Responsive Design**: Adapts to different screen sizes and content lengths
- **Accessible**: Built with ARIA labels and keyboard navigation support
- **Customizable**: Configurable button text, styling classes, and behavior
- **Smart Truncation**: Intelligently shows page numbers with ellipsis for large datasets
- **Flexible Configuration**: Control the number of visible pages and navigation options

## Use Cases
- Data tables with large datasets
- Search results pagination
- Content management systems
- E-commerce product listings
- Blog or article archives
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The currently active page number (1-based indexing)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'The total number of pages available',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    onPageChange: {
      action: 'pageChanged',
      description:
        'Callback function called when the user navigates to a different page',
      table: {
        type: { summary: '(page: number) => void' },
      },
    },
    maxVisiblePages: {
      control: { type: 'number', min: 3, max: 15 },
      description:
        'Maximum number of visible page numbers (including ellipsis and edge pages)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '7' },
      },
    },
    prevButtonText: {
      control: 'text',
      description: 'Text displayed on the previous page button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Previous' },
      },
    },
    nextButtonText: {
      control: 'text',
      description: 'Text displayed on the next page button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Next' },
      },
    },
    gapIndicator: {
      control: 'text',
      description: 'Text or symbol used to indicate skipped pages (ellipsis)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '...' },
      },
    },
    disabledClassName: {
      control: 'text',
      description: 'CSS class applied to disabled navigation elements',
      table: {
        type: { summary: 'string' },
        disable: true,
      },
    },
    activeClassName: {
      control: 'text',
      description: 'CSS class applied to the currently active page',
      table: {
        type: { summary: 'string' },
        disable: true,
      },
    },
    itemClassName: {
      control: 'text',
      description: 'CSS class applied to each pagination item',
      table: {
        type: { summary: 'string' },
        disable: true,
      },
    },
    containerClassName: {
      control: 'text',
      description: 'CSS class applied to the pagination container',
      table: {
        type: { summary: 'string' },
      },
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Whether to show first and last page navigation buttons',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <DemoWrapper>
        <Story />
      </DemoWrapper>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const Template: Story = {
  render: (args) => <PaginationWrapper {...args} />,
};

export const Default: Story = {
  ...Template,
  args: {
    currentPage: 1,
    totalPages: 10,
    maxVisiblePages: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic pagination with 10 pages, showing the first page. This is the most common use case for moderate-sized datasets.',
      },
    },
  },
};

export const ManyPages: Story = {
  ...Template,
  args: {
    currentPage: 5,
    totalPages: 50,
    maxVisiblePages: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination for a large dataset with 50 pages. The component intelligently shows ellipsis when there are more pages than can be displayed.',
      },
    },
  },
};

export const NearBeginning: Story = {
  ...Template,
  args: {
    currentPage: 3,
    totalPages: 6,
    maxVisiblePages: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination near the beginning of a dataset. All page numbers are visible since the total pages is less than maxVisiblePages.',
      },
    },
  },
};

export const NearEnd: Story = {
  ...Template,
  args: {
    currentPage: 4,
    totalPages: 6,
    maxVisiblePages: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination near the end of a dataset. Useful for demonstrating navigation behavior when approaching the last page.',
      },
    },
  },
};

export const LastPages: Story = {
  ...Template,
  args: {
    currentPage: 48,
    totalPages: 50,
    maxVisiblePages: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination showing the last few pages of a large dataset. Demonstrates how the component handles navigation near the end.',
      },
    },
  },
};
