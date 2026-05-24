import { ConfirmationDialog } from '@@agrosphere/shared';

interface TeamDeactivateMultipleUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function TeamDeactivateMultipleUsers({
  isOpen,
  onClose,
  onConfirm,
  count,
}: TeamDeactivateMultipleUsersProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Deactivate users!"
      message={`Are you sure you want to deactivate ${count} user(s)? After deactivation, these users will no longer be able to log in to the system.`}
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
  );
}
