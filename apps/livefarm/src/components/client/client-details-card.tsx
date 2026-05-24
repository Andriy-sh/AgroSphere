'use client';
import React from 'react';
import {
  Avatar,
  ClientData,
  DetailCard,
  DetailRow,
  TagItem,
  type Client,
} from '@@agrosphere/shared';

interface ClientDetailsCardProps {
  client: ClientData;
  onClientUpdate?: (clientData: Partial<ClientData>) => void;
  onClientUpdated?: (updatedClient: Client) => void;
  updateClientState?: (clientData: Partial<ClientData>) => void;
  onEditClient?: () => void;
}

export function ClientDetailsCard({
  client,
  onClientUpdate,
  onClientUpdated,
  updateClientState,
  onEditClient,
}: ClientDetailsCardProps) {
  return (
    <>
      <DetailCard
        title="Client details"
        showEditButton={true}
        onEdit={onEditClient}
      >
        <DetailRow
          icon="grid_3x3"
          label="Account No:"
          value={client.account_number || '---'}
        />
        <DetailRow
          icon="location_on"
          label="Address:"
          value={client.address || '---'}
        />
        <DetailRow
          icon="call"
          label="Phone number:"
          value={
            <span className="text-[#29B54C] font-semibold">
              {client.phone || '---'}
            </span>
          }
        />
        <DetailRow icon="mail" label="Email:" value={client.email || '---'} />
        <DetailRow
          icon="grid_3x3"
          label="Herd No:"
          value={client.herdNo || '---'}
        />
        <DetailRow icon="person" label="Assigned consultant:">
          {client.assignedConsultant ? (
            <div className="flex items-center gap-3">
              <Avatar
                className="rounded-md"
                row={{
                  original: {
                    client: {
                      name: client.assignedConsultant,
                      surname: '',
                      avatarSrc: '',
                    },
                  },
                }}
                size="sm"
                tooltipText={client.assignedConsultant}
              />
              <span className="text-black font-medium">
                {client.assignedConsultant}
              </span>
            </div>
          ) : (
            <span>---</span>
          )}
        </DetailRow>
        <DetailRow icon="label" label="Tags:">
          <div className="flex gap-2 flex-wrap">
            {client.tags && client.tags.length > 0 ? (
              client.tags.map((tag, i) => (
                <TagItem
                  key={i}
                  className="bg-basic-white text-basic-black px-2 py-1 text-sm font-medium rounded-[4px]"
                >
                  {tag}
                </TagItem>
              ))
            ) : (
              <span>---</span>
            )}
          </div>
        </DetailRow>
      </DetailCard>
    </>
  );
}
