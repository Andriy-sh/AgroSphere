import type { Meta, StoryObj } from '@storybook/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';
import { Avatar } from '../avatar/avatar';
import { StatusIndicator } from '../status-indicator/status-indicator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/table';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  country: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  assignedTo: string;
  dueDate: string;
}

const generateData = (count: number): Person[] => {
  const names = [
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Jane', lastName: 'Smith' },
    { firstName: 'Alice', lastName: 'Johnson' },
    { firstName: 'Bob', lastName: 'Brown' },
    { firstName: 'Eve', lastName: 'Davis' },
  ];

  const statuses: Person['status'][] = [
    'completed',
    'in_progress',
    'pending',
    'cancelled',
  ];
  const assignees = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Eve Davis',
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `${i + 1}`,
    firstName: names[i % names.length].firstName,
    lastName: names[i % names.length].lastName,
    age: 20 + (i % 30),
    city: ['New York', 'London', 'Paris', 'Berlin', 'Tokyo'][i % 5],
    email: `user${i + 1}@example.com`,
    phone: `+1234567890${i}`,
    company: ['Acme Inc', 'Globex', 'Umbrella', 'Stark', 'Wayne'][i % 5],
    position: ['Manager', 'Developer', 'Designer', 'QA', 'Support'][i % 5],
    country: ['USA', 'UK', 'France', 'Germany', 'Japan'][i % 5],
    status: statuses[i % statuses.length],
    assignedTo: assignees[i % assignees.length],
    dueDate: '2024-05-10',
  }));
};

const meta: Meta<typeof DataTable> = {
  component: DataTable,
  title: 'Components/DataTable',
  parameters: {
    docs: {
      description: {
        component:
          'A powerful and flexible data table component built with TanStack Table (React Table v8). This component provides comprehensive data display capabilities including sorting, filtering, pagination, row selection, and custom cell rendering. The table supports various data types, responsive design, and extensive customization options for enterprise applications.',
      },
    },
  },
  argTypes: {
    columns: {
      description:
        'Column definitions that specify how each column should be displayed and behave',
      control: false,
    },
    data: {
      description: 'Array of data objects to be displayed in the table rows',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const baseColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">No</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-sm truncate">{row.original.id}</div>
    ),
    meta: { className: 'w-24 text-start first:pl-5 ' },
  },
  {
    accessorKey: 'firstName',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">Name</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-0">
        <Avatar
          row={{
            original: {
              client: {
                name: row.original.firstName,
                surname: row.original.lastName,
                avatarSrc: '',
              },
            },
          }}
          rounded="md"
          className="w-7 h-7 flex-shrink-0"
        />
        <span className="text-sm truncate">
          {row.original.firstName} {row.original.lastName}
        </span>
      </div>
    ),
    meta: { className: 'w-40 text-start text-sm' },
  },
  {
    accessorKey: 'email',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">Email</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm truncate text-blue-600">{row.original.email}</div>
    ),
    meta: { className: 'w-48 text-start' },
  },
  {
    accessorKey: 'company',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">Company</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm truncate">{row.original.company}</div>
    ),
    meta: { className: 'w-36 text-start' },
  },
  {
    accessorKey: 'position',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">Position</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm truncate">{row.original.position}</div>
    ),
    meta: { className: 'w-28 text-start' },
  },
  {
    accessorKey: 'city',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">City</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm truncate">{row.original.city}</div>
    ),
    meta: { className: 'w-28 text-start' },
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">Status</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">
        <StatusIndicator
          className="!text-sm"
          iconClassName="text-lg"
          showText={true}
          showBackground={true}
          status={row.original.status}
        />
      </div>
    ),
    meta: { className: 'w-32 text-start' },
  },
  {
    accessorKey: 'dueDate',
    header: () => (
      <div className="flex items-center gap-1 cursor-pointer text-sm truncate">
        <span className="truncate">Due Date</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">
          expand_all
        </span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm truncate">{row.original.dueDate}</div>
    ),
    meta: { className: 'w-24 text-start' },
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-full min-w-0 max-w-full">
      <Table className="table-fixed rounded-xl overflow-visible relative">
        <TableHeader className="text-basic-gray bg-basic-white">
          {baseColumns.map((column, index) => {
            const meta = column.meta as { className?: string };
            return (
              <TableHead
                key={column.id || (column as any).accessorKey}
                className={`text-sm font-normal first:pl-5 overflow-hidden h-9 truncate pr-2.5 ${
                  meta?.className || ''
                } ${index === 0 ? 'rounded-l-xl' : ''} ${
                  index === baseColumns.length - 1 ? 'rounded-r-xl' : ''
                }`}
              >
                {typeof column.header === 'function'
                  ? column.header({} as any)
                  : column.header}
              </TableHead>
            );
          })}
        </TableHeader>
        <TableBody className="relative">
          {generateData(10).map((row) => (
            <TableRow key={row.id}>
              {baseColumns.map((column) => {
                const meta = column.meta as { className?: string };
                return (
                  <TableCell
                    key={column.id || (column as any).accessorKey}
                    className={`${meta?.className || ''}`}
                  >
                    {typeof column.cell === 'function'
                      ? column.cell({ row: { original: row } } as any)
                      : column.cell}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Data table with comprehensive user information including avatars, status indicators, and sortable columns. This demonstrates the core table functionality with enterprise-level features.',
      },
    },
  },
};
