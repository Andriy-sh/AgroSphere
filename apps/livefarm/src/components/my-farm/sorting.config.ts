export type SortField = 'id' | 'name' | 'size';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  id: SortField;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'id', label: 'ID', icon: 'swap_vert' },
  { id: 'name', label: 'Name', icon: 'swap_vert' },
  { id: 'size', label: 'Size', icon: 'swap_vert' },
];

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export const sortingUtils = {
  getDefaultSort: (): SortState => ({
    field: 'name',
    direction: 'asc',
  }),

  toggleDirection: (currentDirection: SortDirection): SortDirection => {
    return currentDirection === 'asc' ? 'desc' : 'asc';
  },

  getSortIcon: (
    field: SortField,
    currentField: SortField,
    direction: SortDirection
  ): string => {
    if (field !== currentField) {
      return 'swap_vert';
    }
    return direction === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  },

  getSortLabel: (field: SortField, direction: SortDirection): string => {
    const fieldLabels: Record<SortField, string> = {
      id: 'ID',
      name: 'Name',
      size: 'Size',
    };

    return `${fieldLabels[field]}`;
  },
};
