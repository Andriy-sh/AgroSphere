import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/users/user-service';
import { UserRolesResponse } from '../services/users/user-types';
import { USER_KEYS } from '../query-constants/queryKeys';

export function useUsers(filters: { tenantId?: string } = {}, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<UserRolesResponse>({
    queryKey: USER_KEYS.roles(filters),
    queryFn: () => UserService.getUserRoles(filters),
    enabled,
  });

  return {
    userRoles: data?.data || [],
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : 'An error occurred'
      : null,
    getUserRoles: refetch,
  };
}
