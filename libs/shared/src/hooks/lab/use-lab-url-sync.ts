'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '../../components/filters/filters';

export interface LabURLState {
  currentPage: number;
  searchTerm: string;
  showFilters: boolean;
  activeFilters: FilterState;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | 'none';
}

export function useLabURLSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getInitialState = useCallback((): LabURLState => {
    if (!searchParams) {
      return {
        currentPage: 1,
        searchTerm: '',
        showFilters: true,
        activeFilters: {
          clients: [],
          period: [],
          status: [],
          taskType: [],
          type: [],
        },
        sortField: null,
        sortDirection: 'none',
      };
    }

    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

    const searchTerm =
      searchParams.get('q') || searchParams.get('search') || '';

    const showFilters = searchParams.get('filters') !== 'false';

    const clients =
      searchParams.getAll('clients').length > 0
        ? searchParams.getAll('clients').filter(Boolean)
        : searchParams.get('clients')?.split(',').filter(Boolean) || [];

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

    const type =
      searchParams.getAll('type').length > 0
        ? searchParams.getAll('type').filter(Boolean)
        : searchParams.get('type')?.split(',').filter(Boolean) || [];

    const activeFilters: FilterState = {
      clients,
      period,
      status,
      taskType,
      type,
    };

    const sortField = searchParams.get('sort') || null;
    const sortDirection =
      (searchParams.get('direction') as 'asc' | 'desc' | 'none') || 'none';

    return {
      currentPage,
      searchTerm,
      showFilters,
      activeFilters,
      sortField,
      sortDirection,
    };
  }, [searchParams]);

  const updateURL = useCallback(
    (state: Partial<LabURLState>) => {
      const params = new URLSearchParams();

      if (state.currentPage && state.currentPage > 1) {
        params.set('page', state.currentPage.toString());
      }

      if (state.searchTerm) {
        params.set('q', state.searchTerm);
      }

      if (state.showFilters === false) {
        params.set('filters', 'false');
      }

      if (
        state.activeFilters?.clients &&
        state.activeFilters.clients.length > 0
      ) {
        const sortedClients = [...state.activeFilters.clients].sort();
        sortedClients.forEach((value) => params.append('clients', value));
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

      if (state.activeFilters?.type && state.activeFilters.type.length > 0) {
        const sortedTypes = [...state.activeFilters.type].sort();
        sortedTypes.forEach((value) => params.append('type', value));
      }

      if (
        state.sortField &&
        state.sortDirection &&
        state.sortDirection !== 'none'
      ) {
        params.set('sort', state.sortField);
        params.set('direction', state.sortDirection);
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
