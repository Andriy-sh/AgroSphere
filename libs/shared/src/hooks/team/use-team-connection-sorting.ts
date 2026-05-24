'use client';
import { useCallback, useMemo } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { Connection } from '../../mock/mock-connections';

export const useTeamConnectionSorting = (connections: Connection[]) => {
  const [sortField, setSortField] = useQueryState(
    'connectionsSortField',
    parseAsString.withDefault('')
  );

  const [sortDirection, setSortDirection] = useQueryState(
    'connectionsSortDirection',
    parseAsString.withDefault('none')
  );

  const getNextSortDirection = useCallback(
    (field: keyof Connection) => {
      if (sortField === field) {
        if (sortDirection === 'none') return 'asc';
        if (sortDirection === 'asc') return 'desc';
        return 'none';
      }
      return 'asc';
    },
    [sortField, sortDirection]
  );

  const handleSort = useCallback(
    (field: keyof Connection) => {
      const newDirection = getNextSortDirection(field);
      setSortField(field);
      setSortDirection(newDirection);
    },
    [getNextSortDirection, setSortField, setSortDirection]
  );

  const getSortIcon = useCallback(
    (field: keyof Connection) => {
      if (sortField !== field || sortDirection === 'none') return 'expand_all';
      return sortDirection === 'asc' ? 'expand_less' : 'expand_more';
    },
    [sortField, sortDirection]
  );

  const sortedConnections = useMemo(() => {
    const awaitingConnections = connections.filter(
      (conn) => conn.status === 'awaiting'
    );
    const otherConnections = connections.filter(
      (conn) => conn.status !== 'awaiting'
    );

    let sortedOtherConnections = otherConnections;
    if (sortDirection !== 'none' && sortField) {
      sortedOtherConnections = [...otherConnections].sort((a, b) => {
        const aValue = a[sortField as keyof Connection];
        const bValue = b[sortField as keyof Connection];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
        if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return [...awaitingConnections, ...sortedOtherConnections];
  }, [connections, sortField, sortDirection]);

  return {
    sortField: sortField || null,
    sortDirection: sortDirection || 'none',
    handleSort,
    getSortIcon,
    sortedConnections,
  };
};
