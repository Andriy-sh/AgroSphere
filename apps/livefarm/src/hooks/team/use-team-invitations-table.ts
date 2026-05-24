'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTeamInvitationsApi, TeamInvitation } from '@@agrosphere/shared';
import { useDynamicPageSize } from '@@agrosphere/shared';
import { useDebounce } from '@@agrosphere/shared';

interface UseTeamInvitationsTableProps {
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

export function useTeamInvitationsTable({
  searchTerm,
  currentPage,
  isActive = true,
  onPageReset,
}: UseTeamInvitationsTableProps): {
  invitations: TeamInvitation[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  dynamicPageSize: number | null;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  refreshInvitations: () => Promise<void>;
} {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { fetchInvitations, invitations, pagination, loading, error } =
    useTeamInvitationsApi();

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

  const loadInvitations = useCallback(async () => {
    if (!isActive || !isReady || !debouncedPageSize) {
      return;
    }

    try {
      await fetchInvitations(apiFilters);
    } catch (error) {
      console.error('Failed to fetch team invitations:', error);
    }
  }, [fetchInvitations, apiFilters, isReady, isActive, debouncedPageSize]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations, isActive, isReady, debouncedPageSize]);

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
      invitations.length === 0 &&
      currentPage > 1
    ) {
      onPageReset?.();
    }
  }, [
    pagination,
    debouncedPageSize,
    invitations.length,
    currentPage,
    onPageReset,
  ]);

  return {
    invitations,
    pagination,
    loading,
    error,
    dynamicPageSize,
    tableContainerRef,
    refreshInvitations: loadInvitations,
  };
}
