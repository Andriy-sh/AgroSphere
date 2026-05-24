'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ConfirmationDialog,
  RoleCard,
  RoleDialog,
  AssignUsersDialog,
  mockAvailableUsers,
} from '@@agrosphere/shared';
import {
  useTeamDialogs,
  useTeamPageSize,
  useTeamNavigationWithUrl,
  useTeamUsersWithUrl,
  useTeamConnectionsWithUrl,
  useTeamRolesWithUrl,
} from '@@agrosphere/shared';
import { TeamUsersTable } from '@/components/team/team-users-table';
import { TeamPagination } from '@/components/team/team-pagination';
import { TeamConnectionTable } from '@/components/team/team-connection-table';
import { TeamRoleDetail } from '@/components/team/team-role-detail';
import { TeamNavigation } from '@/components/team/team-navigation';
import { TeamEditUserDetails } from '@/components/team/team-edit-user-details';
import { TeamInviteUser } from '@/components/team/team-invite-user';
import { TeamInviteConnection } from '@/components/team/team-invite-connection';
import { TeamActivateUser } from '@/components/team/team-activate-user';
import { TeamDeleteMultipleUsers } from '@/components/team/team-delete-multiple-users';
import { TeamDeactivateMultipleUsers } from '@/components/team/team-deactivate-multiple-users';
import { TeamDeleteMultipleConnections } from '@/components/team/team-delete-multiple-connections';

