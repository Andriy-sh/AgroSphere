'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useClients } from '@@agrosphere/shared';

export interface ClientFilters {
  assignee?: string;
  tags?: string[];
}

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

interface UseTableClientsSimpleProps {
  filters: ClientFilters;
  searchTerm: string;
  currentPage: number;
  isActive?: boolean;
  onPageReset?: () => void;
  dynamicPageSize?: number;
}

export function useTableClientsSimple({
  filters,
  searchTerm,
  currentPage,
  isActive = true,
  onPageReset,
  dynamicPageSize,
}: UseTableClientsSimpleProps) {
  const { clients, meta, loading, error, getClients } = useClients();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedPageSize = useDebounce(dynamicPageSize, 300);

  const apiFilters = useMemo(() => {
    const apiFilters: Record<string, string | number> = {
      page: currentPage,
    };

    if (debouncedPageSize) {
      apiFilters.per_page = debouncedPageSize;
    }

    if (debouncedSearchTerm) {
      apiFilters.search = debouncedSearchTerm;
    }

    if (filters.assignee) {
      apiFilters.lead_consultant = filters.assignee;
    }

    return apiFilters;
  }, [currentPage, debouncedPageSize, debouncedSearchTerm, filters.assignee]);

  const loadClients = useCallback(async () => {
    if (!isActive || !debouncedPageSize) {
      return;
    }

    try {
      await getClients(apiFilters);
    } catch {
      return;
    }
  }, [getClients, apiFilters, isActive, debouncedPageSize]);

  useEffect(() => {
    loadClients();
  }, [loadClients, isActive, debouncedPageSize]);

  useEffect(() => {
    if (meta?.total && debouncedPageSize && currentPage > 1) {
      const totalPages = Math.ceil(meta.total / debouncedPageSize);
      if (currentPage > totalPages) {
        onPageReset?.();
      }
    }
  }, [meta?.total, debouncedPageSize, currentPage, onPageReset]);

  const refreshClients = useCallback(async () => {
    await loadClients();
  }, [loadClients]);

  return {
    clients,
    total: meta?.total || 0,
    loading,
    error,
    refreshClients,
  };
}
