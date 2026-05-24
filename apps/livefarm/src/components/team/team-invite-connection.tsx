'use client';

import { InviteDialog } from '@@agrosphere/shared';

interface InviteConnection {
  id: string;
  email: string;
}

interface TeamInviteConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (connections: InviteConnection[]) => void;
}

export function TeamInviteConnection({
  isOpen,
  onClose,
  onInvite,
}: TeamInviteConnectionProps) {
  const handleInvite = (
    items: Array<{ id: string; email: string; role?: string }>
  ) => {
    const connections: InviteConnection[] = items.map((item) => ({
      id: item.id,
      email: item.email,
    }));
    onInvite(connections);
  };

  return (
    <InviteDialog
      isOpen={isOpen}
      onClose={onClose}
      onInvite={handleInvite}
      title="Invite connection"
      icon={
        <span className="material-symbols-outlined text-basic-green">business_center</span>
      }
      showRoleSelector={false}
      addMoreText="Add more connection"
      sendButtonText="Send invite"
      emailPlaceholder="Enter email of org admin"
    />
  );
}
