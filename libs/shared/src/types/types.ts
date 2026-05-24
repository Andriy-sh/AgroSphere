export interface ClientData {
  id: string;
  name: string;
  surname?: string;
  address: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  country?: string;
  eircode?: string;
  postcode?: string;
  phone: string;
  email?: string;
  herdNo: string;
  farmType?: string;
  assignedConsultant?: string;
  tags: string[];
  avatar?: string;
  subscription?: ClientSubscription;
  assignedUsers?: AssignedUser[];
  comments?: ClientComment[];
  business_name?: string;
  business_type?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  mobile?: string;
  full_address?: string;
  contact_name?: string;
  contact_role?: string | null;
  account_number?: string | null;
  derogation?: boolean;
  organic?: boolean | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientSubscription {
  planId: string;
  planName: string;
  price: string;
  period: string;
  startDate: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  canCancel?: boolean;
}

export interface AssignedUser {
  name: string;
  avatar?: string;
  role: string;
}

export interface ClientComment {
  user: string;
  avatar?: string;
  avatarSrc?: string;
  date: string;
  text: string;
}

export interface TaskRow {
  id: number;
  type: string;
  assignedTo: { name: string; avatar?: string };
  client: string;
  clientAvatar?: string;
  startAfter: string;
  due: string;
  status: 'done' | 'pending' | 'overdue';
}

export interface OverviewProps {
  client: ClientData;
  assignedUsers: AssignedUser[];
  comments: ClientComment[];
}
