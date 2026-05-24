import * as React from 'react';
import { cn } from '../../utils/cn';
import { Label } from '../label/label';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  warning?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, required, error, warning, className, labelClassName, children },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(className)}>
        <Label
          className={cn('mb-2 text-basic-black text-xs', labelClassName)}
          required={required}
        >
          {label}
        </Label>
        {children}
        {error && <p className="text-basic-red text-sm mt-1">{error}</p>}
        {warning && !error && (
          <p className="text-basic-yellow text-sm mt-1">{warning}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
