'use client';

import * as React from 'react';

import { cn } from '../../utils/cn';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container "
      className="relative w-full overflow-x-auto min-h-0 overflow-y-auto h-full"
    >
      <table
        data-slot="table"
        className={cn(
          'w-full caption-bottom text-sm  border-spacing-y-2',
          className
        )}
        style={{ transition: 'none' }}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        '[&:has([role=checkbox])>th:first-child]:pl-2.5',
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody data-slot="table-body" className={cn('', className)} {...props} />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted hover:bg-gray-50 h-[60px] border-b border-basic-white bg-white relative',
        className
      )}
      style={{ transition: 'none' }}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-9 font-medium text-truncate overflow-hidden first:rounded-l-xl last:rounded-r-xl  ',
        'text-center',
        '[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  checkbox,
  ...props
}: React.ComponentProps<'td'> & { checkbox?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'align-middle text-truncate overflow-hidden h-[60px] ',
        checkbox && 'first:text-center',
        className
      )}
      style={{ transition: 'none' }}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm ', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
