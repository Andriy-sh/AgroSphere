'use client';
import React, { useMemo, useState, useRef } from 'react';
import { mockClients, type ExistingClient } from '@@agrosphere/shared';
import { getClientFormDefaults } from './client-form.defaults';
import { useAddClientDialog } from './use-add-client-dialog';
import { AddClientForm } from './add-client-form';
import { AddClientModal } from './add-client-modal';
import type { AddClientDialogProps } from './add-client.types';
import type { ClientFormData } from '@@agrosphere/shared';

export function AddClientDialog({
  isOpen,
  onClose,
  onAddClient,
  mode = 'add',
  clientData: existingClientData,
  onClientUpdated,
  updateClientState,
}: AddClientDialogProps) {
  const [inviteClient, setInviteClient] = useState(false);
  const formSubmitRef = useRef<(() => void) | null>(null);

  const defaultValues = useMemo(
    () => getClientFormDefaults(mode, existingClientData),
    [mode, existingClientData]
  );

  const { handleSubmit, loading, serverErrors } = useAddClientDialog({
    mode,
    clientId: existingClientData?.id,
    onSuccess: (data, invite) => {
      console.log('onSuccess called with data:', data, 'invite:', invite);
      try {
        onAddClient(data, invite);
      } catch (error) {
        console.error('Error in onAddClient:', error);
      } finally {
        onClose();
        setInviteClient(false);
      }
    },
    updateClientState,
  });

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      await handleSubmit(data, inviteClient);
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  };

  const handleSaveClick = () => {
    if (formSubmitRef.current) {
      formSubmitRef.current();
    }
  };

  const handleClose = () => {
    setInviteClient(false);
    onClose();
  };

  return (
    <AddClientModal
      isOpen={isOpen}
      mode={mode}
      onClose={handleClose}
      onSave={handleSaveClick}
      canSave={true}
      loading={loading}
      showInviteToggle={mode === 'add'}
      inviteChecked={inviteClient}
      onInviteChange={setInviteClient}
    >
      <AddClientForm
        mode={mode}
        defaultValues={defaultValues}
        existingClients={mockClients as ExistingClient[]}
        excludeClientId={mode === 'edit' ? existingClientData?.id : undefined}
        serverErrors={serverErrors}
        onSubmit={handleFormSubmit}
        formSubmitRef={formSubmitRef}
      />
    </AddClientModal>
  );
}
