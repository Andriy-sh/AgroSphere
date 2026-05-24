'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { ColumnDef, CellContext, HeaderContext } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  SelectAllCheckbox,
  Avatar,
  TagItem,
  DropdownActionsNoLib,
  DropdownActionItem,
  AssignUser,
  useUpdateClient,
  useDeleteClient,
  Client,
  Icon,
  NoResultsFound,
} from '@@agrosphere/shared';
import { Tooltip } from '@base-ui-components/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClientsProductDialog } from './clients-product-dialog';
import { ClientsDeleteDialog } from './clients-delete-dialog';
import { ClientsDeleteMultipleDialog } from './clients-delete-multiple-dialog';
import { Pagination } from '@@agrosphere/shared';
import { useClientsParams } from '@/utils/clients/url-params';
import { ClientFilters } from './clients-filters';
import { useTableClients } from '@/hooks/clients';
import { ClientsTableRowSkeleton } from '@/components/skeletons';

interface ClientsTableProps {
  userOptions?: {
    value: string;
    label: string;
    initials?: string;
    avatar?: string;
  }[];
  filters: ClientFilters;
  searchTerm: string;
  currentPage: number;
  isActive?: boolean;
  onPageReset?: () => void;
  onOpenMenuIdChange?: (id: string | null) => void;
  onEditingIdChange?: (id: string | null) => void;
  onEditingDataChange?: (data: {
    name: string;
    address: string | null;
    phone: string | null;
  }) => void;
  refreshTrigger?: number;
  enableDynamicPageSize?: boolean;
  mapSize?: number;
  onClientClick?: (clientId: string) => void;
  selectedFarmId?: string | null;
  selectedClientId?: string | null;
}

function getTextWidth(text: string, font: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    return context.measureText(text).width;
  }
  return 0;
}

