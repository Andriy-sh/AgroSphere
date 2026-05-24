export interface TeamUser {
  id: string;
  name: string;
  email: string;
  userRole:
    | 'Administrator'
    | 'Field advisor'
    | 'Contractor manager'
    | 'Viewer'
    | 'Support';
  status: 'Active' | 'Inactive' | 'Invited';
  avatar?: string;
  initials: string;
  lastActive?: string;
  joinDate: string;
  department?: string;
  location?: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface TeamUsersResponse {
  data: TeamUser[];
  links: PaginationLinks;
  meta: PaginationMeta;
  roles: string[];
  statuses: string[];
}

export interface TeamUsersFilters {
  status?: 'active' | 'pending' | 'inactive';
  per_page?: number;
  page?: number;
}

// Team Invitations Types
export interface TeamInvitationUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TeamInvitationInvitedBy {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TeamInvitationRole {
  value: string;
  label: string;
}

export interface TeamInvitation {
  id: number;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  role: string;
  role_display: string;
  invited_by: TeamInvitationInvitedBy;
  token: string;
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
  declined_at: string | null;
  user: TeamInvitationUser | null;
}

export interface TeamInvitationsResponse {
  data: TeamInvitation[];
  links: PaginationLinks;
  meta: PaginationMeta;
  statuses: string[];
  roles: TeamInvitationRole[];
}

export interface TeamInvitationsFilters {
  per_page?: number;
  page?: number;
}

// Team Invite Types
export interface TeamInviteUser {
  email: string;
  role: string;
}

export interface TeamInviteRequest {
  users: TeamInviteUser[];
}

export interface TeamInviteResult {
  email: string;
  status: 'success' | 'error';
  message: string;
}

export interface TeamInviteResponse {
  success: boolean;
  message: string;
  results: TeamInviteResult[];
}

export interface TeamInviteError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface UserActivationResponse {
  success: boolean;
  message: string;
}

export interface UserActivationError {
  success?: boolean;
  message: string;
}
