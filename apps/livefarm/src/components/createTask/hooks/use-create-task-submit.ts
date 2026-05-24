import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskService } from '@@agrosphere/shared';
import { transformFormDataToRequest } from '../utils/transform-form-data';
import { createTaskRequestSchema } from '../utils/validation';
import { CreateTaskFormInput } from '../utils/validation';

export function useCreateTaskSubmit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitTask = async (
    formData: CreateTaskFormInput,
    selectedFarms: Record<string, string[]>
  ) => {
    if (Object.keys(selectedFarms).length === 0) {
      throw new Error('At least one farm must be selected');
    }

    const hasSelectedFields = Object.values(selectedFarms).some(
      (fields) => fields.length > 0
    );

    if (!hasSelectedFields) {
      throw new Error('At least one field must be selected');
    }

    const createTaskData = transformFormDataToRequest(formData, selectedFarms);

    const validationResult = createTaskRequestSchema.safeParse(createTaskData);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) => issue.message
      );
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    setIsSubmitting(true);

    try {
      await TaskService.createTask(createTaskData);
      router.push('/tasks');
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    router.push('/tasks');
  };

  return {
    submitTask,
    cancel,
    isSubmitting,
  };
}
