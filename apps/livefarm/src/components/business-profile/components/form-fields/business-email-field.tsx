'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input, FormField } from '@@agrosphere/shared';

interface BusinessEmailFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
}

export const BusinessEmailField: React.FC<BusinessEmailFieldProps> = ({
  register,
  error,
}) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Email"
        required
        error={error}
        labelClassName="font-medium text-sm"
      >
        <Input>
          <Input.Content
            {...register}
            type="email"
            placeholder="Enter business email"
          />
        </Input>
      </FormField>
    </div>
  );
};

