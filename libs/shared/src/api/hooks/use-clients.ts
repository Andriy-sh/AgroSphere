import { useApi } from './use-api';
import { ClientService } from '../services/clients/client-service';
import {
  ClientsResponse,
  ClientFilters,
  ClientDetailsResponse,
  CreateClientRequest,
  CreateClientResponse,
  Client,
} from '../services/clients/client-types';
import { useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useClients() {
  const {
    data: clientsData,
    loading,
    error,
    execute: executeClients,
  } = useApi<ClientsResponse>();

  const getClients = useCallback(
    (filters?: ClientFilters) =>
      executeClients(() => ClientService.getClients(filters)),
    [executeClients]
  );

  return {
    clients: clientsData?.data || [],
    meta: clientsData?.meta,
    links: clientsData?.links,
    search: clientsData?.search,
    paginate: clientsData?.paginate,
    loading,
    error,
    getClients,
  };
}

export function useClientDetails() {
  const {
    data: clientDetails,
    loading,
    error,
    execute: executeDetails,
  } = useApi<ClientDetailsResponse>();

  const getClientDetails = useCallback(
    (clientId: string) =>
      executeDetails(() => ClientService.getClientDetails(clientId)),
    [executeDetails]
  );

  return {
    clientDetails,
    loading,
    error,
    getClientDetails,
  };
}

export function useCreateClient(options?: {
  onSuccess?: (data: CreateClientResponse) => void;
}) {
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(options?.onSuccess);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
  }, [options?.onSuccess]);

  const mutation = useMutation<
    CreateClientResponse,
    Error,
    CreateClientRequest
  >({
    mutationFn: (clientData: CreateClientRequest) =>
      ClientService.createClient(clientData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      onSuccessRef.current?.(data);
    },
  });

  const createClient = useCallback(
    (clientData: CreateClientRequest) => mutation.mutateAsync(clientData),
    [mutation]
  );

  return {
    createdClient: mutation.data?.client,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    createClient,
  };
}

export function useUpdateClient() {
  const {
    data: updateClientData,
    loading,
    error,
    execute: executeUpdate,
  } = useApi<{ client: Client }>();

  const updateClient = useCallback(
    (clientId: string, clientData: Partial<Client>) =>
      executeUpdate(() => ClientService.updateClient(clientId, clientData)),
    [executeUpdate]
  );

  return {
    updatedClient: updateClientData?.client,
    loading,
    error,
    updateClient,
  };
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ success: boolean }, Error, string>({
    mutationFn: (clientId: string) => ClientService.deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteClient = useCallback(
    (clientId: string) => mutation.mutateAsync(clientId),
    [mutation]
  );

  return {
    deleteResult: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    deleteClient,
  };
}
