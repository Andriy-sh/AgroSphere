import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FilterState } from '@@agrosphere/shared';

interface TaskFiltersState {
  filters: FilterState;

  searchTerm: string;

  currentPage: number;

  activeTab: string;

  showFilters: boolean;

  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  taskTypeFilter: 'none' | 'asc' | 'desc';

  setFilters: (filters: FilterState) => void;
  setSearchTerm: (searchTerm: string) => void;
  setCurrentPage: (page: number) => void;
  setActiveTab: (tab: string) => void;
  setShowFilters: (show: boolean) => void;
  setAssignedToFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setClientFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setDueFilter: (filter: 'none' | 'newest' | 'oldest') => void;
  setStatusFilter: (filter: 'none' | 'asc' | 'desc') => void;
  setTaskTypeFilter: (filter: 'none' | 'asc' | 'desc') => void;
  resetFilters: () => void;
  resetAll: () => void;
}

const initialState = {
  filters: {
    clients: [],
    period: [],
    status: [],
    taskType: [],
    type: [],
  },
  searchTerm: '',
  currentPage: 1,
  activeTab: 'table',
  showFilters: true,
  assignedToFilter: 'none' as const,
  clientFilter: 'none' as const,
  dueFilter: 'none' as const,
  statusFilter: 'none' as const,
  taskTypeFilter: 'none' as const,
};

export const useTaskFiltersStore = create<TaskFiltersState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFilters: (filters: FilterState) => {
        set({ filters });
      },

      setSearchTerm: (searchTerm: string) => {
        set({ searchTerm, currentPage: 1 }); 
      },

      setCurrentPage: (currentPage: number) => {
        set({ currentPage });
      },

      setActiveTab: (activeTab: string) => {
        set({ activeTab });
      },

      setShowFilters: (showFilters: boolean) => {
        set({ showFilters });
      },

      setAssignedToFilter: (assignedToFilter: 'none' | 'asc' | 'desc') => {
        set({ assignedToFilter });
      },

      setClientFilter: (clientFilter: 'none' | 'asc' | 'desc') => {
        set({ clientFilter });
      },

      setDueFilter: (dueFilter: 'none' | 'newest' | 'oldest') => {
        set({ dueFilter });
      },

      setStatusFilter: (statusFilter: 'none' | 'asc' | 'desc') => {
        set({ statusFilter });
      },

      setTaskTypeFilter: (taskTypeFilter: 'none' | 'asc' | 'desc') => {
        set({ taskTypeFilter });
      },

      resetFilters: () => {
        set({
          filters: initialState.filters,
          searchTerm: '',
          currentPage: 1,
        });
      },

      resetAll: () => {
        set(initialState);
      },
    }),
    {
      name: 'task-filters-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        searchTerm: state.searchTerm,
        currentPage: state.currentPage,
        activeTab: state.activeTab,
        showFilters: state.showFilters,
        assignedToFilter: state.assignedToFilter,
        clientFilter: state.clientFilter,
        dueFilter: state.dueFilter,
        statusFilter: state.statusFilter,
        taskTypeFilter: state.taskTypeFilter,
      }),
    }
  )
);
