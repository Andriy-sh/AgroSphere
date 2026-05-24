'use client';
import { useMemo } from 'react';

import { FilterState } from '../components/filters/filters';
import { TaskType } from '../api/services/tasks/task-types';

const mapTaskTypeToCategory = (taskType: string | null): string => {
  if (!taskType) return 'Others';

  switch (taskType.toLowerCase()) {
    case 'soil sampler':
    case 'soil_sampling':
      return 'Soil sampling';
    case 'pesticide spraying':
    case 'pesticide_spraying':
      return 'Pesticide spraying';
    case 'fertilizer application':
    case 'fertilizer_application':
      return 'Fertilizer application';
    case 'drainage inspection':
    case 'drainage_inspection':
      return 'Drainage inspection';
    case 'soil preparation':
    case 'soil_preparation':
      return 'Soil preparation';
  }

  return 'Others';
};

export function useTaskFilters(
  tasks: TaskType[],
  searchTerm: string,
  activeFilters: FilterState
) {
  const filteredTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }

    const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
    const hasStatusFilters =
      activeFilters?.status && activeFilters.status.length > 0;
    const hasTaskTypeFilters =
      activeFilters?.taskType && activeFilters.taskType.length > 0;
    const hasPeriodFilters =
      activeFilters?.period && activeFilters.period.length > 0;

    if (
      !hasSearchTerm &&
      !hasStatusFilters &&
      !hasTaskTypeFilters &&
      !hasPeriodFilters
    ) {
      return tasks;
    }

    let filtered = tasks;

    if (hasSearchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          (task.id || '').toLowerCase().includes(searchLower) ||
          (task.task_type || '').toLowerCase().includes(searchLower) ||
          (task.client?.name || '').toLowerCase().includes(searchLower)
      );
    }

    if (hasStatusFilters) {
      filtered = filtered.filter((task) =>
        activeFilters.status.some((status) => {
          switch (status) {
            case 'All':
              return true;
            case 'Inbox':
              return task.task_status === 'not_started';
            case 'Not started':
              return task.task_status === 'pending';
            case 'In progress':
              return task.task_status === 'in_progress';
            case 'Complete':
              return task.task_status === 'completed';
            case 'Declined':
              return task.task_status === 'cancelled';
            default:
              return task.task_status === status;
          }
        })
      );
    }

    if (hasTaskTypeFilters) {
      filtered = filtered.filter((task) => {
        const taskTypeCategory = mapTaskTypeToCategory(task.task_type);

        return activeFilters.taskType.some((type) => {
          if (type === 'All') {
            return true;
          }
          const matches = taskTypeCategory === type;
          return matches;
        });
      });
    }

    if (hasPeriodFilters) {
      const today = new Date();
      const todayString = today.toDateString();

      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.active_date || '');
        if (isNaN(taskDate.getTime())) return false;
        const isToday = taskDate.toDateString() === todayString;
        const isLate = taskDate < today && task.task_status !== 'completed';

        return activeFilters.period.some((period) => {
          switch (period) {
            case 'Late tasks':
              return isLate;
            case 'Today':
              return isToday;
            case 'Last 7 days': {
              const sevenDaysAgo = new Date(
                today.getTime() - 7 * 24 * 60 * 60 * 1000
              );
              return taskDate >= sevenDaysAgo && taskDate <= today;
            }
            case 'Last 30 days': {
              const thirtyDaysAgo = new Date(
                today.getTime() - 30 * 24 * 60 * 60 * 1000
              );
              return taskDate >= thirtyDaysAgo && taskDate <= today;
            }
            case 'Next 7 days': {
              const sevenDaysFromNow = new Date(
                today.getTime() + 7 * 24 * 60 * 60 * 1000
              );
              return taskDate >= today && taskDate <= sevenDaysFromNow;
            }
            case 'Next 3 months': {
              const threeMonthsFromNow = new Date(
                today.getTime() + 90 * 24 * 60 * 60 * 1000
              );
              return taskDate >= today && taskDate <= threeMonthsFromNow;
            }
            default:
              return true;
          }
        });
      });
    }

    return filtered;
  }, [tasks, searchTerm, activeFilters]);

  return filteredTasks;
}
