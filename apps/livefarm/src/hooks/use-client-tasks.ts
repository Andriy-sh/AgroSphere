'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useDynamicPageSize } from '@@agrosphere/shared';
import { ClientTask } from '@/mock/client-tasks';

export function useClientTasks(initialTasks: ClientTask[]) {
  const [tasks, setTasks] = useState<ClientTask[]>(initialTasks);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    'type' | 'assignedTo' | 'client' | 'startAfter' | 'due' | 'status'
  >('status');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [periodFilter, setPeriodFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('');

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const dynamicPageSize = useDynamicPageSize(tableContainerRef, {
    estimatedRowHeight: 60,
    headerHeight: 40,
    paginationHeight: 40,
    minPageSize: 1,
  });

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignedTo.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (taskTypeFilter) {
      filtered = filtered.filter((task) => task.type === taskTypeFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    if (assignedToFilter) {
      filtered = filtered.filter(
        (task) => task.assignedTo.name === assignedToFilter
      );
    }

    if (periodFilter) {
      const now = new Date();

      switch (periodFilter) {
        case 'today': {
          filtered = filtered.filter((task) => {
            const taskStartDate = new Date(task.startAfter);
            return taskStartDate.toDateString() === now.toDateString();
          });
          break;
        }
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((task) => {
            const taskStartDate = new Date(task.startAfter);
            return taskStartDate >= weekAgo;
          });
          break;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((task) => {
            const taskStartDate = new Date(task.startAfter);
            return taskStartDate >= monthAgo;
          });
          break;
        }
        case 'quarter': {
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((task) => {
            const taskStartDate = new Date(task.startAfter);
            return taskStartDate >= quarterAgo;
          });
          break;
        }
      }
    }

    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'assignedTo':
          aValue = a.assignedTo.name;
          bValue = b.assignedTo.name;
          break;
        case 'client':
          aValue = a.client;
          bValue = b.client;
          break;
        case 'startAfter':
          aValue = new Date(a.startAfter).getTime();
          bValue = new Date(b.startAfter).getTime();
          break;
        case 'due':
          aValue = new Date(a.due).getTime();
          bValue = new Date(b.due).getTime();
          break;
        case 'status': {
          const statusOrder = {
            pending: 0,
            not_started: 1,
            in_progress: 2,
            completed: 3,
          };
          aValue = statusOrder[a.status] || 4;
          bValue = statusOrder[b.status] || 4;
          break;
        }
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    filtered = [...filtered].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });

    return filtered;
  }, [
    tasks,
    searchTerm,
    sortBy,
    sortOrder,
    statusFilter,
    taskTypeFilter,
    priorityFilter,
    assignedToFilter,
    periodFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / (dynamicPageSize.pageSize || 10))
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedTasks = useMemo(() => {
    const pageSize = dynamicPageSize.pageSize || 10;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, safeCurrentPage, dynamicPageSize]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (column: typeof sortBy) => {
      if (sortBy === column) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortOrder('asc');
      }
    },
    [sortBy]
  );

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPeriodFilter('');
    setStatusFilter('');
    setTaskTypeFilter('');
    setPriorityFilter('');
    setAssignedToFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handleAddTask = useCallback(
    (newTask: Omit<ClientTask, 'id'>) => {
      const id = `#${
        Math.max(...tasks.map((t) => parseInt(t.id.replace('#', '')))) + 1
      }`;
      setTasks((prev) => [...prev, { ...newTask, id }]);
    },
    [tasks]
  );

  const handleUpdateTask = useCallback(
    (id: string, updates: Partial<ClientTask>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
    },
    []
  );

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleDuplicateTask = useCallback(
    (id: string) => {
      const taskToDuplicate = tasks.find((task) => task.id === id);
      if (taskToDuplicate) {
        const newId = `#${
          Math.max(...tasks.map((t) => parseInt(t.id.replace('#', '')))) + 1
        }`;
        const duplicatedTask: ClientTask = {
          ...taskToDuplicate,
          id: newId,
          type: `${taskToDuplicate.type} (Copy)`,
        };
        setTasks((prev) => [...prev, duplicatedTask]);
      }
    },
    [tasks]
  );

  return {
    tasks: pagedTasks,
    allTasks: tasks,
    filteredTasks,

    currentPage: safeCurrentPage,
    totalPages,
    pageSize: dynamicPageSize.pageSize || 10,

    searchTerm,
    showFilters,
    sortBy,
    sortOrder,

    periodFilter,
    statusFilter,
    taskTypeFilter,
    priorityFilter,
    assignedToFilter,

    tableContainerRef,

    handlePageChange,
    handleSearchChange,
    handleSort,
    handleToggleFilters,
    handleClearFilters,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDuplicateTask,

    setPeriodFilter,
    setStatusFilter,
    setTaskTypeFilter,
    setPriorityFilter,
    setAssignedToFilter,

    totalTasks: tasks.length,
    filteredTasksCount: filteredTasks.length,
  };
}
