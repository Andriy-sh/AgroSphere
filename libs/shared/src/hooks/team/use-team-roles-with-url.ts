'use client';
import { useState, useCallback } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { mockRoles, Role } from '../../mock/mock-roles';
import { mockAvailableUsers } from '../../mock/mock-available-users';

export const useTeamRolesWithUrl = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(mockRoles);

  const [roleSearchTerm, setRoleSearchTerm] = useQueryState(
    'rolesSearch',
    parseAsString.withDefault('')
  );

  const [selectedRoleId, setSelectedRoleId] = useQueryState(
    'selectedRole',
    parseAsString.withDefault('')
  );

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [assignUsersDialogOpen, setAssignUsersDialogOpen] = useState(false);
  const [assigningToRole, setAssigningToRole] = useState<Role | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const selectedRole = selectedRoleId
    ? roles.find((role) => role.id === selectedRoleId) || null
    : null;

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      setRoleSearchTerm(searchValue);

      if (!searchValue.trim()) {
        setFilteredRoles(roles);
        return;
      }

      const searchLower = searchValue.toLowerCase();
      const filtered = roles.filter((role) => {
        return (
          role.title.toLowerCase().includes(searchLower) ||
          role.description.toLowerCase().includes(searchLower)
        );
      });

      setFilteredRoles(filtered);
    },
    [roles, setRoleSearchTerm]
  );

  const handleCreateRole = useCallback(() => {
    setRoleDialogMode('create');
    setEditingRole(null);
    setRoleDialogOpen(true);
  }, []);

  const handleEditRole = useCallback(
    (roleId: string) => {
      const roleToEdit = roles.find((role) => role.id === roleId);
      if (roleToEdit) {
        setRoleDialogMode('edit');
        setEditingRole(roleToEdit);
        setRoleDialogOpen(true);
      }
    },
    [roles]
  );

  const handleAddUserToRole = useCallback(
    (roleId: string) => {
      const role = roles.find((r) => r.id === roleId);
      if (role) {
        setAssigningToRole(role);
        const alreadyAssignedUserIds =
          role.assignedUsers?.map((user) => user.id) || [];
        setSelectedUserIds(alreadyAssignedUserIds);
        setAssignUsersDialogOpen(true);
      }
    },
    [roles]
  );

  const handleSaveRole = useCallback(
    (roleData: Partial<Role>) => {
      if (roleDialogMode === 'create') {
        const newRole: Role = {
          id: `role-${Date.now()}`,
          title: roleData.title || '',
          description: roleData.description || '',
          permissions: roleData.permissions || [],
          assignedUsers: roleData.assignedUsers || [],
        };
        setRoles((prev) => [...prev, newRole]);
        setFilteredRoles((prev) => [...prev, newRole]);
      } else if (editingRole) {
        const updatedRole = { ...editingRole, ...roleData };
        setRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? updatedRole : role))
        );
        setFilteredRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? updatedRole : role))
        );
      }
      setRoleDialogOpen(false);
      setEditingRole(null);
    },
    [roleDialogMode, editingRole]
  );

  const handleRoleClick = useCallback(
    (role: Role) => {
      setSelectedRoleId(role.id);
    },
    [setSelectedRoleId]
  );

  const handleBackToRoles = useCallback(() => {
    setSelectedRoleId('');
  }, [setSelectedRoleId]);

  const handleTogglePermission = useCallback(
    (roleId: string, permissionId: string) => {
      setRoles((prev) =>
        prev.map((role) => {
          if (role.id === roleId) {
            const permissions = role.permissions || [];
            const permissionIndex = permissions.findIndex(
              (p) => p.id === permissionId
            );

            if (permissionIndex >= 0) {
              const updatedPermissions = [...permissions];
              updatedPermissions[permissionIndex] = {
                ...updatedPermissions[permissionIndex],
                enabled: !updatedPermissions[permissionIndex].enabled,
              };
              return { ...role, permissions: updatedPermissions };
            }
          }
          return role;
        })
      );

      setFilteredRoles((prev) =>
        prev.map((role) => {
          if (role.id === roleId) {
            const permissions = role.permissions || [];
            const permissionIndex = permissions.findIndex(
              (p) => p.id === permissionId
            );

            if (permissionIndex >= 0) {
              const updatedPermissions = [...permissions];
              updatedPermissions[permissionIndex] = {
                ...updatedPermissions[permissionIndex],
                enabled: !updatedPermissions[permissionIndex].enabled,
              };
              return { ...role, permissions: updatedPermissions };
            }
          }
          return role;
        })
      );
    },
    []
  );

  const handleAssignUsersToRole = useCallback(
    (userIds: string[]) => {
      if (assigningToRole) {
        const updatedAssignedUsers = userIds.map((id) => {
          const user = mockAvailableUsers.find((u) => u.id === id);
          return {
            id,
            initials: user?.initials || id.charAt(0).toUpperCase(),
            name: user?.name || id,
            avatarSrc: user?.avatar,
          };
        });

        const updatedRole = {
          ...assigningToRole,
          assignedUsers: updatedAssignedUsers,
        };

        setRoles((prev) =>
          prev.map((role) =>
            role.id === assigningToRole.id ? updatedRole : role
          )
        );
        setFilteredRoles((prev) =>
          prev.map((role) =>
            role.id === assigningToRole.id ? updatedRole : role
          )
        );
      }
      setAssignUsersDialogOpen(false);
      setAssigningToRole(null);
      setSelectedUserIds([]);
    },
    [assigningToRole]
  );

  const handleCloseAssignUsersDialog = useCallback(() => {
    setAssignUsersDialogOpen(false);
    setAssigningToRole(null);
    setSelectedUserIds([]);
  }, []);

  const handleCloseRoleDialog = useCallback(() => {
    setRoleDialogOpen(false);
    setEditingRole(null);
  }, []);

  const handleResetSearch = useCallback(() => {
    setRoleSearchTerm('');
    setFilteredRoles(roles);
  }, [roles, setRoleSearchTerm]);

  const setSelectedRole = useCallback(
    (role: Role | null) => {
      setSelectedRoleId(role?.id || '');
    },
    [setSelectedRoleId]
  );

  return {
    roles,
    filteredRoles,
    roleSearchTerm: roleSearchTerm || '',
    selectedRole,
    roleDialogOpen,
    roleDialogMode,
    editingRole,
    assignUsersDialogOpen,
    assigningToRole,
    selectedUserIds,
    handleSearchChange,
    handleCreateRole,
    handleEditRole,
    handleAddUserToRole,
    handleSaveRole,
    handleRoleClick,
    handleBackToRoles,
    handleTogglePermission,
    handleAssignUsersToRole,
    handleCloseAssignUsersDialog,
    handleCloseRoleDialog,
    handleResetSearch,
    setSelectedRole,
    setSelectedUserIds,
  };
};
