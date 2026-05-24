'use client';

import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { X, Check } from 'lucide-react';
import { format } from 'date-fns';
import {
  TaskType,
  Flag,
  Avatar,
  StatusIndicator,
  AssignAssignee,
  TaskDropdownActions,
  PatchTaskRequest,
} from '@@agrosphere/shared';

function useTableContainerWidth(containerRef: React.RefObject<HTMLDivElement>) {
  const [width, setWidth] = useState(1400);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width;
          setWidth((prevWidth) => {
            if (Math.abs(prevWidth - newWidth) > 10) {
              return newWidth;
            }
            return prevWidth;
          });
        }
      }, 16);
    });

    observer.observe(container);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [containerRef]);

  return width;
}

function useDateFormatState(containerRef: React.RefObject<HTMLDivElement>) {
  const [showFullDates, setShowFullDates] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setShowFullDates(width > 1000);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return showFullDates;
}

function formatMonthDay(dateStr: string | null | undefined) {
  if (!dateStr) return 'No date';
  try {
    const parts = dateStr.split('-');
    let year, month, day;

    if (parts[0].length === 4) {
      [year, month, day] = parts;
    } else {
      [day, month, year] = parts;
    }

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return format(date, 'MMMM dd');
  } catch {
    return 'Invalid date';
  }
}

function formatShortDate(dateStr: string | null | undefined) {
  if (!dateStr) return 'No date';
  try {
    const parts = dateStr.split('-');
    let year, month, day;

    if (parts[0].length === 4) {
      [year, month, day] = parts;
    } else {
      [day, month, year] = parts;
    }

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return format(date, 'MMM dd');
  } catch {
    return 'Invalid date';
  }
}

