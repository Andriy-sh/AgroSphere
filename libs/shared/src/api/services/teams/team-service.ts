import { apiClient } from '../../client/axios-client';
import {
  TeamUsersResponse,
  TeamUsersFilters,
  TeamUser,
  TeamInvitationsResponse,
  TeamInvitationsFilters,
  TeamInviteRequest,
  TeamInviteResponse,
  UserActivationResponse,
} from './team-types';

export class TeamService {
  private static readonly BASE_PATH = '/teams';

  static async getUsers(
    filters?: TeamUsersFilters
  ): Promise<TeamUsersResponse> {
    const response = await apiClient.instance.get(`${this.BASE_PATH}/users`, {
      params: filters,
    });

    const transformedData = response.data.data.map(
      (user: {
        id: string;
        full_name: string;
        email: string;
        tenant_role: string;
        status: string;
        first_name: string;
        last_name: string;
        invited_at: string;
      }) => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        userRole: user.tenant_role as TeamUser['userRole'],
        status:
          user.status === 'active'
            ? 'Active'
            : user.status === 'pending'
            ? 'Invited'
            : 'Inactive',
        initials: user.first_name.charAt(0) + user.last_name.charAt(0),
        joinDate: user.invited_at,
        department: 'Team Member',
      })
    );

    return {
      ...response.data,
      data: transformedData,
    };
  }

  static async getInvitations(
    filters?: TeamInvitationsFilters
  ): Promise<TeamInvitationsResponse> {
    const response = await apiClient.instance.get(
      `${this.BASE_PATH}/invitations`,
      {
        params: filters,
      }
    );
    return response.data;
  }

  static async inviteUsers(
    inviteData: TeamInviteRequest
  ): Promise<TeamInviteResponse> {
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/users/invite`,
      inviteData
    );
    return response.data;
  }

  static async activateUser(userId: string): Promise<UserActivationResponse> {
    const response = await apiClient.instance.put(
      `${this.BASE_PATH}/users/${userId}/activate`
    );
    return response.data;
  }

  static async deactivateUser(userId: string): Promise<UserActivationResponse> {
    const response = await apiClient.instance.put(
      `${this.BASE_PATH}/users/${userId}/deactivate`
    );
    return response.data;
  }
}
