'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FiltersStore {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set) => ({
      showFilters: false,
      setShowFilters: (show: boolean) => {
        set({ showFilters: show });
      },
      toggleFilters: () => {
        set((state) => {
          const newValue = !state.showFilters;
          return { showFilters: newValue };
        });
      },
    }),
    {
      name: 'filters-store',
    }
  )
);
