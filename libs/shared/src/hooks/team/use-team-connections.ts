'use client';
import { useState, useCallback, useMemo } from 'react';
import { Connection, mockConnections } from '../../mock/mock-connections';

export const useTeamConnections = () => {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [connectionSortField, setConnectionSortField] =
    useState<keyof Connection>('name');
  const [connectionSortDirection, setConnectionSortDirection] = useState<
    'asc' | 'desc'
  >('asc');
  const [connectionCurrentPage, setConnectionCurrentPage] = useState(1);
  const [connectionPageSize, setConnectionPageSize] = useState(9);

  const sortedConnections = useMemo(() => {
    return [...connections].sort((a, b) => {
      const aValue = a[connectionSortField];
      const bValue = b[connectionSortField];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return connectionSortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return connectionSortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return connectionSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return connectionSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
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

  const handleSearchChange = useCallback((searchValue: string) => {
    if (!searchValue.trim()) {
      setConnections(mockConnections);
      setConnectionCurrentPage(1);
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
  }, []);

  const handleConnectionPageChange = useCallback((page: number) => {
    setConnectionCurrentPage(page);
  }, []);

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
      prev.map((conn) =>
        conn.id === id ? { ...conn, status: 'inactive' as const } : conn
      )
    );
  }, []);

  const handleActivateConnection = useCallback((id: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === id ? { ...conn, status: 'active' as const } : conn
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
  }, []);

  const setPageSize = useCallback((size: number) => {
    setConnectionPageSize(size);
  }, []);

  const resetToFirstPage = useCallback(() => {
    setConnectionCurrentPage(1);
  }, []);

  return {
    connections,
    selectedConnections,
    connectionSortField,
    connectionSortDirection,
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
  };
};
