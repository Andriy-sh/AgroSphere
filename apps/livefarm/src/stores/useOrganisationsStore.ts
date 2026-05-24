import { create } from 'zustand';
import {Tenant} from '@@agrosphere/shared';
interface organisation {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant) => void;
}

export const useOrganisationsStore = create<organisation>((set) => ({
  currentTenant: null,
  setCurrentTenant: (tenant: Tenant) => set({ currentTenant: tenant }),
}));
  