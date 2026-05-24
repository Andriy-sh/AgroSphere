'use client';

import React from 'react';
import { Input, FormField } from '@@agrosphere/shared';
import { UseFormSetValue, FieldPath, FieldValues } from 'react-hook-form';

interface NumberFormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  error?: string;
  value: number | undefined;
  setValue: UseFormSetValue<T>;
  placeholder?: string;
  step?: string;
  min?: string | number;
  onBlur?: () => void;
}

export function NumberFormField<T extends FieldValues>({
  name,
  label,
  required = false,
  error,
  value,
  setValue,
  placeholder,
  step = '0.1',
  min = '0',
  onBlur,
}: NumberFormFieldProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numValue = Number(inputValue);
    setValue(
      name,
      (inputValue === ''
        ? undefined
        : isNaN(numValue)
        ? undefined
        : numValue) as T[FieldPath<T>],
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  return (
    <FormField label={label} required={required} error={error}>
      <Input className="w-full">
        <Input.Content
          type="number"
          step={step}
          min={min}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          className="w-full"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${String(name)}-error` : undefined}
        />
      </Input>
    </FormField>
  );
}

