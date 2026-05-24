import React from 'react';
import { FilterSection } from '../components/filters/filters';

interface TaskStatusCounts {
  not_started: number;
  in_progress: number;
  rejected: number;
  collected: number;
  cancelled: number;
  lab: number;
  complete: number;
}

export function createTaskFilterSectionsFromApi(
  statusCounts: TaskStatusCounts,
  activeFilters: {
    period: string[];
    status: string[];
    taskType: string[];
  }
): FilterSection[] {
  const totalTasks =
    statusCounts.not_started +
    statusCounts.in_progress +
    statusCounts.rejected +
    statusCounts.complete;

  return [
    {
      key: 'period',
      title: 'Period',
      icon: 'calendar_today',
      rows: [
        {
          checked: activeFilters.period.includes('Late tasks'),
          label: 'Late tasks',
          badgeCount: 0,
        },
        {
          checked: activeFilters.period.includes('Today'),
          label: 'Today',
          badgeCount: 0,
        },
        {
          checked: activeFilters.period.includes('Last 7 days'),
          label: 'Last 7 days',
          badgeCount: 0,
        },
        {
          checked: activeFilters.period.includes('Last 30 days'),
          label: 'Last 30 days',
          badgeCount: 0,
        },
        {
          checked: activeFilters.period.includes('Next 7 days'),
          label: 'Next 7 days',
          badgeCount: 0,
        },
        {
          checked: activeFilters.period.includes('Next 3 months'),
          label: 'Next 3 months',
          badgeCount: 0,
        },
        {
          checked: false,
          label: 'Custom',
          isCustom: true,
        },
      ],
    },
    {
      key: 'status',
      title: 'Status',
      icon: 'radio_button_partial',
      rows: [
        {
          checked: activeFilters.status.includes('All'),
          label: 'All',
          badgeCount: totalTasks,
        },
        {
          checked: activeFilters.status.includes('Inbox'),
          label: 'Inbox',
          badgeCount: statusCounts.not_started,
        },
        {
          checked: activeFilters.status.includes('Not started'),
          label: 'Not started',
          badgeCount: statusCounts.not_started,
        },
        {
          checked: activeFilters.status.includes('In progress'),
          label: 'In progress',
          badgeCount: statusCounts.in_progress,
        },
        {
          checked: activeFilters.status.includes('Completed'),
          label: 'Completed',
          badgeCount: statusCounts.complete,
        },
        {
          checked: activeFilters.status.includes('Declined'),
          label: 'Declined',
          badgeCount: statusCounts.rejected,
        },
      ],
    },
    {
      key: 'taskType',
      title: 'Task type',
      icon: 'docs',
      rows: [
        {
          checked: activeFilters.taskType.includes('All'),
          label: 'All',
          badgeCount: totalTasks,
        },
        {
          checked: activeFilters.taskType.includes('Soil sampling'),
          label: 'Soil sampling',
          badgeCount: 0,
        },
        {
          checked: activeFilters.taskType.includes('Pesticide spraying'),
          label: 'Pesticide spraying',
          badgeCount: 0,
        },
        {
          checked: activeFilters.taskType.includes('Fertilizer application'),
          label: 'Fertilizer application',
          badgeCount: 0,
        },
        {
          checked: activeFilters.taskType.includes('Drainage inspection'),
          label: 'Drainage inspection',
              badgeCount: 0,
        },
        {
          checked: activeFilters.taskType.includes('Soil preparation'),
          label: 'Soil preparation',
          badgeCount: 0,
        },
        {
          checked: activeFilters.taskType.includes('Others'),
          label: 'Others',
          badgeCount: 0,
        },
      ],
    },
  ];
}
