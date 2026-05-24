'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input, FormField } from '@@agrosphere/shared';

interface BusinessNameFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
}

export const BusinessNameField: React.FC<BusinessNameFieldProps> = ({
  register,
  error,
  placeholder = 'Enter business or legal name',
}) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Business name"
        required
        error={error}
        labelClassName="font-medium text-sm"
      >
        <Input>
          <Input.Content
            {...register}
            type="text"
            placeholder={placeholder}
          />
        </Input>
      </FormField>
    </div>
  );
};

