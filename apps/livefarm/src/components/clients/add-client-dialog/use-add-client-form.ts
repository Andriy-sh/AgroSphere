import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback, useRef, useState } from 'react';
import type { ClientFormData, ExistingClient } from '@@agrosphere/shared';
import { createClientFormSchema } from './client-form.schema';
import type {
  UseAddClientFormReturn,
  AddClientFormProps,
} from './add-client.types';

function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

export function useAddClientForm({
  defaultValues,
  existingClients = [],
  excludeClientId,
}: Pick<
  AddClientFormProps,
  'defaultValues' | 'existingClients' | 'excludeClientId'
>): UseAddClientFormReturn {
  const schema = useMemo(
    () => createClientFormSchema(existingClients, excludeClientId, 'add'),
    [existingClients, excludeClientId]
  );

  const form = useForm<ClientFormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    shouldUnregister: false,
  });

  const firstName = useWatch({ control: form.control, name: 'firstName' });
  const lastName = useWatch({ control: form.control, name: 'lastName' });

  const debouncedAutoFill = useDebouncedCallback(
    (first: string, last: string) => {
      const fullName = `${first || ''} ${last || ''}`.trim();
      if (fullName && (first || last)) {
        form.setValue('businessName', fullName, {
          shouldValidate: false,
          shouldDirty: true,
        });
        form.setValue('contactName', fullName, {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
    },
    300
  );

  useEffect(() => {
    debouncedAutoFill(firstName || '', lastName || '');
  }, [firstName, lastName, debouncedAutoFill]);

  const watchedForValidation = useWatch({
    control: form.control,
    name: [
      'firstName',
      'lastName',
      'addressLine1',
      'addressLine2',
      'eircode',
      'phone',
    ],
  });

  const [validationIssues, setValidationIssues] = useState<
    Array<{ type: 'error' | 'warning'; field: string; message: string }>
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const values = {
        firstName: watchedForValidation[0],
        lastName: watchedForValidation[1],
        addressLine1: watchedForValidation[2],
        addressLine2: watchedForValidation[3],
        eircode: watchedForValidation[4],
        phone: watchedForValidation[5],
      };

      const issues: Array<{
        type: 'error' | 'warning';
        field: string;
        message: string;
      }> = [];
      const normalize = (str: string) =>
        str.toLowerCase().trim().replace(/\s+/g, ' ');

      existingClients.forEach((client) => {
        if (excludeClientId && client.id === excludeClientId) return;

        if (
          values.firstName &&
          values.lastName &&
          client.name &&
          normalize(`${values.firstName} ${values.lastName}`) ===
            normalize(client.name)
        ) {
          issues.push({
            type: 'warning',
            field: 'name',
            message:
              'A client with the same first and last name already exists',
          });
        }

        const formAddress = [values.addressLine1, values.addressLine2]
          .filter(Boolean)
          .join(', ');
        if (
          formAddress &&
          client.address &&
          normalize(formAddress) === normalize(client.address)
        ) {
          issues.push({
            type: 'warning',
            field: 'address',
            message: 'A client with the same address already exists',
          });
        }

        if (
          values.eircode &&
          client.eircode &&
          normalize(values.eircode) === normalize(client.eircode)
        ) {
          issues.push({
            type: 'warning',
            field: 'eircode',
            message: 'A client with the same eircode already exists',
          });
        }

        if (
          values.phone &&
          client.phone &&
          normalize(values.phone) === normalize(client.phone)
        ) {
          issues.push({
            type: 'warning',
            field: 'phone',
            message: 'A client with the same phone number already exists',
          });
        }
      });

      setValidationIssues(issues);
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedForValidation, existingClients, excludeClientId]);

  const canSubmit = useMemo(() => {
    const { isValid, isDirty } = form.formState;
    return isValid && isDirty;
  }, [form.formState.isValid, form.formState.isDirty]);

  const hasErrors = useMemo(() => {
    return Object.keys(form.formState.errors).length > 0;
  }, [form.formState.errors]);

  const validateField = useCallback(
    async (fieldName: keyof ClientFormData): Promise<boolean> => {
      const result = await form.trigger(fieldName);
      return result;
    },
    [form]
  );

  const setServerErrors = useCallback(
    (errors: Record<string, string>) => {
      Object.entries(errors).forEach(([field, message]) => {
        form.setError(field as keyof ClientFormData, {
          type: 'server',
          message,
        });
      });
    },
    [form]
  );

  const clearErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  return {
    form,
    canSubmit,
    hasErrors,
    validationIssues,
    validateField,
    setServerErrors,
    clearErrors,
  };
}
