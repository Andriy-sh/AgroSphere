'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table';
import {
  Pagination,
  Avatar,
  DropdownActionsNoLib,
  DropdownActionItem,
  StatusIndicator,
  Checkbox,
  SelectAllCheckbox,
  formatShortDate,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Icon,
} from '@@agrosphere/shared';
import { LabItem, ConfirmationDialog } from '@@agrosphere/shared';
import { LabDeleteSingle } from './lab-delete-single';
import { LabTableRowSkeleton } from '@/components/skeletons';

interface LabTableProps {
  labItems: LabItem[];
  allLabItems: LabItem[];
  currentPage: number;
  searchTerm: string;
  pageSize?: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
  onDownload: (id: string) => void;
  onDownloadSelected: (ids: string[]) => void;
  selectedItems: string[];
  onSelectedItemsChange: (selected: string[]) => void;
  showFilters?: boolean;
  enableDynamicPageSize?: boolean;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc' | 'none';
  onSortChange?: (field: string, direction: 'asc' | 'desc' | 'none') => void;
  loading?: boolean;
}

interface LabTableItem extends LabItem {
  taskId: string;
  labOrderNo: string;
  samples: number;
  sentDate: string;
  receivedDate: string;
  updatedAt: string;
}

export function LabTable({
  labItems,
  allLabItems,
  currentPage,
  searchTerm,
  pageSize,
  totalPages,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  onDeleteSelected,
  onDownload,
  onDownloadSelected,
  selectedItems,
  onSelectedItemsChange,
  showFilters = false,
  enableDynamicPageSize = false,
  sortField: externalSortField = null,
  sortDirection: externalSortDirection = 'none',
  onSortChange,
  loading = false,
}: LabTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const sortField = externalSortField as keyof LabTableItem | null;
  const sortDirection = externalSortDirection;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteSingleDialogOpen, setIsDeleteSingleDialogOpen] =
    useState(false);
  const [labOrderToDelete, setLabOrderToDelete] = useState<string>('');

  const tableData: LabTableItem[] = useMemo(() => {
    return labItems.map((item) => ({
      ...item,
      taskId: item.taskId.startsWith('#') ? item.taskId : `#${item.taskId}`,
      labOrderNo: `LAB-${item.id.split('-')[1]?.padStart(6, '0') || '000000'}`,
      samples: Math.floor(Math.random() * 15) + 1,
      sentDate: formatShortDate(item.sampleDate),
      receivedDate: formatShortDate(
        new Date(
          new Date(item.sampleDate).getTime() + 24 * 60 * 60 * 1000
        ).toISOString()
      ),
      updatedAt: formatShortDate(new Date().toISOString()),
    }));
  }, [labItems]);

  const handleSort = useCallback(
    (field: keyof LabTableItem) => {
      const getNextSortDirection = (field: keyof LabTableItem) => {
        if (sortField && sortField === field) {
          if (sortDirection === 'none') return 'asc';
          if (sortDirection === 'asc') return 'desc';
          if (sortDirection === 'desc') return 'none';
        }
        return 'asc';
      };

      const newDirection = getNextSortDirection(field);
      if (onSortChange) {
        onSortChange(field as string, newDirection);
      }
    },
    [sortField, sortDirection, onSortChange]
  );

  const getSortIcon = useCallback(
    (field: keyof LabTableItem) => {
      if (!sortField || sortField !== field) return 'expand_all';
      if (sortDirection === 'none') return 'expand_all';
      return sortDirection === 'asc' ? 'expand_less' : 'expand_more';
    },
    [sortField, sortDirection]
  );

  const columns: ColumnDef<LabTableItem>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <SelectAllCheckbox
            allItems={allLabItems}
            selectedItems={selectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
            className="rounded text-center border-basic-gray-light "
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedItems.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectedItemsChange([...selectedItems, row.original.id]);
              } else {
                onSelectedItemsChange(
                  selectedItems.filter((itemId) => itemId !== row.original.id)
                );
              }
            }}
            className={`rounded border-basic-gray-light w-4 h-4 ${
              selectedItems.includes(row.original.id)
                ? 'bg-basic-green-dark border-basic-green-dark'
                : 'bg-white border-basic-gray-light'
            }`}
          />
        ),
        meta: { className: '!w-9 text-center' },
      },
      {
        accessorKey: 'id',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('id')}
          >
            <span className="truncate">No</span>
            <Icon icon={getSortIcon('id')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-sm truncate">{row.original.id}</div>
        ),
        meta: { className: 'w-20 text-left' },
      },
      {
        accessorKey: 'client',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('client')}
          >
            <span className="truncate">Client</span>
            <Icon icon={getSortIcon('client')} size="sm" />
          </div>
        ),
        cell: ({ row }: { row: { original: LabTableItem } }) => (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar
              row={{
                original: {
                  client: {
                    name: row.original.client.name,
                    surname: row.original.client.surname,
                    avatarSrc: row.original.client.avatarSrc,
                  },
                },
              }}
              rounded="md"
              className="w-7 h-7 flex-shrink-0"
            />
            {!showFilters && (
              <span className="text-sm truncate">
                {row.original.client.name} {row.original.client.surname[0]}.
              </span>
            )}
          </div>
        ),
        meta: {
          className: showFilters
            ? 'w-16 text-left text-sm'
            : 'w-36 text-left text-sm',
        },
      },
      {
        accessorKey: 'type',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('type')}
          >
            <span className="truncate">Type</span>
            <Icon icon={getSortIcon('type')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.type}</div>
        ),
        meta: { className: 'w-20 text-left' },
      },
      {
        accessorKey: 'labName',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('labName')}
          >
            <span className="truncate">Lab name</span>
            <Icon icon={getSortIcon('labName')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.labName}</div>
        ),
        meta: { className: showFilters ? 'w-28 text-left' : 'w-44 text-left' },
      },
      {
        accessorKey: 'taskId',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('taskId')}
          >
            <span className="truncate">Task ID</span>
            <Icon icon={getSortIcon('taskId')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-green-600 font-medium truncate">
            {row.original.taskId.startsWith('#')
              ? row.original.taskId
              : `#${row.original.taskId}`}
          </div>
        ),
        meta: { className: showFilters ? 'w-20 text-left' : 'w-20 text-left' },
      },
      {
        accessorKey: 'labOrderNo',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('labOrderNo')}
          >
            <span className="truncate">Lab order No</span>
            <Icon icon={getSortIcon('labOrderNo')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.labOrderNo}</div>
        ),
        meta: { className: showFilters ? 'w-24 text-left' : 'w-24 text-left' },
      },
      {
        accessorKey: 'samples',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer justify-start text-sm truncate"
            onClick={() => handleSort('samples')}
          >
            <span className="truncate">Samples</span>
            <Icon icon={getSortIcon('samples')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-start font-medium truncate">
            {row.original.samples}
          </div>
        ),
        meta: {
          className: showFilters ? 'w-16 text-center' : 'w-20 text-center',
        },
      },
      {
        accessorKey: 'sentDate',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('sentDate')}
          >
            <span className="truncate">Sent</span>
            <Icon icon={getSortIcon('sentDate')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.sentDate}</div>
        ),
        meta: { className: showFilters ? 'w-16 text-left' : 'w-24 text-left' },
      },
      {
        accessorKey: 'receivedDate',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('receivedDate')}
          >
            <span className="truncate">Received</span>
            <Icon icon={getSortIcon('receivedDate')} size="sm" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.receivedDate}</div>
        ),
        meta: { className: showFilters ? 'w-20 text-left' : 'w-24 text-left' },
      },
      {
        accessorKey: 'status',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('status')}
          >
            <span className="truncate">Status</span>
            <Icon icon={getSortIcon('status')} size="sm" />
          </div>
        ),
        cell: ({ row }: { row: { original: LabTableItem } }) => (
          <div className="flex justify-start">
            <StatusIndicator
              className="!text-sm"
              iconClassName="text-lg"
              showText={!showFilters}
              showBackground={!showFilters}
              status={row.original.status}
              tooltip={
                row.original.status.charAt(0).toUpperCase() +
                row.original.status.slice(1).replace('_', ' ')
              }
            />
          </div>
        ),
        meta: { className: showFilters ? 'w-16 text-left' : 'w-32 text-left' },
      },
      ...(showFilters
        ? []
        : [
            {
              accessorKey: 'updatedAt',
              header: () => (
                <div
                  className="flex items-center gap-1 cursor-pointer text-sm truncate"
                  onClick={() => handleSort('updatedAt')}
                >
                  <span className="truncate">Updated at</span>
                  <Icon icon={getSortIcon('updatedAt')} size="sm" />
                </div>
              ),
              cell: ({ row }: { row: { original: LabTableItem } }) => (
                <div className="text-sm truncate">{row.original.updatedAt}</div>
              ),
              meta: { className: 'w-24 text-left' },
            },
          ]),
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const dropdownItems: DropdownActionItem[] = [
            {
              id: 'view-details',
              label: <span className="text-sm">View details</span>,
              icon: 'visibility',
              onClick: () =>
                onViewDetails(
                  row.original.taskId.startsWith('#')
                    ? row.original.taskId
                    : `#${row.original.taskId}`
                ),
            },

            {
              id: 'delete',
              label: <span className="text-sm">Delete</span>,
              icon: 'delete',
              onClick: () => handleDeleteSingle(row.original.labOrderNo),
              className: 'text-red-600',
            },
          ];

          return (
            <div className="flex justify-center">
              <DropdownActionsNoLib
                items={dropdownItems}
                placement="bottom-end"
              />
            </div>
          );
        },
        meta: { className: 'w-8 text-left' },
      },
    ],
    [
      selectedItems,
      allLabItems,
      onViewDetails,
      onSelectedItemsChange,
      showFilters,
      getSortIcon,
      handleSort,
    ]
  );

  const paginatedData = tableData;

  const handleDeleteSelected = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteSelected(selectedItems);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteSingle = (labOrderId: string) => {
    setLabOrderToDelete(labOrderId);
    setIsDeleteSingleDialogOpen(true);
  };

  const handleConfirmDeleteSingle = () => {
    const itemToDelete = labItems.find((item) => {
      const labOrderNo = `LAB-${
        item.id.split('-')[1]?.padStart(6, '0') || '000000'
      }`;
      return labOrderNo === labOrderToDelete;
    });

    if (itemToDelete) {
      onDelete(itemToDelete.id);
    }

    setIsDeleteSingleDialogOpen(false);
    setLabOrderToDelete('');
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-visible min-w-0 w-full max-w-full"
      >
        <div className="w-full min-w-0 max-w-full">
          <Table className="table-fixed rounded-xl overflow-visible relative">
            <TableHeader className="text-basic-gray bg-basic-white">
              <TableHead className="w-12 h-9 !text-center">
                <div className="flex items-center justify-center w-full h-full">
                  <SelectAllCheckbox
                    allItems={allLabItems}
                    selectedItems={selectedItems}
                    onSelectedItemsChange={onSelectedItemsChange}
                  />
                </div>
              </TableHead>

              {columns.slice(1).map((column, index) => {
                const meta = column.meta as { className?: string };
                return (
                  <TableHead
                    key={
                      column.id ||
                      (column as { accessorKey?: string }).accessorKey
                    }
                    className={`text-sm font-normal overflow-hidden h-9 truncate pr-2.5 ${
                      meta?.className || ''
                    }`}
                  >
                    {selectedItems.length > 0 ? (
                      index === 0 ? (
                        <div className="flex items-center text-xs font-normal justify-start w-full h-full">
                          <span className="truncate">
                            {selectedItems.length} of {allLabItems.length}{' '}
                            selected
                          </span>
                        </div>
                      ) : index === columns.slice(1).length - 1 ? (
                        <div className="flex items-center justify-end w-full h-full">
                          <Icon
                            icon="delete"
                            className="text-basic-black cursor-pointer text-lg hover:text-basic-red transition-colors flex-shrink-0"
                            onClick={handleDeleteSelected}
                          />
                        </div>
                      ) : index === columns.slice(1).length - 2 ? (
                        <div className="flex items-center justify-end w-full h-full">
                          <Icon
                            icon="download"
                            className="text-basic-black cursor-pointer text-lg hover:text-basic-green transition-colors flex-shrink-0"
                            onClick={() => onDownloadSelected(selectedItems)}
                          />
                        </div>
                      ) : (
                        <span>&nbsp;</span>
                      )
                    ) : typeof column.header === 'function' ? (
                      column.header({} as HeaderContext<LabTableItem, unknown>)
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableHeader>
            <TableBody className="relative">
              {loading ? (
                Array.from({ length: pageSize || 10 }).map((_, index) => (
                  <LabTableRowSkeleton
                    key={`skeleton-${index}`}
                    showFilters={showFilters}
                  />
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow className="h-[60px] bg-white">
                  <TableCell
                    colSpan={columns.length}
                    className="h-[60px] text-center text-basic-gray"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column, columnIndex) => {
                      const meta = column.meta as { className?: string };
                      return (
                        <TableCell
                          key={
                            column.id ||
                            (column as { accessorKey?: string }).accessorKey
                          }
                          className={` ${meta?.className || ''}`}
                          checkbox={columnIndex === 0}
                        >
                          {typeof column.cell === 'function'
                            ? column.cell({
                                row: { original: row },
                              } as CellContext<LabTableItem, unknown>)
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

      {totalPages > 1 && paginatedData.length > 0 && (
        <div className="bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            maxVisiblePages={7}
          />
        </div>
      )}

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete lab orders!"
        message={`Are you sure you want to delete ${selectedItems.length} selected lab order(s)? This action is irreversible and will permanently remove all selected lab orders from the system.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        size="lg"
        icon={
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon icon="delete" className="text-basic-red" />
          </div>
        }
      />

      <LabDeleteSingle
        isOpen={isDeleteSingleDialogOpen}
        onClose={() => setIsDeleteSingleDialogOpen(false)}
        onConfirm={handleConfirmDeleteSingle}
        labOrderId={labOrderToDelete}
      />
    </div>
  );
}
