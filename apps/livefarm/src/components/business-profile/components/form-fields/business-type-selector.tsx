'use client';

import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Radio } from '@@agrosphere/shared';
import { RadioOption } from '../../types/form';
import type { BusinessProfileFormData } from '../../types/form';

interface BusinessTypeSelectorProps {
  control: Control<BusinessProfileFormData>;
  options: RadioOption[];
  error?: string;
  layout?: 'single-column' | 'two-columns';
}

export const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({
  control,
  options,
  error,
  layout = 'two-columns',
}) => {
  return (
    <div className="space-y-4">
      <Controller
        name="businessType"
        control={control}
        render={({ field }) => (
          <Radio
            name="businessType"
            label="Please select your business type"
            options={options}
            value={field.value}
            onChange={field.onChange}
            error={error}
            layout={layout}
          />
        )}
      />
    </div>
  );
};

