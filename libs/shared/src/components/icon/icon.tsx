import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const iconButtonVariants = cva(
  'material-symbols-outlined inline-flex items-center justify-center transition-all cursor-pointer text-basic-black',
  {
    variants: {
      size: {
        xs: 'text-[12px]',
        sm: 'text-[16px]',
        md: 'text-[20px]',
        lg: 'text-[24px]',
        xl: 'text-[28px]',
        xxl: 'text-[32px]',
      },
      variant: {
        default: 'text-current',
        primary: 'text-primary',
        secondary: 'text-secondary',
        destructive: 'text-destructive',
        muted: 'text-muted-foreground',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface IconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: string;
  asChild?: boolean;
}

const Icon = React.forwardRef<HTMLButtonElement, IconProps>(
  (
    { className, size, variant, icon, asChild = false, children, ...props },
    ref
  ) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        className: cn(iconButtonVariants({ size, variant, className })),
        ref,
      } as any);
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(iconButtonVariants({ size, variant, className }))}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);

Icon.displayName = 'Icon';

export { Icon, iconButtonVariants };
