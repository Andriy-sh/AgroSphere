'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Pagination,
  StatusIndicator,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Label,
  CustomSelect,
  NoResultsFound,
  SearchInput,
} from '@@agrosphere/shared';
import { ColumnDef, HeaderContext, CellContext } from '@tanstack/react-table';
import { ClientTask } from '@/mock/client-tasks';
import { useClientTasks } from '@/hooks/use-client-tasks';
import { TaskDropdownActions } from '@@agrosphere/shared';

interface ClientTasksProps {
  tasks: ClientTask[];
}

export function ClientTasks({ tasks }: ClientTasksProps) {
  const [activeView, setActiveView] = useState<
    'table' | 'list' | 'kanban' | 'calendar'
  >('table');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    tasks: pagedTasks,
    currentPage,
    totalPages,
    showFilters,
    tableContainerRef,
    handlePageChange,
    handleSearchChange,
    handleToggleFilters,
    handleClearFilters,
    handleUpdateTask,
    handleDeleteTask,
    handleDuplicateTask,
    periodFilter,
    statusFilter,
    taskTypeFilter,
    priorityFilter,
    assignedToFilter,
    setPeriodFilter,
    setStatusFilter,
    setTaskTypeFilter,
    setPriorityFilter,
    setAssignedToFilter,
  } = useClientTasks(tasks);

  const handleUpdateStatus = (id: string, status: string) => {
    const mapStatus = (status: string): ClientTask['status'] => {
      switch (status) {
        case 'Not Started':
          return 'not_started';
        case 'in_progress':
          return 'in_progress';
        case 'completed':
          return 'completed';
        case 'pending':
          return 'pending';
        default:
          return 'not_started';
      }
    };

    handleUpdateTask(id, { status: mapStatus(status) });
  };

  const handleUpdatePriority = (
    id: string,
    priority: 'normal' | 'high' | 'none'
  ) => {
    const mapPriority = (
      priority: 'normal' | 'high' | 'none'
    ): ClientTask['priority'] => {
      switch (priority) {
        case 'high':
          return 'urgent';
        case 'normal':
          return 'normal';
        case 'none':
        default:
          return 'none';
      }
    };

    handleUpdateTask(id, { priority: mapPriority(priority) });
  };

  const handleSearchClick = () => {
    setIsSearchActive(true);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearchChange(e.target.value);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleSearchClose();
    }
  };

  const columns: ColumnDef<ClientTask>[] = [
    {
      accessorKey: 'type',
      header: () => (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base px-2 text-basic-gray">
            flag_2
          </span>
          Task type
          <span className="material-symbols-outlined text-sm text-basic-gray">
            unfold_more
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 w-full">
          <span
            className={
              row.original.priority === 'urgent' ||
              row.original.type === 'Drainage inspection' ||
              row.original.type === 'Pesticide spraying'
                ? 'text-[#F04438]'
                : 'text-[#3B82F6]'
            }
          >
            <span className="material-symbols-outlined text-base px-2">
              flag_2
            </span>
          </span>
          <span className="font-medium text-sm flex-1 truncate">
            {row.original.id} {row.original.type}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: () => (
        <div className="flex items-center gap-2">
          Assigned to
          <span className="material-symbols-outlined text-sm text-basic-gray">
            unfold_more
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar
            className="text-basic-green font-bold text-xs"
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
            rounded="lg"
            size="ssm"
          />
          <span className="text-sm">{row.original.assignedTo.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'client',
      header: () => (
        <div className="flex items-center gap-2">
          Client
          <span className="material-symbols-outlined text-sm text-basic-gray">
            unfold_more
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar
            className="text-basic-green font-bold text-xs"
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
            rounded="lg"
            size="ssm"
          />
          <span className="text-sm">{row.original.client}</span>
        </div>
      ),
    },
    {
      accessorKey: 'startAfter',
      header: () => (
        <div className="flex items-center gap-2">
          Start after
          <span className="material-symbols-outlined text-sm text-basic-gray">
            unfold_more
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-basic-gray">
          {row.original.startAfter}
        </span>
      ),
    },
    {
      accessorKey: 'due',
      header: () => (
        <div className="flex items-center gap-2">
          Due
          <span className="material-symbols-outlined text-sm text-basic-gray">
            unfold_more
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-basic-gray">{row.original.due}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex items-center gap-2">
          Stat.
          <span className="material-symbols-outlined text-sm text-basic-gray">
            unfold_more
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        let displayStatus:
          | 'not_started'
          | 'in_progress'
          | 'complete'
          | 'pending';

        switch (status) {
          case 'completed':
            displayStatus = 'complete';
            break;
          case 'in_progress':
            displayStatus = 'in_progress';
            break;
          case 'pending':
            displayStatus = 'pending';
            break;
          case 'not_started':
            displayStatus = 'not_started';
            break;
          default:
            displayStatus = 'pending';
            break;
        }

        return (
          <div className="flex justify-center">
            <StatusIndicator
              status={displayStatus}
              showBackground={true}
              showText={true}
            />
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const task = row.original;
        const mapStatus = (status: ClientTask['status']): string => {
          switch (status) {
            case 'pending':
              return 'Pending';
            case 'not_started':
              return 'Not Started';
            case 'in_progress':
              return 'in_progress';
            case 'completed':
              return 'completed';
            default:
              return 'Not Started';
          }
        };

        return (
          <div className="flex items-center justify-center">
            <TaskDropdownActions
              taskId={task.id}
              status={mapStatus(task.status)}
              isAccepted={true}
              task_has_unmatched_samples={task.priority === 'urgent'}
              task_has_tests_without_lab_result={false}
              task_has_not_started_test={task.priority !== 'normal'}
              onAcceptTask={(id) => console.log(`Accept task ${id}`)}
              onDeclineTask={(id) => console.log(`Decline task ${id}`)}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onViewDetails={(id) => {
                console.log(`View details for task ${id}`);
              }}
              onViewOnMap={(id) => {
                console.log(`View on map task ${id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-1 px-5 pt-2">
        <div className="text-xl font-semibold text-gray-900">Tasks</div>
        <div className="flex items-center gap-3">
          {!isSearchActive ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 bg-basic-white rounded-lg hover:bg-[#E8E9ED] hover:shadow-sm transition-all duration-200"
              onClick={handleSearchClick}
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </Button>
          ) : (
            <SearchInput
              isActive={isSearchActive}
              searchTerm={searchTerm}
              onSearchChange={handleSearchInputChange}
              onClose={handleSearchClose}
              onKeyDown={handleSearchKeyDown}
              className="w-[300px]"
              placeholder="Search tasks..."
              clearOnClose={false}
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 bg-basic-white rounded-lg hover:bg-[#E8E9ED] hover:shadow-sm transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">download</span>
          </Button>

          <Button
            variant={showFilters ? 'complete' : 'ghost'}
            size="default"
            className={`h-9 rounded-lg px-3 flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              !showFilters
                ? 'bg-basic-white hover:bg-[#E8E9ED] hover:shadow-sm'
                : ''
            }`}
            onClick={handleToggleFilters}
          >
            <span className="material-symbols-outlined text-xl">
              filter_alt
            </span>
            Filter
          </Button>

          <div className="flex items-center gap-1 bg-basic-white rounded-lg px-1 h-9">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                activeView === 'table'
                  ? 'bg-white shadow-sm'
                  : 'text-basic-gray hover:bg-[#E8E9ED] hover:shadow-sm'
              }`}
              onClick={() => setActiveView('table')}
            >
              <span className="material-symbols-outlined text-lg">
                border_all
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                activeView === 'list'
                  ? 'bg-white shadow-sm'
                  : 'text-basic-gray hover:bg-[#E8E9ED] hover:shadow-sm'
              }`}
              onClick={() => setActiveView('list')}
            >
              <span className="material-symbols-outlined text-lg">sort</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                activeView === 'kanban'
                  ? 'bg-white shadow-sm'
                  : 'text-basic-gray hover:bg-[#E8E9ED] hover:shadow-sm'
              }`}
              onClick={() => setActiveView('kanban')}
            >
              <span className="material-symbols-outlined text-lg">
                view_kanban
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                activeView === 'calendar'
                  ? 'bg-white shadow-sm'
                  : 'text-basic-gray hover:bg-[#E8E9ED] hover:shadow-sm'
              }`}
              onClick={() => setActiveView('calendar')}
            >
              <span className="material-symbols-outlined text-lg">
                view_object_track
              </span>
            </Button>
          </div>

          <Button
            variant="complete"
            className="h-9 rounded-lg px-4 flex items-center gap-2 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add task
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="w-full bg-white">
          <div className="flex gap-4 px-6 py-3">
            <div className="flex flex-col gap-1 flex-1">
              <Label size="sm">Period</Label>
              <CustomSelect
                options={[
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This week' },
                  { value: 'month', label: 'This month' },
                  { value: 'quarter', label: 'Last 3 months' },
                ]}
                value={periodFilter}
                onValueChange={(value: string) => setPeriodFilter(value)}
                className="w-full"
                placeholder="Select period"
                triggerClassName="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <Label size="sm">Status</Label>
              <CustomSelect
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'not_started', label: 'Not Started' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'complete', label: 'Completed' },
                ]}
                value={statusFilter}
                onValueChange={(value: string) => setStatusFilter(value)}
                placeholder="All"
                className="w-full"
                triggerClassName="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <Label size="sm">Task type</Label>
              <CustomSelect
                options={[
                  { value: 'Soil sampling', label: 'Soil sampling' },
                  { value: 'Soil preparation', label: 'Soil preparation' },
                  { value: 'Pesticide spraying', label: 'Pesticide spraying' },
                  {
                    value: 'Drainage inspection',
                    label: 'Drainage inspection',
                  },
                  { value: 'Harvest planning', label: 'Harvest planning' },
                ]}
                value={taskTypeFilter}
                onValueChange={(value: string) => setTaskTypeFilter(value)}
                placeholder="All"
                className="w-full"
                triggerClassName="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <Label size="sm">Priority</Label>
              <CustomSelect
                options={[
                  { value: 'urgent', label: 'Urgent' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'none', label: 'None' },
                ]}
                value={priorityFilter}
                onValueChange={(value: string) => setPriorityFilter(value)}
                placeholder="All"
                className="w-full"
                triggerClassName="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <Label size="sm">Assigned to</Label>
              <CustomSelect
                options={[
                  { value: 'jane', label: 'Jane C.' },
                  { value: 'ronald', label: 'Ronald R.' },
                  { value: 'brooklyn', label: 'Brooklyn S.' },
                  { value: 'alex', label: 'Alex M.' },
                ]}
                value={assignedToFilter}
                onValueChange={(value: string) => setAssignedToFilter(value)}
                placeholder="All"
                className="w-full"
                triggerClassName="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-9 h-9 bg-[#F5F6FA] rounded-lg flex items-center justify-center hover:bg-[#E8E9ED] transition-colors"
                title="Clear all filters"
              >
                <span className="material-symbols-outlined text-lg text-gray-600">
                  refresh
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={tableContainerRef}
        className="flex-1 overflow-visible min-w-0 w-full max-w-full"
      >
        <div className="w-full min-w-0 max-w-full p-5">
          {activeView === 'table' && (
            <>
              {pagedTasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-basic-gray">
                  No tasks found
                </div>
              ) : (
                <Table
                  className="w-full rounded-lg overflow-visible relative"
                  style={{
                    contain: 'layout style paint',
                    willChange: 'auto',
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
                          className={`overflow-hidden h-9 truncate ${
                            meta?.className || ''
                          } ${index === 0 ? 'rounded-l-xl' : ''} ${
                            index === columns.length - 1 ? 'rounded-r-xl' : ''
                          } ${
                            index === 0
                              ? 'w-auto min-w-[300px]'
                              : index === 1 || index === 2
                              ? 'w-[140px]'
                              : index === 3 || index === 4
                              ? 'w-[100px]'
                              : index === 5
                              ? 'w-[100px]'
                              : 'w-[60px]'
                          }`}
                          style={{
                            contain: 'layout style',
                            willChange: 'auto',
                          }}
                        >
                          {typeof column.header === 'function'
                            ? column.header(
                                {} as HeaderContext<ClientTask, unknown>
                              )
                            : column.header}
                        </TableHead>
                      );
                    })}
                  </TableHeader>
                  <TableBody className="relative">
                    {pagedTasks.length === 0 ? (
                      <TableRow className="h-[60px]">
                        <TableCell
                          colSpan={columns.length}
                          className="h-[60px] text-center text-basic-gray rounded-b-xl"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagedTasks.map((row, rowIndex) => (
                        <TableRow
                          key={row.id}
                          className={`h-[60px] border-b border-basic-white transition-colors relative cursor-pointer ${
                            rowIndex === pagedTasks.length - 1
                              ? 'border-b-0'
                              : ''
                          } ${
                            row.status === 'pending'
                              ? 'bg-[#EEF0F666] hover:bg-[#EEF0F666]/80'
                              : 'hover:bg-basic-white'
                          }`}
                        >
                          {columns.map((column, columnIndex) => {
                            const meta = column.meta as { className?: string };
                            const isFirstColumn = columnIndex === 0;
                            const isLastColumn =
                              columnIndex === columns.length - 1;
                            const isLastRow =
                              rowIndex === pagedTasks.length - 1;
                            return (
                              <TableCell
                                key={
                                  column.id ||
                                  (column as { accessorKey?: string })
                                    .accessorKey
                                }
                                className={`h-[60px] overflow-visible transition-colors ${
                                  meta?.className || ''
                                } ${
                                  isFirstColumn && isLastRow
                                    ? 'rounded-bl-xl'
                                    : ''
                                } ${
                                  isLastColumn && isLastRow
                                    ? 'rounded-br-xl'
                                    : ''
                                } ${
                                  columnIndex === 0
                                    ? 'w-auto min-w-[300px]'
                                    : columnIndex === 1 || columnIndex === 2
                                    ? 'w-[140px]'
                                    : columnIndex === 3 || columnIndex === 4
                                    ? 'w-[100px]'
                                    : columnIndex === 5
                                    ? 'w-[120px]'
                                    : 'w-[60px]'
                                }`}
                                style={{
                                  contain: 'layout style',
                                  willChange: 'auto',
                                }}
                              >
                                {typeof column.cell === 'function'
                                  ? column.cell({
                                      row: { original: row },
                                    } as CellContext<ClientTask, unknown>)
                                  : column.cell}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </>
          )}

          {activeView === 'kanban' && (
            <NoResultsFound
              variant="tasks"
              title="Kanban board coming soon!"
              description="The kanban board view is currently under development. Please use the table view for now."
              className="h-96"
            />
          )}

          {activeView === 'list' && (
            <NoResultsFound
              variant="tasks"
              title="List view coming soon!"
              description="The list view is currently under development. Please use the table view for now."
              className="h-96"
            />
          )}

          {activeView === 'calendar' && (
            <NoResultsFound
              variant="tasks"
              title="Calendar view coming soon!"
              description="The calendar view is currently under development. Please use the table view for now."
              className="h-96"
            />
          )}
        </div>
      </div>

      {activeView === 'table' && pagedTasks.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisiblePages={7}
        />
      )}
    </div>
  );
}
