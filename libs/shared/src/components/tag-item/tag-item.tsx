'use client';

import { cn } from '../../utils/cn';

export const TagItem = ({
  children,
  className,
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-1 transition-colors duration-200 ease-in-out',
        className
      )}
    >
      {children}
    </div>
  );
};
