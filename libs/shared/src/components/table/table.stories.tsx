import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';
import { Checkbox } from '../checkbox/checkbox';
import { SelectAllCheckbox } from '../select-all-checkbox/select-all-checkbox';
import { CustomSelect, Select } from '../select/select';
import { useState } from 'react';

const equipmentData = [
  {
    id: 'EQ-001',
    type: 'Tractor',
    status: 'Operational',
    lastService: '2024-03-15',
  },
  {
    id: 'EQ-002',
    type: 'Harvester',
    status: 'Maintenance',
    lastService: '2024-03-10',
  },
  {
    id: 'EQ-003',
    type: 'Planter',
    status: 'Operational',
    lastService: '2024-03-12',
  },
  {
    id: 'EQ-004',
    type: 'Sprayer',
    status: 'Operational',
    lastService: '2024-03-08',
  },
  {
    id: 'EQ-005',
    type: 'Irrigation System',
    status: 'Repair',
    lastService: '2024-03-05',
  },
  {
    id: 'EQ-006',
    type: 'Grain Cart',
    status: 'Operational',
    lastService: '2024-03-14',
  },
];

const teamData = [
  {
    id: 'EQ-001',
    name: 'John Smith',
    email: 'john.smith@farm.com',
    phone: '+1 (555) 123-4567',
    status: 'Operational',
    department: 'Field Operations',
    location: 'North Field',
  },
  {
    id: 'EQ-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@farm.com',
    phone: '+1 (555) 234-5678',
    status: 'Maintenance',
    department: 'Equipment',
    location: 'Main Garage',
  },
  {
    id: 'EQ-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@farm.com',
    phone: '+1 (555) 345-6789',
    status: 'Operational',
    department: 'Irrigation',
    location: 'South Field',
  },
  {
    id: 'EQ-004',
    name: 'Lisa Brown',
    email: 'lisa.brown@farm.com',
    phone: '+1 (555) 456-7890',
    status: 'Operational',
    department: 'Harvesting',
    location: 'East Field',
  },
  {
    id: 'EQ-005',
    name: 'David Davis',
    email: 'david.davis@farm.com',
    phone: '+1 (555) 567-8901',
    status: 'Repair',
    department: 'Maintenance',
    location: 'Workshop',
  },
  {
    id: 'EQ-006',
    name: 'Emma Wilson',
    email: 'emma.wilson@farm.com',
    phone: '+1 (555) 678-9012',
    status: 'Operational',
    department: 'Storage',
    location: 'Warehouse',
  },
];

