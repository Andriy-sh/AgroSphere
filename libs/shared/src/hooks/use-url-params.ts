'use client';
import { useMemo } from 'react';
import { FilterState } from '../components/filters/filters';

export interface URLParamsState {
  currentPage: number;
  searchTerm: string;
  showFilters: boolean;
  activeFilters: FilterState;
  activeTab: string;
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  taskTypeFilter: 'none' | 'asc' | 'desc';
}

export function useURLParams(searchParams: URLSearchParams): URLParamsState {
  return useMemo(() => {
    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    const searchTerm =
      searchParams.get('q') || searchParams.get('search') || '';

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
      searchParams.getAll('type').length > 0
        ? searchParams.getAll('type').filter(Boolean)
        : searchParams.getAll('taskType').length > 0
        ? searchParams.getAll('taskType').filter(Boolean)
        : searchParams.get('taskType')?.split(',').filter(Boolean) || [];

    const clients =
      searchParams.getAll('clients').length > 0
        ? searchParams.getAll('clients').filter(Boolean)
        : searchParams.get('clients')?.split(',').filter(Boolean) || [];

    const type =
      searchParams.getAll('type').length > 0
        ? searchParams.getAll('type').filter(Boolean)
        : searchParams.get('type')?.split(',').filter(Boolean) || [];

    const activeFilters: FilterState = {
      period,
      status,
      taskType,
      clients,
      type,
    };

    const activeTab = searchParams.get('tab') || 'table';

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
      showFilters,
      activeFilters,
      activeTab,
      assignedToFilter,
      clientFilter,
      dueFilter,
      statusFilter,
      taskTypeFilter,
    };
  }, [searchParams]);
}
