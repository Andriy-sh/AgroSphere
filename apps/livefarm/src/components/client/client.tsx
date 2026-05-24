'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Avatar,
  Breadcrumbs,
  Header,
  DropdownActionsNoLib,
  useClientDetails,
  ClientData,
  AssignedUser,
  ClientComment,
  type Client,
  type ClientFormData,
} from '@@agrosphere/shared';
import { Overview } from '@/components/tabs/overview';
import { ClientTasks } from '@/components/tabs/client-tasks';
import { mockClientTasks } from '@/mock/client-tasks';
import { ClientHeaderSkeleton } from '../skeletons/client/client-header-skeleton';
import { OverviewSkeleton } from '../skeletons/client/overview-skeleton';
import { AddClientDialog } from '../clients/add-client-dialog';

interface ClientProps {
  clientId: string;
}

interface ApiClientData {
  id: string;
  business_name: string;
  business_type: string;
  first_name: string;
  last_name: string;
  full_name: string;
  mobile: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string | null;
  eircode: string;
  county: string;
  full_address: string;
  contact_name: string;
  contact_role: string | null;
  account_number: string | null;
  derogation: boolean;
  farm_type: string | null;
  herd_no: string | null;
  organic: boolean | null;
  status: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export function Client({ clientId }: ClientProps) {
  const { clientDetails, loading, getClientDetails } = useClientDetails();
  const [localClientData, setLocalClientData] = useState<ClientData | null>(
    null
  );
  const [baseClientData, setBaseClientData] = useState<ClientData | null>(null);
  const [clientState, setClientState] = useState<ClientData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const transformApiDataToClientData = (
    apiData: ApiClientData
  ): ClientData => ({
    id: apiData.id,
    name: apiData.full_name || apiData.business_name || 'Unknown',
    surname: apiData.last_name || '',
    address: apiData.full_address || '',
    addressLine1: apiData.address_line_1,
    addressLine2: apiData.address_line_2,
    city: apiData.city,
    county: apiData.county,
    country: apiData.country || undefined,
    eircode: apiData.eircode,
    phone: apiData.mobile,
    email: apiData.email,
    herdNo: apiData.herd_no || '',
    farmType: apiData.farm_type || undefined,
    assignedConsultant: undefined,
    tags: apiData.tags || [],
    avatar: undefined,
    business_name: apiData.business_name,
    business_type: apiData.business_type,
    first_name: apiData.first_name,
    last_name: apiData.last_name,
    full_name: apiData.full_name,
    mobile: apiData.mobile,
    full_address: apiData.full_address,
    contact_name: apiData.contact_name,
    contact_role: apiData.contact_role,
    account_number: apiData.account_number,
    derogation: apiData.derogation,
    organic: apiData.organic,
    status: apiData.status,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,
  });

  useEffect(() => {
    if (clientDetails?.data) {
      const transformedData = transformApiDataToClientData(clientDetails.data);
      setBaseClientData(transformedData);
      setClientState(transformedData);
    }
  }, [clientDetails?.data]);

  const client: ClientData | undefined =
    clientState || localClientData || baseClientData || undefined;

  const assignedUsers: AssignedUser[] = [];
  const comments: ClientComment[] = [];
  const router = useRouter();
  const searchParams = useSearchParams();

  const breadcrumbItems = [
    { label: 'All clients', href: '/clients' },
    { label: 'Clients details' },
  ];

  const tabItemsData = useMemo(
    () => [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'quick_reference_all',
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: 'task',
      },
      // {
      //   id: 'subscriptions',
      //   label: 'Subscriptions',
      //   icon: (
      //     <span className="material-symbols-outlined text-lg">
      //       subscriptions
      //     </span>
      //   ),
      // },
      // {
      //   id: 'file-storage',
      //   label: 'File storage',
      //   icon: <span className="material-symbols-outlined text-lg">folder</span>,
      // },
      // {
      //   id: 'activity-log',
      //   label: 'Client activity log',
      //   icon: (
      //     <span className="material-symbols-outlined text-lg">event_note</span>
      //   ),
      // },
      // {
      //   id: 'key-dates',
      //   label: 'Key dates',
      //   icon: (
      //     <span className="material-symbols-outlined text-lg">
      //       calendar_month
      //     </span>
      //   ),
      // },
    ],
    []
  );
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams?.get('tab');
    return tabFromUrl && tabItemsData.some((item) => item.id === tabFromUrl)
      ? tabFromUrl
      : 'overview';
  });

  useEffect(() => {
    getClientDetails(clientId);
    setLocalClientData(null);
  }, [clientId, getClientDetails]);

  const handleClientUpdate = (updatedData: Partial<ClientData>) => {
    if (clientState) {
      setClientState((prevState) => {
        if (!prevState) return null;
        return {
          ...prevState,
          ...updatedData,
        };
      });
    }
  };

  const handleClientUpdated = (updatedClient: Client) => {
    if (updatedClient) {
      const transformedClientData = transformApiDataToClientData(updatedClient);
      setClientState(transformedClientData);
      setBaseClientData(transformedClientData);
      setLocalClientData(null);
    }
  };

  const updateClientState = (updatedData: Partial<ClientData>) => {
    setClientState((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        ...updatedData,
      };
    });
  };

  const handleEditClient = (
    clientData: ClientFormData,
    inviteClient: boolean
  ) => {
    if (updateClientState) {
      const fullName = `${clientData.firstName} ${clientData.lastName}`.trim();
      const fullAddress = [
        clientData.addressLine1,
        clientData.addressLine2,
        clientData.eircode,
      ]
        .filter(Boolean)
        .join(', ');

      updateClientState({
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        full_name: fullName,
        business_name: clientData.businessName,
        business_type: clientData.businessType,
        email: clientData.email,
        mobile: clientData.phone,
        phone: clientData.phone,
        contact_name: clientData.contactName,
        contact_role: clientData.contactRole,
        address: fullAddress,
        addressLine1: clientData.addressLine1,
        addressLine2: clientData.addressLine2,
        city: clientData.city,
        county: clientData.county,
        country: clientData.country,
        eircode: clientData.eircode,
        account_number: clientData.accountNo,
        farmType: clientData.farmType?.[0],
        herdNo: clientData.herdNo,
        tags: clientData.tags,
      });
    }

    setEditDialogOpen(false);
  };
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('tab', tabId);
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const tabFromUrl = searchParams?.get('tab');
    if (tabFromUrl && tabItemsData.some((item) => item.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, tabItemsData]);

  return (
    <div
      className="flex flex-col overflow-hidden text-sm bg-white h-full border border-basic-gray-light rounded-xl"
      data-list-container
    >
      <div className="">
        <Breadcrumbs
          items={breadcrumbItems}
          className="p-5 border-b border-basic-white"
        />
        <div className="flex items-center  px-5 pt-5 bg-white justify-between">
          {loading || !client ? (
            <ClientHeaderSkeleton />
          ) : (
            <div className="flex items-center gap-3">
              <Avatar
                className="rounded-lg"
                row={{
                  original: {
                    client: {
                      name: client.full_name || client.business_name,
                      surname: '',
                      avatarSrc: undefined,
                    },
                  },
                }}
                avatarSrc="w-9 h-9"
                tooltipText={client.full_name || client.business_name}
              />
              <span className="text-[28px] font-semibold text-gray-900">
                {client.full_name || client.business_name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* <Button
              variant="outline"
              onClick={() => toast.success('Message sent!')}
              className="border-none p-0"
            >
              <span className="material-symbols-outlined text-xl">chat</span>
            </Button>
            <span className="h-4 w-px bg-gray-200 ml-1"></span> */}
            <DropdownActionsNoLib
              items={[
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: 'delete',
                  onClick: () => {
                    return;
                  },
                },
              ]}
            />
          </div>
        </div>
        <Header
          showSearchButton={false}
          showDownloadButton={false}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabItemsData={tabItemsData}
          className="mb-2  border-b-0 p-2 shadow-none"
        />
      </div>
      {activeTab === 'overview' &&
        (loading || !client ? (
          <OverviewSkeleton />
        ) : (
          <Overview
            client={client}
            assignedUsers={assignedUsers}
            comments={comments}
            onClientUpdate={handleClientUpdate}
            onClientUpdated={handleClientUpdated}
            updateClientState={updateClientState}
            onEditClient={() => setEditDialogOpen(true)}
          />
        ))}
      {activeTab === 'tasks' && <ClientTasks tasks={mockClientTasks} />}
      {/* {activeTab === 'subscriptions' && <Subscriptions client={client} />}
      {activeTab === 'file-storage' && (
        <div className="flex-1 p-6">
          <NoResultsFound
            variant="payment"
            title="No files uploaded yet!"
            description="Upload important documents, contracts, and files related to this client. All uploaded files will be securely stored and easily accessible here."
            className="h-full flex items-center justify-center"
          />
        </div>
      )}
      {activeTab === 'activity-log' && (
        <div className="flex-1 p-6">
          <NoResultsFound
            variant="payment"
            title="No activity recorded yet!"
            description="Track all client interactions, updates, and important events. The activity log will show a complete history of all actions and communications with this client."
            className="h-full flex items-center justify-center"
          />
        </div>
      )}
      {activeTab === 'key-dates' && (
        <div className="flex-1 p-6">
          <NoResultsFound
            variant="payment"
            title="No key dates set!"
            description="Add important dates like contract renewals, project deadlines, meetings, and other significant events. Key dates will help you stay organized and never miss important milestones."
            className="h-full flex items-center justify-center"
          />
        </div>
      )} */}

      <AddClientDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onAddClient={handleEditClient}
        mode="edit"
        clientData={client}
        onClientUpdated={handleClientUpdated}
        updateClientState={updateClientState}
      />
    </div>
  );
}
