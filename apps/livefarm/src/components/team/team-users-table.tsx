'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
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
  CustomSelect,
  SelectOption,
  Button,
  useTeamUserActivationApi,
  TEAM_ROLES,
} from '@@agrosphere/shared';
import { TeamPagination } from '@/components/team/team-pagination';
import { TeamUsersDeactivateMany } from '@/components/team/team-users-deactivate-many';
import { TeamUserDeactivateModal } from '@/components/team/team-user-deactivate-modal';
import { TeamUserActivateModal } from '@/components/team/team-user-activate-modal';
import { TeamUser } from '@@agrosphere/shared';
import { useTeamUsersTableSimple } from '@/hooks/team/use-team-users-table-simple';
import { useTeamPageSize } from '@/hooks/team/use-team-page-size';
import { TeamUsersTableRowSkeleton } from '@/components/skeletons/team/team-users-table-row-skeleton';

interface TeamUsersTableProps {
  searchTerm: string;
  currentPage: number;
  selectedUsers: string[];
  onSelectedUsersChange: (selectedUsers: string[]) => void;
  onRoleChange: (userId: string, newRole: TeamUser['userRole']) => void;
  onSort?: (field: keyof TeamUser, direction: 'asc' | 'desc' | 'none') => void;
  onEditUser?: (userId: string) => void;
  onDeactivateUser?: (userId: string) => void;
  onActivateUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onDeleteSelectedUsers?: () => void;
  onDeactivateSelectedUsers?: () => void;
  onResendInvite?: (userId: string) => void;
  onPageChange?: (page: number) => void;
  onPageReset?: () => void;
  refreshTrigger?: number;
}

