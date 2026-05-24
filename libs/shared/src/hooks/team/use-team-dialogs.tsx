'use client';
import { useState, useCallback } from 'react';
import { TeamUser } from '../../mock/mock-team-users';
import { Icon } from '../../components/icon';

export const useTeamDialogs = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteConnectionDialogOpen, setInviteConnectionDialogOpen] =
    useState(false);

  const [deactivateDialog, setDeactivateDialog] = useState<{
    isOpen: boolean;
    userName: string;
    userId: string;
  }>({
    isOpen: false,
    userName: '',
    userId: '',
  });

  const [activateDialog, setActivateDialog] = useState<{
    isOpen: boolean;
    userName: string;
    userId: string;
  }>({
    isOpen: false,
    userName: '',
    userId: '',
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    userName: string;
    userId: string;
  }>({
    isOpen: false,
    userName: '',
    userId: '',
  });

  const [deleteMultipleUsersDialog, setDeleteMultipleUsersDialog] = useState<{
    isOpen: boolean;
    count: number;
  }>({
    isOpen: false,
    count: 0,
  });

  const [deactivateMultipleUsersDialog, setDeactivateMultipleUsersDialog] =
    useState<{
      isOpen: boolean;
      count: number;
    }>({
      isOpen: false,
      count: 0,
    });

  const [deleteMultipleConnectionsDialog, setDeleteMultipleConnectionsDialog] =
    useState<{
      isOpen: boolean;
      count: number;
    }>({
      isOpen: false,
      count: 0,
    });

  const [connectionConfirmationDialog, setConnectionConfirmationDialog] =
    useState<{
      isOpen: boolean;
      title: string;
      message: string;
      confirmText: string;
      confirmButtonVariant: 'danger' | 'primary';
      icon: React.ReactNode;
      onConfirm: () => void;
    }>({
      isOpen: false,
      title: '',
      message: '',
      confirmText: '',
      confirmButtonVariant: 'primary',
      icon: null,
      onConfirm: () => {
        return;
      },
    });

  const handleEditUser = useCallback((userId: string, fullList: TeamUser[]) => {
    const userToEdit = fullList.find((user) => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setEditDialogOpen(true);
    }
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingUser(null);
  }, []);

  const handleInviteUser = useCallback(() => {
    setInviteDialogOpen(true);
  }, []);

  const handleInviteConnection = useCallback(() => {
    setInviteConnectionDialogOpen(true);
  }, []);

  const handleDeactivateUser = useCallback(
    (userId: string, fullList: TeamUser[]) => {
      const userToDeactivate = fullList.find((user) => user.id === userId);
      if (userToDeactivate) {
        setDeactivateDialog({
          isOpen: true,
          userName: userToDeactivate.name,
          userId: userId,
        });
      }
    },
    []
  );

  const handleActivateUser = useCallback(
    (userId: string, fullList: TeamUser[]) => {
      const userToActivate = fullList.find((user) => user.id === userId);
      if (userToActivate) {
        setActivateDialog({
          isOpen: true,
          userName: userToActivate.name,
          userId: userId,
        });
      }
    },
    []
  );

  const handleDeleteUser = useCallback(
    (userId: string, fullList: TeamUser[]) => {
      const userToDelete = fullList.find((user) => user.id === userId);
      if (userToDelete) {
        setDeleteDialog({
          isOpen: true,
          userName: userToDelete.name,
          userId: userId,
        });
      }
    },
    []
  );

  const handleDeleteSelectedUsers = useCallback((selectedUsers: string[]) => {
    if (selectedUsers.length > 0) {
      setDeleteMultipleUsersDialog({
        isOpen: true,
        count: selectedUsers.length,
      });
    }
  }, []);

  const handleDeactivateSelectedUsers = useCallback(
    (selectedUsers: string[]) => {
      if (selectedUsers.length > 0) {
        setDeactivateMultipleUsersDialog({
          isOpen: true,
          count: selectedUsers.length,
        });
      }
    },
    []
  );

  const handleDeleteSelectedConnections = useCallback(
    (selectedConnections: string[], onConfirmCallback?: () => void) => {
      if (selectedConnections.length > 0) {
        setDeleteMultipleConnectionsDialog({
          isOpen: true,
          count: selectedConnections.length,
        });
      }
    },
    []
  );

  const handleDeactivateConnection = useCallback(
    (id: string, connections: any[], onConfirmCallback?: () => void) => {
      const connection = connections.find((c) => c.id === id);
      if (connection) {
        setConnectionConfirmationDialog({
          isOpen: true,
          title: 'Deactivate connection!',
          message: `This will temporarily deactivate your connection with ${connection.name}. You will no longer be able to assign new tasks or receive task requests.`,
          confirmText: 'Deactivate',
          confirmButtonVariant: 'danger',
          icon: (
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon icon="cloud_off" className='text-red-500' size="lg" />
            </div>
          ),
          onConfirm: () => {
            if (onConfirmCallback) {
              onConfirmCallback();
            }
            setConnectionConfirmationDialog({
              isOpen: false,
              title: '',
              message: '',
              confirmText: '',
              confirmButtonVariant: 'primary',
              icon: null,
              onConfirm: () => {
                return;
              },
            });
          },
        });
      }
    },
    []
  );

  const handleActivateConnection = useCallback(
    (id: string, connections: any[], onConfirmCallback?: () => void) => {
      const connection = connections.find((c) => c.id === id);
      if (connection) {
        setConnectionConfirmationDialog({
          isOpen: true,
          title: 'Activate connection!',
          message: `This will reactivate your connection with ${connection.name}. You will be able to assign new tasks and receive task requests again. Any previously paused outstanding tasks will resume.`,
          confirmText: 'Activate',
          confirmButtonVariant: 'primary',
          icon: (
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-2xl">
                replay
              </span>
            </div>
          ),
          onConfirm: () => {
            if (onConfirmCallback) {
              onConfirmCallback();
            }
            setConnectionConfirmationDialog({
              isOpen: false,
              title: '',
              message: '',
              confirmText: '',
              confirmButtonVariant: 'primary',
              icon: null,
              onConfirm: () => {
return              },
            });
          },
        });
      }
    },
    []
  );

  const handleRemoveConnection = useCallback(
    (id: string, connections: any[], onConfirmCallback?: () => void) => {
      const connection = connections.find((c) => c.id === id);
      if (connection) {
        setConnectionConfirmationDialog({
          isOpen: true,
          title: 'Remove connection!',
          message: `This will permanently remove your connection with ${connection.name}. You will no longer be able to assign new tasks or receive task requests and any outstanding tasks will be cancelled.`,
          confirmText: 'Remove',
          confirmButtonVariant: 'danger',
          icon: (
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500 text-2xl">
                delete
              </span>
            </div>
          ),
          onConfirm: () => {
            if (onConfirmCallback) {
              onConfirmCallback();
            }
            setConnectionConfirmationDialog({
              isOpen: false,
              title: '',
              message: '',
              confirmText: '',
              confirmButtonVariant: 'primary',
              icon: null,
              onConfirm: () => {
return              },
            });
          },
        });
      }
    },
    []
  );

  return {
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

    setEditDialogOpen,
    setEditingUser,
    setInviteDialogOpen,
    setInviteConnectionDialogOpen,
    setDeactivateDialog,
    setActivateDialog,
    setDeleteDialog,
    setDeleteMultipleUsersDialog,
    setDeactivateMultipleUsersDialog,
    setDeleteMultipleConnectionsDialog,
    setConnectionConfirmationDialog,
  };
};
