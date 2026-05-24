import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface TasksUrlParams {
  search?: string;
  page?: number;
  tab?: string;
  showFilters?: boolean;
  assignedTo?: string;
  client?: string;
  due?: string;
  status?: string;
  taskType?: string;
  period?: string[];
  statusArray?: string[];
  taskTypeArray?: string[];
  clientsArray?: string[];
  typeArray?: string[];
}

export function useTasksUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentParams = useMemo(() => {
    const params: TasksUrlParams = {};

    const search = searchParams?.get('tasksSearch');
    if (search) params.search = search;

    const page = searchParams?.get('tasksPage');
    if (page) params.page = parseInt(page, 10);

    const tab = searchParams?.get('tasksTab');
    if (tab) params.tab = tab;

    const showFilters = searchParams?.get('tasksShowFilters');
    if (showFilters) {
      params.showFilters = showFilters === 'true';
    }

    const assignedTo = searchParams?.get('tasksAssignedTo');
    if (assignedTo) params.assignedTo = assignedTo;

    const client = searchParams?.get('tasksClient');
    if (client) params.client = client;

    const due = searchParams?.get('tasksDue');
    if (due) params.due = due;

    const status = searchParams?.get('tasksStatus');
    if (status) params.status = status;

    const taskType = searchParams?.get('tasksTaskType');
    if (taskType) params.taskType = taskType;

    const period = searchParams?.get('tasksPeriod');
    if (period) params.period = period.split(',').filter(Boolean);

    const statusArray = searchParams?.get('tasksStatusArray');
    if (statusArray)
      params.statusArray = statusArray.split(',').filter(Boolean);

    const taskTypeArray = searchParams?.get('tasksTaskTypeArray');
    if (taskTypeArray)
      params.taskTypeArray = taskTypeArray.split(',').filter(Boolean);

    const clientsArray = searchParams?.get('tasksClientsArray');
    if (clientsArray)
      params.clientsArray = clientsArray.split(',').filter(Boolean);

    const typeArray = searchParams?.get('tasksTypeArray');
    if (typeArray) params.typeArray = typeArray.split(',').filter(Boolean);

    return params;
  }, [searchParams]);

  const updateUrlParams = useCallback(
    (updates: Partial<TasksUrlParams>) => {
      const newSearchParams = new URLSearchParams(
        searchParams?.toString() || ''
      );

      if (updates.search !== undefined) {
        if (updates.search) {
          newSearchParams.set('tasksSearch', updates.search);
        } else {
          newSearchParams.delete('tasksSearch');
        }
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          newSearchParams.set('tasksPage', updates.page.toString());
        } else {
          newSearchParams.delete('tasksPage');
        }
      }

      if (updates.tab !== undefined) {
        if (updates.tab && updates.tab !== 'table') {
          newSearchParams.set('tasksTab', updates.tab);
        } else {
          newSearchParams.delete('tasksTab');
        }
      }

      if (updates.showFilters !== undefined) {
        if (updates.showFilters) {
          newSearchParams.set('tasksShowFilters', 'true');
        } else {
          newSearchParams.delete('tasksShowFilters');
        }
      }

      if (updates.assignedTo !== undefined) {
        if (updates.assignedTo && updates.assignedTo !== 'none') {
          newSearchParams.set('tasksAssignedTo', updates.assignedTo);
        } else {
          newSearchParams.delete('tasksAssignedTo');
        }
      }

      if (updates.client !== undefined) {
        if (updates.client && updates.client !== 'none') {
          newSearchParams.set('tasksClient', updates.client);
        } else {
          newSearchParams.delete('tasksClient');
        }
      }

      if (updates.due !== undefined) {
        if (updates.due && updates.due !== 'none') {
          newSearchParams.set('tasksDue', updates.due);
        } else {
          newSearchParams.delete('tasksDue');
        }
      }

      if (updates.status !== undefined) {
        if (updates.status && updates.status !== 'none') {
          newSearchParams.set('tasksStatus', updates.status);
        } else {
          newSearchParams.delete('tasksStatus');
        }
      }

      if (updates.taskType !== undefined) {
        if (updates.taskType && updates.taskType !== 'none') {
          newSearchParams.set('tasksTaskType', updates.taskType);
        } else {
          newSearchParams.delete('tasksTaskType');
        }
      }

      if (updates.period !== undefined) {
        if (updates.period && updates.period.length > 0) {
          newSearchParams.set('tasksPeriod', updates.period.join(','));
        } else {
          newSearchParams.delete('tasksPeriod');
        }
      }

      if (updates.statusArray !== undefined) {
        if (updates.statusArray && updates.statusArray.length > 0) {
          newSearchParams.set(
            'tasksStatusArray',
            updates.statusArray.join(',')
          );
        } else {
          newSearchParams.delete('tasksStatusArray');
        }
      }

      if (updates.taskTypeArray !== undefined) {
        if (updates.taskTypeArray && updates.taskTypeArray.length > 0) {
          newSearchParams.set(
            'tasksTaskTypeArray',
            updates.taskTypeArray.join(',')
          );
        } else {
          newSearchParams.delete('tasksTaskTypeArray');
        }
      }

      if (updates.clientsArray !== undefined) {
        if (updates.clientsArray && updates.clientsArray.length > 0) {
          newSearchParams.set(
            'tasksClientsArray',
            updates.clientsArray.join(',')
          );
        } else {
          newSearchParams.delete('tasksClientsArray');
        }
      }

      if (updates.typeArray !== undefined) {
        if (updates.typeArray && updates.typeArray.length > 0) {
          newSearchParams.set('tasksTypeArray', updates.typeArray.join(','));
        } else {
          newSearchParams.delete('tasksTypeArray');
        }
      }

      const newUrl = `${pathname}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
      }`;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearAllFilters = useCallback(() => {
    const newSearchParams = new URLSearchParams();

    const tasksTab = searchParams?.get('tasksTab');
    if (tasksTab) {
      newSearchParams.set('tasksTab', tasksTab);
    }
    const tasksShowFilters = searchParams?.get('tasksShowFilters');
    if (tasksShowFilters) {
      newSearchParams.set('tasksShowFilters', tasksShowFilters);
    }

    const newUrl = `${pathname}${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
    }`;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, router, pathname]);

  return {
    currentParams,
    updateUrlParams,
    clearAllFilters,
  };
}
