import { create } from 'zustand';

interface FiltersState {
  isFiltersOpen: boolean;
  toggleFilters: () => void;
  setFiltersOpen: (isOpen: boolean) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  isFiltersOpen: false,
  toggleFilters: () =>
    set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  setFiltersOpen: (isOpen: boolean) => set({ isFiltersOpen: isOpen }),
}));
