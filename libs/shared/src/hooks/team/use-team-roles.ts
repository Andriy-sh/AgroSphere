'use client';
import { useState, useCallback } from 'react';
import { mockRoles, Role } from '../../mock/mock-roles';
import { mockAvailableUsers } from '../../mock/mock-available-users';

export const useTeamRoles = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(mockRoles);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [assignUsersDialogOpen, setAssignUsersDialogOpen] = useState(false);
  const [assigningToRole, setAssigningToRole] = useState<Role | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

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
    [roles]
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
        setSelectedUserIds(role.assignedUsers.map((user) => user.id));
        setAssignUsersDialogOpen(true);
      }
    },
    [roles]
  );

  const handleSaveRole = useCallback(
    (roleData: {
      title: string;
      description: string;
      assignedUsers: Array<{
        id: string;
        name?: string;
        initials: string;
        avatarSrc?: string;
      }>;
    }) => {
      if (roleDialogMode === 'create') {
        const newRole: Role = {
          id: `role-${Date.now()}`,
          title: roleData.title,
          description: roleData.description,
          assignedUsers: roleData.assignedUsers,
          permissions: [
            {
              id: 'perm-1',
              title: 'User management',
              description:
                'Can add, edit, and remove users within the organisation',
              enabled: false,
            },
            {
              id: 'perm-2',
              title: 'Company settings',
              description:
                'Can manage company profile, settings, and integrations',
              enabled: false,
            },
            {
              id: 'perm-3',
              title: 'Task management',
              description:
                'Can create, edit, assign, and delete sampling tasks',
              enabled: false,
            },
            {
              id: 'perm-4',
              title: 'Farm mapping',
              description:
                'Can manage farm maps: create, update, and delete fields and zones',
              enabled: false,
            },
            {
              id: 'perm-5',
              title: 'Soil sample collection',
              description:
                'Can oversee collection and submission of GPS-based soil samples',
              enabled: false,
            },
          ],
        };

        setRoles((prev) => [...prev, newRole]);
        setFilteredRoles((prev) => [...prev, newRole]);
      } else if (editingRole) {
        const updatedRole: Role = {
          ...editingRole,
          title: roleData.title,
          description: roleData.description,
          assignedUsers: roleData.assignedUsers,
        };

        setRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? updatedRole : role))
        );
        setFilteredRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? updatedRole : role))
        );

        if (selectedRole?.id === editingRole.id) {
          setSelectedRole(updatedRole);
        }
      }

      setRoleDialogOpen(false);
      setEditingRole(null);
    },
    [roleDialogMode, editingRole, selectedRole]
  );

  const handleRoleClick = useCallback((role: Role) => {
    setSelectedRole(role);
  }, []);

  const handleBackToRoles = useCallback(() => {
    setSelectedRole(null);
  }, []);

  const handleTogglePermission = useCallback(
    (roleId: string, permissionId: string) => {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === roleId
            ? {
                ...role,
                permissions: role.permissions.map((permission) =>
                  permission.id === permissionId
                    ? { ...permission, enabled: !permission.enabled }
                    : permission
                ),
              }
            : role
        )
      );

      setFilteredRoles((prev) =>
        prev.map((role) =>
          role.id === roleId
            ? {
                ...role,
                permissions: role.permissions.map((permission) =>
                  permission.id === permissionId
                    ? { ...permission, enabled: !permission.enabled }
                    : permission
                ),
              }
            : role
        )
      );
    },
    []
  );

  const handleAssignUsersToRole = useCallback(() => {
    if (!assigningToRole) return;

    const selectedUsers = mockAvailableUsers.filter((user) =>
      selectedUserIds.includes(user.id)
    );

    const newAssignedUsers = selectedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      initials: user.initials,
      avatarSrc: user.avatar,
    }));

    const updatedRole: Role = {
      ...assigningToRole,
      assignedUsers: newAssignedUsers,
    };

    setRoles((prev) =>
      prev.map((role) => (role.id === assigningToRole.id ? updatedRole : role))
    );
    setFilteredRoles((prev) =>
      prev.map((role) => (role.id === assigningToRole.id ? updatedRole : role))
    );

    if (selectedRole?.id === assigningToRole.id) {
      setSelectedRole(updatedRole);
    }

    setAssignUsersDialogOpen(false);
    setAssigningToRole(null);
    setSelectedUserIds([]);
  }, [assigningToRole, selectedUserIds, selectedRole]);

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
    setFilteredRoles(roles);
    setRoleSearchTerm('');
  }, [roles]);

  return {
    roles,
    filteredRoles,
    roleSearchTerm,
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
