'use client';

import React from 'react';
import {
  FilterState,
  TaskType,
  TaskDetails,
  TaskList as SharedTaskList,
  NoResultsFound,
} from '@@agrosphere/shared';
import { useTableFilters } from '@/hooks/tasks/use-table-filters';

const mockTask: TaskType = {
  id: '1',
  task_type: 'Soil sampling',
  client: {
    id: 'client-1',
    name: 'Green Valley Farm',
  },
  status: 'not_started',
  assigned_to_organisation: {
    id: 'org-1',
    name: 'Farm Team Organization',
    email: 'team@farm.com',
    type: 'organization',
  },
  created_date: '2024-01-15',
  reporting: 'pending',
  created_by: {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@farm.com',
  },
  task_number: 'FT-2024-001',
  task_status: 'not_started',
  issues: [],
  priority: 'high',
  active_date: '2024-01-20',
  complete_by: '2024-01-30',
  advisor: 'Dr. Sarah Wilson',
  latitude: 53.3498,
  longitude: -6.2603,
};

interface ListTabProps {
  tasks: TaskType[];
  searchTerm?: string;
  activeFilters: FilterState;
  assignedToFilter: 'none' | 'asc' | 'desc';
  clientFilter: 'none' | 'asc' | 'desc';
  dueFilter: 'none' | 'newest' | 'oldest';
  statusFilter: 'none' | 'asc' | 'desc';
  taskTypeFilter: 'none' | 'asc' | 'desc';
  handleAcceptTask: (id: string) => void;
  handleDeclineTask: (id: string) => void;
  handleUpdateStatus: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
  handleUpdatePriority: (id: string, flag: 'normal' | 'high' | 'none') => void;
  handleDeleteTask: (id: string) => void;
  handleUpdateTask: (id: string, updates: Partial<TaskDetails>) => void;
  handleDuplicateTask?: (id: string) => void;
  handleViewOnMap?: (taskId: string) => void;
  handleViewDetails?: (taskId: string) => void;
  showFilters: boolean;
}

export function ListTab({
  tasks,
  searchTerm = '',
  activeFilters,
  assignedToFilter,
  clientFilter,
  dueFilter,
  statusFilter,
  taskTypeFilter,
  handleAcceptTask,
  handleDeclineTask,
  handleUpdateStatus,
  handleUpdatePriority,
  handleDeleteTask,
  handleUpdateTask,
  handleDuplicateTask,
  handleViewOnMap,
  handleViewDetails,
  showFilters,
}: ListTabProps) {
  const { applyFilters, sortTasksNotStartedFirst } = useTableFilters();

  // Use mock task if tasks array is empty
  const tasksToUse = tasks.length === 0 ? [mockTask] : tasks;

  let filteredTasks = applyFilters(tasksToUse, searchTerm, activeFilters, {
    taskTypeFilter,
    assignedToFilter,
    clientFilter,
    dueFilter,
    statusFilter,
  });

  if (
    dueFilter === 'none' &&
    statusFilter === 'none' &&
    assignedToFilter === 'none' &&
    clientFilter === 'none' &&
    taskTypeFilter === 'none' &&
    activeFilters.period.length === 0 &&
    (activeFilters.status.length === 0 || activeFilters.status.length === 6) &&
    (activeFilters.taskType.length === 0 || activeFilters.taskType.length === 7)
  ) {
    filteredTasks = sortTasksNotStartedFirst(filteredTasks);
  }

  const convertTaskTypeToTaskDetails = (task: TaskType) => ({
    id: task.id,
    organisation_name: task.assigned_to_organisation?.name || '',
    organisation_id: parseInt(task.assigned_to_organisation?.id || '0'),
    assigned_to_organisation: parseInt(
      task.assigned_to_organisation?.id || '0'
    ),
    farmer_name: task.client?.name || '',
    task_type: task.task_type,
    assigned_to: parseInt(task.assigned_to_organisation?.id || '0'),
    task_creator: parseInt(task.created_by?.id || '0'),
    farmer_organisation_id: parseInt(task.assigned_to_organisation?.id || '0'),
    farms: task.client?.name || '',
    lab: '',
    no_of_samples: 0,
    farmer_address: '',
    soil_sampler: null,
    farmteam_task_number: task.task_number,
    id_number: parseInt(task.id),
    task_has_not_started_test: false,
    task_has_unmatched_samples: false,
    task_has_tests_without_lab_result: false,
    date: task.active_date,
    complete_by: task.complete_by,
    status: task.status,
    tests: [],
    created_by: parseInt(task.created_by?.id || '0'),
    issues_approve_by: null,
    reporting_status: task.reporting,
    combine_task_report: 0,
    combine_soil_analysis_report: 0,
    advisor: task.advisor,
  });

  const convertedTasks = filteredTasks.map(convertTaskTypeToTaskDetails);

  const handleAcceptTaskAdapter = (task: any) => {
    handleAcceptTask(task.id);
  };

  const handleDeclineTaskAdapter = (task: any) => {
    handleDeclineTask(task.id);
  };

  const handleUpdateTaskAdapter = (id: string, updates: any) => {
    handleUpdateTask(id, updates);
  };

  const assigneeOptions = [
    { value: '', label: 'Select assignee' },
    { value: 'john', label: 'John Doe', initials: 'JD' },
    { value: 'jane', label: 'Jane Smith', initials: 'JS' },
    { value: 'kristin', label: 'Kristin W.', initials: 'KW' },
    { value: 'bill', label: 'Bill Sanders', initials: 'BS' },
    { value: 'olga', label: 'Olga Ivanova', initials: 'OI' },
    { value: 'peter', label: 'Peter Müller', initials: 'PM' },
    { value: 'li', label: 'Li Wei', initials: 'LW' },
    { value: 'lucas', label: 'Lucas Martin', initials: 'LM' },
    { value: 'sofia', label: 'Sofia Rossi', initials: 'SR' },
    { value: 'anna', label: 'Anna Svensson', initials: 'AS' },
  ];

  return (
    <div className="h-full min-h-0 overflow-y-auto" data-list-container>
      {filteredTasks.length === 0 ? (
        <NoResultsFound
          variant="tasks"
          hasSearchTerm={!!searchTerm}
          className="h-full flex items-center justify-center"
        />
      ) : (
        <SharedTaskList
          tasks={convertedTasks}
          showActions
          onAcceptTask={handleAcceptTaskAdapter}
          onDeclineTask={handleDeclineTaskAdapter}
          onUpdatePriority={handleUpdatePriority}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTaskAdapter}
          onViewOnMap={handleViewOnMap}
          onViewDetails={handleViewDetails}
          assigneeOptions={assigneeOptions}
          showFilters={showFilters}
          shouldCloseOnAction={true}
        />
      )}
    </div>
  );
}
