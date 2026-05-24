'use client';

import React from 'react';
import {
  mockLabItems,
  DetailCard,
  DetailRow,
  Breadcrumbs,
  Avatar,
  TaskComments,
  mockComments,
  mockCurrentUser,
} from '@@agrosphere/shared';
import { LabDetailHeader } from '@/components/lab-detail/lab-detail-header';
import { LabResultsCard } from '@/components/lab-detail/lab-results-card';

interface LabDetailProps {
  labId: string;
}

export default function LabDetail({ labId }: LabDetailProps) {
  const labItem = mockLabItems.find((item) => item.id === labId);

  if (!labItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lab not found
          </h1>
          <p className="text-gray-600">
            The lab item with ID &quot;{labId}&quot; was not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden text-sm bg-white h-full">
      <div className="m-4">
        <Breadcrumbs
          items={[
            { label: 'All orders', href: '/lab' },
            { label: 'Order details', href: '#' },
          ]}
        />
      </div>

      <LabDetailHeader labItem={labItem} />

      <div
        className="flex-1 min-h-0 flex flex-col overflow-hidden m-2 text-sm"
        data-list-container
      >
        <div className="flex-1 min-h-0 grid grid-cols-[2fr_1fr] gap-6 items-start overflow-hidden p-1">
          <div className="flex flex-col min-h-0 h-full gap-6">
            <div className="h-1/2 min-h-0 overflow-hidden">
              <DetailCard
                title="Order details"
                showEditButton={true}
                onEdit={() => console.log('Edit order details')}
              >
                <DetailRow
                  icon="experiment"
                  label="Lab:"
                  value={labItem.labName}
                />
                <DetailRow
                  icon="assignment_turned_in"
                  label="Task ID:"
                  value={labItem.taskId}
                />
                <DetailRow icon="person" label="Client:">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="rounded-md"
                      row={{
                        original: {
                          client: {
                            name: labItem.client.name,
                            surname: labItem.client.surname,
                            avatarSrc: labItem.client.avatarSrc,
                          },
                        },
                      }}
                      size="sm"
                      tooltipText={`${labItem.client.name} ${labItem.client.surname}`}
                    />
                    <span className="text-black font-medium">
                      {labItem.client.name.charAt(0)} {labItem.client.surname}
                    </span>
                  </div>
                </DetailRow>
                <DetailRow
                  icon="home_work"
                  label="Farm:"
                  value={labItem.farm}
                />
                <DetailRow
                  icon="edit_calendar"
                  label="Sample date:"
                  value={labItem.sampleDate}
                />
                <DetailRow
                  icon="edit_calendar"
                  label="Sent date:"
                  value={labItem.sentDate}
                />
                <DetailRow
                  icon="edit_calendar"
                  label="Received date:"
                  value={labItem.receivedDate}
                />
                <DetailRow
                  icon="experiment"
                  label="Samples:"
                  value={labItem.samples.toString()}
                />
                <DetailRow
                  icon="schedule"
                  label="Updated at:"
                  value={labItem.updatedAt}
                />
              </DetailCard>
            </div>

            <div className="h-1/2 min-h-0 overflow-hidden">
              <LabResultsCard />
            </div>
          </div>

          <div className="flex flex-col min-h-0 h-full overflow-hidden">
            <div className="bg-white rounded-xl shadow border p-6 border-[#EEF0F6] h-full">
              <h2 className="text-base font-medium text-black mb-6 text-start">
                Comments
              </h2>
              <TaskComments
                commentsData={mockComments}
                currentUser={mockCurrentUser}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
