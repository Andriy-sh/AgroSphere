import { apiClient } from '../../client/axios-client';
import { UserRolesResponse } from './user-types';
import { MOCK_USER_ROLES } from '../../mocks/mock-user-roles';

export class UserService {
    private static readonly BASE_PATH = '/users';
    private static readonly USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    static {
        console.log('[UserService] NEXT_PUBLIC_USE_MOCK_DATA:', process.env.NEXT_PUBLIC_USE_MOCK_DATA);
        console.log('[UserService] USE_MOCK_DATA:', this.USE_MOCK_DATA);
    }

    static async getUserRoles(filters: { tenantId?: string } = {}): Promise<UserRolesResponse> {
        // Use mock data in development when no backend is available
        if (this.USE_MOCK_DATA) {
            console.log('[UserService] Using mock data for getUserRoles');
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300));

            if (filters.tenantId) {
                return {
                    data: MOCK_USER_ROLES.data.filter(
                        userRole => userRole.tenant.id === filters.tenantId
                    ),
                };
            }
            console.log('[UserService] Returning mock data:', MOCK_USER_ROLES);
            return MOCK_USER_ROLES;
        }

        let url = `${this.BASE_PATH}/roles`;
        if(filters.tenantId) {
            url += `?tenant_id=${filters.tenantId}`;
        }
        return apiClient.instance.get(url).then(response => response.data);
    }
}