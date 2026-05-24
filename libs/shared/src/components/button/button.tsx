import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex  items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-basic-green text-basic-white shadow-xs hover:bg-basic-green/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary',
        cancel:
          'bg-basic-white text-gray-700 shadow-xs hover:bg-gray-200 disabled:cursor-not-allowed',
        update: 'bg-black text-white shadow-xs hover:bg-gray-800',
        complete:
          'bg-basic-green text-white shadow-xs hover:bg-basic-green-dark',
        tag: 'bg-basic-gray text-white shadow-xs hover:bg-basic-gray-dark mt-2 w-full bg-gray-100 hover:bg-gray-200 rounded text-sm bg-basic-white text-basic-black font-normal',
        decline:
          'bg-basic-gray-light text-basic-black shadow-xs hover:bg-basic-red-dark',
        filter: 'bg-basic-white text-basic-black',
        delete: ' text-basic-red bg-[#FF323F1F] shadow-xs hover:bg-[#FF323F1F]',
      },
      size: {
        default: 'h-9 px-4 py-2.5 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        md: 'h-9 rounded-md px-4 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
