'use client';

import React, { useEffect } from 'react';
import {
  FilterState,
  TaskType,
  Pagination,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  NoResultsFound,
} from '@@agrosphere/shared';
import { TableColumns } from '@/components/tasks/table-columns';
import { CellContext, HeaderContext } from '@tanstack/react-table';
import { useTableTasks } from '@/hooks/tasks';
import { TasksTableRowSkeleton } from '@/components/skeletons';

interface TableTabProps {
  filters: FilterState;
  searchTerm: string;
  currentPage: number;
  activeTab: string;
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  createdAtFilter: 'none' | 'newest' | 'oldest';
  activeAfterFilter: 'none' | 'newest' | 'oldest';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  taskTypeFilter: 'none' | 'asc' | 'desc';

  setAssignedToFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setClientFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setCreatedAtFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setActiveAfterFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setDueFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setStatusFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setTaskTypeFilter: (filter: 'none' | 'asc' | 'desc') => void;

  handlePageChange: (page: number) => void;
  handlePageReset?: () => void;
  handleAcceptTask: (id: string) => void;
  handleDeclineTask: (id: string) => void;
  handleUpdateStatus: (
    id: string,
    status:
      | 'pending'
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'not_started'
      | 'Not Started'
      | 'not_started'
  ) => void;
  handleUpdatePriority: (id: string, flag: 'normal' | 'high' | 'none') => void;
  handleDeleteTask: (id: string) => void;
  handleUpdateTask: (id: string, updates: Partial<TaskType>) => void;
  handleDuplicateTask?: (id: string) => void;

  showFilters: boolean;
  onViewOnMap?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  onNavigateToTask?: (taskId: string) => void;
  onSetDeleteOptimistic?: (
    deleteFn: ((taskId: string) => Promise<void>) | null
  ) => void;
}

