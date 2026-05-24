import { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs} from './breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A navigation component that displays the current page location within a website hierarchy. Breadcrumbs help users understand where they are in the site structure and provide quick navigation to parent pages. Supports customizable separators, styling, and both clickable links and static text items.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of breadcrumb items to display',
      control: { type: 'object' },
      table: {
        type: { summary: 'BreadcrumbItem[]' },
        defaultValue: { summary: '[]' },
      },
    },
    separator: {
      description: 'Character or symbol to use between breadcrumb items',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '/' },
      },
    },
    linkClassName: {
      description: 'CSS classes to apply to clickable breadcrumb links',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    activeClassName: {
      description: 'CSS classes to apply to the current/active breadcrumb item',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    separatorClassName: {
      description: 'CSS classes to apply to separator elements',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description:
        'Additional CSS classes to apply to the breadcrumbs container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    separator: '/',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Library', href: '/library' },
      { label: 'Data' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Standard breadcrumbs with default styling. The last item represents the current page and is not clickable, while previous items are clickable links for navigation.',
      },
    },
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '>',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumbs with a custom separator character. You can use any character or symbol to separate breadcrumb items, such as arrows, chevrons, or other decorative elements.',
      },
    },
  },
};

export const CustomClasses: Story = {
  args: {
    linkClassName: 'text-blue-500 underline',
    activeClassName: 'text-black font-semibold',
    separatorClassName: 'text-red-300',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumbs with custom CSS classes for links, active items, and separators. This allows for complete styling customization to match your design system.',
      },
    },
  },
};

export const OnlyActiveItem: Story = {
  args: {
    items: [{ label: 'Current Page' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumbs with only the current page item. Useful for top-level pages or when you want to show just the current location without navigation options.',
      },
    },
  },
};

export const DeepNavigation: Story = {
  args: {
    separator: '›',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Smartphones', href: '/products/electronics/smartphones' },
      { label: 'iPhone 15 Pro' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Deep navigation breadcrumbs showing a complex product hierarchy. This demonstrates how breadcrumbs work with multiple levels of navigation.',
      },
    },
  },
};

export const ECommerceExample: Story = {
  args: {
    separator: '>',
    items: [
      { label: 'Store', href: '/store' },
      { label: 'Clothing', href: '/store/clothing' },
      { label: 'Men', href: '/store/clothing/men' },
      { label: 'Shirts', href: '/store/clothing/men/shirts' },
      { label: 'Casual Shirts' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'E-commerce breadcrumbs example showing product category navigation. This is a common use case for online stores.',
      },
    },
  },
};

export const DocumentationExample: Story = {
  args: {
    separator: '›',
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'Components', href: '/docs/components' },
      { label: 'Navigation', href: '/docs/components/navigation' },
      { label: 'Breadcrumbs' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Documentation site breadcrumbs showing the current page location within the documentation structure.',
      },
    },
  },
};

export const DifferentSeparators: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Forward Slash:</h3>
        <Breadcrumbs
          separator="/"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Section', href: '/section' },
            { label: 'Page' },
          ]}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Greater Than:</h3>
        <Breadcrumbs
          separator=">"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Section', href: '/section' },
            { label: 'Page' },
          ]}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Arrow:</h3>
        <Breadcrumbs
          separator="›"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Section', href: '/section' },
            { label: 'Page' },
          ]}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Chevron:</h3>
        <Breadcrumbs
          separator="›"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Section', href: '/section' },
            { label: 'Page' },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different separator styles. Choose the separator that best matches your design system and user expectations.',
      },
    },
  },
};

export const LongLabels: Story = {
  args: {
    separator: '›',
    items: [
      { label: 'Home', href: '/' },
      {
        label: 'Very Long Section Name That Might Overflow',
        href: '/long-section',
      },
      {
        label:
          'Another Extremely Long Page Title That Could Cause Layout Issues',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumbs with long labels to demonstrate how the component handles text overflow and maintains proper layout.',
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    separator: '›',
    items: [
      { label: '🏠 Home', href: '/' },
      { label: '📁 Projects', href: '/projects' },
      { label: '🔧 Settings', href: '/projects/settings' },
      { label: '⚙️ Configuration' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumbs with emoji icons to demonstrate how the component can handle rich content and visual indicators.',
      },
    },
  },
};
