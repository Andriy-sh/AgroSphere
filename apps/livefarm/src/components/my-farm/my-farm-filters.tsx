'use client';
import { Filters } from '@@agrosphere/shared';
import { useMemo } from 'react';
import { baseSections, FilterState, filterUtils } from './filters.config';

interface MyFarmFiltersProps {
  activeFilters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function MyFarmFilters({
  activeFilters,
  onFiltersChange,
}: MyFarmFiltersProps) {
  const sections = useMemo(
    () =>
      baseSections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          checked: activeFilters[section.key]?.includes(row.label) ?? false,
        })),
      })),
    [activeFilters]
  );

  const handleReset = () => {
    const clearedFilters = filterUtils.clearAllFilters();
    onFiltersChange(clearedFilters);
  };

  return (
    <aside
      aria-label="Filters"
      className="flex-shrink-0 border border-basic-gray-light rounded-xl bg-white overflow-y-auto w-60 h-full max-h-full"
    >
      <Filters
        sections={sections}
        titleClassName="text-sm font-semibold text-basic-black"
        onReset={handleReset}
        onFiltersChange={onFiltersChange}
        initialFilterState={activeFilters}
        className="h-full"
      />
    </aside>
  );
}
