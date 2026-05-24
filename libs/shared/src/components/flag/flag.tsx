'use client';

import * as React from 'react';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

interface FlagDisplayData {
  finalTooltipContent: string;
}

export const getFlagDisplayData = (
  variant: 'normal' | 'high' | 'none' | undefined | null,
  children: React.ReactNode,
  tooltipContent?: string
): FlagDisplayData => {
  let contentForTooltip: string;
  if (tooltipContent) {
    contentForTooltip = tooltipContent;
  } else if (typeof children === 'string') {
    contentForTooltip = children;
  } else {
    contentForTooltip =
      variant === 'high' ? 'High priority' : 'Normal priority';
  }

  return {
    finalTooltipContent: contentForTooltip,
  };
};

const flagVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      normal: 'text-blue-500',
      high: 'text-red-500',
      none: 'text-transparent',
    },
    size: {
      xs: 'text-[12px]',
      sm: 'text-[16px]',
      md: 'text-[20px]',
      lg: 'text-[24px]',
      xl: 'text-[28px]',
      '2xl': 'text-[32px]',
      '3xl': 'text-[36px]',
    },
  },
  defaultVariants: {
    variant: 'normal',
    size: 'md',
  },
});

interface FlagProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof flagVariants> {
  tooltipContent?: string;
  showText?: boolean;
  children?: React.ReactNode;
  iconColor?: string;
}

export const Flag: React.FC<FlagProps> = ({
  className,
  variant,
  size,
  tooltipContent,
  showText = false,
  children,
  iconColor,
  ...props
}) => {
  const { finalTooltipContent } = getFlagDisplayData(
    variant,
    children,
    tooltipContent
  );

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div
            className={cn(
              flagVariants({ variant, size }),
              'flex items-center gap-1',
              className
            )}
            {...props}
          >
            {variant !== 'none' && (
              <span
                className={cn(
                  flagVariants({ variant, size }),
                  'material-symbols-outlined',
                  iconColor && `text-${iconColor}`
                )}
              >
                flag_2
              </span>
            )}
            {showText && variant !== 'none' && (
              <span
                className={cn(
                  'font-sans font-medium',
                  flagVariants({ variant })
                )}
              >
                {children}
              </span>
            )}
          </div>
        </Tooltip.Trigger>
        {variant !== 'none' && (
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={5}>
              <Tooltip.Popup className="bg-black text-white px-3 py-1 rounded-md text-xs font-normal shadow-md z-[1000]">
                {finalTooltipContent}
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
