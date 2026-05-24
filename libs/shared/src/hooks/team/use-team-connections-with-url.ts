'use client';
import { useState, useCallback, useMemo } from 'react';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { Connection, mockConnections } from '../../mock/mock-connections';

export const useTeamConnectionsWithUrl = () => {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);

  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  const [connectionSortField, setConnectionSortField] = useQueryState(
    'connectionsSortField',
    parseAsString.withDefault('')
  );

  const [connectionSortDirection, setConnectionSortDirection] = useQueryState(
    'connectionsSortDirection',
    parseAsString.withDefault('none')
  );

  const [connectionCurrentPage, setConnectionCurrentPage] = useQueryState(
    'connectionsPage',
    parseAsInteger.withDefault(1)
  );

  const [connectionPageSize, setConnectionPageSize] = useState(9);

  const sortedConnections = useMemo(() => {
    const awaitingConnections = connections.filter(
      (conn) => conn.status === 'awaiting'
    );
    const otherConnections = connections.filter(
      (conn) => conn.status !== 'awaiting'
    );

    let sortedOtherConnections = otherConnections;
    if (connectionSortDirection !== 'none' && connectionSortField) {
      sortedOtherConnections = [...otherConnections].sort((a, b) => {
        const aValue = a[connectionSortField as keyof Connection];
        const bValue = b[connectionSortField as keyof Connection];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return connectionSortDirection === 'asc' ? -1 : 1;
        if (bValue == null) return connectionSortDirection === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return connectionSortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return connectionSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return connectionSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return [...awaitingConnections, ...sortedOtherConnections];
  }, [connections, connectionSortField, connectionSortDirection]);

  const paginatedConnections = useMemo(() => {
    const startIndex = (connectionCurrentPage - 1) * connectionPageSize;
    return sortedConnections.slice(startIndex, startIndex + connectionPageSize);
  }, [sortedConnections, connectionCurrentPage, connectionPageSize]);

  const connectionTotalPages = Math.ceil(
    sortedConnections.length / connectionPageSize
  );
  const safeConnectionCurrentPage = Math.min(
    connectionCurrentPage,
    Math.max(1, connectionTotalPages)
  );

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      if (!searchValue.trim()) {
        setConnections(mockConnections);
        return;
      }

      const searchLower = searchValue.toLowerCase();
      const filtered = mockConnections.filter((connection) => {
        return (
          connection.name.toLowerCase().includes(searchLower) ||
          connection.email.toLowerCase().includes(searchLower) ||
          connection.status.toLowerCase().includes(searchLower)
        );
      });

      setConnections(filtered);
      setConnectionCurrentPage(1);
    },
    [setConnectionCurrentPage]
  );

  const handleConnectionPageChange = useCallback(
    (page: number) => {
      setConnectionCurrentPage(page);
    },
    [setConnectionCurrentPage]
  );

  const handleAcceptConnection = useCallback((id: string) => {
    setConnections((prev) =>
      prev.map((connection) =>
        connection.id === id
          ? { ...connection, status: 'active' as const }
          : connection
      )
    );
  }, []);

  const handleDeclineConnection = useCallback((id: string) => {
    setConnections((prev) =>
      prev.map((connection) =>
        connection.id === id
          ? { ...connection, status: 'declined' as const }
          : connection
      )
    );
  }, []);

  const handleResendInvite = useCallback((id: string) => {
    return;
  }, []);

  const handleDeactivateConnection = useCallback((id: string) => {
    setConnections((prev) =>
      prev.map((connection) =>
        connection.id === id
          ? { ...connection, status: 'inactive' as const }
          : connection
      )
    );
  }, []);

  const handleActivateConnection = useCallback((id: string) => {
    setConnections((prev) =>
      prev.map((connection) =>
        connection.id === id
          ? { ...connection, status: 'active' as const }
          : connection
      )
    );
  }, []);

  const handleRemoveConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((connection) => connection.id !== id));
  }, []);

  const handleSelectedConnectionsChange = useCallback((selected: string[]) => {
    setSelectedConnections(selected);
  }, []);

  const handleDeleteSelectedConnections = useCallback(() => {
    setConnections((prev) =>
      prev.filter((connection) => !selectedConnections.includes(connection.id))
    );
    setSelectedConnections([]);
  }, [selectedConnections]);

  const handleInviteConnections = useCallback(
    (invitedConnections: Array<{ email: string }>) => {
      return;
    },
    []
  );

  const handleResetSearch = useCallback(() => {
    setConnections(mockConnections);
    setConnectionCurrentPage(1);
  }, [setConnectionCurrentPage]);

  const setPageSize = useCallback(
    (size: number) => {
      setConnectionPageSize(size);
    },
    [setConnectionPageSize]
  );

  const resetToFirstPage = useCallback(() => {
    setConnectionCurrentPage(1);
  }, [setConnectionCurrentPage]);

  const handleSort = useCallback(
    (field: keyof Connection) => {
      if (connectionSortField === field) {
        if (connectionSortDirection === 'none') {
          setConnectionSortField(field);
          setConnectionSortDirection('asc');
        } else if (connectionSortDirection === 'asc') {
          setConnectionSortDirection('desc');
        } else {
          setConnectionSortField('');
          setConnectionSortDirection('none');
        }
      } else {
        setConnectionSortField(field);
        setConnectionSortDirection('asc');
      }
    },
    [
      connectionSortField,
      connectionSortDirection,
      setConnectionSortField,
      setConnectionSortDirection,
    ]
  );

  const getSortIcon = useCallback(
    (field: keyof Connection) => {
      if (connectionSortField !== field || connectionSortDirection === 'none')
        return 'expand_all';
      return connectionSortDirection === 'asc' ? 'expand_less' : 'expand_more';
    },
    [connectionSortField, connectionSortDirection]
  );

  return {
    connections,
    selectedConnections,
    connectionSortField: connectionSortField || '',
    connectionSortDirection: connectionSortDirection || 'none',
    connectionCurrentPage: safeConnectionCurrentPage,
    connectionPageSize,
    sortedConnections,
    paginatedConnections,
    connectionTotalPages,

    handleSearchChange,
    handleConnectionPageChange,
    handleAcceptConnection,
    handleDeclineConnection,
    handleResendInvite,
    handleDeactivateConnection,
    handleActivateConnection,
    handleRemoveConnection,
    handleSelectedConnectionsChange,
    handleDeleteSelectedConnections,
    handleInviteConnections,
    handleResetSearch,
    setPageSize,
    resetToFirstPage,
    setConnectionSortField,
    setConnectionSortDirection,
    handleSort,
    getSortIcon,
  };
};
