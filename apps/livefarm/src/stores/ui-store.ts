import { create } from 'zustand';

interface UIStore {
  // Add Client Modal
  isAddClientModalOpen: boolean;
  openAddClientModal: () => void;
  closeAddClientModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Add Client Modal
  isAddClientModalOpen: false,
  openAddClientModal: () => set({ isAddClientModalOpen: true }),
  closeAddClientModal: () => set({ isAddClientModalOpen: false }),
}));
