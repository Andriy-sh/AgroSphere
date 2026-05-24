'use client';

import React, { useCallback, useRef } from 'react';
import { AddButton, Icon, PageHeader } from '@@agrosphere/shared';
import { useFiltersStore } from '@/stores/use-filters-store';

interface TaskHeaderProps {
  onAddTask: () => void;
}

export const TaskHeader = React.memo(function TaskHeader({
  onAddTask,
}: TaskHeaderProps) {
  const { showFilters, toggleFilters } = useFiltersStore();
  const lastToggleTimeRef = useRef(0);

  const handleToggleFilters = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 200) {
      return;
    }
    lastToggleTimeRef.current = now;
    toggleFilters();
  }, [toggleFilters]);

  return (
    <div className="flex items-center justify-between bg-white rounded-t-xl max-h-full">
      <div className="flex items-center">
        <button
          type="button"
          className="focus:outline-none flex items-center justify-center h-10 w-10"
          onClick={handleToggleFilters}
          aria-label="Toggle filters"
        >
          <Icon
            className={` text-basic-gray ${!showFilters ? 'rotate-180' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            icon="menu_open"
          />
        </button>
        <PageHeader
          icon="description"
          title="Tasks"
          iconColor="text-[#00AF4D]"
          titleColor="text-[#222]"
          titleClassName="font-semibold"
        />
      </div>

      <AddButton buttonText="Add" />
    </div>
  );
});
