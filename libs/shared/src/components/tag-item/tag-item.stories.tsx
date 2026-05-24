import type { Meta, StoryObj } from '@storybook/react';
import { TagItem } from './tag-item';

const meta: Meta<typeof TagItem> = {
  component: TagItem,
  title: 'Components/TagItem',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible tag component designed for agricultural applications and categorization.

## Component Overview

The TagItem component provides a clean, interactive way to display tags, labels,
and categories with smooth hover effects and customizable styling optimized
for farm management applications.

## Key Features
- **Interactive hover effects**: Smooth color transitions on hover
- **Flexible content**: Supports any content as children
- **Customizable styling**: Extensible through className prop
- **Agricultural focus**: Green hover color for farm themes
- **Accessibility**: Proper cursor and transition indicators
- **Responsive design**: Works across all device sizes

## Visual States
- **Default**: Standard tag appearance
- **Hover**: Green color transition for interactive feedback
- **Custom**: User-defined styling through className

## Usage Examples
- Crop type identification
- Equipment categorization
- Task priority indicators
- Status and condition badges
- Filter and search tags
- Category and classification markers
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description:
        'Content to display inside the tag (text, icons, or other elements)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling and theming',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    children: 'Sample Tag',
    className: '',
  },
};
export default meta;
type Story = StoryObj<typeof TagItem>;

export const Default: Story = {
  args: {
    children: 'Wheat',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic tag item displaying a crop type with default styling and hover effects.',
      },
    },
  },
};

export const CropTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem>Wheat</TagItem>
      <TagItem>Corn</TagItem>
      <TagItem>Soybeans</TagItem>
      <TagItem>Cotton</TagItem>
      <TagItem>Rice</TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Collection of crop type tags showing how the component can be used for agricultural categorization.',
      },
    },
  },
};

export const EquipmentTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem>Tractor</TagItem>
      <TagItem>Harvester</TagItem>
      <TagItem>Planter</TagItem>
      <TagItem>Sprayer</TagItem>
      <TagItem>Irrigation</TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Equipment categorization tags for farm machinery and tools.',
      },
    },
  },
};

export const PriorityTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem className="bg-red-100 text-red-700 hover:text-red-800">
        High Priority
      </TagItem>
      <TagItem className="bg-yellow-100 text-yellow-700 hover:text-yellow-800">
        Medium Priority
      </TagItem>
      <TagItem className="bg-green-100 text-green-700 hover:text-green-800">
        Low Priority
      </TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Priority level tags with custom color coding for task management and workflow organization.',
      },
    },
  },
};

export const StatusTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem className="bg-green-100 text-green-700 hover:text-green-800">
        Active
      </TagItem>
      <TagItem className="bg-gray-100 text-gray-700 hover:text-gray-800">
        Inactive
      </TagItem>
      <TagItem className="bg-blue-100 text-blue-700 hover:text-blue-800">
        Pending
      </TagItem>
      <TagItem className="bg-orange-100 text-orange-700 hover:text-orange-800">
        Maintenance
      </TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status indicator tags with color-coded backgrounds for different operational states.',
      },
    },
  },
};

export const FieldTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem>North Field</TagItem>
      <TagItem>South Field</TagItem>
      <TagItem>East Field</TagItem>
      <TagItem>West Field</TagItem>
      <TagItem>Greenhouse</TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Field location tags for organizing agricultural operations by geographic areas.',
      },
    },
  },
};

export const TaskTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem>Planting</TagItem>
      <TagItem>Irrigation</TagItem>
      <TagItem>Fertilization</TagItem>
      <TagItem>Harvesting</TagItem>
      <TagItem>Maintenance</TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Task type tags for categorizing different agricultural activities and operations.',
      },
    },
  },
};

export const WeatherTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagItem className="bg-blue-100 text-blue-700 hover:text-blue-800">
        Sunny
      </TagItem>
      <TagItem className="bg-gray-100 text-gray-700 hover:text-gray-800">
        Cloudy
      </TagItem>
      <TagItem className="bg-blue-100 text-blue-700 hover:text-blue-800">
        Rainy
      </TagItem>
      <TagItem className="bg-purple-100 text-purple-700 hover:text-purple-800">
        Stormy
      </TagItem>
      <TagItem className="bg-gray-100 text-gray-700 hover:text-gray-800">
        Foggy
      </TagItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Weather condition tags with appropriate color coding for environmental monitoring.',
      },
    },
  },
};

export const CustomStyled: Story = {
  args: {
    children: 'Custom Tag',
    className:
      'bg-purple-100 text-purple-700 border border-purple-300 rounded-full px-3 py-1',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom styled tag demonstrating the flexibility of the component with unique colors and border styling.',
      },
    },
  },
};

export const InteractiveExample: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Hover over tags to see interactive effects:
      </p>
      <div className="flex flex-wrap gap-2">
        <TagItem>Organic</TagItem>
        <TagItem>Certified</TagItem>
        <TagItem>Premium</TagItem>
        <TagItem>Local</TagItem>
        <TagItem>Sustainable</TagItem>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing the hover effects and smooth transitions that enhance user experience.',
      },
    },
  },
};

export const FilterTags: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <TagItem className="bg-green-100 text-green-700 hover:text-green-800">
          All Crops
        </TagItem>
        <TagItem>Wheat</TagItem>
        <TagItem>Corn</TagItem>
        <TagItem>Soybeans</TagItem>
      </div>
      <div className="flex flex-wrap gap-2">
        <TagItem className="bg-blue-100 text-blue-700 hover:text-blue-800">
          All Equipment
        </TagItem>
        <TagItem>Tractors</TagItem>
        <TagItem>Harvesters</TagItem>
        <TagItem>Planters</TagItem>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Filter tag groups demonstrating how tags can be used for data filtering and category selection in agricultural applications.',
      },
    },
  },
};