function formatTaskType(taskType: string | null | undefined) {
  if (!taskType) return 'Unknown Task';

  return taskType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface AssigneeOption {
  value: string;
  label: string;
  initials?: string;
}

interface AssignedToCellProps {
  row: Row<TaskType>;
  assigneeOptions: AssigneeOption[];
  handleUpdateTask: (id: string, updates: Partial<TaskType>) => void;
  isFiltersOpen: boolean;
}

function AssignedToCell({
  row,
  assigneeOptions,
  handleUpdateTask,
  isFiltersOpen,
}: AssignedToCellProps) {
  const assignedOrg = row.original.assigned_to_organisation;
  const assigned = assignedOrg?.name;
  const isAccepted = assignedOrg !== null && assignedOrg !== undefined;
  const hasNoOrg = assignedOrg === null || assignedOrg === undefined;
  const isCompleted = row.original.status === 'completed';

  const cellRef = useRef<HTMLDivElement>(null);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setShowName(entry.contentRect.width > 80);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (hasNoOrg) {
    return (
      <div
        ref={cellRef}
        className={`flex justify-start items-center p-2 w-full ${
          isCompleted ? 'opacity-40' : ''
        }`}
      >
        <AssignAssignee
          assigneeOptions={assigneeOptions}
          onAssign={(assigneeId, assigneeLabel) => {
            handleUpdateTask(row.original.id, {
              assigned_to_organisation: assigneeId
                ? {
                    id: assigneeId,
                    name: assigneeLabel,
                    email: '',
                    type: 'contractor',
                  }
                : undefined,
            });
          }}
          className="!w-8 !h-8"
        />
      </div>
    );
  }

  if (!assigned || !assigned.trim()) {
    if (isAccepted) {
      return (
        <div
          ref={cellRef}
          className={`flex justify-center w-full ${
            isCompleted ? 'opacity-40' : ''
          }`}
        >
          <AssignAssignee
            assigneeOptions={assigneeOptions}
            onAssign={(assigneeId, assigneeLabel) => {
              handleUpdateTask(row.original.id, {
                assigned_to_organisation: assigneeId
                  ? {
                      id: assigneeId,
                      name: assigneeLabel,
                      email: '',
                      type: 'contractor',
                    }
                  : undefined,
              });
            }}
            className="w-8 h-8"
          />
        </div>
      );
    } else {
      return (
        <div
          ref={cellRef}
          className={`flex justify-center w-full ${
            isCompleted ? 'opacity-40' : ''
          }`}
        >
          <span className="text-gray-400 font-medium">---</span>
        </div>
      );
    }
  }

  return (
    <div
      ref={cellRef}
      className={`flex items-center gap-2 w-full ${
        isCompleted ? 'opacity-40' : ''
      }`}
    >
      <Avatar
        row={{
          original: {
            client: {
              name: assigned,
              surname: '',
              avatarSrc: '',
            },
          },
        }}
        tooltipText={assigned}
        rounded="lg"
        size="md"
        className="flex-shrink-0"
      />
      {showName && (
        <span className="text-sm font-medium truncate" title={assigned}>
          {assigned}
        </span>
      )}
    </div>
  );
}

interface SortableHeaderProps {
  title: string;
  onClick: () => void;
  getSortIcon: (
    field: string,
    filterState: string,
    filterType: 'alphabetical' | 'date' | 'status'
  ) => string;
}

function SortableHeader({ title, onClick, getSortIcon }: SortableHeaderProps) {
  return (
    <div
      className="text-left flex items-center font-normal text-sm text-basic-gray cursor-pointer hover:bg-gray-100 rounded min-w-0 w-full overflow-hidden"
      onClick={onClick}
    >
      <span className="truncate">{title}</span>
      <span className="material-symbols-outlined text-[14px] mb-0.5 flex-shrink-0">
        {getSortIcon('date', 'none', 'date')}
      </span>
    </div>
  );
}

interface StatusHeaderProps {
  onClick: () => void;
  statusFilter: 'none' | 'asc' | 'desc';
  getSortIcon: (
    field: string,
    filterState: string,
    filterType: 'alphabetical' | 'date' | 'status'
  ) => string;
}

function StatusHeader({
  onClick,
  statusFilter,
  getSortIcon,
}: StatusHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [showFullHeader, setShowFullHeader] = useState(true);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setShowFullHeader(entry.contentRect.width > 105);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headerRef}
      className={`text-left flex items-center font-normal text-sm text-basic-gray cursor-pointer hover:bg-gray-100 rounded min-w-0 w-full overflow-hidden ${
        showFullHeader ? '' : 'justify-center'
      }`}
      onClick={onClick}
    >
      <span className="truncate">Status</span>
      <span className="material-symbols-outlined text-[14px] mb-0.5 flex-shrink-0">
        {getSortIcon('status', statusFilter, 'status')}
      </span>
    </div>
  );
}

interface StatusCellProps {
  row: Row<TaskType>;
  handleDeclineTask: (id: string) => void;
  handleAcceptTask: (id: string) => void;
  handleUpdateStatus: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
}

function StatusCell({
  row,
  handleDeclineTask,
  handleAcceptTask,
  handleUpdateStatus,
}: StatusCellProps) {
  const status = row.original.status;
  const rowId = row.original.id;

  const cellRef = useRef<HTMLDivElement>(null);
  const [showFullStatus, setShowFullStatus] = useState(true);

  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const screenWidth = window.innerWidth;
      const threshold = screenWidth <= 1940 ? 105 : 65;
      setShowFullStatus(entry.contentRect.width > threshold);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (status === 'pending') {
    return (
      <div
        ref={cellRef}
        className={`flex gap-2  items-center ${
          showFullStatus ? 'justify-start' : 'justify-center'
        }`}
      >
        <button
          className="rounded-md bg-[#DBDEE8] p-1 hover:bg-gray-200 w-7 h-7 shadow-[0_-1px_0_rgba(228,229,235,255)]"
          onClick={(e) => {
            e.stopPropagation();
            handleDeclineTask(rowId);
            handleUpdateStatus(rowId, 'cancelled');
          }}
        >
          <X size={20} />
        </button>
        <button
          className="rounded-md  bg-basic-green p-1 w-7 h-7 shadow-[0_-1px_0_rgba(127,211,149,255)]"
          onClick={(e) => {
            e.stopPropagation();
            handleAcceptTask(rowId);
            handleUpdateStatus(rowId, 'in_progress');
          }}
        >
          <Check size={20} className="text-white" />
        </button>
      </div>
    );
  }

  let displayStatus = status;
  if (status === 'In Progress' || status === 'in_progress')
    displayStatus = 'in_progress';
  if (status === 'complete' || status === 'Completed' || status === 'Complete')
    displayStatus = 'complete';
  if (status === 'Not Started' || status === 'Not started')
    displayStatus = 'not_started';
  if (status === 'rejected' || status === 'Declined')
    displayStatus = 'cancelled';

  return (
    <div
      ref={cellRef}
      className={`flex  ${showFullStatus ? 'justify-start' : 'justify-center'}`}
    >
      <StatusIndicator
        tooltip=""
        className="py-0.5"
        iconClassName={showFullStatus ? 'text-[16px]' : 'text-[20px]'}
        status={displayStatus as 'not_started' | 'in_progress' | 'complete'}
        showBackground={showFullStatus}
        showText={showFullStatus}
      />
    </div>
  );
}

