'use client';
import { useApi } from './use-api';
import { TeamService } from '../services/teams/team-service';
import {
  TeamUsersResponse,
  TeamUsersFilters,
  TeamInvitationsResponse,
  TeamInvitationsFilters,
  TeamInviteRequest,
  TeamInviteResponse,
  UserActivationResponse,
} from '../services/teams/team-types';
import { useCallback } from 'react';

export function useTeamUsersApi() {
  const { data, loading, error, execute } = useApi<TeamUsersResponse>();

  const fetchUsers = useCallback(
    async (filters?: TeamUsersFilters) => {
      const result = await execute(() => TeamService.getUsers(filters));
      return result;
    },
    [execute]
  );

  return {
    users: data?.data || [],
    pagination: data
      ? {
          links: data.links,
          meta: data.meta,
        }
      : null,
    roles: data?.roles || [],
    statuses: data?.statuses || [],
    loading,
    error,
    fetchUsers,
  };
}

export function useTeamInvitationsApi() {
  const { data, loading, error, execute } = useApi<TeamInvitationsResponse>();

  const fetchInvitations = useCallback(
    async (filters?: TeamInvitationsFilters) => {
      const result = await execute(() => TeamService.getInvitations(filters));
      return result;
    },
    [execute]
  );

  return {
    invitations: data?.data || [],
    pagination: data
      ? {
          links: data.links,
          meta: data.meta,
        }
      : null,
    statuses: data?.statuses || [],
    roles: data?.roles || [],
    loading,
    error,
    fetchInvitations,
  };
}

export function useTeamInviteApi() {
  const { data, loading, error, execute } = useApi<TeamInviteResponse>();

  const inviteUsers = useCallback(
    async (inviteData: TeamInviteRequest) => {
      const result = await execute(() => TeamService.inviteUsers(inviteData));
      return result;
    },
    [execute]
  );

  return {
    response: data,
    loading,
    error,
    inviteUsers,
  };
}

export function useTeamUserActivationApi() {
  const { data, loading, error, execute } = useApi<UserActivationResponse>();

  const activateUser = useCallback(
    async (userId: string) => {
      const result = await execute(() => TeamService.activateUser(userId));
      return result;
    },
    [execute]
  );

  const deactivateUser = useCallback(
    async (userId: string) => {
      const result = await execute(() => TeamService.deactivateUser(userId));
      return result;
    },
    [execute]
  );

  return {
    response: data,
    loading,
    error,
    activateUser,
    deactivateUser,
  };
}
