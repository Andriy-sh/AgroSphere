import { FilterSection } from '@@agrosphere/shared';

export const baseSections: FilterSection[] = [
  {
    key: 'size',
    title: 'Size',
    icon: 'all_out',
    rows: [
      { label: 'Less than 1 ha', checked: false },
      { label: '1-5 ha', checked: false },
      { label: 'More than 5 ha', checked: false },
    ],
  },
  {
    key: 'cropType',
    title: 'Crop type',
    icon: 'psychiatry',
    rows: [
      { label: 'All', checked: false },
      { label: 'Grassland', checked: false },
      { label: 'Cereals', checked: false },
      { label: 'Maize', checked: false },
      { label: 'OSR', checked: false },
      { label: 'Potatoes', checked: false },
      { label: 'Oats', checked: false },
    ],
  },
  {
    key: 'soilType',
    title: 'Soil type',
    icon: 'grain',
    rows: [
      { label: 'Mineral', checked: false },
      { label: 'Peat', checked: false },
    ],
  },
];

export type FilterState = Record<string, string[]>;

export const filterUtils = {
  getAllActiveFilters: (filterState: FilterState): string[] => {
    return Object.values(filterState).flat();
  },

  hasActiveFilters: (filterState: FilterState): boolean => {
    return Object.values(filterState).some((filters) => filters.length > 0);
  },

  getActiveFiltersCount: (filterState: FilterState): number => {
    return Object.values(filterState).reduce(
      (total, filters) => total + filters.length,
      0
    );
  },

  clearAllFilters: (): FilterState => {
    return {};
  },

  getSectionFilters: (
    filterState: FilterState,
    sectionKey: string
  ): string[] => {
    return filterState[sectionKey] || [];
  },
};
