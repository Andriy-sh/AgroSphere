import React, { useState, useMemo } from 'react';
import {
  Avatar,
  Button,
  DataTable,
  DropdownActionItem,
  DropdownActionsNoLib,
  Pagination,
  StatusIndicator,
} from '@@agrosphere/shared';
import { ColumnDef } from '@tanstack/react-table';

export interface TaskRow {
  id: number;
  type: string;
  assignedTo: { name: string; avatar?: string };
  client: string;
  clientAvatar?: string;
  startAfter: string;
  due: string;
  status: 'done' | 'pending' | 'overdue';
}

interface TasksTabProps {
  tasks: TaskRow[];
}

const ROWS_PER_PAGE = 10;

const columns: ColumnDef<TaskRow>[] = [
  {
    accessorKey: 'type',
    header: () => (
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-base text-[#29B54C]">
          flag_2
        </span>
        Task type
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={
            row.original.type === 'Soil sampling' ||
            row.original.type === 'Drainage inspection'
              ? 'text-[#F04438]'
              : 'text-[#3B82F6]'
          }
        >
          <span className="material-symbols-outlined text-base">flag_2</span>
        </span>
        <span className="font-medium">
          #{row.original.id} {row.original.type}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned to',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar
          className="w-7 h-7 rounded bg-green-50 text-[#29B54C] font-bold"
          row={{
            original: {
              client: {
                name: row.original.assignedTo.name,
                surname: '',
                avatarSrc: row.original.assignedTo.avatar,
              },
            },
          }}
          tooltipText={row.original.assignedTo.name}
          size="sm"
        />
        <span>{row.original.assignedTo.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar
          className="w-7 h-7 rounded bg-green-50 text-[#29B54C] font-bold"
          row={{
            original: {
              client: {
                name: row.original.client,
                surname: '',
                avatarSrc: row.original.clientAvatar,
              },
            },
          }}
          tooltipText={row.original.client}
          size="sm"
        />
        <span>{row.original.client}</span>
      </div>
    ),
  },
  {
    accessorKey: 'startAfter',
    header: 'Start after',
  },
  {
    accessorKey: 'due',
    header: 'Due',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      let status: 'complete' | 'pending' | 'cancelled' | 'unknown' = 'unknown';
      if (row.original.status === 'done') status = 'complete';
      else if (row.original.status === 'pending') status = 'pending';
      else if (row.original.status === 'overdue') status = 'cancelled';
      return <StatusIndicator status={status} />;
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const items: DropdownActionItem[] = [
        {
          id: 'view',
          label: 'View',
          onClick: () => alert(`View task #${row.original.id}`),
        },
        {
          id: 'edit',
          label: 'Edit',
          onClick: () => alert(`Edit task #${row.original.id}`),
        },
        {
          id: 'delete',
          label: 'Delete',
          className: 'text-red-600',
          onClick: () => alert(`Delete task #${row.original.id}`),
        },
      ];
      return <DropdownActionsNoLib items={items} />;
    },
  },
];

export function TasksTab({ tasks }: TasksTabProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tasks.length / ROWS_PER_PAGE);
  const pagedTasks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return tasks.slice(start, start + ROWS_PER_PAGE);
  }, [tasks, page]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold">Tasks</div>
        <div className="flex items-center gap-3">
          <button className="bg-[#F5F6FA] rounded-xl p-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <button className="bg-[#F5F6FA] rounded-xl p-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">download</span>
          </button>
          <button className="bg-[#F5F6FA] rounded-xl p-3 flex items-center gap-2 font-medium text-base">
            <span className="material-symbols-outlined text-2xl">
              filter_alt
            </span>
            Filter
          </button>
          <div className="flex items-center gap-1 bg-[#F5F6FA] rounded-xl px-1 py-1 ml-2">
            <button className="bg-white rounded-xl p-2 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-xl">
                grid_view
              </span>
            </button>
            <button className="rounded-xl p-2 flex items-center justify-center text-[#818D99]">
              <span className="material-symbols-outlined text-xl">
                view_kanban
              </span>
            </button>
            <button className="rounded-xl p-2 flex items-center justify-center text-[#818D99]">
              <span className="material-symbols-outlined text-xl">
                view_agenda
              </span>
            </button>
          </div>
          <Button className="bg-[#16C35D] hover:bg-[#13a34d] text-white rounded-xl px-6 py-3 flex items-center gap-2 text-base font-semibold">
            <span className="material-symbols-outlined text-xl">add</span>
            Add task
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={pagedTasks} />
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          maxVisiblePages={5}
          prevButtonText="Previous"
          nextButtonText="Next"
          activeClassName="bg-[#16C35D] text-white rounded-xl"
          itemClassName="w-10 h-10 flex items-center justify-center rounded-xl text-base font-medium"
          containerClassName="justify-center"
        />
      </div>
    </div>
  );
}
