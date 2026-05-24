import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-xl  border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        ghost:
          'border-transparent bg-basic-gray-light text-basic-gray w-[30px] h-[20px] ',
        notification:
          'border-transparent  bg-basic-red text-white w-[30px] h-[20px]',
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      },
      size: {
        xs: 'px-2 py-0.5 text-xs ',
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-5 py-2 text-base',
        xl: 'px-6 py-2.5 text-lg',
        '2xl': 'px-7 py-3 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'xs',
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
