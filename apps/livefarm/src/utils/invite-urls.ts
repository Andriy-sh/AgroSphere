export type ValidRole = 'farmer' | 'advisor' | 'contractor';

export interface InviteUrlParams {
  role: ValidRole;
  organization?: string;
  email?: string;
  inviterName?: string;
  baseUrl?: string;
}

export const createInviteUrl = (params: InviteUrlParams): string => {
  const {
    role,
    organization,
    email,
    inviterName,
    baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost',
  } = params;

  const url = new URL(`${baseUrl}/invite`);

  url.searchParams.set('role', role);

  if (organization && organization.trim().length > 0) {
    url.searchParams.set('organization', organization.trim());
  }

  if (email && email.trim().length > 0) {
    url.searchParams.set('email', email.trim());
  }

  if (inviterName && inviterName.trim().length > 0) {
    url.searchParams.set('inviterName', inviterName.trim());
  }

  const finalUrl = url.toString();

  return finalUrl;
};

export const createRegistrationUrlFromInvite = (
  params: InviteUrlParams
): string => {
  const {
    role,
    organization,
    baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost',
  } = params;

  const url = new URL(`${baseUrl}/sign-up`);

  url.searchParams.set('role', role);

  if (organization && organization.trim().length > 0) {
    url.searchParams.set('organization', organization.trim());
  }

  const finalUrl = url.toString();

  return finalUrl;
};

export const parseInviteUrl = (url: string): InviteUrlParams | null => {
  try {
    const urlObj = new URL(url);
    const role = urlObj.searchParams.get('role');

    if (!role || !['farmer', 'advisor', 'contractor'].includes(role)) {
      return null;
    }

    const params: InviteUrlParams = {
      role: role as ValidRole,
      organization: urlObj.searchParams.get('organization') || undefined,
      email: urlObj.searchParams.get('email') || undefined,
      inviterName: urlObj.searchParams.get('inviterName') || undefined,
    };

    return params;
  } catch (error) {
    return null;
  }
};

export const validateInviteParams = (params: InviteUrlParams): boolean => {
  const { role, organization } = params;

  if (!role || !['farmer', 'advisor', 'contractor'].includes(role)) {
    return false;
  }

  if (
    (role === 'advisor' || role === 'contractor') &&
    (!organization || organization.trim().length < 2)
  ) {
    return false;
  }

  if (role === 'farmer' && organization && organization.trim().length > 0) {
    return false;
  }

  return true;
};

export const getCurrentInviteParams = (): InviteUrlParams | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return parseInviteUrl(window.location.href);
};
