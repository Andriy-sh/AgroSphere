export interface Tenant {
    id: string;
    name: string;
    type: 'advisor' | 'farmer' | 'contractor' | 'lab';
    email: string;
    telephone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    stripe_id?: string;
}