export function TableTab({
  filters,
  searchTerm,
  currentPage,
  activeTab,
  assignedToFilter,
  clientFilter,
  createdAtFilter,
  activeAfterFilter,
  dueFilter,
  statusFilter,
  taskTypeFilter,
  setAssignedToFilter,
  setClientFilter,
  setCreatedAtFilter,
  setActiveAfterFilter,
  setDueFilter,
  setStatusFilter,
  setTaskTypeFilter,
  handlePageChange,
  handlePageReset,
  handleAcceptTask,
  handleDeclineTask,
  handleUpdateStatus,
  handleUpdatePriority,
  handleDeleteTask,
  handleUpdateTask,
  handleDuplicateTask,
  showFilters,
  onViewOnMap,
  onViewDetails,
  onNavigateToTask,
  onSetDeleteOptimistic,
}: TableTabProps) {
  const {
    tasks,
    total,
    dynamicPageSize,
    tableContainerRef,
    deleteTaskOptimistic,
    patchTaskOptimistic,
    showSkeleton,
    showNoResults,
  } = useTableTasks({
    filters,
    searchTerm,
    currentPage,
    assignedToFilter,
    clientFilter,
    createdAtFilter,
    activeAfterFilter,
    dueFilter,
    statusFilter,
    taskTypeFilter,
    isActive: activeTab === 'table',
    onPageReset: handlePageReset,
  });

  const filteredTasks = tasks;

  const { columns, showColumns } = TableColumns({
    taskTypeFilter,
    assignedToFilter,
    clientFilter,
    createdAtFilter,
    activeAfterFilter,
    dueFilter,
    statusFilter,
    setTaskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
    handleAcceptTask,
    handleDeclineTask,
    handleUpdateStatus,
    handleUpdatePriority,
    handleDeleteTask,
    handleUpdateTask,
    handleDuplicateTask,
    showFilters,
    tableContainerRef: tableContainerRef as React.RefObject<HTMLDivElement>,
    onViewOnMap,
    onViewDetails,
    onNavigateToTask,
    patchTaskOptimistic,
  });

  const pagedTasks = filteredTasks;

  useEffect(() => {
    if (onSetDeleteOptimistic && deleteTaskOptimistic) {
      onSetDeleteOptimistic(deleteTaskOptimistic);
    }
  }, [onSetDeleteOptimistic, deleteTaskOptimistic]);

  const totalPages =
    total && dynamicPageSize ? Math.ceil(total / dynamicPageSize) : 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-visible min-w-0 w-full max-w-full"
      >
        <div className="w-full min-w-0 max-w-full">
          <Table
            className="table-fixed rounded-xl overflow-visible relative"
            style={{
              contain: 'layout style paint',
              willChange: 'auto',
              transition: 'none',
            }}
          >
            <TableHeader className="text-basic-gray bg-basic-white">
              {columns.map((column, index) => {
                const meta = column.meta as { className?: string };
                return (
                  <TableHead
                    key={
                      column.id ||
                      (column as { accessorKey?: string }).accessorKey
                    }
                    className={`overflow-hidden h-9 px-2 truncate ${
                      meta?.className || ''
                    } ${index === 0 ? 'rounded-l-xl' : ''} ${
                      index === columns.length - 1 ? 'rounded-r-xl' : ''
                    }`}
                    style={{
                      contain: 'layout style',
                      willChange: 'auto',
                      transition: 'none',
                    }}
                  >
                    {typeof column.header === 'function'
                      ? column.header({} as HeaderContext<TaskType, unknown>)
                      : column.header}
                  </TableHead>
                );
              })}
            </TableHeader>
            <TableBody className="relative">
              {showSkeleton ? (
                Array.from({ length: dynamicPageSize ?? 10 }).map(
                  (_, index) => (
                    <TasksTableRowSkeleton
                      key={`skeleton-${index}`}
                      showColumns={showColumns}
                      showFilters={showFilters}
                    />
                  )
                )
              ) : showNoResults ? (
                <TableRow className="h-[60px] bg-white">
                  <TableCell
                    colSpan={columns.length}
                    className="h-[60px] text-center text-basic-gray"
                    checkbox={true}
                  >
                    <NoResultsFound variant="tasks" />
                  </TableCell>
                </TableRow>
              ) : (
                pagedTasks.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    className={`h-[60px] border-b border-basic-white transition-colors relative cursor-pointer ${
                      rowIndex === pagedTasks.length - 1 ? 'border-b-0' : ''
                    } ${
                      row.status === 'pending'
                        ? 'bg-[#EEF0F666] hover:bg-[#EEF0F666]/80'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onViewOnMap?.(row.id)}
                  >
                    {columns.map((column, columnIndex) => {
                      const meta = column.meta as { className?: string };
                      const isFirstColumn = columnIndex === 0;
                      const isLastColumn = columnIndex === columns.length - 1;
                      const isLastRow = rowIndex === pagedTasks.length - 1;
                      return (
                        <TableCell
                          key={
                            column.id ||
                            (column as { accessorKey?: string }).accessorKey
                          }
                          className={`h-[60px] px-2 overflow-visible transition-colors ${
                            meta?.className || ''
                          } ${
                            isFirstColumn && isLastRow ? 'rounded-bl-xl' : ''
                          } ${
                            isLastColumn && isLastRow ? 'rounded-br-xl' : ''
                          }`}
                          style={{
                            contain: 'layout style',
                            willChange: 'auto',
                            transition: 'none',
                          }}
                        >
                          {typeof column.cell === 'function'
                            ? column.cell({
                                row: { original: row },
                                table: {
                                  getRowModel: () => ({
                                    rows: pagedTasks.map((task, index) => ({
                                      id: task.id,
                                      original: task,
                                    })),
                                  }),
                                  getState: () => {
                                    const state = {
                                      pagination: {
                                        pageIndex: safeCurrentPage,
                                        pageSize: dynamicPageSize ?? 10,
                                      },
                                    };
                                    return state;
                                  },
                                },
                              } as unknown as CellContext<TaskType, unknown>)
                            : column.cell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredTasks.length > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisiblePages={7}
        />
      )}
    </div>
  );
}
