'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { mockTeamUsers, TeamUser } from '../../mock/mock-team-users';

export const useTeamUsersWithUrl = () => {
  const [fullList, setFullList] = useState<TeamUser[]>(mockTeamUsers);
  const [filteredList, setFilteredList] = useState<TeamUser[]>(mockTeamUsers);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useQueryState(
    'usersPage',
    parseAsInteger.withDefault(1)
  );

  const [sortField, setSortField] = useQueryState(
    'usersSortField',
    parseAsString.withDefault('')
  );

  const [sortDirection, setSortDirection] = useQueryState(
    'usersSortDirection',
    parseAsString.withDefault('none')
  );

  const [dynamicPageSize, setDynamicPageSize] = useState(9);

  const sortedUsers = useMemo(() => {
    if (sortDirection === 'none' || !sortField) {
      return filteredList;
    }

    return [...filteredList].sort((a, b) => {
      const aValue = a[sortField as keyof TeamUser];
      const bValue = b[sortField as keyof TeamUser];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredList, sortField, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * dynamicPageSize;
    return sortedUsers.slice(startIndex, startIndex + dynamicPageSize);
  }, [sortedUsers, currentPage, dynamicPageSize]);

  const totalPages = Math.ceil(sortedUsers.length / dynamicPageSize);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      if (!searchValue.trim()) {
        setFilteredList(fullList);
        return;
      }

      const searchLower = searchValue.toLowerCase();
      const filtered = fullList.filter((user) => {
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.department &&
            user.department.toLowerCase().includes(searchLower)) ||
          (user.location &&
            user.location.toLowerCase().includes(searchLower)) ||
          user.userRole.toLowerCase().includes(searchLower) ||
          user.status.toLowerCase().includes(searchLower)
        );
      });

      setFilteredList(filtered);
      setCurrentPage(1);
    },
    [fullList, setCurrentPage]
  );

  const handleSort = useCallback(
    (field: keyof TeamUser, direction?: 'asc' | 'desc' | 'none') => {
      if (direction) {
        if (direction === 'none') {
          setSortField('');
          setSortDirection('none');
        } else {
          setSortField(field);
          setSortDirection(direction);
        }
      } else {
        if (sortField === field) {
          const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          setSortDirection(newDirection);
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      }
      setCurrentPage(1);
    },
    [sortField, sortDirection, setSortField, setSortDirection, setCurrentPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      return prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
    });
  }, []);

  const handleSelectedUsersChange = useCallback(
    (newSelectedUsers: string[]) => {
      setSelectedUsers(newSelectedUsers);
    },
    []
  );

  const handleInviteUsers = useCallback(
    (
      invitedUsers: Array<{
        id: string;
        email: string;
        userRole: string;
        name?: string;
        department?: string;
        status?: string;
        avatar?: string;
        initials?: string;
        joinDate?: string;
      }>
    ) => {
      const newUsers: TeamUser[] = invitedUsers.map((user) => ({
        id: user.id,
        name: user.name || 'Invited User',
        email: user.email,
        department: user.department || 'Pending',
        userRole: user.userRole as TeamUser['userRole'],
        status: (user.status as TeamUser['status']) || 'Invited',
        avatar: user.avatar || '',
        initials: user.initials || 'IU',
        joinDate: user.joinDate || new Date().toISOString(),
      }));

      setFullList((prev) => [...prev, ...newUsers]);
      setFilteredList((prev) => [...prev, ...newUsers]);
    },
    []
  );

  const handleRoleChange = useCallback(
    (userId: string, newRole: TeamUser['userRole']) => {
      setFullList((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, userRole: newRole } : user
        )
      );
      setFilteredList((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, userRole: newRole } : user
        )
      );
    },
    []
  );

  const handleSaveUser = useCallback(
    (userId: string, updatedUser: Partial<TeamUser>) => {
      setFullList((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );
      setFilteredList((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );
    },
    []
  );

  const handleDeactivateUser = useCallback((userId: string) => {
    setFullList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: 'Inactive' as const } : user
      )
    );
    setFilteredList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: 'Inactive' as const } : user
      )
    );
  }, []);

  const handleActivateUser = useCallback((userId: string) => {
    setFullList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: 'Active' as const } : user
      )
    );
    setFilteredList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: 'Active' as const } : user
      )
    );
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
    setFullList((prev) => prev.filter((user) => user.id !== userId));
    setFilteredList((prev) => prev.filter((user) => user.id !== userId));
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  }, []);

  const handleDeleteSelectedUsers = useCallback(() => {
    setFullList((prev) =>
      prev.filter((user) => !selectedUsers.includes(user.id))
    );
    setFilteredList((prev) =>
      prev.filter((user) => !selectedUsers.includes(user.id))
    );
    setSelectedUsers([]);
  }, [selectedUsers]);

  const handleDeactivateSelectedUsers = useCallback((userIds: string[]) => {
    setFullList((prev) =>
      prev.map((user) =>
        userIds.includes(user.id)
          ? { ...user, status: 'Inactive' as const }
          : user
      )
    );
    setFilteredList((prev) =>
      prev.map((user) =>
        userIds.includes(user.id)
          ? { ...user, status: 'Inactive' as const }
          : user
      )
    );
    setSelectedUsers([]);
  }, []);

  const handleResetSearch = useCallback(() => {
    setFilteredList(fullList);
    setCurrentPage(1);
  }, [fullList, setCurrentPage]);

  const setPageSize = useCallback(
    (size: number) => {
      setDynamicPageSize(size);
    },
    [setDynamicPageSize]
  );

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  return {
    fullList,
    filteredList,
    selectedUsers,
    currentPage: safeCurrentPage,
    sortField: sortField || null,
    sortDirection: (sortDirection as 'asc' | 'desc' | 'none') || 'none',
    dynamicPageSize,
    sortedUsers,
    paginatedUsers,
    totalPages,

    handleSearchChange,
    handleSort,
    handlePageChange,
    handleSelectUser,
    handleSelectedUsersChange,
    handleInviteUsers,
    handleRoleChange,
    handleSaveUser,
    handleDeactivateUser,
    handleActivateUser,
    handleDeleteUser,
    handleDeleteSelectedUsers,
    handleDeactivateSelectedUsers,
    handleResetSearch,
    setPageSize,
    resetToFirstPage,
  };
};
