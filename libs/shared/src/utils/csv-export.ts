import { TaskDetails } from '../types/task';
import { FilterState } from '../components/filters/filters';
import { LabItem } from '../mock/mock-lab-items';
import { TaskType } from '../api/services/tasks/task-types';

export function filterTasks(
  tasks: TaskDetails[],
  filters: FilterState
): TaskDetails[] {
  let filteredTasks = [...tasks];

  if (filters.period.length > 0) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    filteredTasks = filteredTasks.filter((task) => {
      const taskDate = new Date(task.date);
      const dueDate = task.complete_by ? new Date(task.complete_by) : null;

      return filters.period.some((period) => {
        switch (period) {
          case 'Late tasks':
            return dueDate && dueDate < today && task.status !== 'completed';
          case 'Today':
            return task.date === todayStr;
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

  if (filters.status.length > 0 && !filters.status.includes('All')) {
    filteredTasks = filteredTasks.filter((task) => {
      return filters.status.some((status) => {
        switch (status) {
          case 'Inbox':
            return task.status === 'Not Started';
          case 'Not started':
            return task.status === 'pending';
          case 'In progress':
            return task.status === 'in_progress';
          case 'Completed':
            return task.status === 'completed';
          case 'Declined':
            return task.status === 'cancelled';
          default:
            return false;
        }
      });
    });
  }

  if (filters.taskType.length > 0 && !filters.taskType.includes('All')) {
    filteredTasks = filteredTasks.filter((task) => {
      return filters.taskType.some((type) => {
        const taskType = task.task_type?.toLowerCase() || '';
        switch (type) {
          case 'Soil sampling':
            return taskType.includes('soil') || taskType.includes('sampler');
          case 'Pesticide spraying':
            return (
              taskType.includes('pesticide') || taskType.includes('spraying')
            );
          case 'Fertilizer application':
            return (
              taskType.includes('fertilizer') ||
              taskType.includes('application')
            );
          case 'Drainage inspection':
            return (
              taskType.includes('drainage') || taskType.includes('inspection')
            );
          case 'Soil preparation':
            return (
              taskType.includes('preparation') || taskType.includes('soil prep')
            );
          case 'Others':
            return ![
              'soil',
              'sampler',
              'pesticide',
              'spraying',
              'fertilizer',
              'application',
              'drainage',
              'inspection',
              'preparation',
            ].some((keyword) => taskType.includes(keyword));
          default:
            return false;
        }
      });
    });
  }

  return filteredTasks;
}

function taskToCSVRow(task: TaskDetails): string {
  const fields = [
    task.id,
    task.farmteam_task_number,
    task.farmer_name,
    task.task_type || '',
    task.status,
    task.date,
    task.complete_by || '',
    task.soil_sampler,
    task.farms,
    task.lab,
    task.no_of_samples.toString(),
    task.farmer_address,
    task.organisation_name,
    task.advisor,
    task.reporting_status || '',
  ];

  const escapedFields = fields.map((field) => {
    const stringField = String(field);
    if (
      stringField.includes(',') ||
      stringField.includes('"') ||
      stringField.includes('\n')
    ) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  });

  return escapedFields.join(',');
}

export function exportTasksToCSV(
  tasks: TaskDetails[],
  filters: FilterState
): number {
  const filteredTasks = filterTasks(tasks, filters);

  const headers = [
    'Task ID',
    'Task Number',
    'Farmer Name',
    'Task Type',
    'Status',
    'Date',
    'Complete By',
    'Soil Sampler',
    'Farms',
    'Lab',
    'Number of Samples',
    'Farmer Address',
    'Organization',
    'Advisor',
    'Reporting Status',
  ];

  const csvContent = [
    headers.join(','),
    ...filteredTasks.map(taskToCSVRow),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filterInfo = [];

  if (filters.period.length > 0)
    filterInfo.push(`period-${filters.period.join('-')}`);
  if (filters.status.length > 0 && !filters.status.includes('All'))
    filterInfo.push(`status-${filters.status.join('-')}`);
  if (filters.taskType.length > 0 && !filters.taskType.includes('All'))
    filterInfo.push(`type-${filters.taskType.join('-')}`);

  const filename = `tasks-export-${dateStr}.csv`;

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return filteredTasks.length;
}

function labItemToCSVRow(labItem: LabItem): string {
  const fields = [
    labItem.id || '',
    labItem.labName || '',
    labItem.type || '',
    labItem.client
      ? `${labItem.client.name || ''} ${labItem.client.surname || ''}`.trim()
      : '',
    labItem.farm || '',
    labItem.taskId || '',
    labItem.sampleDate || '',
    labItem.labOrderNo || '',
    labItem.status || '',
    labItem.hasResults ? 'Yes' : 'No',
  ];

  const escapedFields = fields.map((field) => {
    const stringField = String(field);
    if (
      stringField.includes(',') ||
      stringField.includes('"') ||
      stringField.includes('\n')
    ) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  });

  return escapedFields.join(',');
}

export function exportLabItemsToCSV(
  labItems: LabItem[],
  labOrderId?: string
): number {
  const headers = [
    'Lab ID',
    'Lab Name',
    'Test Type',
    'Client',
    'Farm',
    'Parcels/Zones',
    'Sample Date',
    'Created By',
    'Status',
    'Has Results',
  ];

  const csvContent = [headers.join(','), ...labItems.map(labItemToCSVRow)].join(
    '\n'
  );

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');

  let filename: string;
  if (labOrderId) {
    filename = `lab-items-${labOrderId}-${dateStr}-${timeStr}.csv`;
  } else {
    filename = `lab-items-${dateStr}-${timeStr}.csv`;
  }

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return labItems.length;
}

export function exportSelectedLabItemsToCSV(
  labItems: LabItem[],
  selectedIds: string[]
): number {
  const selectedItems = labItems.filter((item) =>
    selectedIds.includes(item.id)
  );

  const headers = [
    'Lab ID',
    'Lab Name',
    'Test Type',
    'Client',
    'Farm',
    'Parcels/Zones',
    'Sample Date',
    'Created By',
    'Status',
    'Has Results',
  ];

  const csvContent = [
    headers.join(','),
    ...selectedItems.map(labItemToCSVRow),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');

  const filename = `selected-lab-items-${dateStr}-${timeStr}.csv`;

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return selectedItems.length;
}

function taskTypeToCSVRow(task: TaskType): string {
  const fields = [
    task.id,
    task.task_number,
    task.client?.name || '',
    task.task_type || '',
    task.task_status,
    task.active_date,
    task.complete_by || '',
    task.assigned_to_organisation?.name || '',
    '', 
    task.reporting || '',
    '0', 
    '', 
    task.assigned_to_organisation?.name || '',
    task.advisor,
    '',
  ];

  const escapedFields = fields.map((field) => {
    const stringField = String(field);
    if (
      stringField.includes(',') ||
      stringField.includes('"') ||
      stringField.includes('\n')
    ) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  });

  return escapedFields.join(',');
}

export function exportTaskTypesToCSV(
  tasks: TaskType[],
  filters: FilterState
): number {
  let filteredTasks = [...tasks];

  if (filters.period.length > 0) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    filteredTasks = filteredTasks.filter((task) => {
      const taskDate = new Date(task.active_date);
      const dueDate = task.complete_by ? new Date(task.complete_by) : null;

      return filters.period.some((period) => {
        switch (period) {
          case 'Late tasks':
            return (
              dueDate && dueDate < today && task.task_status !== 'completed'
            );
          case 'Today':
            return task.active_date === todayStr;
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

  if (filters.status.length > 0 && !filters.status.includes('All')) {
    filteredTasks = filteredTasks.filter((task) => {
      return filters.status.some((status) => {
        switch (status) {
          case 'Inbox':
            return task.task_status === 'not_started';
          case 'Not started':
            return task.task_status === 'pending';
          case 'In progress':
            return task.task_status === 'in_progress';
          case 'Completed':
            return task.task_status === 'completed';
          case 'Declined':
            return task.task_status === 'cancelled';
          default:
            return false;
        }
      });
    });
  }

  if (filters.taskType.length > 0 && !filters.taskType.includes('All')) {
    filteredTasks = filteredTasks.filter((task) => {
      return filters.taskType.some((type) => {
        const taskType = task.task_type?.toLowerCase() || '';
        switch (type) {
          case 'Soil sampling':
            return taskType.includes('soil') || taskType.includes('sampler');
          case 'Pesticide spraying':
            return (
              taskType.includes('pesticide') || taskType.includes('spraying')
            );
          case 'Fertilizer application':
            return (
              taskType.includes('fertilizer') ||
              taskType.includes('application')
            );
          case 'Drainage inspection':
            return (
              taskType.includes('drainage') || taskType.includes('inspection')
            );
          case 'Soil preparation':
            return (
              taskType.includes('preparation') || taskType.includes('soil prep')
            );
          case 'Others':
            return ![
              'soil',
              'sampler',
              'pesticide',
              'spraying',
              'fertilizer',
              'application',
              'drainage',
              'inspection',
              'preparation',
            ].some((keyword) => taskType.includes(keyword));
          default:
            return false;
        }
      });
    });
  }

  const headers = [
    'Task ID',
    'Task Number',
    'Farmer Name',
    'Task Type',
    'Status',
    'Date',
    'Complete By',
    'Soil Sampler',
    'Farms',
    'Lab',
    'Number of Samples',
    'Farmer Address',
    'Organization',
    'Advisor',
    'Reporting Status',
  ];

  const csvContent = [
    headers.join(','),
    ...filteredTasks.map(taskTypeToCSVRow),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filterInfo = [];

  if (filters.period.length > 0)
    filterInfo.push(`period-${filters.period.join('-')}`);
  if (filters.status.length > 0 && !filters.status.includes('All'))
    filterInfo.push(`status-${filters.status.join('-')}`);
  if (filters.taskType.length > 0 && !filters.taskType.includes('All'))
    filterInfo.push(`type-${filters.taskType.join('-')}`);

  const filename = `tasks-export-${dateStr}.csv`;

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return filteredTasks.length;
}
