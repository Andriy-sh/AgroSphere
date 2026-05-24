import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { getPostalCodeLabel } from '../../utils/postal-code-utils';
import { getRegionLabel } from '../../utils/region-utils';

const labelVariants = cva('block font-normal transition-colors', {
  variants: {
    variant: {
      default: 'text-basic-black',
      error: 'text-basic-red',
      warning: 'text-basic-yellow',
      success: 'text-basic-green',
    },
    size: {
      sm: 'text-xs',
      default: 'text-xs',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  country?: string;
  type?: 'default' | 'postal-code' | 'region';
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
      variant,
      size,
      required,
      children,
      country,
      type = 'default',
      ...props
    },
    ref
  ) => {
    const getLabelText = () => {
      if (children) return children;

      switch (type) {
        case 'postal-code':
          return getPostalCodeLabel(country);
        case 'region':
          return getRegionLabel(country);
        default:
          return children;
      }
    };

    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, size, className }))}
        {...props}
      >
        {getLabelText()}
        {required && <span className="text-basic-red ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label, labelVariants };
