'use client';

import { useState, useCallback } from 'react';
import { FilterState } from '@@agrosphere/shared';

export function useTasksState() {
  const [filters, setFilters] = useState<FilterState>({
    clients: [],
    period: [],
    status: [],
    taskType: [],
    type: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('table');
  const [showFilters, setShowFilters] = useState(true);
  const [assignedToFilter, setAssignedToFilter] = useState<
    'none' | 'asc' | 'desc'
  >('none');
  const [clientFilter, setClientFilter] = useState<'none' | 'asc' | 'desc'>(
    'none'
  );
  const [dueFilter, setDueFilter] = useState<'none' | 'newest' | 'oldest'>(
    'none'
  );
  const [statusFilter, setStatusFilter] = useState<'none' | 'asc' | 'desc'>(
    'none'
  );
  const [taskTypeFilter, setTaskTypeFilter] = useState<'none' | 'asc' | 'desc'>(
    'none'
  );
  const [createdAtFilter, setCreatedAtFilter] = useState<
    'none' | 'newest' | 'oldest'
  >('none');
  const [activeAfterFilter, setActiveAfterFilter] = useState<
    'none' | 'newest' | 'oldest'
  >('none');

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [currentPage]
  );

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      clients: [],
      period: [],
      status: [],
      taskType: [],
      type: [],
    });
    setCurrentPage(1);
  }, []);

  return {
    filters,
    searchTerm,
    currentPage,
    activeTab,
    showFilters,
    assignedToFilter,
    clientFilter,
    dueFilter,
    statusFilter,
    taskTypeFilter,
    createdAtFilter,
    activeAfterFilter,

    setFilters,
    setSearchTerm,
    setCurrentPage,
    setActiveTab,
    setShowFilters,
    setAssignedToFilter,
    setClientFilter,
    setDueFilter,
    setStatusFilter,
    setTaskTypeFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,

    handlePageChange,
    handleSearchChange,
    handleTabChange,
    handleFiltersChange,
    handleResetFilters,
  };
}
