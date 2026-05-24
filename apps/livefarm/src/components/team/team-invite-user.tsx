'use client';

import { useState } from 'react';
import {
  InviteDialog,
  useTeamInviteApi,
  TeamInviteRequest,
  TEAM_ROLES,
} from '@@agrosphere/shared';

interface InviteUser {
  id: string;
  email: string;
  userRole: string;
  name?: string;
  department?: string;
  status?: string;
  avatar?: string;
  initials?: string;
  joinDate?: string;
}

interface TeamInviteUserProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (users: InviteUser[]) => void;
}

export function TeamInviteUser({
  isOpen,
  onClose,
  onInvite,
}: TeamInviteUserProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inviteUsers, loading } = useTeamInviteApi();

  const roleOptions = TEAM_ROLES;

  const handleInvite = async (
    items: Array<{ id: string; email: string; role?: string }>
  ) => {
    setIsSubmitting(true);

    try {
      const inviteData: TeamInviteRequest = {
        users: items.map((item) => ({
          email: item.email,
          role: item.role || '',
        })),
      };

      const result = await inviteUsers(inviteData);

      if (result) {
        const users: InviteUser[] = items.map((item) => ({
          id: `invited-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          email: item.email,
          userRole: item.role || '',
          name: 'Invited User',
          department: 'Pending',
          status: 'Invited',
          avatar: '',
          initials: 'IU',
          joinDate: new Date().toISOString(),
        }));

        onInvite(users);
      }
    } catch (error) {
      console.error('Failed to invite users:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <InviteDialog
      isOpen={isOpen}
      onClose={onClose}
      onInvite={handleInvite}
      title="Invite user"
      icon={
        <span className="material-symbols-outlined text-basic-green">
          group_add
        </span>
      }
      showRoleSelector={true}
      roleOptions={roleOptions}
      addMoreText="Add more people"
      sendButtonText={isSubmitting || loading ? 'Sending...' : 'Send invite'}
      emailPlaceholder="Enter user email"
      rolePlaceholder="Select user role"
    />
  );
}
