'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '../../components/filters/filters';

export interface TasksURLState {
  currentPage: number;
  searchTerm: string;
  activeTab: string;
  showFilters: boolean;
  activeFilters: FilterState;
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  taskTypeFilter: 'none' | 'asc' | 'desc';
}

export function useTasksURLSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getInitialState = useCallback((): TasksURLState => {
    if (!searchParams) {
      return {
        currentPage: 1,
        searchTerm: '',
        activeTab: 'table',
        showFilters: true,
        activeFilters: {
          clients: [],
          period: [],
          status: [],
          taskType: [],
          type: [],
        },
        assignedToFilter: 'none',
        clientFilter: 'none',
        dueFilter: 'none',
        statusFilter: 'none',
        taskTypeFilter: 'none',
      };
    }

    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    const searchTerm =
      searchParams.get('q') || searchParams.get('search') || '';

    const activeTab = searchParams.get('tab') || 'table';
    const showFilters = searchParams.get('filters') !== 'false';

    const period =
      searchParams.getAll('period').length > 0
        ? searchParams.getAll('period').filter(Boolean)
        : searchParams.get('period')?.split(',').filter(Boolean) || [];

    const status =
      searchParams.getAll('status').length > 0
        ? searchParams.getAll('status').filter(Boolean)
        : searchParams.get('status')?.split(',').filter(Boolean) || [];

    const taskType =
      searchParams.getAll('taskType').length > 0
        ? searchParams.getAll('taskType').filter(Boolean)
        : searchParams.get('taskType')?.split(',').filter(Boolean) || [];

    const activeFilters: FilterState = {
      clients: [],
      period,
      status,
      taskType,
      type: [],
    };

    const assignedToFilter =
      (searchParams.get('sort_assigned') as 'none' | 'asc' | 'desc') ||
      (searchParams.get('assignedTo') as 'none' | 'asc' | 'desc') ||
      'none';

    const clientFilter =
      (searchParams.get('sort_client') as 'none' | 'asc' | 'desc') ||
      (searchParams.get('client') as 'none' | 'asc' | 'desc') ||
      'none';

    const dueFilter =
      (searchParams.get('sort_due') as 'none' | 'newest' | 'oldest') ||
      (searchParams.get('due') as 'none' | 'newest' | 'oldest') ||
      'none';

    const statusFilter =
      (searchParams.get('sort_status') as 'none' | 'asc' | 'desc') ||
      (searchParams.get('statusFilter') as 'none' | 'asc' | 'desc') ||
      'none';

    const taskTypeFilter =
      (searchParams.get('sort_type') as 'none' | 'asc' | 'desc') ||
      (searchParams.get('taskTypeFilter') as 'none' | 'asc' | 'desc') ||
      'none';

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
    };
  }, [searchParams]);

  const updateURL = useCallback(
    (state: Partial<TasksURLState>) => {
      const params = new URLSearchParams();

      if (state.currentPage && state.currentPage > 1) {
        params.set('page', state.currentPage.toString());
      }

      if (state.activeTab && state.activeTab !== 'table') {
        params.set('tab', state.activeTab);
      }

      if (state.searchTerm) {
        params.set('q', state.searchTerm);
      }

      if (state.showFilters === false) {
        params.set('filters', 'false');
      }

      if (
        state.activeFilters?.period &&
        state.activeFilters.period.length > 0
      ) {
        const sortedPeriods = [...state.activeFilters.period].sort();
        sortedPeriods.forEach((value) => params.append('period', value));
      }

      if (
        state.activeFilters?.status &&
        state.activeFilters.status.length > 0
      ) {
        const sortedStatuses = [...state.activeFilters.status].sort();
        sortedStatuses.forEach((value) => params.append('status', value));
      }

      if (
        state.activeFilters?.taskType &&
        state.activeFilters.taskType.length > 0
      ) {
        const sortedTaskTypes = [...state.activeFilters.taskType].sort();
        sortedTaskTypes.forEach((value) => params.append('taskType', value));
      }

      if (state.assignedToFilter && state.assignedToFilter !== 'none') {
        params.set('sort_assigned', state.assignedToFilter);
      }

      if (state.clientFilter && state.clientFilter !== 'none') {
        params.set('sort_client', state.clientFilter);
      }

      if (state.dueFilter && state.dueFilter !== 'none') {
        params.set('sort_due', state.dueFilter);
      }

      if (state.statusFilter && state.statusFilter !== 'none') {
        params.set('sort_status', state.statusFilter);
      }

      if (state.taskTypeFilter && state.taskTypeFilter !== 'none') {
        params.set('sort_type', state.taskTypeFilter);
      }

      let urlString = params.toString();
      urlString = urlString.replace(/\+/g, '%20');

      if (urlString) {
        const paramPairs = urlString.split('&').map((pair) => {
          const [key, value] = pair.split('=');
          return { key, value: value || '' };
        });

        paramPairs.sort((a, b) => {
          if (a.key !== b.key) {
            return a.key.localeCompare(b.key);
          }
          return a.value.localeCompare(b.value);
        });

        urlString = paramPairs
          .map((pair) => `${pair.key}=${pair.value}`)
          .join('&');
      }

      const newURL = `${window.location.pathname}${
        urlString ? '?' + urlString : ''
      }`;

      if (newURL !== window.location.pathname + window.location.search) {
        router.replace(newURL, { scroll: false });
      }
    },
    [router]
  );

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  return {
    getInitialState,
    updateURL,
    isInitialLoad,
  };
}
