import { Tenant } from '../../../types/tenant';
import { Role } from '../../../types/role';

export interface UserRole {
    tenant: Tenant;
    role: Role;
    status: 'active' | 'inactive' | 'pending';
}

export interface UserRolesResponse {
    data: UserRole[];
}
