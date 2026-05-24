import { CreateTaskRequest } from '@@agrosphere/shared';
import { CreateTaskFormInput } from './validation';

export function transformFormDataToRequest(
  formData: CreateTaskFormInput,
  selectedFarms: Record<string, string[]>
): CreateTaskRequest {
  return {
    task_type: formData.taskType,
    farmer_hashid: formData.client,
    lab: parseInt(formData.lab) || 0,
    assigned_to_hashid: formData.assignedUser ? [formData.assignedUser] : [],
    assigned_organization_hashid: formData.assignedTo,
    priority: formData.priority,
    active_date: formData.startAfter,
    complete_by: formData.completeBy || '',
    note: formData.description || '',
    farms: Object.keys(selectedFarms).map((farmId) => ({
      hashid: farmId,
    })),
  };
}