export function TeamUsersTable({
  searchTerm,
  currentPage,
  selectedUsers,
  onSelectedUsersChange,
  onRoleChange,
  onSort,
  onEditUser,
  onDeactivateUser,
  onActivateUser,
  onDeleteUser,
  onDeleteSelectedUsers,
  onDeactivateSelectedUsers,
  onResendInvite,
  onPageChange,
  onPageReset,
  refreshTrigger,
}: TeamUsersTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { dynamicPageSize } = useTeamPageSize({
    tableContainerRef,
    estimatedRowHeight: 60,
    headerHeight: 36,
    paginationHeight: 79,
    minPageSize: 1,
  });

  const { users, pagination, showSkeleton, showNoResults, refreshUsers } =
    useTeamUsersTableSimple({
      searchTerm,
      currentPage,
      isActive: true,
      onPageReset,
      dynamicPageSize: dynamicPageSize || undefined,
    });

  const {
    activateUser,
    deactivateUser,
    loading: activationLoading,
  } = useTeamUserActivationApi();
  const [sortField, setSortField] = useState<keyof TeamUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>(
    'none'
  );
  const [localUsers, setLocalUsers] = useState<TeamUser[]>([]);
  const [deactivateManyDialog, setDeactivateManyDialog] = useState({
    isOpen: false,
    count: 0,
  });
  const [deactivateModal, setDeactivateModal] = useState({
    isOpen: false,
    userId: '',
    userName: '',
  });
  const [activateModal, setActivateModal] = useState({
    isOpen: false,
    userId: '',
    userName: '',
  });

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Handle refresh trigger
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refreshUsers();
    }
  }, [refreshTrigger, refreshUsers]);

  const handleActivateUser = useCallback(
    (userId: string) => {
      const user = localUsers.find((u) => u.id === userId);
      if (user) {
        setActivateModal({
          isOpen: true,
          userId: userId,
          userName: user.name,
        });
      }
    },
    [localUsers]
  );

  const handleConfirmActivateUser = useCallback(async () => {
    const { userId } = activateModal;
    if (!userId) return;

    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: 'Active' as const } : user
      )
    );

    onActivateUser?.(userId);

    try {
      const result = await activateUser(userId);
      if (!result?.success) {
        await refreshUsers();
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
      await refreshUsers();
    }

    setActivateModal({ isOpen: false, userId: '', userName: '' });
  }, [activateModal, activateUser, refreshUsers, onActivateUser]);

  const handleDeactivateUser = useCallback(
    (userId: string) => {
      const user = localUsers.find((u) => u.id === userId);
      if (user) {
        setDeactivateModal({
          isOpen: true,
          userId: userId,
          userName: user.name,
        });
      }
    },
    [localUsers]
  );

  const handleConfirmDeactivateUser = useCallback(async () => {
    const { userId } = deactivateModal;
    if (!userId) return;

    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: 'Inactive' as const } : user
      )
    );

    onDeactivateUser?.(userId);

    try {
      const result = await deactivateUser(userId);
      if (!result?.success) {
        await refreshUsers();
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      await refreshUsers();
    }

    setDeactivateModal({ isOpen: false, userId: '', userName: '' });
  }, [deactivateModal, deactivateUser, refreshUsers, onDeactivateUser]);

  const roleOptions: SelectOption[] = useMemo(() => TEAM_ROLES, []);

  const getNextSortDirection = useCallback(
    (field: keyof TeamUser) => {
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
    (field: keyof TeamUser) => {
      const newDirection = getNextSortDirection(field);
      setSortField(field);
      setSortDirection(newDirection);
      onSort?.(field, newDirection);
    },
    [onSort, getNextSortDirection]
  );

  const getSortIcon = useCallback(
    (field: keyof TeamUser) => {
      if (sortField !== field || sortDirection === 'none') return 'expand_all';
      return sortDirection === 'asc' ? 'expand_less' : 'expand_more';
    },
    [sortField, sortDirection]
  );

  const getStatusColor = (status: TeamUser['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-basic-green-opacity text-basic-green';
      case 'Inactive':
        return 'bg-basic-white text-basic-black';
      case 'Invited':
        return 'bg-basic-blue-opacity text-basic-blue';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<TeamUser>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <SelectAllCheckbox
            allItems={localUsers}
            selectedItems={selectedUsers}
            onSelectedItemsChange={onSelectedUsersChange}
            className="rounded text-center border-basic-gray-light"
            aria-label="Select all users"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedUsers.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectedUsersChange([...selectedUsers, row.original.id]);
              } else {
                onSelectedUsersChange(
                  selectedUsers.filter((userId) => userId !== row.original.id)
                );
              }
            }}
            className={`rounded border-basic-gray-light w-4 h-4 ${
              selectedUsers.includes(row.original.id)
                ? 'bg-basic-green-dark border-basic-green-dark'
                : 'bg-white border-basic-gray-light'
            }`}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        meta: { className: 'w-8 text-left' },
      },

      {
        accessorKey: 'name',
        header: () => (
          <button
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left "
            onClick={() => handleSort('name')}
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
              {getSortIcon('name')}
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
                    avatarSrc: row.original.avatar,
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
              <div className="text-xs text-gray-600 truncate">
                {row.original.department}
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
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left "
            onClick={() => handleSort('email')}
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
              {getSortIcon('email')}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm truncate">{row.original.email}</div>
        ),
        meta: { className: 'w-[20%] text-left' },
      },
      {
        accessorKey: 'userRole',
        header: () => (
          <button
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left"
            onClick={() => handleSort('userRole')}
            aria-label={`Sort by user role ${
              sortField === 'userRole' && sortDirection !== 'none'
                ? sortDirection === 'asc'
                  ? 'descending'
                  : 'ascending'
                : 'ascending'
            }`}
          >
            <span className="truncate">User role</span>
            <span
              className="material-symbols-outlined text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {getSortIcon('userRole')}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <CustomSelect
            options={roleOptions}
            value={row.original.userRole}
            onValueChange={(newRole) => {
              onRoleChange(row.original.id, newRole as TeamUser['userRole']);
            }}
            className="relative w-[80%]"
            triggerClassName={`border w-full truncate border-basic-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-50 py-2 h-7 `}
            popupClassName="bg-white rounded-lg"
            aria-label={`Change role for ${row.original.name}`}
          />
        ),
        meta: { className: 'w-[30%] text-left' },
      },
      {
        accessorKey: 'status',
        header: () => (
          <button
            className="flex items-center gap-1 cursor-pointer text-sm truncate w-full text-left"
            onClick={() => handleSort('status')}
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
              {getSortIcon('status')}
            </span>
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex justify-start">
            <span
              className={`inline-flex px-2 py-[1.5px] text-xs font-semibold rounded-[4px] ${getStatusColor(
                row.original.status
              )}`}
            >
              {row.original.status}
            </span>
          </div>
        ),
        meta: { className: 'w-[15%] text-left' },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const dropdownItems: DropdownActionItem[] = [
            {
              id: 'edit',
              label: <span className="text-sm">Edit</span>,
              icon: 'edit',
              onClick: () => onEditUser?.(row.original.id),
            },

            {
              id: 'activate',
              label: <span className="text-sm">Activate user</span>,
              icon: 'replay',
              onClick: () => handleActivateUser(row.original.id),
              className: row.original.status === 'Inactive' ? '' : 'hidden',
              isDisabled: activationLoading,
            },
            {
              id: 'deactivate',
              label: <span className="text-sm">Deactivate user</span>,
              icon: 'account_circle_off',
              onClick: () => handleDeactivateUser(row.original.id),
              className: row.original.status === 'Active' ? '' : 'hidden',
              isDisabled: activationLoading,
            },
            {
              id: 'delete',
              label: <span className="text-sm">Delete</span>,
              icon: 'delete',
              onClick: () => onDeleteUser?.(row.original.id),
              className: 'text-red-600',
            },
          ];

          if (row.original.status === 'Invited') {
            return (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto underline-none border border-basic-white text-basic-green"
                  onClick={() => onResendInvite?.(row.original.id)}
                  aria-label={`Resend invite to ${row.original.name}`}
                >
                  Resend invite
                </Button>
                <DropdownActionsNoLib
                  items={dropdownItems}
                  aria-label={`Actions for ${row.original.name}`}
                />
              </div>
            );
          }

          return (
            <div className="flex items-center justify-end">
              <DropdownActionsNoLib
                items={dropdownItems}
                aria-label={`Actions for ${row.original.name}`}
              />
            </div>
          );
        },
        meta: { className: 'w-[25%] text-left' },
      },
    ],
    [
      selectedUsers,
      localUsers,
      onSelectedUsersChange,
      onRoleChange,
      onEditUser,
      onDeleteUser,
      onResendInvite,
      getSortIcon,
      handleSort,
      roleOptions,
      sortField,
      sortDirection,
      activationLoading,
      handleActivateUser,
      handleDeactivateUser,
    ]
  );

  const sortedData = useMemo(() => {
    return localUsers;
  }, [localUsers]);

  const handleDeleteSelected = () => {
    onDeleteSelectedUsers?.();
  };

  const handleDeactivateSelected = () => {
    const activeSelectedUsers = selectedUsers.filter((userId) => {
      const user = localUsers.find((u) => u.id === userId);
      return user && user.status === 'Active';
    });

    if (activeSelectedUsers.length > 0) {
      setDeactivateManyDialog({
        isOpen: true,
        count: activeSelectedUsers.length,
      });
    }
  };

  const handleConfirmDeactivateMany = async () => {
    const activeSelectedUsers = selectedUsers.filter((userId) => {
      const user = localUsers.find((u) => u.id === userId);
      return user && user.status === 'Active';
    });

    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        activeSelectedUsers.includes(user.id)
          ? { ...user, status: 'Inactive' as const }
          : user
      )
    );

    onSelectedUsersChange([]);

    onDeactivateSelectedUsers?.();

    setDeactivateManyDialog({ isOpen: false, count: 0 });

    try {
      const deactivatePromises = activeSelectedUsers.map((userId) =>
        deactivateUser(userId)
      );
      await Promise.all(deactivatePromises);
    } catch (error) {
      console.error('Failed to deactivate selected users:', error);
      await refreshUsers();
    }
  };

  const handleCancelDeactivateMany = () => {
    setDeactivateManyDialog({ isOpen: false, count: 0 });
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
                    allItems={localUsers}
                    selectedItems={selectedUsers}
                    onSelectedItemsChange={onSelectedUsersChange}
                    aria-label="Select all users"
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
                    {selectedUsers.length > 0 ? (
                      index === 0 ? (
                        <div className="flex items-center text-xs font-normal justify-start w-full h-full">
                          <span className="truncate">
                            {selectedUsers.length} of {localUsers.length}{' '}
                            selected
                          </span>
                        </div>
                      ) : index === columns.slice(1).length - 1 ? (
                        <div className="flex items-center justify-end w-full h-full gap-2">
                          {(() => {
                            const activeSelectedUsers = selectedUsers.filter(
                              (userId) => {
                                const user = localUsers.find(
                                  (u) => u.id === userId
                                );
                                return user && user.status === 'Active';
                              }
                            );
                            const hasActiveUsers =
                              activeSelectedUsers.length > 0;

                            return (
                              <button
                                className={`material-symbols-outlined text-lg flex-shrink-0 transition-colors ${
                                  hasActiveUsers
                                    ? 'text-basic-black cursor-pointer hover:text-basic-blue'
                                    : 'text-gray-400 cursor-not-allowed'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={
                                  hasActiveUsers
                                    ? handleDeactivateSelected
                                    : undefined
                                }
                                disabled={activationLoading || !hasActiveUsers}
                                aria-label={
                                  hasActiveUsers
                                    ? `Deactivate ${activeSelectedUsers.length} active user(s)`
                                    : 'No active users selected to deactivate'
                                }
                                title={
                                  hasActiveUsers
                                    ? `Deactivate ${activeSelectedUsers.length} active user(s)`
                                    : 'No active users selected to deactivate'
                                }
                              >
                                account_circle_off
                              </button>
                            );
                          })()}
                          <div
                            className="w-px h-4 bg-gray-300"
                            aria-hidden="true"
                          ></div>
                          <button
                            className="material-symbols-outlined text-basic-black cursor-pointer text-lg hover:text-basic-red transition-colors flex-shrink-0"
                            onClick={handleDeleteSelected}
                            aria-label="Delete selected users"
                          >
                            delete
                          </button>
                        </div>
                      ) : (
                        <span>&nbsp;</span>
                      )
                    ) : typeof column.header === 'function' ? (
                      column.header({} as HeaderContext<TeamUser, unknown>)
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
                    <TeamUsersTableRowSkeleton
                      key={`skeleton-${index}`}
                      showColumns={{
                        email: true,
                        role: true,
                        status: true,
                        actions: true,
                      }}
                    />
                  )
                )
              ) : showNoResults ? (
                <TableRow className="h-[60px] bg-white">
                  <TableCell
                    colSpan={columns.length}
                    className="h-[60px] text-center text-basic-gray"
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
                              } as CellContext<TeamUser, unknown>)
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

      {!showSkeleton && pagination && pagination.meta && (
        <div className="py-3 bg-white rounded-lg flex justify-center items-center flex-shrink-0">
          <TeamPagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              pagination.meta.total / (dynamicPageSize || 10)
            )}
            onPageChange={onPageChange || (() => undefined)}
          />
        </div>
      )}

      <TeamUsersDeactivateMany
        isOpen={deactivateManyDialog.isOpen}
        onClose={handleCancelDeactivateMany}
        onConfirm={handleConfirmDeactivateMany}
        count={deactivateManyDialog.count}
      />

      <TeamUserDeactivateModal
        isOpen={deactivateModal.isOpen}
        onClose={() =>
          setDeactivateModal({ isOpen: false, userId: '', userName: '' })
        }
        onConfirm={handleConfirmDeactivateUser}
        userName={deactivateModal.userName}
        loading={activationLoading}
      />

      <TeamUserActivateModal
        isOpen={activateModal.isOpen}
        onClose={() =>
          setActivateModal({ isOpen: false, userId: '', userName: '' })
        }
        onConfirm={handleConfirmActivateUser}
        userName={activateModal.userName}
        loading={activationLoading}
      />
    </div>
  );
}
