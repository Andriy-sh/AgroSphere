'use client';
import { useState, useCallback, useMemo } from 'react';
import { mockTeamUsers, TeamUser } from '../../mock/mock-team-users';

export const useTeamUsers = () => {
  const [fullList, setFullList] = useState<TeamUser[]>(mockTeamUsers);
  const [filteredList, setFilteredList] = useState<TeamUser[]>(mockTeamUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof TeamUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>(
    'none'
  );
  const [dynamicPageSize, setDynamicPageSize] = useState(9);

  const sortedUsers = useMemo(() => {
    if (sortDirection === 'none' || !sortField) {
      return filteredList;
    }

    return [...filteredList].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

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
    [fullList]
  );

  const handleSort = useCallback(
    (field: keyof TeamUser, direction?: 'asc' | 'desc' | 'none') => {
      if (direction) {
        if (direction === 'none') {
          setSortField(null);
          setSortDirection('none');
        } else {
          setSortField(field);
          setSortDirection(direction);
        }
      } else {
        if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      }
      setCurrentPage(1);
    },
    [sortField, sortDirection]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSelectedUsersChange = useCallback(
    (newSelectedUsers: string[]) => {
      setSelectedUsers(newSelectedUsers);
    },
    []
  );

  const handleInviteUsers = useCallback(
    (invitedUsers: Array<{ email: string; userRole: string }>) => {
      const newUsers: TeamUser[] = invitedUsers.map((user, index) => ({
        id: `invited-${Date.now()}-${index}`,
        name: 'Invited User',
        email: user.email,
        department: 'Pending',
        userRole: user.userRole as TeamUser['userRole'],
        status: 'Invited' as const,
        avatar: '',
        initials: 'IU',
        joinDate: new Date().toISOString(),
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
  }, [fullList]);

  const setPageSize = useCallback((size: number) => {
    setDynamicPageSize(size);
  }, []);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    fullList,
    filteredList,
    selectedUsers,
    currentPage: safeCurrentPage,
    sortField,
    sortDirection,
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