interface ClientCellProps {
  row: Row<TaskType>;
  isFiltersOpen: boolean;
}

function ClientCell({ row, isFiltersOpen }: ClientCellProps) {
  const client = row.original.client?.name || 'Unknown Client';
  const isCompleted = row.original.status === 'completed';

  const cellRef = useRef<HTMLDivElement>(null);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setShowName(entry.contentRect.width > 80);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cellRef}
      className={`flex items-center gap-2 w-full ${
        isCompleted ? 'opacity-40' : ''
      }`}
    >
      <Avatar
        row={{
          original: {
            client: {
              name: client,
              surname: '',
              avatarSrc: '',
            },
          },
        }}
        tooltipText={client}
        rounded="md"
        size="md"
        className="flex-shrink-0"
      />
      {showName && (
        <span className="text-sm font-medium truncate" title={client}>
          {client}
        </span>
      )}
    </div>
  );
}

interface DateCellProps {
  row: Row<TaskType>;
  showFullDates: boolean;
  dateField: 'created_date' | 'active_date' | 'complete_by';
}

function DateCell({ row, showFullDates, dateField }: DateCellProps) {
  const isCompleted = row.original.status === 'completed';
  const date = row.original[dateField];

  const cellRef = useRef<HTMLDivElement>(null);
  const [showFullText, setShowFullText] = useState(true);

  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const screenWidth = window.innerWidth;
      const threshold = screenWidth <= 1940 ? 50 : 40;
      setShowFullText(entry.contentRect.width > threshold);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formattedDate = date
    ? showFullDates
      ? formatMonthDay(date)
      : formatShortDate(date)
    : 'No date';

  return (
    <div
      ref={cellRef}
      className="flex justify-start items-center h-full w-full"
    >
      <span
        className={`text-sm font-medium ${
          showFullText ? 'whitespace-nowrap' : 'truncate'
        } block ${
          formattedDate === 'No date' || formattedDate === 'Invalid date'
            ? 'text-gray-400'
            : ''
        } ${isCompleted ? 'opacity-40' : ''}`}
        title={formattedDate}
      >
        {formattedDate}
      </span>
    </div>
  );
}

interface TableColumnsProps {
  taskTypeFilter: 'none' | 'asc' | 'desc';
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  createdAtFilter: 'none' | 'newest' | 'oldest';
  activeAfterFilter: 'none' | 'newest' | 'oldest';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  setTaskTypeFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setAssignedToFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setClientFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setCreatedAtFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setActiveAfterFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setDueFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setStatusFilter: (filter: 'none' | 'asc' | 'desc') => void;
  handleAcceptTask: (id: string) => void;
  handleDeclineTask: (id: string) => void;
  handleUpdateStatus: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
  handleUpdatePriority: (id: string, flag: 'normal' | 'high' | 'none') => void;
  handleDeleteTask: (id: string) => void;
  handleUpdateTask: (id: string, updates: Partial<TaskType>) => void;
  handleDuplicateTask?: (id: string) => void;
  showFilters: boolean;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  onViewOnMap?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  onNavigateToTask?: (taskId: string) => void;
  patchTaskOptimistic?: (
    taskId: string,
    patchData: PatchTaskRequest
  ) => Promise<void>;
}

