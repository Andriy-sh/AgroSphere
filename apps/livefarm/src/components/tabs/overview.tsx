'use client';
import React from 'react';
import { OverviewProps, ClientData, type Client } from '@@agrosphere/shared';
import { ClientDetailsCard } from '../client/client-details-card';
import { AssignedUsersList } from '../client/assigned-users-list';
import { CommentsSection } from '../client/comments-section';

export function Overview({
  client,
  assignedUsers,
  comments,
  onClientUpdate,
  onClientUpdated,
  updateClientState,
  onEditClient,
}: OverviewProps & {
  onClientUpdate?: (clientData: Partial<ClientData>) => void;
  onClientUpdated?: (updatedClient: Client) => void;
  updateClientState?: (clientData: Partial<ClientData>) => void;
  onEditClient?: () => void;
}) {
  // Mock data for testing
  const mockAssignedUsers = [
    { name: 'John Smith', role: 'Manager', avatar: '' },
    { name: 'Sarah Johnson', role: 'Consultant', avatar: '' },
    { name: 'Mike Wilson', role: 'Analyst', avatar: '' },
    { name: 'Emma Davis', role: 'Specialist', avatar: '' },
    { name: 'Tom Brown', role: 'Coordinator', avatar: '' },
  ];

  const mockComments = [
    {
      user: 'John Smith',
      text: 'Client meeting scheduled for next week. Need to prepare the quarterly report.',
      date: '2024-01-15',
      avatarSrc: '',
    },
    {
      user: 'Sarah Johnson',
      text: 'Farm inspection completed successfully. All requirements met.',
      date: '2024-01-14',
      avatarSrc: '',
    },
    {
      user: 'Mike Wilson',
      text: 'Lab results are ready. Will send the detailed analysis tomorrow.',
      date: '2024-01-13',
      avatarSrc: '',
    },
    {
      user: 'Emma Davis',
      text: 'Payment processed successfully. Invoice #12345 has been paid.',
      date: '2024-01-12',
      avatarSrc: '',
    },
    {
      user: 'Tom Brown',
      text: 'Follow-up call scheduled for next month. Client seems satisfied with our services.',
      date: '2024-01-11',
      avatarSrc: '',
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden m-2 text-sm ">
      <div className="flex-1 min-h-0 grid grid-cols-[2fr_1fr] gap-6 items-start overflow-hidden p-1">
        <div className="flex flex-col min-h-0 h-full gap-6">
          <div className="h-1/2 min-h-0 overflow-hidden">
            <ClientDetailsCard
              client={client}
              onClientUpdate={onClientUpdate}
              onClientUpdated={onClientUpdated}
              updateClientState={updateClientState}
              onEditClient={onEditClient}
            />
          </div>
          <div className="h-1/2 min-h-0 overflow-hidden">
            <AssignedUsersList users={mockAssignedUsers} />
          </div>
        </div>
        <div className="flex flex-col min-h-0 h-full overflow-hidden">
          <CommentsSection comments={mockComments} />
        </div>
      </div>
    </div>
  );
}
