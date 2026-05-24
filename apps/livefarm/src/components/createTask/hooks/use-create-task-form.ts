import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { createTaskFormSchema, CreateTaskFormInput } from '../utils/validation';

type CreateTaskFormValues = {
  lab: string;
  client: string;
  taskType: string;
  assignedTo: string;
  assignedUser: string;
  priority: string;
  startAfter: string;
  completeBy: string;
  description: string;
};

const defaultValues: CreateTaskFormInput = {
  lab: '',
  client: '',
  taskType: '',
  assignedTo: '',
  assignedUser: '',
  priority: '',
  startAfter: '',
  completeBy: '',
  description: '',
};

export function useCreateTaskForm() {
  const searchParams = useSearchParams();

  const form = useForm<CreateTaskFormInput>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const clientId = searchParams?.get('clientId');
    const assignedTo = searchParams?.get('assignedTo');

    if (clientId) {
      form.setValue('client', clientId, { shouldValidate: true });
      if (assignedTo) {
        form.setValue('assignedTo', assignedTo, { shouldValidate: true });
      }
    }
  }, [searchParams, form]);

  const handleChange = (field: keyof CreateTaskFormValues, value: string) => {
    form.setValue(field as keyof CreateTaskFormInput, value, {
      shouldValidate: true,
    });
  };

  const values = form.watch();

  const isFormValid = useMemo(() => {
    const result = createTaskFormSchema.safeParse(values);
    return result.success;
  }, [values]);

  return {
    form,
    values,
    handleChange,
    isFormValid,
  };
}
