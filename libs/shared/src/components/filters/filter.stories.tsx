import type { Meta, StoryObj } from '@storybook/react';
import { Filters, type FilterSection } from './filters';
import { Tag, Users, CalendarDays, BarChart } from 'lucide-react';

const mockSections: FilterSection[] = [
  {
    title: 'Task Type',
    icon: <Tag size={20} />,
    rows: [
      { checked: true, label: 'Website Design', badgeCount: 15 },
      { checked: false, label: 'Logo Design', badgeCount: 8 },
      { checked: true, label: 'Brand Identity', badgeCount: 22 },
    ],
  },
  {
    title: 'Assigned To',
    icon: <Users size={20} />,
    rows: [
      { checked: true, label: 'John Doe', badgeCount: 7 },
      { checked: false, label: 'Sarah Johnson', badgeCount: 3 },
    ],
  },
  {
    title: 'Start Date',
    icon: <CalendarDays size={20} />,
    rows: [
      { checked: false, label: 'Last 7 days', badgeCount: 30 },
      { checked: true, label: 'Last 30 days', badgeCount: 90 },
      { checked: false, label: 'This month', badgeCount: 45 },
      { checked: false, label: 'Custom Range', isCustom: true },
    ],
  },
  {
    title: 'Status',
    icon: <BarChart size={20} />,
    rows: [
      { checked: true, label: 'Pending', badgeCount: 18 },
      { checked: false, label: 'In Progress', badgeCount: 42 },
      { checked: false, label: 'Completed', badgeCount: 65 },
      { checked: false, label: 'Cancelled', badgeCount: 5 },
    ],
  },
];

const meta: Meta<typeof Filters> = {
  component: Filters,
  title: 'Components/Filters',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive filter sidebar component that provides an organized way to filter data across multiple categories. Perfect for dashboards, task management systems, and any interface requiring complex filtering capabilities.\n\n**Features:**\n- Collapsible filter sections with custom icons\n- Checkbox-based filtering with badge counts\n- Reset functionality to clear all filters\n- Responsive design with scrollable content\n- Custom filter options for date ranges and special cases\n- Accessibility features with proper ARIA labels\n- Clean, modern UI with hover effects and transitions\n\n**Usage:**\nOrganize filters into logical sections (e.g., Task Type, Assigned To, Date Range, Status). Each section can contain multiple filter options with associated counts. The component automatically handles the collapsible behavior and provides a reset button to clear all selections.',
      },
    },
  },
  argTypes: {
    sections: {
      description:
        'Array of filter sections, each containing a title, icon, and filter rows',
      control: { type: 'object' },
      table: {
        type: { summary: 'FilterSection[]' },
      },
    },
    className: {
      description: 'Additional CSS classes for the root container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    onReset: {
      description:
        'Callback function triggered when the reset button is clicked',
      action: 'reset',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  args: {
    sections: mockSections,
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof Filters>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 300, height: 600 }}>
      <Filters {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default filter sidebar with multiple sections including Task Type, Assigned To, Start Date, and Status. Demonstrates the complete filtering interface with collapsible sections, badge counts, and reset functionality.',
      },
    },
  },
};

export const TaskManagementFilters: Story = {
  render: (args) => (
    <div style={{ width: 300, height: 600 }}>
      <Filters {...args} />
    </div>
  ),
  args: {
    sections: [
      {
        title: 'Priority',
        icon: <Tag size={20} />,
        rows: [
          { checked: true, label: 'High Priority', badgeCount: 12 },
          { checked: false, label: 'Medium Priority', badgeCount: 25 },
          { checked: true, label: 'Low Priority', badgeCount: 8 },
        ],
      },
      {
        title: 'Team Members',
        icon: <Users size={20} />,
        rows: [
          { checked: true, label: 'Design Team', badgeCount: 15 },
          { checked: false, label: 'Development Team', badgeCount: 22 },
          { checked: true, label: 'Marketing Team', badgeCount: 10 },
        ],
      },
      {
        title: 'Due Date',
        icon: <CalendarDays size={20} />,
        rows: [
          { checked: false, label: 'Overdue', badgeCount: 5 },
          { checked: true, label: 'Due Today', badgeCount: 8 },
          { checked: false, label: 'Due This Week', badgeCount: 18 },
          { checked: false, label: 'Due Next Week', badgeCount: 12 },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Task management focused filters showing priority levels, team assignments, and due dates. This demonstrates how the component can be customized for specific use cases with relevant filter categories.',
      },
    },
  },
};
