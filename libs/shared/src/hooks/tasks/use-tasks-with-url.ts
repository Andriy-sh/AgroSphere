'use client';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from 'nuqs';
import { FilterState } from '../../components/filters/filters';
import { useDynamicPageSize } from '../../utils/page-size-calculator';
import { showTaskActionToast, showUndoToast } from '../../utils/toast-utils';
import { debounce } from '../../utils/debounce';
import { useTaskActions } from '../use-task-actions';
import {
  useDeleteTask,
  useUpdateTask,
  useTasks,
} from '../../api/hooks/use-tasks';
import { TaskFilters, TaskType } from '../../api/services/tasks/task-types';
import { toast } from 'react-toastify';

export const useTasksWithUrl = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const taskActions = useTaskActions();
  const { deleteTask } = useDeleteTask();
  const { updateTask } = useUpdateTask();
  const { tasks: apiTasks, total, loading, fetchTasks } = useTasks();

  const [currentPage, setCurrentPage] = useQueryState(
    'tasksPage',
    parseAsInteger.withDefault(1)
  );

  const [searchTerm, setSearchTerm] = useQueryState(
    'tasksSearch',
    parseAsString.withDefault('')
  );

  const [activeTab, setActiveTab] = useQueryState(
    'tasksTab',
    parseAsString.withDefault('table')
  );

  const [showFilters, setShowFilters] = useQueryState(
    'tasksShowFilters',
    parseAsString.withDefault('true')
  );

  const [assignedToFilter, setAssignedToFilter] = useQueryState(
    'tasksAssignedTo',
    parseAsString.withDefault('none')
  );

  const [clientFilter, setClientFilter] = useQueryState(
    'tasksClient',
    parseAsString.withDefault('none')
  );

  const [dueFilter, setDueFilter] = useQueryState(
    'tasksDue',
    parseAsString.withDefault('none')
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'tasksStatus',
    parseAsString.withDefault('none')
  );

  const [taskTypeFilter, setTaskTypeFilter] = useQueryState(
    'tasksTaskType',
    parseAsString.withDefault('none')
  );

  const [periodFilter, setPeriodFilter] = useQueryState(
    'tasksPeriod',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [statusArrayFilter, setStatusArrayFilter] = useQueryState(
    'tasksStatusArray',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [taskTypeArrayFilter, setTaskTypeArrayFilter] = useQueryState(
    'tasksTaskTypeArray',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [clientsArrayFilter, setClientsArrayFilter] = useQueryState(
    'tasksClientsArray',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [typeArrayFilter, setTypeArrayFilter] = useQueryState(
    'tasksTypeArray',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined
  );

  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);

  const { pageSize: dynamicPageSize, isReady } = useDynamicPageSize(
    tableContainerRef,
    {
      estimatedRowHeight: 60,
      headerHeight: 40,
      paginationHeight: 40,
      minPageSize: 1,
    }
  );

  const activeFilters: FilterState = useMemo(
    () => ({
      clients: clientsArrayFilter || [],
      period: periodFilter || [],
      status: statusArrayFilter || [],
      taskType: taskTypeArrayFilter || [],
      type: typeArrayFilter || [],
    }),
    [
      clientsArrayFilter,
      periodFilter,
      statusArrayFilter,
      taskTypeArrayFilter,
      typeArrayFilter,
    ]
  );

  const apiFilters = useMemo(() => {
    if (!isReady || !dynamicPageSize) return null;

    const statusMapping: Record<
      string,
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'not_started'
      | 'rejected'
      | 'collected'
      | 'lab'
    > = {
      'Not started': 'not_started',
      'In progress': 'in_progress',
      Complete: 'complete',
      Cancelled: 'cancelled',
      Pending: 'not_started',
    };

    return {
      search: searchTerm || undefined,
      page: currentPage,
      per_page: dynamicPageSize,
      status:
        statusArrayFilter.length > 0
          ? statusMapping[statusArrayFilter[0]]
          : undefined,
      task_type:
        taskTypeArrayFilter.length > 0 ? taskTypeArrayFilter[0] : undefined,
    };
  }, [
    isReady,
    dynamicPageSize,
    searchTerm,
    currentPage,
    statusArrayFilter,
    taskTypeArrayFilter,
  ]);

  useEffect(() => {
    if (apiFilters) {
      fetchTasks(apiFilters as TaskFilters);
    }
  }, [apiFilters, fetchTasks]);

  const {
    tasks: localTasks,
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

  const tasks = apiTasks.length > 0 ? apiTasks : localTasks;

  const totalPages = useMemo(() => {
    if (total > 0) {
      return Math.ceil(total / (dynamicPageSize || 1));
    }
    return Math.ceil(tasks.length / (dynamicPageSize || 1));
  }, [total, dynamicPageSize, tasks.length]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  const filteredTasks = useMemo(() => {
    if (apiTasks.length > 0) {
      return tasks;
    } else {
      return tasks;
    }
  }, [apiTasks.length, tasks]);

  useEffect(() => {
    if (searchTerm) {
      setLastPageBeforeSearch(currentPage || 1);
      setCurrentPage(1);
    } else {
      setCurrentPage(lastPageBeforeSearch);
    }
  }, [searchTerm, lastPageBeforeSearch, setCurrentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const validPage = Math.max(1, page);
      setCurrentPage(validPage);
    },
    [setCurrentPage]
  );

  const debouncedSearch = useCallback(
    (search: string) => {
      const debouncedFn = debounce((searchValue: string) => {
        setSearchTerm(searchValue);
        setCurrentPage(1);
      }, 300);
      debouncedFn(search);
    },
    [setSearchTerm, setCurrentPage]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setSearchTerm(search);
      debouncedSearch(search);
      setSelectedTaskId(undefined);
    },
    [setSearchTerm, debouncedSearch]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      setCurrentPage(1);
      setSelectedTaskId(undefined);
    },
    [setActiveTab, setCurrentPage]
  );

  const handleFiltersToggle = useCallback(
    (show?: boolean) => {
      const currentValue = showFilters;
      const newValue = show !== undefined ? show : !(currentValue === 'true');

      if (
        (newValue && currentValue !== 'true') ||
        (!newValue && currentValue !== 'false')
      ) {
        setShowFilters(newValue ? 'true' : 'false');
      }
    },
    [setShowFilters, showFilters]
  );

  const handleResetFilters = useCallback(() => {
    setPeriodFilter([]);
    setStatusArrayFilter([]);
    setTaskTypeArrayFilter([]);
    setClientsArrayFilter([]);
    setTypeArrayFilter([]);
    setCurrentPage(1);
    setSearchTerm('');
  }, [
    setPeriodFilter,
    setStatusArrayFilter,
    setTaskTypeArrayFilter,
    setClientsArrayFilter,
    setTypeArrayFilter,
    setCurrentPage,
    setSearchTerm,
  ]);

  const debouncedFiltersChange = useCallback(
    debounce((filters: FilterState) => {
      setPeriodFilter(filters.period || []);
      setStatusArrayFilter(filters.status || []);
      setTaskTypeArrayFilter(filters.taskType || []);
      setClientsArrayFilter(filters.clients || []);
      setTypeArrayFilter(filters.type || []);
      setCurrentPage(1);
      setSelectedTaskId(undefined);
    }, 100),
    [
      setPeriodFilter,
      setStatusArrayFilter,
      setTaskTypeArrayFilter,
      setClientsArrayFilter,
      setTypeArrayFilter,
      setCurrentPage,
    ]
  );

  const handleFiltersChange = useCallback(
    (filters: FilterState) => {
      debouncedFiltersChange(filters);
    },
    [debouncedFiltersChange]
  );

  const handleAcceptTaskWithToast = useCallback(
    async (id: string) => {
      const actionData = handleAcceptTask(id);
      if (actionData) {
        showTaskActionToast('accept', () =>
          handleUndoActionWithData(actionData)
        );
      }

      setSelectedTaskId(undefined);
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

      setSelectedTaskId(undefined);
    },
    [handleDeclineTask, handleUndoActionWithData]
  );

  const handleUndoActionWithToast = useCallback(() => {
    handleUndoAction();
    showUndoToast();
    setSelectedTaskId(undefined);
  }, [handleUndoAction]);

  const handleUpdateStatusWithReset = useCallback(
    async (
      id: string,
      status:
        | 'pending'
        | 'in_progress'
        | 'complete'
        | 'cancelled'
        | 'not_started'
    ) => {
      await updateTask(id, { status });
      setSelectedTaskId(undefined);
      handleUpdateStatus(id, status);
    },
    [updateTask, setSelectedTaskId, handleUpdateStatus]
  );

  const handleUpdatePriorityWithReset = useCallback(
    async (id: string, priority: 'normal' | 'high' | 'none') => {
      await updateTask(id, { priority });
      setSelectedTaskId(undefined);
      handleUpdatePriority(id, priority);
    },
    [updateTask, setSelectedTaskId, handleUpdatePriority]
  );

  const handleDeleteTaskWithReset = useCallback(
    async (id: string) => {
      setSelectedTaskId(undefined);
      await deleteTask(id);
      handleDeleteTask(id);
    },
    [deleteTask, setSelectedTaskId, handleDeleteTask]
  );

  const handleUpdateTaskWithReset = useCallback(
    (id: string, updates: Partial<TaskType>) => {
      handleUpdateTask(id, updates);
      setSelectedTaskId(undefined);
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
    setSelectedTaskId(taskId);
  }, []);

  return {
    currentPage: currentPage || 1,
    searchTerm: searchTerm || '',
    activeTab: activeTab || 'table',
    showFilters: showFilters === 'true',
    activeFilters,
    assignedToFilter: (assignedToFilter as 'none' | 'asc' | 'desc') || 'none',
    clientFilter: (clientFilter as 'none' | 'asc' | 'desc') || 'none',
    dueFilter: (dueFilter as 'none' | 'newest' | 'oldest') || 'none',
    statusFilter: (statusFilter as 'none' | 'asc' | 'desc') || 'none',
    taskTypeFilter: (taskTypeFilter as 'none' | 'asc' | 'desc') || 'none',
    selectedTaskId,
    tasks: filteredTasks,
    dynamicPageSize,
    totalPages,
    loading,
    isReady,
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
    setInitialTasks,
  };
};
