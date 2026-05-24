import { useState, useCallback, useRef, useEffect } from 'react';
import type { ClientFormData } from '@@agrosphere/shared';
import { useCreateClient, useUpdateClient } from '@@agrosphere/shared';
import {
  mapFormToCreateRequest,
  mapFormToUpdateRequest,
} from './client-request.mapper';
import { mapServerErrors } from './client-error.mapper';
import type {
  UseAddClientDialogReturn,
  ClientFormMode,
} from './add-client.types';

interface UseAddClientDialogProps {
  mode: ClientFormMode;
  clientId?: string;
  onSuccess?: (data: ClientFormData, inviteClient: boolean) => void;
  updateClientState?: (
    data: Partial<import('@@agrosphere/shared').ClientData>
  ) => void;
}

export function useAddClientDialog({
  mode,
  clientId,
  onSuccess,
  updateClientState,
}: UseAddClientDialogProps): UseAddClientDialogReturn {
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const {
    createClient: addClient,
    loading: addLoading,
    error: addError,
  } = useCreateClient();
  const {
    updateClient,
    loading: updateLoading,
    error: updateError,
  } = useUpdateClient();

  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const loading = mode === 'add' ? addLoading : updateLoading;
  const error = mode === 'add' ? addError : updateError;

  const handleSubmit = useCallback(
    async (data: ClientFormData, inviteClient: boolean) => {
      try {
        setServerErrors({});

        if (mode === 'edit' && clientId) {
          // Update existing client
          if (updateClientState) {
            const fullName = `${data.firstName} ${data.lastName}`.trim();
            const fullAddress = [
              data.addressLine1,
              data.addressLine2,
              data.city,
              data.county,
              data.country,
              data.eircode,
            ]
              .filter(Boolean)
              .join(', ');

            updateClientState({
              first_name: data.firstName,
              last_name: data.lastName,
              full_name: fullName,
              business_name: data.businessName,
              business_type: data.businessType,
              email: data.email,
              mobile: data.phone,
              phone: data.phone,
              contact_name: data.contactName,
              contact_role: data.contactRole,
              address: fullAddress,
              addressLine1: data.addressLine1,
              addressLine2: data.addressLine2,
              city: data.city,
              county: data.county,
              country: data.country,
              eircode: data.eircode,
              account_number: data.accountNo,
              farmType: data.farmType?.[0],
              herdNo: data.herdNo,
              tags: data.tags,
            });
          }

          const updateRequest = mapFormToUpdateRequest(data);
          await updateClient(clientId, updateRequest);
          onSuccessRef.current?.(data, inviteClient);
        } else {
          const createRequest = mapFormToCreateRequest(data);
          const result = await addClient(createRequest);
          if (result) {
            onSuccessRef.current?.(data, inviteClient);
          }
        }
      } catch (err) {
        const { fieldErrors, generalError } = mapServerErrors(err);
        const errors = {
          ...fieldErrors,
          ...(generalError && { general: generalError }),
        };
        setServerErrors(errors);
        throw err;
      }
    },
    [mode, clientId, addClient, updateClient, updateClientState]
  );

  return {
    handleSubmit,
    loading,
    error: error ? String(error) : null,
    serverErrors,
  };
}
