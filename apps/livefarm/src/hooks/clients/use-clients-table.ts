'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useClients, Client } from '@@agrosphere/shared';
import { useDynamicPageSize } from '@@agrosphere/shared';
import { useDebounce } from '@@agrosphere/shared';

export interface ClientFilters {
  assignee?: string;
  tags?: string[];
}

interface UseTableClientsProps {
  filters: ClientFilters;
  searchTerm: string;
  currentPage: number;
  isActive?: boolean;
  onPageReset?: () => void;
}

export function useTableClients({
  filters,
  searchTerm,
  currentPage,
  isActive = true,
  onPageReset,
}: UseTableClientsProps): {
  clients: Client[];
  total: number;
  loading: boolean;
  error: string | null;
  showSkeleton: boolean;
  showNoResults: boolean;
  dynamicPageSize: number | null;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  refreshClients: () => Promise<void>;
} {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  const { clients, meta, loading, error, getClients } = useClients();

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

  const apiFilters = useMemo(() => {
    if (!isReady || !dynamicPageSize) return null;

    const apiFilters: Record<string, string | number | string[]> = {
      page: currentPage,
      per_page: dynamicPageSize,
    };

    if (debouncedSearchTerm) {
      apiFilters.search = debouncedSearchTerm;
    }

    if (filters.assignee) {
      apiFilters.lead_consultant = filters.assignee;
    }

    if (filters.tags && filters.tags.length > 0) {
      apiFilters.tags = filters.tags;
    }

    return apiFilters;
  }, [
    isReady,
    dynamicPageSize,
    currentPage,
    debouncedSearchTerm,
    filters.assignee,
    filters.tags,
  ]);

  useEffect(() => {
    if (apiFilters && isActive) {
      getClients(apiFilters);
      isInitialLoadRef.current = false;
    }
  }, [apiFilters, getClients, isActive]);

  useEffect(() => {
    if (meta?.total && dynamicPageSize && currentPage > 1) {
      const totalPages = Math.ceil(meta.total / dynamicPageSize);
      if (currentPage > totalPages) {
        onPageReset?.();
      }
    }
  }, [meta?.total, dynamicPageSize, currentPage, onPageReset]);

  useEffect(() => {
    if (
      meta?.total &&
      meta.total > 0 &&
      dynamicPageSize &&
      clients.length === 0 &&
      currentPage > 1
    ) {
      onPageReset?.();
    }
  }, [meta?.total, dynamicPageSize, clients.length, currentPage, onPageReset]);

  const showSkeleton = loading && isInitialLoadRef.current;
  const showNoResults =
    !loading && clients.length === 0 && !isInitialLoadRef.current;

  const refreshClients = useCallback(async () => {
    if (apiFilters && isActive) {
      await getClients(apiFilters);
    }
  }, [apiFilters, getClients, isActive]);

  return {
    clients,
    total: meta?.total || 0,
    loading,
    error,
    showSkeleton,
    showNoResults,
    dynamicPageSize,
    tableContainerRef,
    refreshClients,
  };
}