const DynamicTagsCell = ({ tags }: { tags: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      let usedWidth = 0;
      const tempVisible: string[] = [];
      let remainingTags = tags.length;

      const plusWidth =
        tags.length > 0
          ? getTextWidth(`+${tags.length}`, '12px Inter') + 16
          : 0;

      tags.forEach((tag, index) => {
        const tagWidth = getTextWidth(tag, '12px Inter') + 16;
        const willFit =
          usedWidth + tagWidth + (remainingTags > 1 ? plusWidth : 0) <=
          containerWidth;

        if (willFit) {
          tempVisible.push(tag);
          usedWidth += tagWidth + 4;
          remainingTags--;
        }
      });

      setVisibleTags(tempVisible);
      setHiddenCount(tags.length - tempVisible.length);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [tags]);

  if (!tags || tags.length === 0) {
    return <span></span>;
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1 overflow-hidden w-full"
    >
      {visibleTags.map((tag, i) => (
        <TagItem key={i} className="text-xs whitespace-nowrap">
          {tag}
        </TagItem>
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs text-basic-gray bg-gray-100 px-2 py-1 rounded-md font-medium flex-shrink-0 whitespace-nowrap">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

const DynamicNameCell = ({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayName, setDisplayName] = useState(name);

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const avatarWidth = 28;
      const gap = 8;
      const availableWidth = containerWidth - avatarWidth - gap;

      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ');

      const fullNameWidth = getTextWidth(name, '14px Inter');
      if (fullNameWidth <= availableWidth) {
        setDisplayName(name);
        return;
      }

      const shortName = lastName ? `${firstName} ${lastName[0]}.` : firstName;
      const shortNameWidth = getTextWidth(shortName, '14px Inter');
      if (shortNameWidth <= availableWidth) {
        setDisplayName(shortName);
        return;
      }

      setDisplayName(firstName);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [name]);

  return (
    <div ref={containerRef} className="flex items-center gap-2 min-w-0">
      <Avatar
        row={{
          original: {
            client: {
              name: name,
              surname: '',
              avatarSrc: avatar,
            },
          },
        }}
        rounded="md"
        className="flex-shrink-0"
        avatarSrc="w-7 h-7"
        tooltipText={name}
      />
      <span className="truncate">{displayName}</span>
    </div>
  );
};

export function ClientsTable({
  userOptions,
  filters,
  searchTerm,
  currentPage,
  isActive = true,
  onPageReset,
  onOpenMenuIdChange,
  onEditingIdChange,
  onEditingDataChange,
  refreshTrigger,
  enableDynamicPageSize = false,
  mapSize,
  onClientClick,
  selectedFarmId,
  selectedClientId,
}: ClientsTableProps) {
  const router = useRouter();
  const { currentParams, updateParams } = useClientsParams();

  // Use currentPage from params instead of prop to ensure it updates
  const actualCurrentPage = currentParams.page || 1;

  const {
    clients,
    total,
    error,
    showSkeleton,
    showNoResults,
    refreshClients,
    dynamicPageSize,
    tableContainerRef,
  } = useTableClients({
    filters,
    searchTerm,
    currentPage: actualCurrentPage,
    isActive,
    onPageReset,
  });

  const { updateClient } = useUpdateClient();
  const { deleteClient } = useDeleteClient();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] =
    useState(false);
  const [clientToDelete, setClientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [tableWidth, setTableWidth] = useState(0);

  const sortField = (currentParams.sortField as keyof Client) || null;
  const sortDirection = currentParams.sortDirection || 'none';

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      if (refreshClients) {
        refreshClients();
      }
    }
  }, [refreshTrigger, refreshClients]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  const defaultUserOptions = useMemo(
    () =>
      Array.from(
        new Set(
          clients.map((c: Client) => c.lead_consultant?.name).filter(Boolean)
        )
      ).map((name) => ({
        value: name as string,
        label: name as string,
        initials: (name as string).charAt(0),
        avatar: '',
      })),
    [clients]
  );

  const assigneeOptions = useMemo(
    () =>
      userOptions && userOptions.length > 0
        ? [{ value: '', label: '-- Select assignee --' }, ...userOptions]
        : [
            { value: '', label: '-- Select assignee --' },
            ...defaultUserOptions,
          ],
    [userOptions, defaultUserOptions]
  );

  const filteredClients = clients;
  const paginatedClients = clients;

  const safeCurrentPage = Math.max(1, actualCurrentPage);
  const safePageSize = Math.max(1, dynamicPageSize || 10);
  const totalPages = Math.ceil(total / safePageSize);

  useEffect(() => {
    const updateTableWidth = () => {
      if (tableContainerRef.current) {
        setTableWidth(tableContainerRef.current.offsetWidth);
      }
    };

    updateTableWidth();
    window.addEventListener('resize', updateTableWidth);

    let resizeObserver: ResizeObserver | null = null;
    if (tableContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateTableWidth();
      });
      resizeObserver.observe(tableContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateTableWidth);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [tableContainerRef]);

  useEffect(() => {
    const updateTableWidth = () => {
      if (tableContainerRef.current) {
        setTableWidth(tableContainerRef.current.offsetWidth);
      }
    };

    const timeoutId = setTimeout(updateTableWidth, 100);

    return () => clearTimeout(timeoutId);
  }, [tableContainerRef]);

  const shouldShowColumn = useCallback(
    (columnKey: string) => {
      if (mapSize && mapSize > 0) {
        if (columnKey === 'herdNo') return false;

        if (tableWidth >= 1200) return true;
        if (tableWidth >= 900) return !['tags'].includes(columnKey);
        if (tableWidth >= 600) return !['tags'].includes(columnKey);
        return !['phone', 'tags'].includes(columnKey);
      }

      return true;
    },
    [tableWidth, mapSize]
  );

  const getNextSortDirection = useCallback(
    (field: keyof Client) => {
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
    (field: keyof Client) => {
      const newDirection = getNextSortDirection(field);
      updateParams({
        sortField: field,
        sortDirection: newDirection,
      });
    },
    [getNextSortDirection, updateParams]
  );

  const getSortIcon = useCallback(
    (field: keyof Client) => {
      if (sortField !== field || sortDirection === 'none') return 'expand_all';
      return sortDirection === 'asc' ? 'expand_less' : 'expand_more';
    },
    [sortField, sortDirection]
  );

  const handleDeleteSelected = async () => {
    setIsDeleteMultipleDialogOpen(true);
  };

  const handleConfirmDeleteSelected = async () => {
    const selectedClientIds = selectedRows.map((rowId) => {
      const [id] = rowId.split('_');
      return id;
    });

    try {
      await Promise.all(
        selectedClientIds.map((clientId) => deleteClient(clientId))
      );

      setIsDeleteMultipleDialogOpen(false);
      setSelectedRows([]);
      if (refreshClients) {
        await refreshClients();
      }
    } catch (error) {
      console.error('Error deleting clients:', error);
    }
  };

  const handleProductAdded = useCallback(async () => {
    return;
  }, []);

  const handleDeleteClient = useCallback((client: Client) => {
    setClientToDelete({ id: client.id, name: client.full_name });
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDeleteClient = useCallback(async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete.id);
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
      if (refreshClients) {
        await refreshClients();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  }, [clientToDelete, deleteClient, refreshClients]);

  const columns: ColumnDef<Client>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <SelectAllCheckbox
            allItems={filteredClients}
            selectedItems={selectedRows}
            onSelectedItemsChange={setSelectedRows}
            getIdFromItem={(client) => client.id + '_' + client.full_name}
            className="rounded text-center border-basic-gray-light"
          />
        ),
        cell: ({ row }) => {
          const rowId = row.original.id + '_' + row.original.full_name;
          return (
            <div className="flex items-center justify-center w-full h-full">
              <Checkbox
                checked={selectedRows.includes(rowId)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRows([...selectedRows, rowId]);
                  } else {
                    setSelectedRows(selectedRows.filter((id) => id !== rowId));
                  }
                }}
                className={`rounded border-basic-gray-light w-4 h-4 ${
                  selectedRows.includes(rowId)
                    ? 'bg-basic-green-dark border-basic-green-dark'
                    : 'bg-white border-basic-gray-light'
                }`}
              />
            </div>
          );
        },
        meta: { className: '!w-9 text-center min-w-0' },
      },
      {
        accessorKey: 'id',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('account_number')}
          >
            <span className="truncate">No</span>
            <Icon size="sm" icon={getSortIcon('id')} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-sm truncate">
            {row.original.account_number || '---'}
          </div>
        ),
        meta: { className: 'w-16 text-left' },
      },
      {
        accessorKey: 'full_name',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('full_name')}
          >
            <span className="truncate">Name</span>
            <Icon size="sm" icon={getSortIcon('name')} />
          </div>
        ),
        cell: ({ row }) => (
          <DynamicNameCell name={row.original.full_name} avatar="" />
        ),
        meta: { className: 'w-32 text-left min-w-0 truncate' },
      },
      {
        accessorKey: 'full_address',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('full_address')}
          >
            <span className="truncate">Address</span>
            <Icon size="sm" icon={getSortIcon('address')} />
          </div>
        ),
        cell: ({ row }) => {
          const addressParts = [
            row.original.address_line_1,
            row.original.address_line_2,
            row.original.eircode,
          ].filter(Boolean);

          return (
            <div className="text-sm truncate">
              {addressParts.length > 0 ? addressParts.join(', ') : '---'}
            </div>
          );
        },
        meta: { className: 'w-36 text-left' },
      },
      ...(shouldShowColumn('phone')
        ? [
            {
              accessorKey: 'mobile',
              header: () => (
                <div
                  className="flex items-center gap-1 cursor-pointer text-sm truncate"
                  onClick={() => handleSort('mobile')}
                >
                  <span className="truncate">Phone number</span>
                  <Icon size="sm" icon={getSortIcon('phone')} />
                </div>
              ),
              cell: ({ row }: { row: { original: Client } }) => (
                <div className="text-sm text-green-600 font-medium truncate">
                  {row.original.mobile || '---'}
                </div>
              ),
              meta: { className: 'w-24 text-left min-w-0 truncate' },
            },
          ]
        : []),
      ...(shouldShowColumn('herdNo')
        ? [
            {
              accessorKey: 'herd_no',
              header: () => (
                <div
                  className="flex items-center gap-1 cursor-pointer text-sm truncate"
                  onClick={() => handleSort('herd_no')}
                >
                  <span className="truncate">Herd No</span>
                  <Icon size="sm" icon={getSortIcon('herd_no')} />
                </div>
              ),
              cell: ({ row }: { row: { original: Client } }) => (
                <div className="text-sm truncate">
                  {row.original.herd_no || '---'}
                </div>
              ),
              meta: { className: 'w-16 text-left min-w-0 truncate' },
            },
          ]
        : []),
      {
        accessorKey: 'lead_consultant',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('lead_consultant')}
          >
            <span className="truncate">Lead.</span>
            <Icon size="sm" icon={getSortIcon('asgn')} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.lead_consultant ? (
              <div className="flex justify-start">
                <Avatar
                  row={{
                    original: {
                      client: {
                        name: row.original.lead_consultant.name,
                        surname: '',
                        avatarSrc: '',
                      },
                    },
                  }}
                  size="sm"
                  rounded="sm"
                  className="w-7 h-7"
                  tooltipText={row.original.lead_consultant.name}
                />
              </div>
            ) : (
              <div className="flex justify-start">
                <AssignUser
                  userOptions={assigneeOptions.filter(
                    (opt) => opt.value !== ''
                  )}
                  onAssign={async (assigneeId, assigneeLabel) => {
                    try {
                      await updateClient(row.original.id, {
                        lead_consultant: assigneeId
                          ? {
                              id: assigneeId,
                              name: assigneeLabel || '',
                              email: '',
                            }
                          : null,
                      });
                      if (refreshClients) {
                        await refreshClients();
                      }
                    } catch (error) {
                      console.error('Error updating client assignee:', error);
                    }
                  }}
                  dialogTitle="Assign a consultant"
                  label="Lead consultant"
                  buttonText="Add"
                  placeholder="Select lead consultant"
                  className="w-8 h-8"
                />
              </div>
            )}
          </div>
        ),
        meta: { className: 'w-16 text-center min-w-0 truncate' },
      },
      {
        accessorKey: 'tasks',
        header: () => (
          <div
            className="flex items-center gap-1 cursor-pointer text-sm truncate"
            onClick={() => handleSort('tasks')}
          >
            <span className="truncate">Tasks</span>
            <Icon size="sm" icon={getSortIcon('tasks')} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.tasks || '0'}</div>
        ),
        meta: { className: 'w-16 text-left min-w-0 truncate' },
      },
      // {
      //   accessorKey: 'product',
      //   header: () => (
      //     <div
      //       className="flex items-center gap-1 cursor-pointer text-sm truncate"
      //       onClick={() => handleSort('product')}
      //     >
      //       <span className="truncate">Product</span>
      //       <span className="material-symbols-outlined text-sm flex-shrink-0">
      //         {getSortIcon('product')}
      //       </span>
      //     </div>
      //   ),
      //   cell: ({ row }) => {
      //     const hasProduct =
      //       row.original.product && !row.original.product.startsWith('Add');

      //     return (
      //       <div className="text-sm truncate flex items-start justify-start w-full">
      //         {hasProduct ? (
      //           <TagItem className="text-sm">{row.original.product}</TagItem>
      //         ) : (
      //           <Button
      //             variant="ghost"
      //             size="sm"
      //             className="text-basic-green font-medium m-0 !p-0 flex items-center justify-start w-full h-8  transition-colors"
      //             onClick={() => {
      //               setSelectedClientId(row.original.id);
      //               setIsProductDialogOpen(true);
      //             }}
      //           >
      //             <PlusIcon className="w-4 h-4 mr-1 bg-basic-green text-white rounded-full" />
      //             Add product
      //           </Button>
      //         )}
      //       </div>
      //     );
      //   },
      //   meta: { className: 'w-32 text-left' },
      // },
      ...(shouldShowColumn('tags')
        ? [
            {
              accessorKey: 'tags',
              header: () => (
                <div
                  className="flex items-center gap-1 cursor-pointer text-sm truncate"
                  onClick={() => handleSort('tags')}
                >
                  <span className="truncate">Tags</span>
                  <Icon size="sm" icon={getSortIcon('tags')} />
                </div>
              ),
              cell: ({ row }: { row: { original: Client } }) => {
                const tags = row.original.tags || [];
                return <DynamicTagsCell tags={tags} />;
              },
              meta: { className: 'w-32 text-left min-w-0 truncate' },
            },
          ]
        : []),
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const dropdownItems: DropdownActionItem[] = [
            {
              id: 'view',
              label: 'View details',
              icon: 'visibility',
              onClick: () => {
                router.push(`/clients/${row.original.id}`);
                onOpenMenuIdChange?.(null);
              },
            },
            {
              id: 'message',
              label: 'Message client',
              icon: 'chat',
              onClick: () => {
                onOpenMenuIdChange?.(null);
              },
            },
            {
              id: 'add-task',
              label: 'Add a task',
              icon: 'note_add',
              onClick: () => {
                const params = new URLSearchParams({
                  clientId: row.original.id,
                  clientName: row.original.full_name ?? '',
                });
                router.push(`/tasks/create-task?${params.toString()}`);
                onOpenMenuIdChange?.(null);
              },
            },
            {
              id: 'delete',
              label: 'Delete',

              icon: 'delete',
              onClick: () => {
                handleDeleteClient(row.original);
                onOpenMenuIdChange?.(null);
              },
              className: 'text-basic-red',
            },
          ];

          return (
            <div className="flex items-center h-full justify-end">
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Link
                    href={`${
                      process.env.NEXT_PUBLIC_CLIENT_BASE_URL ||
                      'https://localhost:3000'
                    }/login?clientId=${row.original.id}&autoLogin=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded transition"
                  >
                    <Icon icon="open_in_new" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={5}>
                    <Tooltip.Popup className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg relative">
                      Go to Client View
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
              <div className="w-px h-6 bg-basic-white mx-1 flex-shrink-0" />
              <DropdownActionsNoLib
                items={dropdownItems}
                key={row.original.id}
                placement="bottom-end"
              />
            </div>
          );
        },
        meta: { className: 'w-12 text-left min-w-0 truncate' },
      },
    ],
    [
      selectedRows,
      filteredClients,
      assigneeOptions,
      onOpenMenuIdChange,
      router,
      getSortIcon,
      handleSort,
      handleDeleteClient,
      updateClient,
      refreshClients,
      shouldShowColumn,
    ]
  );

  const sortedData = [...paginatedClients].sort((a, b) => {
    if (!sortField || sortDirection === 'none') return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <div>Error loading clients: {error}</div>
      </div>
    );
  }

  const shouldHighlightClient = (client: Client) => {
    if (selectedClientId === client.id) {
      return true;
    }

    if (selectedFarmId && client.farms && client.farms > 0) {
      return true;
    }

    return false;
  };

  return (
    <Tooltip.Provider>
      <div className="flex flex-col h-full w-full max-w-full  rounded-b-xl">
        <div
          ref={tableContainerRef}
          className="flex-1 overflow-visible min-w-0 w-full max-w-full"
        >
          <div className="w-full min-w-0 max-w-full ">
            <Table className="table-fixed rounded-xl overflow-visible relative">
              <TableHeader className="text-basic-gray bg-basic-white">
                <TableHead className="w-12 h-9 !text-center">
                  <div className="flex items-center justify-center w-full h-full">
                    <SelectAllCheckbox
                      allItems={filteredClients}
                      selectedItems={selectedRows}
                      onSelectedItemsChange={setSelectedRows}
                      getIdFromItem={(client) =>
                        client.id + '_' + client.full_name
                      }
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
                      className={`text-sm font-normal overflow-hidden h-9 truncate pr-2.5 min-w-0 ${
                        meta?.className || ''
                      } `}
                    >
                      {selectedRows.length > 0 ? (
                        index === 0 ? (
                          <div className="flex items-center text-xs font-normal justify-center w-full h-full">
                            <span className="truncate">
                              {selectedRows.length} of {filteredClients.length}{' '}
                              selected
                            </span>
                          </div>
                        ) : index === columns.slice(1).length - 1 ? (
                          <div className="flex items-center justify-end w-full h-full">
                            <Icon
                              icon="delete"
                              className="text-basic-black cursor-pointer hover:text-basic-red transition-colors flex-shrink-0"
                              onClick={handleDeleteSelected}
                            />
                          </div>
                        ) : (
                          <span>&nbsp;</span>
                        )
                      ) : typeof column.header === 'function' ? (
                        column.header({} as HeaderContext<Client, unknown>)
                      ) : (
                        column.header
                      )}
                    </TableHead>
                  );
                })}
              </TableHeader>
              <TableBody className="relative">
                {showSkeleton ? (
                  Array.from({ length: dynamicPageSize || 10 }).map(
                    (_, index) => (
                      <ClientsTableRowSkeleton
                        key={`skeleton-${index}`}
                        showColumns={{
                          phone: shouldShowColumn('phone'),
                          herdNo: shouldShowColumn('herdNo'),
                          tags: shouldShowColumn('tags'),
                        }}
                      />
                    )
                  )
                ) : showNoResults ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                      <NoResultsFound
                        variant="clients"
                        title={
                          searchTerm ? 'No clients found' : 'No clients yet'
                        }
                        description={
                          searchTerm
                            ? 'Try adjusting your search terms or filters to find clients'
                            : 'Add your first client to get started'
                        }
                        hasSearchTerm={!!searchTerm}
                        className="h-full flex items-center justify-center"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((row, rowIndex) => {
                    const isHighlighted = shouldHighlightClient(row);
                    return (
                      <TableRow
                        key={`${row.id}-${rowIndex}`}
                        className={`h-[60px] border-b border-basic-white transition-colors relative cursor-pointer ${
                          isHighlighted
                            ? 'bg-gray-100'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => onClientClick?.(row.id)}
                      >
                        {columns.map((column, columnIndex) => {
                          const meta = column.meta as { className?: string };
                          return (
                            <TableCell
                              key={
                                column.id ||
                                (column as { accessorKey?: string }).accessorKey
                              }
                              className={`h-[60px] overflow-visible transition-colors min-w-0 ${
                                columnIndex === 0 ? 'text-center' : ''
                              } ${meta?.className || ''}`}
                              checkbox={columnIndex === 0}
                            >
                              {typeof column.cell === 'function'
                                ? column.cell({
                                    row: { original: row },
                                    getValue: () => {
                                      const accessorKey = (
                                        column as { accessorKey?: string }
                                      ).accessorKey;
                                      return accessorKey
                                        ? row[accessorKey as keyof Client]
                                        : undefined;
                                    },
                                    cell: {
                                      getValue: () => {
                                        const accessorKey = (
                                          column as { accessorKey?: string }
                                        ).accessorKey;
                                        return accessorKey
                                          ? row[accessorKey as keyof Client]
                                          : undefined;
                                      },
                                    },
                                    column: {
                                      id:
                                        column.id ||
                                        (column as { accessorKey?: string })
                                          .accessorKey,
                                    },
                                    renderValue: () => {
                                      const accessorKey = (
                                        column as { accessorKey?: string }
                                      ).accessorKey;
                                      return accessorKey
                                        ? row[accessorKey as keyof Client]
                                        : undefined;
                                    },
                                    table: {} as unknown,
                                  } as CellContext<Client, unknown>)
                                : column.cell}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!showSkeleton && (
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={7}
          />
        )}
      </div>

      <ClientsProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => {
          setIsProductDialogOpen(false);
        }}
        clientId={selectedClientId || undefined}
        onProductAdded={handleProductAdded}
      />

      <ClientsDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setClientToDelete(null);
        }}
        onConfirm={handleConfirmDeleteClient}
        clientName={clientToDelete?.name || ''}
      />

      <ClientsDeleteMultipleDialog
        isOpen={isDeleteMultipleDialogOpen}
        onClose={() => setIsDeleteMultipleDialogOpen(false)}
        onConfirm={handleConfirmDeleteSelected}
        count={selectedRows.length}
      />
    </Tooltip.Provider>
  );
}
