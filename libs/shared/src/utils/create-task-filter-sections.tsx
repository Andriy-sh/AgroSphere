import React from 'react';
import { FilterSection } from '../components/filters/filters';
import { TaskCounts } from './task-filters-utils';

export function createTaskFilterSections(
  taskCounts: TaskCounts,
  activeFilters: {
    period: string[];
    status: string[];
    taskType: string[];
  }
): FilterSection[] {
  return [
    {
      key: 'period',
      title: 'Period',
      icon: 'calendar_today',
      rows: [
        {
          checked: activeFilters.period.includes('Late tasks'),
          label: 'Late tasks',
          badgeCount: taskCounts.period['Late tasks'],
        },
        {
          checked: activeFilters.period.includes('Today'),
          label: 'Today',
          badgeCount: taskCounts.period['Today'],
        },
        {
          checked: activeFilters.period.includes('Last 7 days'),
          label: 'Last 7 days',
          badgeCount: taskCounts.period['Last 7 days'],
        },
        {
          checked: activeFilters.period.includes('Last 30 days'),
          label: 'Last 30 days',
          badgeCount: taskCounts.period['Last 30 days'],
        },
        {
          checked: activeFilters.period.includes('Next 7 days'),
          label: 'Next 7 days',
          badgeCount: taskCounts.period['Next 7 days'],
        },
        {
          checked: activeFilters.period.includes('Next 3 months'),
          label: 'Next 3 months',
          badgeCount: taskCounts.period['Next 3 months'],
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
          badgeCount: taskCounts.status['All'],
        },
        {
          checked: activeFilters.status.includes('Inbox'),
          label: 'Inbox',
          badgeCount: taskCounts.status['Inbox'],
        },
        {
          checked: activeFilters.status.includes('Not started'),
          label: 'Not started',
          badgeCount: taskCounts.status['Not started'],
        },
        {
          checked: activeFilters.status.includes('In progress'),
          label: 'In progress',
          badgeCount: taskCounts.status['In progress'],
        },
        {
          checked: activeFilters.status.includes('Complete'),
          label: 'Complete',
          badgeCount: taskCounts.status['Complete'],
        },
        {
          checked: activeFilters.status.includes('Declined'),
          label: 'Declined',
          badgeCount: taskCounts.status['Declined'],
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
          badgeCount: taskCounts.taskType['All'],
        },
        {
          checked: activeFilters.taskType.includes('Soil sampling'),
          label: 'Soil sampling',
          badgeCount: taskCounts.taskType['Soil sampling'],
        },
        {
          checked: activeFilters.taskType.includes('Pesticide spraying'),
          label: 'Pesticide spraying',
          badgeCount: taskCounts.taskType['Pesticide spraying'],
        },
        {
          checked: activeFilters.taskType.includes('Fertilizer application'),
          label: 'Fertilizer application',
          badgeCount: taskCounts.taskType['Fertilizer application'],
        },
        {
          checked: activeFilters.taskType.includes('Drainage inspection'),
          label: 'Drainage inspection',
          badgeCount: taskCounts.taskType['Drainage inspection'],
        },
        {
          checked: activeFilters.taskType.includes('Soil preparation'),
          label: 'Soil preparation',
          badgeCount: taskCounts.taskType['Soil preparation'],
        },
        {
          checked: activeFilters.taskType.includes('Others'),
          label: 'Others',
          badgeCount: taskCounts.taskType['Others'],
        },
      ],
    },
  ];
}
