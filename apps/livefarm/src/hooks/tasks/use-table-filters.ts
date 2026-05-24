import { useCallback } from 'react';
import { FilterState, TaskType } from '@@agrosphere/shared';

interface FilterOptions {
  taskTypeFilter: 'none' | 'asc' | 'desc';
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
}

export function useTableFilters() {
  const applyFilters = useCallback(
    (
      data: TaskType[],
      searchTerm: string,
      activeFilters: FilterState,
      filterOptions: FilterOptions
    ): TaskType[] => {
      let filteredData = [...data];

      if (searchTerm) {
        filteredData = filteredData.filter(
          (task) =>
            (task.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.task_number || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (task.assigned_to_organisation?.name || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (task.client?.name || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (task.task_type || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      if (activeFilters.period.length > 0) {
        filteredData = filteredData.filter((task) => {
          const taskDate = new Date(task.active_date || task.complete_by || '');
          const today = new Date();
          const isToday = taskDate.toDateString() === today.toDateString();
          const isLate = taskDate < today && task.task_status !== 'completed';

          return activeFilters.period.some((period) => {
            switch (period) {
              case 'Late tasks': {
                return isLate;
              }
              case 'Today': {
                return isToday;
              }
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
              default: {
                return true;
              }
            }
          });
        });
      }

      if (activeFilters.status.length > 0) {
        filteredData = filteredData.filter((task) => {
          return activeFilters.status.some((status) => {
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
                return true;
            }
          });
        });
      }

      if (activeFilters.taskType.length > 0) {
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

        filteredData = filteredData.filter((task) => {
          return activeFilters.taskType.some((type) => {
            if (type === 'All') {
              return true;
            }
            const taskTypeCategory = mapTaskTypeToCategory(task.task_type);
            return taskTypeCategory === type;
          });
        });
      }

      const pendingTasks = filteredData.filter(
        (task) => task.status === 'pending'
      );
      const nonPendingTasks = filteredData.filter(
        (task) => task.status !== 'pending'
      );

      if (filterOptions.taskTypeFilter !== 'none') {
        nonPendingTasks.sort((a, b) => {
          const comparison = (a.task_type || '').localeCompare(
            b.task_type || ''
          );
          return filterOptions.taskTypeFilter === 'asc'
            ? comparison
            : -comparison;
        });
      }

      if (filterOptions.assignedToFilter !== 'none') {
        filteredData.sort((a, b) => {
          const aName = a.assigned_to_organisation?.name || '';
          const bName = b.assigned_to_organisation?.name || '';

          const comparison = aName.localeCompare(bName);
          return filterOptions.assignedToFilter === 'asc'
            ? comparison
            : -comparison;
        });
      }

      if (filterOptions.clientFilter !== 'none') {
        filteredData.sort((a, b) => {
          const comparison = (a.client?.name || '').localeCompare(
            b.client?.name || ''
          );
          return filterOptions.clientFilter === 'asc'
            ? comparison
            : -comparison;
        });
      }

      if (filterOptions.dueFilter !== 'none') {
        nonPendingTasks.sort((a, b) => {
          const getValidDate = (
            dateString: string | null | undefined
          ): number => {
            if (!dateString) return 0;
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? 0 : date.getTime();
          };

          const dateA = getValidDate(a.complete_by || a.active_date);
          const dateB = getValidDate(b.complete_by || b.active_date);
          return filterOptions.dueFilter === 'newest'
            ? dateB - dateA
            : dateA - dateB;
        });
      }

      if (filterOptions.statusFilter !== 'none') {
        nonPendingTasks.sort((a, b) => {
          const getStatusPriority = (status: string): number => {
            switch (status) {
              case 'in_progress':
                return 0;
              case 'pending':
                return 1;
              case 'not_started':
                return 2;
              case 'completed':
                return 3;
              case 'cancelled':
                return 4;
              case 'block':
                return 1;
              case 'Not Started':
                return 2;
              default:
                return 4;
            }
          };

          const priorityA = getStatusPriority(a.task_status || '');
          const priorityB = getStatusPriority(b.task_status || '');

          return filterOptions.statusFilter === 'asc'
            ? priorityA - priorityB
            : priorityB - priorityA;
        });
      }

      return [...pendingTasks, ...nonPendingTasks];
    },
    []
  );

  const sortTasksNotStartedFirst = useCallback((tasks: TaskType[]) => {
    return [...tasks].sort((a, b) => {
      if (a.task_status === 'not_started' && b.task_status !== 'not_started')
        return -1;
      if (a.task_status !== 'not_started' && b.task_status === 'not_started')
        return 1;
      const dateA = new Date(a.active_date || a.complete_by || '').getTime();
      const dateB = new Date(b.active_date || b.complete_by || '').getTime();

      return dateB - dateA;
    });
  }, []);

  return {
    applyFilters,
    sortTasksNotStartedFirst,
  };
}
