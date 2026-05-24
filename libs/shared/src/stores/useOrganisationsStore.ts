import { create } from 'zustand';
import { Tenant } from '../types/tenant';

interface OrganisationStore {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant) => void;
}

export const useOrganisationsStore = create<OrganisationStore>((set) => ({
  currentTenant: null,
  setCurrentTenant: (tenant: Tenant) => set({ currentTenant: tenant }),
}));
