'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTeamUsersApi, TeamUser } from '@@agrosphere/shared';
import { useDynamicPageSize } from '@@agrosphere/shared';
import { useDebounce } from '@@agrosphere/shared';

interface UseTeamUsersTableProps {
  searchTerm: string;
  currentPage: number;
  isActive?: boolean;
  onPageReset?: () => void;
}

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Pagination {
  meta: PaginationMeta;
}

export function useTeamUsersTable({
  searchTerm,
  currentPage,
  isActive = true,
  onPageReset,
}: UseTeamUsersTableProps): {
  users: TeamUser[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  dynamicPageSize: number | null;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  refreshUsers: () => Promise<void>;
} {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { fetchUsers, users, pagination, loading, error } = useTeamUsersApi();

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
  const debouncedPageSize = useDebounce(dynamicPageSize, 300);

  const apiFilters = useMemo(() => {
    const filters: Record<string, string | number> = {
      page: currentPage,
    };

    if (debouncedPageSize) {
      filters.per_page = debouncedPageSize;
    }

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    return filters;
  }, [currentPage, debouncedPageSize, debouncedSearchTerm]);

  const loadUsers = useCallback(async () => {
    if (!isActive || !isReady || !debouncedPageSize) {
      return;
    }

    try {
      await fetchUsers(apiFilters);
    } catch (error) {
      console.error('Failed to fetch team users:', error);
    }
  }, [fetchUsers, apiFilters, isReady, isActive, debouncedPageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, isActive, isReady, debouncedPageSize]);

  useEffect(() => {
    if (pagination && pagination.meta && debouncedPageSize && currentPage > 1) {
      const totalPages = Math.ceil(pagination.meta.total / debouncedPageSize);
      if (currentPage > totalPages) {
        onPageReset?.();
      }
    }
  }, [pagination, debouncedPageSize, currentPage, onPageReset]);

  useEffect(() => {
    if (
      pagination &&
      pagination.meta &&
      pagination.meta.total > 0 &&
      debouncedPageSize &&
      users.length === 0 &&
      currentPage > 1
    ) {
      onPageReset?.();
    }
  }, [pagination, debouncedPageSize, users.length, currentPage, onPageReset]);

  return {
    users,
    pagination,
    loading,
    error,
    dynamicPageSize,
    tableContainerRef,
    refreshUsers: loadUsers,
  };
}
