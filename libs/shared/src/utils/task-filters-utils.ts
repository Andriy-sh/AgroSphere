import { TaskDetails } from '../types/task';
import { TaskType } from '../api/services/tasks/task-types';

export interface TaskCounts {
  period: {
    'Late tasks': number;
    Today: number;
    'Last 7 days': number;
    'Last 30 days': number;
    'Next 7 days': number;
    'Next 3 months': number;
  };
  status: {
    All: number;
    Inbox: number;
    'Not started': number;
    'In progress': number;
    Complete: number;
    Declined: number;
  };
  taskType: {
    All: number;
    'Soil sampling': number;
    'Pesticide spraying': number;
    'Fertilizer application': number;
    'Drainage inspection': number;
    'Soil preparation': number;
    Others: number;
  };
}

export const mapTaskTypeToCategory = (taskType: string | null): string => {
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

export function calculateTaskCountsForTaskType(tasks: TaskType[]): TaskCounts {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const isDateInRange = (
    dateStr: string,
    days: number,
    direction: 'past' | 'future'
  ): boolean => {
    const date = new Date(dateStr);
    const diffTime =
      direction === 'past'
        ? today.getTime() - date.getTime()
        : date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= days;
  };

  const isTaskLate = (task: TaskType): boolean => {
    if (!task.complete_by) return false;
    const dueDate = new Date(task.complete_by);
    return dueDate < today && task.task_status !== 'completed';
  };

  const isTaskToday = (task: TaskType): boolean => {
    return task.active_date === todayStr;
  };

  const periodCounts = {
    'Late tasks': tasks.filter(isTaskLate).length,
    Today: tasks.filter(isTaskToday).length,
    'Last 7 days': tasks.filter((task) =>
      isDateInRange(task.active_date, 7, 'past')
    ).length,
    'Last 30 days': tasks.filter((task) =>
      isDateInRange(task.active_date, 30, 'past')
    ).length,
    'Next 7 days': tasks.filter((task) =>
      isDateInRange(task.active_date, 7, 'future')
    ).length,
    'Next 3 months': tasks.filter((task) =>
      isDateInRange(task.active_date, 90, 'future')
    ).length,
  };

  const statusCounts = {
    All: tasks.length,
    Inbox: tasks.filter((task) => task.task_status === 'not_started').length,
    'Not started': tasks.filter((task) => task.task_status === 'pending')
      .length,
    'In progress': tasks.filter((task) => task.task_status === 'in_progress')
      .length,
    Complete: tasks.filter((task) => task.task_status === 'completed').length,
    Declined: tasks.filter((task) => task.task_status === 'cancelled').length,
  };

  const taskTypeCounts = {
    All: tasks.length,
    'Soil sampling': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Soil sampling'
    ).length,
    'Pesticide spraying': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Pesticide spraying'
    ).length,
    'Fertilizer application': tasks.filter(
      (task) =>
        mapTaskTypeToCategory(task.task_type) === 'Fertilizer application'
    ).length,
    'Drainage inspection': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Drainage inspection'
    ).length,
    'Soil preparation': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Soil preparation'
    ).length,
    Others: tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Others'
    ).length,
  };

  return {
    period: periodCounts,
    status: statusCounts,
    taskType: taskTypeCounts,
  };
}

export function calculateTaskCounts(tasks: TaskDetails[]): TaskCounts {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const isDateInRange = (
    dateStr: string,
    days: number,
    direction: 'past' | 'future'
  ): boolean => {
    const date = new Date(dateStr);
    const diffTime =
      direction === 'past'
        ? today.getTime() - date.getTime()
        : date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= days;
  };

  const isTaskLate = (task: TaskDetails): boolean => {
    if (!task.complete_by) return false;
    const dueDate = new Date(task.complete_by);
    return dueDate < today && task.status !== 'completed';
  };

  const isTaskToday = (task: TaskDetails): boolean => {
    return task.date === todayStr;
  };

  const periodCounts = {
    'Late tasks': tasks.filter(isTaskLate).length,
    Today: tasks.filter(isTaskToday).length,
    'Last 7 days': tasks.filter((task) => isDateInRange(task.date, 7, 'past'))
      .length,
    'Last 30 days': tasks.filter((task) => isDateInRange(task.date, 30, 'past'))
      .length,
    'Next 7 days': tasks.filter((task) => isDateInRange(task.date, 7, 'future'))
      .length,
    'Next 3 months': tasks.filter((task) =>
      isDateInRange(task.date, 90, 'future')
    ).length,
  };

  const statusCounts = {
    All: tasks.length,
    Inbox: tasks.filter((task) => task.status === 'Not Started').length,
    'Not started': tasks.filter((task) => task.status === 'pending').length,
    'In progress': tasks.filter((task) => task.status === 'in_progress').length,
    Complete: tasks.filter((task) => task.status === 'completed').length,
    Declined: tasks.filter((task) => task.status === 'cancelled').length,
  };

  const taskTypeCounts = {
    All: tasks.length,
    'Soil sampling': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Soil sampling'
    ).length,
    'Pesticide spraying': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Pesticide spraying'
    ).length,
    'Fertilizer application': tasks.filter(
      (task) =>
        mapTaskTypeToCategory(task.task_type) === 'Fertilizer application'
    ).length,
    'Drainage inspection': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Drainage inspection'
    ).length,
    'Soil preparation': tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Soil preparation'
    ).length,
    Others: tasks.filter(
      (task) => mapTaskTypeToCategory(task.task_type) === 'Others'
    ).length,
  };

  return {
    period: periodCounts,
    status: statusCounts,
    taskType: taskTypeCounts,
  };
}