const renderTable = (
  caption: string,
  headers: string[],
  data: any[],
  footer?: string[]
) => (
  <Table className="table-fixed rounded-xl overflow-visible relative">
    <TableCaption>{caption}</TableCaption>
    <TableHeader className="text-basic-gray  bg-basic-white">
      {headers.map((header, index) => (
        <TableHead
          key={index}
          className={`text-sm font-normal overflow-hidden text-start h-9 truncate first:pl-3 ${
            index === 0 ? 'rounded-l-xl' : ''
          } ${index === headers.length - 1 ? 'rounded-r-xl' : ''}`}
        >
          {header}
        </TableHead>
      ))}
    </TableHeader>
    <TableBody className="relative">
      {data.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {Object.values(row).map((cell, cellIndex) => (
            <TableCell
              key={cellIndex}
              className={`align-middle text-truncate overflow-hidden h-[60px] ${
                cellIndex === 0 ? 'first:pl-3' : ''
              }`}
            >
              {String(cell)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
    {footer && (
      <TableFooter>
        <TableRow>
          {footer.map((cell: any, index: number) => (
            <TableCell
              key={index}
              className={`align-middle text-truncate overflow-hidden h-[60px] ${
                index === 0 ? 'first:pl-3' : ''
              }`}
            >
              {cell}
            </TableCell>
          ))}
        </TableRow>
      </TableFooter>
    )}
  </Table>
);

const meta: Meta<typeof Table> = {
  component: Table,
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A sophisticated table component system designed for agricultural data presentation.

## Component Overview

The Table component suite provides a complete solution for displaying structured data
with semantic HTML, accessibility features, and flexible styling options optimized
for agricultural applications.

## Key Features
- **Semantic structure**: Proper HTML table elements for accessibility
- **Flexible styling**: Customizable appearance with CSS classes
- **Responsive design**: Adapts to different screen sizes
- **Agricultural focus**: Optimized for farm data presentation
- **Professional appearance**: Clean, modern design

## Table Components
- **Table**: Main container with border and styling
- **TableHeader**: Header section with column definitions
- **TableBody**: Main content area with data rows
- **TableFooter**: Footer for summaries and totals
- **TableRow**: Individual data rows
- **TableHead**: Header cells with column titles
- **TableCell**: Data cells for content display
- **TableCaption**: Table description and context

## Usage Examples
- Crop yield reports
- Equipment inventory lists
- Team member directories
- Financial summaries
- Task tracking tables
- Weather data displays
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling and theming',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    className: 'odd:bg-white even:bg-gray-50',
  },
  render: (args) => (
    <div className="flex flex-col h-full w-full max-w-full">
      <div className="flex-1 overflow-visible min-w-0 w-full max-w-full">
        <div className="w-full min-w-0 max-w-full p-5">
          {renderTable(
            'Equipment Inventory',
            ['Equipment ID', 'Type', 'Status', 'Last Service'],
            equipmentData
          )}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Table with alternating row colors for better readability of equipment inventory data.',
      },
    },
  },
};

const TableWithSelectors = ({
  data,
  selectedItems,
  onSelectedItemsChange,
}: {
  data: any[];
  selectedItems: string[];
  onSelectedItemsChange: (selected: string[]) => void;
}) => {
  const [statusValues, setStatusValues] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'operational', label: 'Operational' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'offline', label: 'Offline' },
  ];

  const handleStatusChange = (id: string, value: string) => {
    setStatusValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleDeleteSelected = () => {
    onSelectedItemsChange([]);
  };

  return (
    <Table className="table-fixed rounded-xl overflow-visible relative">
      <TableCaption>Team Members Management</TableCaption>
      <TableHeader className="text-basic-gray  bg-basic-white">
        <TableHead className="w-9 h-9 pl-[10px] rounded-l-xl">
          <SelectAllCheckbox
            allItems={data}
            selectedItems={selectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
            getIdFromItem={(item) => item.id}
          />
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-20">
          {selectedItems.length > 0 ? (
            <div className="flex items-center text-xs font-normal justify-start w-full h-full">
              <span className="truncate">
                {selectedItems.length} of {data.length} selected
              </span>
            </div>
          ) : (
            'ID'
          )}
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-28">
          {selectedItems.length > 0 ? <span>&nbsp;</span> : 'Name'}
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-40">
          {selectedItems.length > 0 ? <span>&nbsp;</span> : 'Email'}
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-36">
          {selectedItems.length > 0 ? <span>&nbsp;</span> : 'Phone'}
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-32">
          {selectedItems.length > 0 ? <span>&nbsp;</span> : 'Status'}
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-28">
          {selectedItems.length > 0 ? <span>&nbsp;</span> : 'Department'}
        </TableHead>
        <TableHead className="text-sm font-normal overflow-hidden text-start h-9 truncate w-32 rounded-r-xl">
          {selectedItems.length > 0 ? (
            <div className="flex items-center justify-end w-full h-full pr-4">
              <span
                className="material-symbols-outlined text-[#1C1B1F] cursor-pointer text-lg hover:text-basic-red transition-colors flex-shrink-0"
                onClick={handleDeleteSelected}
              >
                delete
              </span>
            </div>
          ) : (
            'Location'
          )}
        </TableHead>
      </TableHeader>
      <TableBody className="relative">
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="w-9 h-[60px] pl-[10px]">
              <Checkbox
                checked={selectedItems.includes(row.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectedItemsChange([...selectedItems, row.id]);
                  } else {
                    onSelectedItemsChange(
                      selectedItems.filter((id) => id !== row.id)
                    );
                  }
                }}
                className="rounded border-basic-gray-light w-4 h-4"
              />
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px] w-24">
              {row.id}
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px] w-32">
              {row.name}
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px] w-40">
              {row.email}
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px] w-36">
              {row.phone}
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px] w-28">
              <CustomSelect
                options={statusOptions}
                value={statusValues[row.id] || row.status.toLowerCase()}
                onValueChange={(value) => handleStatusChange(row.id, value)}
                placeholder="Select status"
                triggerClassName="w-full h-8 text-xs mr-4"
                className="mr-4"
              />
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px]  w-32">
              {row.department}
            </TableCell>
            <TableCell className="align-middle text-truncate overflow-hidden h-[60px] w-32">
              {row.location}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const WithSelectorsComponent = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      <div className="flex-1 overflow-visible min-w-0 w-full max-w-full">
        <div className="w-full min-w-0 max-w-full p-5">
          <TableWithSelectors
            data={teamData}
            selectedItems={selectedItems}
            onSelectedItemsChange={setSelectedItems}
          />
        </div>
      </div>
    </div>
  );
};

export const WithSelectors: Story = {
  args: {
    className: 'odd:bg-white even:bg-gray-50',
  },
  render: (args) => <WithSelectorsComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Table with checkboxes for row selection and one dropdown selector for status field. Features 8 columns: centered checkbox selection, ID, name, email, phone, status selector, department, and location. When items are selected, the header shows selection count and a delete button appears on the right.',
      },
    },
  },
};