export default function TeamPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    fullList,
    selectedUsers,
    currentPage,
    handleSearchChange: handleUsersSearchChange,
    handleSort,
    handlePageChange,
    handleSelectedUsersChange,
    handleInviteUsers,
    handleRoleChange,
    handleSaveUser,
    handleDeactivateUser: handleUsersDeactivateUser,
    handleActivateUser: handleUsersActivateUser,
    handleDeleteUser: handleUsersDeleteUser,
    handleDeleteSelectedUsers: handleUsersDeleteSelectedUsers,
    handleDeactivateSelectedUsers: handleUsersDeactivateSelectedUsers,
    handleResetSearch: handleUsersResetSearch,
    setPageSize: setUsersPageSize,
    resetToFirstPage: resetUsersToFirstPage,
  } = useTeamUsersWithUrl();

  const {
    connections,
    selectedConnections,
    connectionCurrentPage,
    sortedConnections,
    paginatedConnections,
    connectionTotalPages,
    handleSearchChange: handleConnectionsSearchChange,
    handleConnectionPageChange,
    handleAcceptConnection,
    handleDeclineConnection,
    handleResendInvite,
    handleDeactivateConnection: handleConnectionsDeactivateConnection,
    handleActivateConnection: handleConnectionsActivateConnection,
    handleRemoveConnection: handleConnectionsRemoveConnection,
    handleSelectedConnectionsChange,
    handleDeleteSelectedConnections: handleConnectionsDeleteSelectedConnections,
    handleInviteConnections,
    handleResetSearch: handleConnectionsResetSearch,
    setPageSize: setConnectionsPageSize,
    resetToFirstPage: resetConnectionsToFirstPage,
    connectionSortField,
    connectionSortDirection,
    handleSort: handleConnectionsSort,
    getSortIcon: getConnectionsSortIcon,
  } = useTeamConnectionsWithUrl();

  const {
    roles,
    filteredRoles,
    selectedRole,
    roleDialogOpen,
    roleDialogMode,
    editingRole,
    assignUsersDialogOpen,
    assigningToRole,
    selectedUserIds,
    handleSearchChange: handleRolesSearchChange,
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
    handleResetSearch: handleRolesResetSearch,
    setSelectedRole,
    setSelectedUserIds,
  } = useTeamRolesWithUrl();

  const {
    editDialogOpen,
    editingUser,
    inviteDialogOpen,
    inviteConnectionDialogOpen,
    deactivateDialog,
    activateDialog,
    deleteDialog,
    deleteMultipleUsersDialog,
    deactivateMultipleUsersDialog,
    deleteMultipleConnectionsDialog,
    connectionConfirmationDialog,
    handleEditUser,
    handleCloseEditDialog,
    handleInviteUser,
    handleInviteConnection,
    handleDeactivateUser,
    handleActivateUser,
    handleDeleteUser,
    handleDeleteSelectedUsers,
    handleDeactivateSelectedUsers,
    handleDeleteSelectedConnections,
    handleDeactivateConnection,
    handleActivateConnection,
    handleRemoveConnection,
    setInviteDialogOpen,
    setInviteConnectionDialogOpen,
    setDeactivateDialog,
    setActivateDialog,
    setDeleteDialog,
    setDeleteMultipleUsersDialog,
    setDeactivateMultipleUsersDialog,
    setDeleteMultipleConnectionsDialog,
    setConnectionConfirmationDialog,
  } = useTeamDialogs();

  const { activeTab, searchTerm, handleTabChange, handleSearchChange } =
    useTeamNavigationWithUrl();

  const {
    dynamicPageSize: pageSizeFromHook,
    connectionPageSize: connectionPageSizeFromHook,
    tableContainerRef,
  } = useTeamPageSize();

  useEffect(() => {
    setUsersPageSize(pageSizeFromHook);
    setConnectionsPageSize(connectionPageSizeFromHook);
  }, [
    pageSizeFromHook,
    connectionPageSizeFromHook,
    setUsersPageSize,
    setConnectionsPageSize,
  ]);

  useEffect(() => {
    if (activeTab === 'users') {
      handleUsersSearchChange(searchTerm);
    } else if (activeTab === 'connections') {
      handleConnectionsSearchChange(searchTerm);
    } else if (activeTab === 'user-roles') {
      handleRolesSearchChange(searchTerm);
    }
  }, [
    searchTerm,
    activeTab,
    handleUsersSearchChange,
    handleConnectionsSearchChange,
    handleRolesSearchChange,
  ]);

  useEffect(() => {
    if (selectedRole) {
      const updatedRole = roles.find((role) => role.id === selectedRole.id);
      if (updatedRole) {
        setSelectedRole(updatedRole);
      }
    }
  }, [roles, selectedRole, setSelectedRole]);

  const handleTabChangeWithCallbacks = (tabId: string) => {
    handleTabChange(tabId, {
      resetUsersSearch: handleUsersResetSearch,
      resetConnectionsSearch: handleConnectionsResetSearch,
      resetRolesSearch: handleRolesResetSearch,
      resetUsersPage: resetUsersToFirstPage,
      resetConnectionsPage: resetConnectionsToFirstPage,
      resetUsersSelection: () => handleSelectedUsersChange([]),
      resetConnectionsSelection: () => handleSelectedConnectionsChange([]),
      resetSelectedRole: () => setSelectedRole(null),
    });
  };

  const handleEditUserWithList = (userId: string) => {
    handleEditUser(userId, fullList);
  };

  const handleDeactivateUserWithList = (userId: string) => {
    handleDeactivateUser(userId, fullList);
  };

  const handleActivateUserWithList = (userId: string) => {
    handleActivateUser(userId, fullList);
  };

  const handleDeleteUserWithList = (userId: string) => {
    handleDeleteUser(userId, fullList);
  };

  const handleDeleteSelectedUsersWithList = () => {
    handleDeleteSelectedUsers(selectedUsers);
  };

  const handleDeactivateSelectedUsersWithList = () => {
    const activeSelectedUsers = selectedUsers.filter((userId) => {
      const user = fullList.find((u) => u.id === userId);
      return user && user.status === 'Active';
    });

    if (activeSelectedUsers.length > 0) {
      handleDeactivateSelectedUsers(activeSelectedUsers);
    }
  };

  const handleDeleteSelectedConnectionsWithList = () => {
    handleDeleteSelectedConnections(selectedConnections, () =>
      handleConnectionsDeleteSelectedConnections()
    );
  };

  const handleDeactivateConnectionWithList = (id: string) => {
    handleDeactivateConnection(id, connections, () =>
      handleConnectionsDeactivateConnection(id)
    );
  };

  const handleActivateConnectionWithList = (id: string) => {
    handleActivateConnection(id, connections, () =>
      handleConnectionsActivateConnection(id)
    );
  };

  const handleRemoveConnectionWithList = (id: string) => {
    handleRemoveConnection(id, connections, () =>
      handleConnectionsRemoveConnection(id)
    );
  };

  const handleInviteUsersWithRefresh = useCallback(
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
      handleInviteUsers(invitedUsers);

      setRefreshTrigger((prev) => prev + 1);
    },
    [handleInviteUsers]
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="flex flex-col h-full ">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TeamUsersTable
                searchTerm={searchTerm}
                currentPage={currentPage}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={handleSelectedUsersChange}
                onRoleChange={handleRoleChange}
                onSort={handleSort}
                onEditUser={handleEditUserWithList}
                onDeactivateUser={handleDeactivateUserWithList}
                onActivateUser={handleActivateUserWithList}
                onDeleteUser={handleDeleteUserWithList}
                onDeleteSelectedUsers={handleDeleteSelectedUsersWithList}
                onDeactivateSelectedUsers={
                  handleDeactivateSelectedUsersWithList
                }
                onPageChange={handlePageChange}
                onPageReset={resetUsersToFirstPage}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        );
      case 'connections':
        return (
          <div className="flex flex-col h-full ">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TeamConnectionTable
                connections={paginatedConnections}
                allConnections={sortedConnections}
                selectedConnections={selectedConnections}
                onSelectedConnectionsChange={handleSelectedConnectionsChange}
                onAcceptConnection={handleAcceptConnection}
                onDeclineConnection={handleDeclineConnection}
                onResendInvite={handleResendInvite}
                onDeactivateConnection={handleDeactivateConnectionWithList}
                onActivateConnection={handleActivateConnectionWithList}
                onRemoveConnection={handleRemoveConnectionWithList}
                onDeleteSelectedConnections={
                  handleDeleteSelectedConnectionsWithList
                }
                sortField={connectionSortField}
                sortDirection={
                  connectionSortDirection as 'asc' | 'desc' | 'none'
                }
                onSort={handleConnectionsSort}
                getSortIcon={getConnectionsSortIcon}
              />
            </div>

            <div className="py-3 bg-white flex justify-center items-center flex-shrink-0">
              <TeamPagination
                currentPage={connectionCurrentPage}
                totalPages={connectionTotalPages}
                onPageChange={handleConnectionPageChange}
              />
            </div>
          </div>
        );
      case 'user-roles':
        return (
          <div className="flex flex-col h-full ">
            {selectedRole ? (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <TeamRoleDetail
                  role={selectedRole}
                  permissions={selectedRole.permissions}
                  onBack={handleBackToRoles}
                  // onEditRole={() => handleEditRole(selectedRole.id)}
                  onAddUser={() => handleAddUserToRole(selectedRole.id)}
                  onTogglePermission={(permissionId) =>
                    handleTogglePermission(selectedRole.id, permissionId)
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    {filteredRoles.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => handleRoleClick(role)}
                        className="cursor-pointer"
                      >
                        <RoleCard
                          title={role.title}
                          description={role.description}
                          assignedUsers={role.assignedUsers}
                          onEdit={(e) => {
                            e?.stopPropagation();
                            handleEditRole(role.id);
                          }}
                          onAddUser={(e) => {
                            e?.stopPropagation();
                            handleAddUserToRole(role.id);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-basic-gray-light rounded-xl">
      <TeamNavigation
        activeTab={activeTab}
        onTabChange={handleTabChangeWithCallbacks}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onInviteUser={handleInviteUser}
        onInviteConnection={handleInviteConnection}
        onCreateRole={handleCreateRole}
        hideContent={!!selectedRole}
      />
      <div
        className="flex-1 min-h-0 mx-5"
        ref={tableContainerRef}
        data-list-container
      >
        {renderTabContent()}
      </div>

      <TeamEditUserDetails
        user={editingUser}
        isOpen={editDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={(updatedUser) => {
          if (editingUser) {
            handleSaveUser(editingUser.id, updatedUser);
          }
          handleCloseEditDialog();
        }}
      />

      <TeamInviteUser
        isOpen={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onInvite={handleInviteUsersWithRefresh}
      />

      <TeamInviteConnection
        isOpen={inviteConnectionDialogOpen}
        onClose={() => setInviteConnectionDialogOpen(false)}
        onInvite={handleInviteConnections}
      />

      <TeamActivateUser
        isOpen={activateDialog.isOpen}
        onClose={() => setActivateDialog({ ...activateDialog, isOpen: false })}
        onConfirm={() => {
          if (activateDialog.userId) {
            handleUsersActivateUser(activateDialog.userId);
          }
          setActivateDialog({ isOpen: false, userName: '', userId: '' });
        }}
        userName={activateDialog.userName}
      />

      <TeamDeleteMultipleUsers
        isOpen={deleteMultipleUsersDialog.isOpen}
        onClose={() =>
          setDeleteMultipleUsersDialog({
            ...deleteMultipleUsersDialog,
            isOpen: false,
          })
        }
        onConfirm={() => {
          handleUsersDeleteSelectedUsers();
          setDeleteMultipleUsersDialog({ isOpen: false, count: 0 });
        }}
        count={deleteMultipleUsersDialog.count}
      />

      <TeamDeactivateMultipleUsers
        isOpen={deactivateMultipleUsersDialog.isOpen}
        onClose={() =>
          setDeactivateMultipleUsersDialog({
            ...deactivateMultipleUsersDialog,
            isOpen: false,
          })
        }
        onConfirm={() => {
          const activeSelectedUsers = selectedUsers.filter((userId) => {
            const user = fullList.find((u) => u.id === userId);
            return user && user.status === 'Active';
          });
          handleUsersDeactivateSelectedUsers(activeSelectedUsers);
          setDeactivateMultipleUsersDialog({ isOpen: false, count: 0 });
        }}
        count={deactivateMultipleUsersDialog.count}
      />

      <TeamDeleteMultipleConnections
        isOpen={deleteMultipleConnectionsDialog.isOpen}
        onClose={() =>
          setDeleteMultipleConnectionsDialog({
            ...deleteMultipleConnectionsDialog,
            isOpen: false,
          })
        }
        onConfirm={() => {
          handleConnectionsDeleteSelectedConnections();
          setDeleteMultipleConnectionsDialog({ isOpen: false, count: 0 });
        }}
        count={deleteMultipleConnectionsDialog.count}
      />

      <ConfirmationDialog
        isOpen={connectionConfirmationDialog.isOpen}
        onClose={() =>
          setConnectionConfirmationDialog({
            ...connectionConfirmationDialog,
            isOpen: false,
          })
        }
        onConfirm={connectionConfirmationDialog.onConfirm}
        title={connectionConfirmationDialog.title}
        message={connectionConfirmationDialog.message}
        confirmText={connectionConfirmationDialog.confirmText}
        confirmButtonVariant={connectionConfirmationDialog.confirmButtonVariant}
        icon={connectionConfirmationDialog.icon}
      />

      <ConfirmationDialog
        isOpen={deactivateDialog.isOpen}
        onClose={() =>
          setDeactivateDialog({ ...deactivateDialog, isOpen: false })
        }
        onConfirm={() => {
          if (deactivateDialog.userId) {
            handleUsersDeactivateUser(deactivateDialog.userId);
          }
          setDeactivateDialog({ isOpen: false, userName: '', userId: '' });
        }}
        title="Deactivate user!"
        message="Are you sure you want to deactivate this user? After deactivation, the user will no longer be able to log in to the system."
        confirmText="Deactivate"
        confirmButtonVariant="danger"
        size="lg"
        icon={
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600 text-xl">
              person_off
            </span>
          </div>
        }
      />

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => {
          if (deleteDialog.userId === 'selected') {
            handleUsersDeleteSelectedUsers();
          } else if (deleteDialog.userId) {
            handleUsersDeleteUser(deleteDialog.userId);
          }
          setDeleteDialog({ isOpen: false, userName: '', userId: '' });
        }}
        title="Delete user!"
        message={
          deleteDialog.userName.includes('selected user(s)')
            ? `Are you sure you want to delete ${deleteDialog.userName}? This action is irreversible.`
            : 'Are you sure you want to delete this user? This action is irreversible.'
        }
        confirmText="Delete"
        confirmButtonVariant="danger"
        size="lg"
        icon={
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600 text-xl">
              delete
            </span>
          </div>
        }
      />

      <RoleDialog
        isOpen={roleDialogOpen}
        mode={roleDialogMode}
        role={editingRole || undefined}
        availableUsers={mockAvailableUsers.map((user) => ({
          id: user.id,
          name: user.name,
          initials: user.initials,
          avatarSrc: user.avatar,
        }))}
        onClose={handleCloseRoleDialog}
        onSave={handleSaveRole}
      />

      <AssignUsersDialog
        isOpen={assignUsersDialogOpen}
        onClose={handleCloseAssignUsersDialog}
        users={mockAvailableUsers.map((user) => ({
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials,
        }))}
        selectedUserIds={selectedUserIds}
        onSelectionChange={setSelectedUserIds}
        onSave={() => handleAssignUsersToRole(selectedUserIds)}
        title={`Add users to ${assigningToRole?.title || 'role'}`}
        searchPlaceholder="Search team members..."
        saveButtonText="Add to role"
        showUserRole={true}
      />
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
