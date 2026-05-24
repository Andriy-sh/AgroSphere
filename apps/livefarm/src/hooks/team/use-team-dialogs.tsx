import { useState, useCallback } from 'react';
import { TeamUser } from '@@agrosphere/shared';

interface UseTeamDialogsReturn {
  editDialogOpen: boolean;
  editingUser: TeamUser | null;
  inviteDialogOpen: boolean;
  deactivateDialog: {
    isOpen: boolean;
    userName: string;
    userId: string;
  };
  deleteDialog: {
    isOpen: boolean;
    userName: string;
    userId: string;
  };
  connectionConfirmationDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmButtonVariant: 'danger' | 'primary';
    icon: React.ReactNode;
    onConfirm: () => void;
  };

  handleEditUser: (user: TeamUser) => void;
  handleCloseEditDialog: () => void;
  handleInviteUser: () => void;
  handleCloseInviteDialog: () => void;
  handleDeactivateUser: (userId: string, userName: string) => void;
  handleDeleteUser: (userId: string, userName: string) => void;
  handleCloseDeactivateDialog: () => void;
  handleCloseDeleteDialog: () => void;
  handleDeactivateConnection: (
    id: string,
    connectionName: string,
    onConfirm: () => void
  ) => void;
  handleActivateConnection: (
    id: string,
    connectionName: string,
    onConfirm: () => void
  ) => void;
  handleRemoveConnection: (
    id: string,
    connectionName: string,
    onConfirm: () => void
  ) => void;
  handleCloseConnectionDialog: () => void;
}

export function useTeamDialogs(): UseTeamDialogsReturn {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [deactivateDialog, setDeactivateDialog] = useState<{
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
return      },
    });

  const handleEditUser = useCallback((user: TeamUser) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingUser(null);
  }, []);

  const handleInviteUser = useCallback(() => {
    setInviteDialogOpen(true);
  }, []);

  const handleCloseInviteDialog = useCallback(() => {
    setInviteDialogOpen(false);
  }, []);

  const handleDeactivateUser = useCallback(
    (userId: string, userName: string) => {
      setDeactivateDialog({
        isOpen: true,
        userName,
        userId,
      });
    },
    []
  );

  const handleDeleteUser = useCallback((userId: string, userName: string) => {
    setDeleteDialog({
      isOpen: true,
      userName,
      userId,
    });
  }, []);

  const handleCloseDeactivateDialog = useCallback(() => {
    setDeactivateDialog({ isOpen: false, userName: '', userId: '' });
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ isOpen: false, userName: '', userId: '' });
  }, []);

  const handleDeactivateConnection = useCallback(
    (id: string, connectionName: string, onConfirm: () => void) => {
      setConnectionConfirmationDialog({
        isOpen: true,
        title: 'Deactivate connection!',
        message: `This will temporarily deactivate your connection with ${connectionName}. You will no longer be able to assign new tasks or receive task requests.`,
        confirmText: 'Deactivate',
        confirmButtonVariant: 'danger',
        icon: (
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-2xl">
              cloud_off
            </span>
          </div>
        ),
        onConfirm,
      });
    },
    []
  );

  const handleActivateConnection = useCallback(
    (id: string, connectionName: string, onConfirm: () => void) => {
      setConnectionConfirmationDialog({
        isOpen: true,
        title: 'Activate connection!',
        message: `This will reactivate your connection with ${connectionName}. You will be able to assign new tasks and receive task requests again. Any previously paused outstanding tasks will resume.`,
        confirmText: 'Activate',
        confirmButtonVariant: 'primary',
        icon: (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500 text-2xl">
              replay
            </span>
          </div>
        ),
        onConfirm,
      });
    },
    []
  );

  const handleRemoveConnection = useCallback(
    (id: string, connectionName: string, onConfirm: () => void) => {
      setConnectionConfirmationDialog({
        isOpen: true,
        title: 'Remove connection!',
        message: `This will permanently remove your connection with ${connectionName}. You will no longer be able to assign new tasks or receive task requests and any outstanding tasks will be cancelled.`,
        confirmText: 'Remove',
        confirmButtonVariant: 'danger',
        icon: (
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-2xl">
              delete
            </span>
          </div>
        ),
        onConfirm,
      });
    },
    []
  );

  const handleCloseConnectionDialog = useCallback(() => {
    setConnectionConfirmationDialog({
      isOpen: false,
      title: '',
      message: '',
      confirmText: '',
      confirmButtonVariant: 'primary',
      icon: null,
      onConfirm: () => {
        return
      },
    });
  }, []);

  return {
    editDialogOpen,
    editingUser,
    inviteDialogOpen,
    deactivateDialog,
    deleteDialog,
    connectionConfirmationDialog,

    handleEditUser,
    handleCloseEditDialog,
    handleInviteUser,
    handleCloseInviteDialog,
    handleDeactivateUser,
    handleDeleteUser,
    handleCloseDeactivateDialog,
    handleCloseDeleteDialog,
    handleDeactivateConnection,
    handleActivateConnection,
    handleRemoveConnection,
    handleCloseConnectionDialog,
  };
}
