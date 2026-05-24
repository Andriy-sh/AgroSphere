'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { FilterState } from '@@agrosphere/shared';
import { useDynamicPageSize } from '@@agrosphere/shared';
import { showTaskActionToast, showUndoToast } from '@@agrosphere/shared';
import { debounce } from '@@agrosphere/shared';
import { useTaskFilters } from '@@agrosphere/shared';
import { useTaskActions } from '@@agrosphere/shared';
import { mockTasks } from '@@agrosphere/shared';
import { toast } from 'react-toastify';
import { useTasksUrlParams } from '@/utils/tasks/url-params';

export const useTasksSimple = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const taskActions = useTaskActions();
  const { currentParams, updateUrlParams } = useTasksUrlParams();

  const currentPage = currentParams.page || 1;
  const searchTerm = currentParams.search || '';
  const activeTab = currentParams.tab || 'table';
  const showFilters = currentParams.showFilters || false;
  const selectedTaskId = useState<string | undefined>(undefined)[0];

  const activeFilters: FilterState = useMemo(
    () => ({
      clients: currentParams.clientsArray || [],
      period: currentParams.period || [],
      status: currentParams.statusArray || [],
      taskType: currentParams.taskTypeArray || [],
      type: currentParams.typeArray || [],
    }),
    [currentParams]
  );

  const assignedToFilter =
    (currentParams.assignedTo as 'none' | 'asc' | 'desc') || 'none';
  const clientFilter =
    (currentParams.client as 'none' | 'asc' | 'desc') || 'none';
  const dueFilter =
    (currentParams.due as 'none' | 'newest' | 'oldest') || 'none';
  const statusFilter =
    (currentParams.status as 'none' | 'asc' | 'desc') || 'none';
  const taskTypeFilter =
    (currentParams.taskType as 'none' | 'asc' | 'desc') || 'none';

  const dynamicPageSize = useDynamicPageSize(tableContainerRef, {
    estimatedRowHeight: 60,
    headerHeight: 40,
    paginationHeight: 40,
    minPageSize: 1,
  });

  const {
    tasks,
    handleAcceptTask,
    handleDeclineTask,
    handleUndoAction,
    handleUndoActionWithData,
    handleUpdateStatus,
    handleUpdatePriority,
    handleDeleteTask,
    handleUpdateTask,
    handleDuplicateTask,
    setInitialTasks,
  } = taskActions;

  const filteredTasks = useTaskFilters(
    tasks,
    searchTerm || '',
    activeFilters || {
      clients: [],
      period: [],
      status: [],
      taskType: [],
      type: [],
    }
  );

  useEffect(() => {
    if (mockTasks && Array.isArray(mockTasks)) {
      setInitialTasks(mockTasks as any);
    }
  }, [setInitialTasks]);

  const handlePageChange = useCallback(
    (page: number) => {
      const validPage = Math.max(1, page);
      updateUrlParams({ page: validPage });
    },
    [updateUrlParams]
  );

  const debouncedSearch = useCallback(
    (search: string) => {
      const debouncedFn = debounce((searchTerm: string) => {
        updateUrlParams({ search: searchTerm, page: 1 });
      }, 300);
      debouncedFn(search);
    },
    [updateUrlParams]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      updateUrlParams({ search, page: 1 });
      debouncedSearch(search);
    },
    [updateUrlParams, debouncedSearch]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      updateUrlParams({ tab, page: 1 });
    },
    [updateUrlParams]
  );

  const handleFiltersToggle = useCallback(
    (show?: boolean) => {
      const newValue = show !== undefined ? show : !showFilters;
      updateUrlParams({ showFilters: newValue });
    },
    [updateUrlParams, showFilters]
  );

  const handleResetFilters = useCallback(() => {
    updateUrlParams({
      period: [],
      statusArray: [],
      taskTypeArray: [],
      clientsArray: [],
      typeArray: [],
      page: 1,
      search: '',
    });
  }, [updateUrlParams]);

  const handleFiltersChange = useCallback(
    (filters: FilterState) => {
      updateUrlParams({
        period: filters.period || [],
        statusArray: filters.status || [],
        taskTypeArray: filters.taskType || [],
        clientsArray: filters.clients || [],
        typeArray: filters.type || [],
        page: 1,
      });
    },
    [updateUrlParams]
  );

  const handleAcceptTaskWithToast = useCallback(
    (id: string) => {
      const actionData = handleAcceptTask(id);
      if (actionData) {
        showTaskActionToast('accept', () =>
          handleUndoActionWithData(actionData)
        );
      }
    },
    [handleAcceptTask, handleUndoActionWithData]
  );

  const handleDeclineTaskWithToast = useCallback(
    (id: string) => {
      const actionData = handleDeclineTask(id);
      if (actionData) {
        showTaskActionToast('decline', () =>
          handleUndoActionWithData(actionData)
        );
      }
    },
    [handleDeclineTask, handleUndoActionWithData]
  );

  const handleUndoActionWithToast = useCallback(() => {
    handleUndoAction();
    showUndoToast();
  }, [handleUndoAction]);

  const handleUpdateStatusWithReset = useCallback(
    (
      id: string,
      status:
        | 'pending'
        | 'in_progress'
        | 'complete'
        | 'cancelled'
        | 'Not Started'
        | 'not_started'
    ) => {
      handleUpdateStatus(id, status);
    },
    [handleUpdateStatus]
  );

  const handleUpdatePriorityWithReset = useCallback(
    (id: string, flag: 'normal' | 'high' | 'none') => {
      handleUpdatePriority(id, flag);
    },
    [handleUpdatePriority]
  );

  const handleDeleteTaskWithReset = useCallback(
    (id: string) => {
      handleDeleteTask(id);
    },
    [handleDeleteTask]
  );

  const handleUpdateTaskWithReset = useCallback(
    (id: string, updates: Record<string, unknown>) => {
      handleUpdateTask(id, updates);
    },
    [handleUpdateTask]
  );

  const handleDuplicateTaskWithToast = useCallback(
    (id: string) => {
      const duplicatedTask = handleDuplicateTask(id);
      if (duplicatedTask) {
        toast.success(
          `Task "${duplicatedTask.task_number}" has been duplicated successfully!`
        );
      }
    },
    [handleDuplicateTask]
  );

  const handleSelectTask = useCallback((taskId: string) => {
    return;
  }, []);

  const setAssignedToFilter = useCallback(
    (value: 'none' | 'asc' | 'desc') => {
      updateUrlParams({ assignedTo: value });
    },
    [updateUrlParams]
  );

  const setClientFilter = useCallback(
    (value: 'none' | 'asc' | 'desc') => {
      updateUrlParams({ client: value });
    },
    [updateUrlParams]
  );

  const setDueFilter = useCallback(
    (value: 'none' | 'newest' | 'oldest') => {
      updateUrlParams({ due: value });
    },
    [updateUrlParams]
  );

  const setStatusFilter = useCallback(
    (value: 'none' | 'asc' | 'desc') => {
      updateUrlParams({ status: value });
    },
    [updateUrlParams]
  );

  const setTaskTypeFilter = useCallback(
    (value: 'none' | 'asc' | 'desc') => {
      updateUrlParams({ taskType: value });
    },
    [updateUrlParams]
  );

  return {
    currentPage,
    searchTerm,
    activeTab,
    showFilters,
    activeFilters,
    assignedToFilter,
    clientFilter,
    dueFilter,
    statusFilter,
    taskTypeFilter,
    selectedTaskId,
    tasks: filteredTasks,
    dynamicPageSize,
    tableContainerRef,

    setAssignedToFilter,
    setClientFilter,
    setDueFilter,
    setStatusFilter,
    setTaskTypeFilter,

    handlePageChange,
    handleSearchChange,
    handleTabChange,
    handleFiltersToggle,
    handleResetFilters,
    handleFiltersChange,
    handleAcceptTaskWithToast,
    handleDeclineTaskWithToast,
    handleUndoActionWithToast,
    handleUpdateStatusWithReset,
    handleUpdatePriorityWithReset,
    handleDeleteTaskWithReset,
    handleUpdateTaskWithReset,
    handleDuplicateTaskWithToast,
    handleSelectTask,
  };
};
