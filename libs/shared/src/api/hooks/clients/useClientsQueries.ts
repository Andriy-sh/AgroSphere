import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { ClientService } from '../../services/clients/client-service';
import {
  ClientsResponse,
  ClientFilters,
} from '../../services/clients/client-types';

const getClientsQueryKey = (filters?: ClientFilters) => ['clients', filters];

export const useGetClients = (filters?: ClientFilters, enabled = true) => {
  return useQuery<ClientsResponse>({
    queryKey: getClientsQueryKey(filters),
    queryFn: () => ClientService.getClients(filters),
    enabled,
  });
};

export const useInfiniteGetClients = (
  filters?: Omit<ClientFilters, 'page' | 'per_page'>,
  options?: {
    perPage?: number;
    enabled?: boolean;
  }
) => {
  const { perPage = 20, enabled = true } = options || {};

  return useInfiniteQuery<
    ClientsResponse,
    Error,
    InfiniteData<ClientsResponse>,
    readonly unknown[],
    number
  >({
    queryKey: ['clients', 'infinite', filters] as const,
    queryFn: ({ pageParam }) =>
      ClientService.getClients({
        ...filters,
        page: (pageParam as number) ?? 1,
        per_page: perPage,
      }),
    getNextPageParam: (lastPage: ClientsResponse) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    enabled,
    initialPageParam: 1,
  });
};
