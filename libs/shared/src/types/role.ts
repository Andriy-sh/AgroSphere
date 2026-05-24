export interface Role {
    id: string;
    name: string;
    permissions?: string[];
    guard_name?: string;
    displayName?: string;
}
