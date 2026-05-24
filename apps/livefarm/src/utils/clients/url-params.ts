'use client';
import { useState, useEffect } from 'react';

export function useDebouncedSearch(initialValue: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(initialValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [initialValue, delay]);

  return debouncedValue;
}

export function useClientsParams() {
  const [params, setParams] = useState({
    search: '',
    page: 1,
    type: '',
    tasks: '',
    assignee: '',
    tags: [] as string[],
    showFilters: false,
    sortField: '',
    sortDirection: '',
    showAddDialog: false,
  });

  const updateParams = (updates: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  const clearAllFilters = () => {
    setParams({
      search: '',
      page: 1,
      type: '',
      tasks: '',
      assignee: '',
      tags: [],
      showFilters: false,
      sortField: '',
      sortDirection: '',
      showAddDialog: false,
    });
  };

  return { currentParams: params, updateParams, clearAllFilters };
}
