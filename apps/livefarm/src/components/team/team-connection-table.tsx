'use client';

import React, { useMemo, useCallback, useRef } from 'react';
import { ColumnDef, HeaderContext, CellContext } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Checkbox,
  SelectAllCheckbox,
  Avatar,
  DropdownActionsNoLib,
  DropdownActionItem,
  Button,
} from '@@agrosphere/shared';
import { Connection } from '@@agrosphere/shared';
import { X, Check, MoreVertical } from 'lucide-react';

interface TeamConnectionTableProps {
  connections: Connection[];
  allConnections: Connection[];
  selectedConnections: string[];
  onSelectedConnectionsChange: (selectedConnections: string[]) => void;
  onAcceptConnection?: (id: string) => void;
  onDeclineConnection?: (id: string) => void;
  onResendInvite?: (id: string) => void;
  onDeactivateConnection?: (id: string) => void;
  onActivateConnection?: (id: string) => void;
  onRemoveConnection?: (id: string) => void;
  onDeleteSelectedConnections?: () => void;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc' | 'none';
  onSort?: (field: keyof Connection) => void;
  getSortIcon?: (field: keyof Connection) => string;
}

export function TeamConnectionTable({
  connections,
  allConnections,
  selectedConnections,
  onSelectedConnectionsChange,
  onAcceptConnection,
  onDeclineConnection,
  onResendInvite,
  onDeactivateConnection,
  onActivateConnection,
  onRemoveConnection,
  onDeleteSelectedConnections,
  sortField,
  sortDirection,
  onSort,
  getSortIcon,
}: TeamConnectionTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: Connection['status']) => {
    switch (status) {
      case 'active':
        return 'bg-basic-green-opacity text-basic-green';
      case 'inactive':
        return 'bg-basic-white text-basic-black';
      case 'invited':
        return 'bg-basic-blue-opacity text-basic-blue';
      case 'awaiting':
        return 'bg-[#FFC6521F] text-basic-yellow';
      case 'declined':
        return 'bg-basic-red-opacity text-basic-red';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getDropdownItems = useCallback(
    (connection: Connection): DropdownActionItem[] => [
      {
        id: 'deactivate',
        label: <span className="text-sm">Deactivate connection</span>,
        icon: 'account_circle_off',
        onClick: () => onDeactivateConnection?.(connection.id),
        className: connection.status === 'active' ? '' : 'hidden',
      },
      {
        id: 'activate',
        label: <span className="text-sm">Activate connection</span>,
        icon: 'replay',
        onClick: () => onActivateConnection?.(connection.id),
        className: connection.status === 'inactive' ? '' : 'hidden',
      },
      {
        id: 'remove',
        label: <span className="text-sm">Remove connection</span>,
        icon: 'delete',
        onClick: () => onRemoveConnection?.(connection.id),
        className: 'text-red-600',
      },
    ],
    [onDeactivateConnection, onActivateConnection, onRemoveConnection]
  );

  const columns: ColumnDef<Connection>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <SelectAllCheckbox
            allItems={allConnections}
            selectedItems={selectedConnections}
            onSelectedItemsChange={onSelectedConnectionsChange}
            className="rounded text-center border-basic-gray-light"
            aria-label="Select all connections"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedConnections.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectedConnectionsChange([
                  ...selectedConnections,
                  row.original.id,
                ]);
              } else {
                onSelectedConnectionsChange(
                  selectedConnections.filter((id) => id !== row.original.id)
                );
              }
            }}
            className={`rounded border-basic-gray-light w-4 h-4 ${
              selectedConnections.includes(row.original.id)
                ? 'bg-basic-green-dark border-basic-green-dark'
                : 'bg-white border-basic-gray-light'
            }`}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        meta: { className: 'w-8 text-center' },
      },
      {
        accessorKey: 'name',
        header: () => (
          <button
            className="flex items-center gap-1  cursor-pointer text-sm truncate w-full text-left"
            onClick={() => onSort?.('name')}
            aria-label={`Sort by name ${
              sortField === 'name' && sortDirection !== 'none'
                ? sortDirection === 'asc'
                  ? 'descending'
                  : 'ascending'
                : 'ascending'
            }`}
          >
            <span className="truncate">Name</span>
            <span
              className="material-symbols-outlined text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {getSortIcon?.('name') || 'expand_all'}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar
              row={{
                original: {
                  client: {
                    name: row.original.name.split(' ')[0] || '',
                    surname:
                      row.original.name.split(' ').slice(1).join(' ') || '',
                  },
                },
              }}
              rounded="md"
              className="w-7 h-7 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-basic-black truncate">
                {row.original.name}
              </div>
            </div>
          </div>
        ),
        meta: { className: 'w-[25%] text-left' },
      },
      {
        accessorKey: 'email',
        header: () => (
          <button
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left"
            onClick={() => onSort?.('email')}
            aria-label={`Sort by email ${
              sortField === 'email' && sortDirection !== 'none'
                ? sortDirection === 'asc'
                  ? 'descending'
                  : 'ascending'
                : 'ascending'
            }`}
          >
            <span className="truncate">Email</span>
            <span
              className="material-symbols-outlined text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {getSortIcon?.('email') || 'expand_all'}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.email}</div>
        ),
        meta: { className: 'w-[20%] text-left' },
      },
      {
        accessorKey: 'status',
        header: () => (
          <button
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left"
            onClick={() => onSort?.('status')}
            aria-label={`Sort by status ${
              sortField === 'status' && sortDirection !== 'none'
                ? sortDirection === 'asc'
                  ? 'descending'
                  : 'ascending'
                : 'ascending'
            }`}
          >
            <span className="truncate">Status</span>
            <span
              className="material-symbols-outlined text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {getSortIcon?.('status') || 'expand_all'}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex justify-start">
            <span
              className={`inline-flex px-2 py-[1.5px] text-xs font-normal rounded-[4px] ${getStatusColor(
                row.original.status
              )}`}
            >
              {capitalizeFirstLetter(row.original.status)}
            </span>
          </div>
        ),
        meta: { className: 'w-[30%] text-left' },
      },
      {
        accessorKey: 'dateAdded',
        header: () => (
          <button
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left"
            onClick={() => onSort?.('dateAdded')}
            aria-label={`Sort by date added ${
              sortField === 'dateAdded' && sortDirection !== 'none'
                ? sortDirection === 'asc'
                  ? 'descending'
                  : 'ascending'
                : 'ascending'
            }`}
          >
            <span className="truncate">Date added</span>
            <span
              className="material-symbols-outlined text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {getSortIcon?.('dateAdded') || 'expand_all'}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.dateAdded}</div>
        ),
        meta: { className: 'w-[15%] text-left' },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          if (row.original.status === 'awaiting') {
            return (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="decline"
                  size="sm"
                  onClick={() => onDeclineConnection?.(row.original.id)}
                  className="text-xs px-2 py-1 h-auto"
                  aria-label={`Decline connection from ${row.original.name}`}
                >
                  <X className="w-3 h-3 mr-1" aria-hidden="true" />
                  Decline
                </Button>
                <Button
                  variant="complete"
                  size="sm"
                  onClick={() => onAcceptConnection?.(row.original.id)}
                  className="text-xs px-2 py-1 h-auto"
                  aria-label={`Accept connection from ${row.original.name}`}
                >
                  <Check className="w-3 h-3 mr-1" aria-hidden="true" />
                  Accept
                </Button>
              </div>
            );
          }

          if (row.original.status === 'invited') {
            return (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs px-3 py-2 h-auto underline-none border border-basic-white text-basic-green"
                  onClick={() => onResendInvite?.(row.original.id)}
                  aria-label={`Resend invite to ${row.original.name}`}
                >
                  Resend invite
                </Button>
                <DropdownActionsNoLib
                  items={getDropdownItems(row.original)}
                  triggerIcon={<MoreVertical className="w-4 h-4" />}
                  triggerClassName="text-basic-gray hover:text-basic-black"
                />
              </div>
            );
          }

          if (
            row.original.status === 'active' ||
            row.original.status === 'inactive' ||
            row.original.status === 'declined'
          ) {
            return (
              <div className="flex items-center justify-end">
                <DropdownActionsNoLib
                  items={getDropdownItems(row.original)}
                  triggerIcon={<MoreVertical className="w-4 h-4" />}
                  triggerClassName="text-basic-gray hover:text-basic-black"
                />
              </div>
            );
          }

          return null;
        },
        meta: { className: 'w-[25%] text-left' },
      },
    ],
    [
      selectedConnections,
      allConnections,
      onSelectedConnectionsChange,
      onAcceptConnection,
      onDeclineConnection,
      onResendInvite,
      getSortIcon,
      onSort,
      getDropdownItems,
      sortField,
      sortDirection,
    ]
  );

  const sortedData = useMemo(() => {
    return connections;
  }, [connections]);

  const handleDeleteSelected = () => {
    onDeleteSelectedConnections?.();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full ">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-visible min-w-0 w-full max-w-full"
      >
        <div className="w-full min-w-0 max-w-full relative">
          <Table className="table-fixed rounded-xl overflow-visible relative">
            <TableHeader className="text-basic-gray bg-basic-white">
              <TableHead className="w-12 h-9 !text-center">
                <div className="flex items-center justify-center w-full h-full">
                  <SelectAllCheckbox
                    allItems={allConnections}
                    selectedItems={selectedConnections}
                    onSelectedItemsChange={onSelectedConnectionsChange}
                    aria-label="Select all connections"
                  />
                </div>
              </TableHead>

              {columns.slice(1).map((column, index) => {
                const meta = column.meta as { className?: string };
                return (
                  <TableHead
                    key={
                      column.id ||
                      String(
                        (column as { accessorKey?: string }).accessorKey || ''
                      )
                    }
                    className={`text-sm font-normal overflow-hidden h-9 truncate pr-2.5 ${
                      meta?.className || ''
                    }`}
                  >
                    {selectedConnections.length > 0 ? (
                      index === 0 ? (
                        <div className="flex items-center text-xs font-normal justify-start w-full h-full">
                          <span className="truncate">
                            {selectedConnections.length} of{' '}
                            {allConnections.length} selected
                          </span>
                        </div>
                      ) : index === columns.slice(1).length - 1 ? (
                        <div className="flex items-center justify-end w-full h-full">
                          <button
                            className="material-symbols-outlined text-basic-black cursor-pointer text-lg hover:text-basic-red transition-colors flex-shrink-0"
                            onClick={handleDeleteSelected}
                            aria-label="Delete selected connections"
                          >
                            delete
                          </button>
                        </div>
                      ) : (
                        <span>&nbsp;</span>
                      )
                    ) : typeof column.header === 'function' ? (
                      column.header({} as HeaderContext<Connection, unknown>)
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableHeader>
            <TableBody className="relative">
              {sortedData.length === 0 ? (
                <TableRow className="bg-white">
                  <TableCell
                    colSpan={columns.length}
                    className="text-basic-gray"
                    checkbox={true}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, rowIndex) => (
                  <TableRow key={row.id}>
                    {columns.map((column, columnIndex) => {
                      const meta = column.meta as { className?: string };
                      return (
                        <TableCell
                          key={
                            column.id ||
                            String(
                              (column as { accessorKey?: string })
                                .accessorKey || ''
                            )
                          }
                          className={`${meta?.className || ''}`}
                          checkbox={true}
                        >
                          {typeof column.cell === 'function'
                            ? column.cell({
                                row: { original: row },
                              } as CellContext<Connection, unknown>)
                            : column.cell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
