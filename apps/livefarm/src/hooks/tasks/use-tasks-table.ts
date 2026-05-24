'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTasks, useDynamicPageSize } from '@@agrosphere/shared';
import { FilterState } from '@@agrosphere/shared';
import { TaskFilters } from '@@agrosphere/shared';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseTableTasksProps {
  filters: FilterState;
  searchTerm: string;
  currentPage: number;
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  createdAtFilter: 'none' | 'newest' | 'oldest';
  activeAfterFilter: 'none' | 'newest' | 'oldest';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  taskTypeFilter: 'none' | 'asc' | 'desc';
  isActive: boolean;
  onPageReset?: () => void;
}

export function useTableTasks({
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
  isActive,
  onPageReset,
}: UseTableTasksProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const lastApiFiltersRef = useRef<string>('');
  const isInitialLoadRef = useRef<boolean>(true);

  const {
    fetchTasks,
    tasks,
    loading,
    error,
    total,
    deleteTaskOptimistic,
    patchTaskOptimistic,
  } = useTasks();

  const { pageSize: dynamicPageSize, isReady } = useDynamicPageSize(
    tableContainerRef,
    {
      estimatedRowHeight: 60,
      headerHeight: 40,
      paginationHeight: 40,
      minPageSize: 1,
    }
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedPageSize = useDebounce(dynamicPageSize, 500);

  const apiFilters = useMemo((): TaskFilters => {
    const apiFilters: TaskFilters = {
      page: currentPage,
    };

    if (debouncedPageSize) {
      apiFilters.per_page = debouncedPageSize;
    }

    if (debouncedSearchTerm) {
      apiFilters.search = debouncedSearchTerm;
    }

    // Add filter mappings
    if (filters.clients.length > 0) {
      apiFilters.farmer_hashid = filters.clients[0];
    }

    if (filters.status.length > 0) {
      const statusMapping: Record<
        string,
        | 'not_started'
        | 'in_progress'
        | 'completed'
        | 'cancelled'
        | 'collected'
        | 'lab'
        | 'rejected'
        | null
      > = {
        'Not started': 'not_started',
        'In progress': 'in_progress',
        Complete: 'completed',
        Cancelled: 'cancelled',
        Pending: 'not_started',
        Declined: 'rejected',
        Inbox: 'not_started',
        All: null,
      };

      const mappedStatus = statusMapping[filters.status[0]];
      if (mappedStatus !== null && mappedStatus !== undefined) {
        apiFilters.status = mappedStatus;
      }
    }

    if (filters.taskType.length > 0) {
      apiFilters.task_type = filters.taskType[0];
    }

    if (assignedToFilter !== 'none') {
      apiFilters.sort = 'assigned_to';
      apiFilters.sortingOrder = assignedToFilter;
    }

    if (clientFilter !== 'none') {
      apiFilters.sort = 'client';
      apiFilters.sortingOrder = clientFilter;
    }

    if (createdAtFilter !== 'none') {
      apiFilters.sort = 'created_at';
      apiFilters.sortingOrder = createdAtFilter === 'newest' ? 'desc' : 'asc';
    }

    if (activeAfterFilter !== 'none') {
      apiFilters.sort = 'active_after';
      apiFilters.sortingOrder = activeAfterFilter === 'newest' ? 'desc' : 'asc';
    }

    if (dueFilter !== 'none') {
      apiFilters.sort = 'due_date';
      apiFilters.sortingOrder = dueFilter === 'newest' ? 'desc' : 'asc';
    }

    if (statusFilter !== 'none') {
      apiFilters.sort = 'status';
      apiFilters.sortingOrder = statusFilter;
    }

    if (taskTypeFilter !== 'none') {
      apiFilters.sort = 'task_type';
      apiFilters.sortingOrder = taskTypeFilter;
    }

    return apiFilters;
  }, [
    currentPage,
    debouncedPageSize,
    debouncedSearchTerm,
    filters,
    assignedToFilter,
    clientFilter,
    createdAtFilter,
    activeAfterFilter,
    dueFilter,
    statusFilter,
    taskTypeFilter,
  ]);

  const loadTasks = useCallback(async () => {
    if (!isActive || !isReady || !debouncedPageSize) {
      return;
    }

    const currentFiltersString = JSON.stringify(apiFilters);

    if (lastApiFiltersRef.current === currentFiltersString) {
      return;
    }

    if (lastApiFiltersRef.current) {
      const lastFilters = JSON.parse(lastApiFiltersRef.current);
      const currentFilters = apiFilters;

      if (
        lastFilters.page === currentFilters.page &&
        lastFilters.search === currentFilters.search &&
        lastFilters.farmer_hashid === currentFilters.farmer_hashid &&
        lastFilters.status === currentFilters.status &&
        lastFilters.task_type === currentFilters.task_type &&
        lastFilters.sort === currentFilters.sort &&
        lastFilters.sortingOrder === currentFilters.sortingOrder &&
        Math.abs(
          (lastFilters.per_page || 0) - (currentFilters.per_page || 0)
        ) <= 2
      ) {
        return;
      }
    }

    lastApiFiltersRef.current = currentFiltersString;

    try {
      await fetchTasks(apiFilters);
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
    } catch {
      return;
    }
  }, [fetchTasks, apiFilters, isReady, isActive, debouncedPageSize]);

  useEffect(() => {
    if (isActive && isReady && debouncedPageSize) {
      loadTasks();
    }
  }, [loadTasks, isActive, isReady, debouncedPageSize]);

  useEffect(() => {
    if (total > 0 && debouncedPageSize && currentPage > 1) {
      const totalPages = Math.ceil(total / debouncedPageSize);
      if (currentPage > totalPages) {
        onPageReset?.();
      }
    }
  }, [total, debouncedPageSize, currentPage, onPageReset]);

  useEffect(() => {
    if (
      total > 0 &&
      debouncedPageSize &&
      tasks.length === 0 &&
      currentPage > 1
    ) {
      onPageReset?.();
    }
  }, [total, debouncedPageSize, tasks.length, currentPage, onPageReset]);

  const showSkeleton = loading && isInitialLoadRef.current;

  const showNoResults =
    !loading && tasks.length === 0 && !isInitialLoadRef.current;

  return {
    tasks,
    total,
    loading,
    error,
    dynamicPageSize,
    tableContainerRef,
    deleteTaskOptimistic,
    patchTaskOptimistic,
    showSkeleton,
    showNoResults,
  };
}
