'use client';

import { useState, useCallback } from 'react';
import type { FormErrors, CreateParcelZonesFormData } from '../types';

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback(
    (field: keyof CreateParcelZonesFormData, value: string) => {
      if (field === 'name') {
        const trimmedValue = value.trim();
        if (trimmedValue.length === 0) {
          setErrors((prev) => ({
            ...prev,
            name: 'Name is required',
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            name: undefined,
          }));
        }
      }

      if (field === 'id') {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 4) {
          setErrors((prev) => ({
            ...prev,
            id: 'Maximum 4 characters',
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            id: undefined,
          }));
        }
      }
    },
    []
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const isFormValid = useCallback(
    (formData: CreateParcelZonesFormData) => {
      return (
        formData.name.trim().length > 0 && !errors.name && !errors.id
      );
    },
    [errors]
  );

  return {
    errors,
    validateField,
    clearErrors,
    isFormValid,
    setErrors,
  };
}

