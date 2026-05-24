'use client';
import { useMemo } from 'react';
import { LabItem } from '../../types/lab';
import { FilterState } from '../../components/filters/filters';
import { DEFAULT_LAB_STATUS_CONFIGS } from '../../types/lab';

export function useLabFilters(
  labItems: LabItem[],
  searchTerm: string,
  activeFilters: FilterState
) {
  const filteredLabItems = useMemo(() => {
    const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
    const hasClientFilters =
      activeFilters?.clients && activeFilters.clients.length > 0;
    const hasStatusFilters =
      activeFilters?.status && activeFilters.status.length > 0;
    const hasTaskTypeFilters =
      activeFilters?.taskType && activeFilters.taskType.length > 0;
    const hasPeriodFilters =
      activeFilters?.period && activeFilters.period.length > 0;
    const hasTypeFilters = activeFilters?.type && activeFilters.type.length > 0;

    if (
      !hasSearchTerm &&
      !hasClientFilters &&
      !hasStatusFilters &&
      !hasTaskTypeFilters &&
      !hasPeriodFilters &&
      !hasTypeFilters
    ) {
      return labItems;
    }

    let filtered = labItems;

    if (hasSearchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.client.name.toLowerCase().includes(searchLower) ||
          item.client.surname.toLowerCase().includes(searchLower) ||
          item.farm.toLowerCase().includes(searchLower) ||
          item.labName.toLowerCase().includes(searchLower) ||
          item.id.toLowerCase().includes(searchLower) ||
          item.taskId.toLowerCase().includes(searchLower) ||
          `LAB-${item.id.split('-')[1]?.padStart(6, '0') || '000000'}`
            .toLowerCase()
            .includes(searchLower)
      );
    }

    if (hasClientFilters && !activeFilters.clients.includes('All')) {
      filtered = filtered.filter((item) => {
        const clientName = `${item.client.name} ${item.client.surname}`;
        return activeFilters.clients.includes(clientName);
      });
    }

    if (hasStatusFilters && !activeFilters.status.includes('All')) {
      filtered = filtered.filter((item) => {
        const statusLabel =
          DEFAULT_LAB_STATUS_CONFIGS.find((config) => config.id === item.status)
            ?.label || item.status;
        return activeFilters.status.includes(statusLabel);
      });
    }

    if (hasTaskTypeFilters && !activeFilters.taskType.includes('All')) {
      filtered = filtered.filter((item) => {
        return activeFilters.taskType.includes(item.type);
      });
    }

    if (hasTypeFilters && !activeFilters.type.includes('All')) {
      filtered = filtered.filter((item) => {
        return activeFilters.type.includes(item.labName);
      });
    }

    if (hasPeriodFilters) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((item) => {
        const dateToCheck = item.sentDate
          ? new Date(item.sentDate)
          : new Date(item.sampleDate);

        return activeFilters.period.some((period) => {
          switch (period) {
            case 'Late tasks':
              return dateToCheck < today;
            case 'Today':
              return dateToCheck >= today;
            case 'Last 7 days':
              return dateToCheck >= weekAgo;
            case 'Last 30 days':
              return dateToCheck >= monthAgo;
            case 'Last year':
              return dateToCheck >= yearAgo;
            default:
              return true;
          }
        });
      });
    }

    return filtered;
  }, [labItems, searchTerm, activeFilters]);

  return filteredLabItems;
}