export function TableColumns({
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
  tableContainerRef,
  onViewOnMap,
  onViewDetails,
  onNavigateToTask,
  patchTaskOptimistic,
}: TableColumnsProps) {
  const containerWidth = useTableContainerWidth(tableContainerRef);
  const showFullDates = useDateFormatState(tableContainerRef);

  const shouldShowColumns = useMemo(() => {
    return containerWidth >= 875;
  }, [containerWidth]);

  const shouldShowWideStatus = useMemo(() => {
    return containerWidth >= 890;
  }, [containerWidth]);

  const shouldShowFixedTaskType = useMemo(() => {
    return containerWidth <= 1500;
  }, [containerWidth]);

  const shouldShowAllDateColumns = useMemo(() => {
    return containerWidth >= 1500;
  }, [containerWidth]);

  const getNextAlphabeticalFilter = (
    currentState: 'none' | 'asc' | 'desc'
  ): 'none' | 'asc' | 'desc' => {
    if (currentState === 'none') return 'asc';
    if (currentState === 'asc') return 'desc';
    return 'none';
  };

  const getNextDateFilter = (
    currentState: 'none' | 'newest' | 'oldest'
  ): 'none' | 'newest' | 'oldest' => {
    if (currentState === 'none') return 'newest';
    if (currentState === 'newest') return 'oldest';
    return 'none';
  };

  const getNextStatusFilter = (
    currentState: 'none' | 'asc' | 'desc'
  ): 'none' | 'asc' | 'desc' => {
    if (currentState === 'none') return 'asc';
    if (currentState === 'asc') return 'desc';
    return 'none';
  };

  const getSortIcon = useCallback(
    (
      field: string,
      filterState: string,
      filterType: 'alphabetical' | 'date' | 'status'
    ) => {
      if (filterState === 'none') return 'expand_all';
      if (filterType === 'alphabetical' || filterType === 'status') {
        return filterState === 'asc' ? 'expand_less' : 'expand_more';
      }
      if (filterType === 'date') {
        return filterState === 'newest' ? 'expand_less' : 'expand_more';
      }
      return 'expand_all';
    },
    []
  );

  const handleTaskTypeSort = useCallback(() => {
    setAssignedToFilter('none');
    setClientFilter('none');
    setCreatedAtFilter('none');
    setActiveAfterFilter('none');
    setDueFilter('none');
    setStatusFilter('none');
    const newFilter = getNextAlphabeticalFilter(taskTypeFilter);
    setTaskTypeFilter(newFilter);
  }, [
    taskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
    setTaskTypeFilter,
  ]);

  const handleAssignedToSort = useCallback(() => {
    setTaskTypeFilter('none');
    setClientFilter('none');
    setCreatedAtFilter('none');
    setActiveAfterFilter('none');
    setDueFilter('none');
    setStatusFilter('none');
    setAssignedToFilter(getNextAlphabeticalFilter(assignedToFilter));
  }, [
    assignedToFilter,
    setTaskTypeFilter,
    setClientFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
    setAssignedToFilter,
  ]);

  const handleClientSort = useCallback(() => {
    setTaskTypeFilter('none');
    setAssignedToFilter('none');
    setCreatedAtFilter('none');
    setActiveAfterFilter('none');
    setDueFilter('none');
    setStatusFilter('none');
    setClientFilter(getNextAlphabeticalFilter(clientFilter));
  }, [
    clientFilter,
    setTaskTypeFilter,
    setAssignedToFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
    setClientFilter,
  ]);

  const handleDueSort = useCallback(() => {
    setTaskTypeFilter('none');
    setAssignedToFilter('none');
    setClientFilter('none');
    setCreatedAtFilter('none');
    setActiveAfterFilter('none');
    setStatusFilter('none');
    setDueFilter(getNextDateFilter(dueFilter));
  }, [
    dueFilter,
    setTaskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setStatusFilter,
    setDueFilter,
  ]);

  const handleCreatedAtSort = useCallback(() => {
    setTaskTypeFilter('none');
    setAssignedToFilter('none');
    setClientFilter('none');
    setActiveAfterFilter('none');
    setDueFilter('none');
    setStatusFilter('none');
    setCreatedAtFilter(getNextDateFilter(createdAtFilter));
  }, [
    createdAtFilter,
    setTaskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
    setCreatedAtFilter,
  ]);

  const handleActiveAfterSort = useCallback(() => {
    setTaskTypeFilter('none');
    setAssignedToFilter('none');
    setClientFilter('none');
    setCreatedAtFilter('none');
    setDueFilter('none');
    setStatusFilter('none');
    setActiveAfterFilter(getNextDateFilter(activeAfterFilter));
  }, [
    activeAfterFilter,
    setTaskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setCreatedAtFilter,
    setDueFilter,
    setStatusFilter,
    setActiveAfterFilter,
  ]);

  const handleStatusSort = useCallback(() => {
    setTaskTypeFilter('none');
    setAssignedToFilter('none');
    setClientFilter('none');
    setCreatedAtFilter('none');
    setActiveAfterFilter('none');
    setDueFilter('none');
    setStatusFilter(getNextStatusFilter(statusFilter));
  }, [
    statusFilter,
    setTaskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
  ]);

  const assigneeOptions = useMemo(
    () => [
      { value: '', label: 'Select assignee' },
      { value: 'john', label: 'John Doe', initials: 'JD' },
      { value: 'jane', label: 'Jane Smith', initials: 'JS' },
      { value: 'kristin', label: 'Kristin W.', initials: 'KW' },
      { value: 'bill', label: 'Bill Sanders', initials: 'BS' },
      { value: 'olga', label: 'Olga Ivanova', initials: 'OI' },
      { value: 'peter', label: 'Peter Müller', initials: 'PM' },
      { value: 'li', label: 'Li Wei', initials: 'LW' },
      { value: 'lucas', label: 'Lucas Martin', initials: 'LM' },
      { value: 'sofia', label: 'Sofia Rossi', initials: 'SR' },
      { value: 'anna', label: 'Anna Svensson', initials: 'AS' },
    ],
    []
  );

  const columns: ColumnDef<TaskType>[] = useMemo(() => {
    const baseColumns: ColumnDef<TaskType>[] = [
      {
        header: () => null,
        id: 'drag',
        meta: { className: 'w-12 min-w-[24px] max-w-[24px] text-center' },
        cell: ({ row }) => {
          const isPending = row.original.status === 'pending';
          return (
            <div className="flex items-center justify-center h-full">
              {isPending ? (
                <div className="w-2 h-2 bg-basic-red rounded-full"></div>
              ) : (
                <span className="material-symbols-outlined text-basic-white">
                  drag_handle
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: () => (
          <Flag
            variant="normal"
            size="md"
            className="text-left font-normal text-sm text-basic-gray mt-1.5"
            tooltipContent="Flag Status"
            iconColor="basic-gray"
          />
        ),
        accessorKey: 'flag',
        meta: {
          className: 'w-12 min-w-[32px] max-w-[32px] !text-start justify-end',
        },
        cell: ({ row }) => {
          let flag: 'normal' | 'high' | 'none' = 'normal';
          if (
            row.original.priority === 'high' ||
            row.original.priority === 'urgent'
          ) {
            flag = 'high';
          } else if (row.original.priority === 'normal') {
            flag = 'normal';
          } else {
            flag = 'none';
          }

          return (
            <div className="flex items-center justify-center">
              <Flag size="md" variant={flag} />
            </div>
          );
        },
      },
      {
        header: () => (
          <SortableHeader
            title="Client"
            onClick={handleClientSort}
            getSortIcon={(field, filterState, filterType) =>
              getSortIcon('client', clientFilter, 'alphabetical')
            }
          />
        ),
        accessorKey: 'client.name',
        meta: {
          className: 'min-w-[100px] max-w-[200px]',
        },
        cell: ({ row }) => {
          return <ClientCell row={row} isFiltersOpen={false} />;
        },
      },
      {
        header: () => (
          <SortableHeader
            title="Task Type"
            onClick={handleTaskTypeSort}
            getSortIcon={(field, filterState, filterType) =>
              getSortIcon('taskType', taskTypeFilter, 'alphabetical')
            }
          />
        ),
        accessorKey: 'task_type',
        meta: {
          className: shouldShowFixedTaskType
            ? '!w-[160px] !min-w-[160px] !max-w-[160px] '
            : 'w-auto',
        },
        cell: ({ row, table }) => {
          const isCompleted = row.original.status === 'completed';
          // const allRows = table.getRowModel().rows;
          // const rowIndex = allRows.findIndex(
          //   (r) => r.original.id === row.original.id
          // );
          // const currentPage = table.getState().pagination?.pageIndex || 1;
          // const pageSize = table.getState().pagination?.pageSize || 10;
          // const sequentialNumber = (currentPage - 1) * pageSize + rowIndex + 1;

          return (
            <div
              className={`flex items-center gap-2  overflow-hidden  font-medium${
                isCompleted ? 'opacity-40' : ''
              }`}
            >
              {/* <span className="text-basic-gray font-medium flex-shrink-0">
                #{sequentialNumber}
              </span> */}
              <span
                className="block truncate"
                title={formatTaskType(row.original.task_type)}
              >
                {formatTaskType(row.original.task_type)}
              </span>
            </div>
          );
        },
      },
      {
        header: () => (
          <SortableHeader
            title="Assigned To"
            onClick={handleAssignedToSort}
            getSortIcon={(field, filterState, filterType) =>
              getSortIcon('assignedTo', assignedToFilter, 'alphabetical')
            }
          />
        ),
        accessorKey: 'assigned_to_organisation.name',
        meta: {
          className: `text-start min-w-[48px] max-w-[200px]`,
        },
        cell: ({ row }) => {
          return (
            <AssignedToCell
              row={row}
              assigneeOptions={assigneeOptions}
              handleUpdateTask={handleUpdateTask}
              isFiltersOpen={false}
            />
          );
        },
      },
      ...(shouldShowColumns || shouldShowAllDateColumns
        ? [
            {
              header: () => (
                <SortableHeader
                  title="Created At"
                  onClick={handleCreatedAtSort}
                  getSortIcon={(field, filterState, filterType) =>
                    getSortIcon('createdAt', createdAtFilter, 'date')
                  }
                />
              ),
              accessorKey: 'created_date',
              meta: {
                className: shouldShowAllDateColumns
                  ? `w-40 min-w-[120px] max-w-[150px] text-center flex-shrink-0`
                  : showFullDates
                  ? `w-32 min-w-[100px] max-w-[120px] text-center flex-shrink-0`
                  : `w-16 min-w-[60px] max-w-[80px] text-center flex-shrink-0`,
              },
              cell: ({ row }: { row: Row<TaskType> }) => {
                return (
                  <DateCell
                    row={row}
                    showFullDates={showFullDates}
                    dateField="created_date"
                  />
                );
              },
            },
          ]
        : []),
      ...(shouldShowColumns || shouldShowAllDateColumns
        ? [
            {
              header: () => (
                <SortableHeader
                  title="Active After"
                  onClick={handleActiveAfterSort}
                  getSortIcon={(field, filterState, filterType) =>
                    getSortIcon('activeAfter', activeAfterFilter, 'date')
                  }
                />
              ),
              accessorKey: 'active_date',
              meta: {
                className: shouldShowAllDateColumns
                  ? `w-40 min-w-[120px] max-w-[150px] text-center flex-shrink-0`
                  : showFullDates
                  ? `w-32 min-w-[100px] max-w-[120px] text-center flex-shrink-0`
                  : `w-16 min-w-[60px] max-w-[80px] text-center flex-shrink-0`,
              },
              cell: ({ row }: { row: Row<TaskType> }) => {
                return (
                  <DateCell
                    row={row}
                    showFullDates={showFullDates}
                    dateField="active_date"
                  />
                );
              },
            },
          ]
        : []),
      {
        header: () => (
          <SortableHeader
            title="Due"
            onClick={handleDueSort}
            getSortIcon={(field, filterState, filterType) =>
              getSortIcon('due', dueFilter, 'date')
            }
          />
        ),
        accessorKey: 'complete_by',
        meta: {
          className: shouldShowAllDateColumns
            ? `w-40 min-w-[120px] max-w-[150px] text-center flex-shrink-0`
            : showFullDates
            ? `w-32 min-w-[100px] max-w-[120px] text-center flex-shrink-0`
            : `w-16 min-w-[60px] max-w-[80px] text-center flex-shrink-0`,
        },
        cell: ({ row }) => {
          return (
            <DateCell
              row={row}
              showFullDates={showFullDates}
              dateField="complete_by"
            />
          );
        },
      },
      {
        header: () => (
          <StatusHeader
            onClick={handleStatusSort}
            statusFilter={statusFilter}
            getSortIcon={getSortIcon}
          />
        ),
        accessorKey: 'status',
        meta: {
          className: shouldShowWideStatus
            ? 'w-32 min-w-[160px] max-w-[160px]'
            : 'w-20 min-w-[80px] max-w-[80px]',
        },
        cell: ({ row }) => {
          return (
            <StatusCell
              row={row}
              handleDeclineTask={handleDeclineTask}
              handleAcceptTask={handleAcceptTask}
              handleUpdateStatus={handleUpdateStatus}
            />
          );
        },
      },
      {
        header: '',
        accessorKey: 'actions',
        meta: {
          className: 'w-20 min-w-[60px] max-w-[64px] text-center flex-shrink-0',
        },
        cell: ({ row }) => {
          const rowId = row.original.id;
          const status = row.original.status;
          const isAccepted =
            row.original.assigned_to_organisation !== null &&
            row.original.assigned_to_organisation !== undefined;

          return (
            <div
              className="flex items-center justify-center w-full"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.stopPropagation()}
              onMouseLeave={(e) => e.stopPropagation()}
            >
              <span
                className="material-symbols-outlined text-basic-gray cursor-pointer hover:bg-gray-100 rounded p-1 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToTask?.(rowId);
                }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
                title="Go to task"
              >
                chevron_forward
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-basic-white"></div>
              </span>
              <div
                className="hover:bg-gray-100 rounded  transition-colors"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <TaskDropdownActions
                  taskId={rowId}
                  status={status}
                  isAccepted={isAccepted}
                  priority={row.original.priority}
                  task_has_unmatched_samples={false}
                  task_has_tests_without_lab_result={false}
                  task_has_not_started_test={false}
                  onAcceptTask={handleAcceptTask}
                  onDeclineTask={handleDeclineTask}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePriority={handleUpdatePriority}
                  onDeleteTask={handleDeleteTask}
                  onDuplicateTask={handleDuplicateTask}
                  onViewOnMap={onViewOnMap}
                  onViewDetails={onViewDetails}
                  onNavigateToTask={onNavigateToTask}
                  patchTaskOptimistic={patchTaskOptimistic}
                />
              </div>
            </div>
          );
        },
      },
    ];

    return baseColumns;
  }, [
    handleTaskTypeSort,
    handleAssignedToSort,
    handleClientSort,
    handleCreatedAtSort,
    handleActiveAfterSort,
    handleDueSort,
    handleStatusSort,
    getSortIcon,
    assigneeOptions,
    handleUpdateTask,
    handleAcceptTask,
    handleDeclineTask,
    handleUpdateStatus,
    handleUpdatePriority,
    handleDeleteTask,
    handleDuplicateTask,
    onViewOnMap,
    onViewDetails,
    onNavigateToTask,
    patchTaskOptimistic,
    shouldShowColumns,
    shouldShowWideStatus,
    shouldShowFixedTaskType,
    shouldShowAllDateColumns,
    showFullDates,
    statusFilter,
    taskTypeFilter,
    assignedToFilter,
    clientFilter,
    createdAtFilter,
    activeAfterFilter,
    dueFilter,
  ]);

  return {
    columns,
    showColumns: {
      createdAt: shouldShowColumns || shouldShowAllDateColumns,
      activeAfter: shouldShowColumns || shouldShowAllDateColumns,
    },
  };
}
