'use client';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useTeamUsersApi, TeamUser, useDebounce } from '@@agrosphere/shared';

interface UseTeamUsersTableSimpleProps {
  searchTerm: string;
  currentPage: number;
  isActive?: boolean;
  onPageReset?: () => void;
  dynamicPageSize?: number;
  refreshTrigger?: number;
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

export function useTeamUsersTableSimple({
  searchTerm,
  currentPage,
  isActive = true,
  onPageReset,
  dynamicPageSize,
  refreshTrigger,
}: UseTeamUsersTableSimpleProps): {
  users: TeamUser[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  showSkeleton: boolean;
  showNoResults: boolean;
  refreshUsers: () => Promise<void>;
} {
  const { fetchUsers, users, pagination, loading, error } = useTeamUsersApi();
  const isInitialLoadRef = useRef<boolean>(true);

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
    if (!isActive || !debouncedPageSize) {
      return;
    }

    try {
      await fetchUsers(apiFilters);
      isInitialLoadRef.current = false;
    } catch (error) {
      console.error('Failed to fetch team users:', error);
    }
  }, [fetchUsers, apiFilters, isActive, debouncedPageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, isActive, debouncedPageSize]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadUsers();
    }
  }, [refreshTrigger, loadUsers]);

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

  const showSkeleton = loading && isInitialLoadRef.current;
  const showNoResults =
    !loading && users.length === 0 && !isInitialLoadRef.current;

  return {
    users,
    pagination,
    loading,
    error,
    showSkeleton,
    showNoResults,
    refreshUsers: loadUsers,
  };
}
