'use client';

import React from 'react';
import {
  FilterState,
  TaskType,
  TaskKanban,
  NoResultsFound,
} from '@@agrosphere/shared';
import { useTableFilters } from '@/hooks/tasks/use-table-filters';

interface KanbanTabProps {
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
    status:
      | 'pending'
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'not_started'
      | 'Not Started'
  ) => void;
  handleUpdatePriority: (id: string, flag: 'normal' | 'high' | 'none') => void;
  handleDeleteTask: (id: string) => void;
}

export function KanbanTab({
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
}: KanbanTabProps) {
  const { applyFilters, sortTasksNotStartedFirst } = useTableFilters();

  let filteredTasks = applyFilters(tasks, searchTerm, activeFilters, {
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

  return (
    <div className="h-full min-h-0 flex flex-col" data-list-container>
      {filteredTasks.length === 0 ? (
        <NoResultsFound
          variant="tasks"
          hasSearchTerm={!!searchTerm}
          className="h-full flex items-center justify-center"
        />
      ) : (
        <TaskKanban
          tasks={convertedTasks}
          onAcceptTask={handleAcceptTaskAdapter}
          onDeclineTask={handleDeclineTaskAdapter}
          onUpdatePriority={handleUpdatePriority}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}
