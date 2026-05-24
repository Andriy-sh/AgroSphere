'use client';

import React, { useMemo } from 'react';
import { FilterSection, FilterState, Filters } from '@@agrosphere/shared';

interface TaskFiltersProps {
  sections: FilterSection[];
  activeFilters: FilterState;
  onReset: () => void;
  onFiltersChange: (filters: FilterState) => void;
  loading?: boolean;
}

export const TaskFilters = React.memo(function TaskFilters({
  sections,
  activeFilters,
  onReset,
  onFiltersChange,
  loading = false,
}: TaskFiltersProps) {
  const sectionsWithActiveFilters = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => {
        let isChecked = false;

        if (section.title === 'Period') {
          isChecked = activeFilters.period.includes(row.label);
        } else if (section.title === 'Status') {
          isChecked = activeFilters.status.includes(row.label);
        } else if (section.title === 'Task type') {
          isChecked = activeFilters.taskType.includes(row.label);
        }

        return {
          ...row,
          checked: isChecked,
        };
      }),
    }));
  }, [sections, activeFilters]);

  const handleFiltersChange = (filters: FilterState) => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="flex-shrink-0 border border-basic-gray-light rounded-xl bg-white overflow-y-auto w-60 h-full max-h-full">
      <Filters
        sections={sectionsWithActiveFilters}
        onReset={handleReset}
        onFiltersChange={handleFiltersChange}
        className="h-full"
        loading={loading}
      />
    </div>
  );
});
