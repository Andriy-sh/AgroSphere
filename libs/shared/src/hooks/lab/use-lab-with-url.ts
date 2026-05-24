'use client';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from 'nuqs';
import { mockLabItems, LabItem } from '../../mock/mock-lab-items';
import { FilterState } from '../../components/filters/filters';
import { useLabFilters } from './use-lab-filters';
import { useDynamicPageSize } from '../../utils/page-size-calculator';

export const useLabWithUrl = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useQueryState(
    'labPage',
    parseAsInteger.withDefault(1)
  );

  const [searchTerm, setSearchTerm] = useQueryState(
    'labSearch',
    parseAsString.withDefault('')
  );

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [sortField, setSortField] = useQueryState(
    'labSortField',
    parseAsString.withDefault('')
  );

  const [sortDirection, setSortDirection] = useQueryState(
    'labSortDirection',
    parseAsString.withDefault('none')
  );

  const [clientsFilter, setClientsFilter] = useQueryState(
    'labClients',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [periodFilter, setPeriodFilter] = useQueryState(
    'labPeriod',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'labStatus',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [taskTypeFilter, setTaskTypeFilter] = useQueryState(
    'labTaskType',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    'labType',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [labItems, setLabItems] = useState<LabItem[]>(mockLabItems);
  const [searchActive, setSearchActive] = useState(false);

  const activeFilters: FilterState = useMemo(
    () => ({
      clients: clientsFilter || [],
      period: periodFilter || [],
      status: statusFilter || [],
      taskType: taskTypeFilter || [],
      type: typeFilter || [],
    }),
    [clientsFilter, periodFilter, statusFilter, taskTypeFilter, typeFilter]
  );

  const { pageSize } = useDynamicPageSize(tableContainerRef, {
    estimatedRowHeight: 60,
    headerHeight: 40,
    paginationHeight: 40,
    minPageSize: 1,
  });

  const filteredLabItems = useLabFilters(
    labItems,
    searchTerm || '',
    activeFilters
  );

  const sortedLabItems = useMemo(() => {
    if (sortDirection === 'none' || !sortField) {
      return filteredLabItems;
    }

    return [...filteredLabItems].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'client':
          aValue = `${a.client.name} ${a.client.surname}`;
          bValue = `${b.client.name} ${b.client.surname}`;
          break;
        case 'taskId':
          aValue = a.taskId.startsWith('#') ? a.taskId : `#${a.taskId}`;
          bValue = b.taskId.startsWith('#') ? b.taskId : `#${b.taskId}`;
          break;
        case 'labOrderNo':
          aValue = `LAB-${a.id.split('-')[1]?.padStart(6, '0') || '000000'}`;
          bValue = `LAB-${b.id.split('-')[1]?.padStart(6, '0') || '000000'}`;
          break;
        case 'samples':
          aValue = (parseInt(a.id.split('-')[1] || '0', 10) % 15) + 1;
          bValue = (parseInt(b.id.split('-')[1] || '0', 10) % 15) + 1;
          break;
        case 'sentDate':
          aValue = new Date(a.sampleDate);
          bValue = new Date(b.sampleDate);
          break;
        case 'receivedDate':
          aValue = new Date(
            new Date(a.sampleDate).getTime() + 24 * 60 * 60 * 1000
          );
          bValue = new Date(
            new Date(b.sampleDate).getTime() + 24 * 60 * 60 * 1000
          );
          break;
        case 'updatedAt':
          aValue = new Date();
          bValue = new Date();
          break;
        default:
          aValue = a[sortField as keyof LabItem];
          bValue = b[sortField as keyof LabItem];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        const comparison = aValue.getTime() - bValue.getTime();
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredLabItems, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedLabItems.length / (pageSize || 10));
  const safeCurrentPage = Math.min(currentPage || 1, Math.max(1, totalPages));
  const paginatedLabItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * (pageSize || 10);
    return sortedLabItems.slice(startIndex, startIndex + (pageSize || 10));
  }, [sortedLabItems, safeCurrentPage, pageSize]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleShowFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleFiltersChange = useCallback(
    (filters: FilterState) => {
      setClientsFilter(filters.clients);
      setPeriodFilter(filters.period);
      setStatusFilter(filters.status);
      setTaskTypeFilter(filters.taskType);
      setTypeFilter(filters.type);
      setCurrentPage(1);
    },
    [
      setClientsFilter,
      setPeriodFilter,
      setStatusFilter,
      setTaskTypeFilter,
      setTypeFilter,
      setCurrentPage,
    ]
  );

  const handleResetFilters = useCallback(() => {
    setClientsFilter([]);
    setPeriodFilter([]);
    setStatusFilter([]);
    setTaskTypeFilter([]);
    setTypeFilter([]);
    setSearchTerm('');
    setCurrentPage(1);
  }, [
    setClientsFilter,
    setPeriodFilter,
    setStatusFilter,
    setTaskTypeFilter,
    setTypeFilter,
    setSearchTerm,
    setCurrentPage,
  ]);

  const handleSortChange = useCallback(
    (field: string, direction: 'asc' | 'desc' | 'none') => {
      if (direction === 'none') {
        setSortField('');
        setSortDirection('none');
      } else {
        setSortField(field);
        setSortDirection(direction);
      }
    },
    [setSortField, setSortDirection]
  );

  const handleDelete = useCallback((id: string) => {
    setLabItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setSelectedItems((prevSelected) =>
      prevSelected.filter((itemId) => itemId !== id)
    );
  }, []);

  const handleDeleteSelected = useCallback((ids: string[]) => {
    setLabItems((prevItems) =>
      prevItems.filter((item) => !ids.includes(item.id))
    );
    setSelectedItems([]);
  }, []);

  const handleSelectedItemsChange = useCallback((selected: string[]) => {
    setSelectedItems(selected);
  }, []);

  return {
    currentPage: safeCurrentPage,
    searchTerm: searchTerm || '',
    showFilters,
    activeFilters,
    sortField: sortField || null,
    sortDirection: (sortDirection as 'asc' | 'desc' | 'none') || 'none',
    selectedItems,
    labItems,
    filteredLabItems: sortedLabItems,
    paginatedLabItems,
    pageSize,
    totalPages,
    searchActive,
    tableContainerRef,

    handleSearchChange,
    handlePageChange,
    handleShowFilters,
    handleFiltersChange,
    handleResetFilters,
    handleSortChange,
    handleDelete,
    handleDeleteSelected,
    handleSelectedItemsChange,
    setSearchActive,
    setLabItems,
  };
};
