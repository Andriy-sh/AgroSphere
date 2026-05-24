'use client';

import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Radio } from '@@agrosphere/shared';
import { RadioOption } from '../../types/form';
import type { BusinessProfileFormData } from '../../types/form';

interface CategorySelectorProps {
  control: Control<BusinessProfileFormData>;
  fieldName: 'farmCategory' | 'businessCategory';
  options: RadioOption[];
  label: string;
  error?: string;
  layout?: 'single-column' | 'two-columns';
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  control,
  fieldName,
  options,
  label,
  error,
  layout = 'two-columns',
}) => {
  return (
    <div className="space-y-4">
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Radio
            name={fieldName}
            label={label}
            options={options}
            value={field.value || ''}
            onChange={field.onChange}
            error={error}
            layout={layout}
          />
        )}
      />
    </div>
  );
};

