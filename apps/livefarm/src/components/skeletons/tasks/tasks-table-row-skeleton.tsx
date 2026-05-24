'use client';

import React from 'react';
import { TableRowSkeleton } from '../table-row-skeleton';

interface TasksTableRowSkeletonProps {
  showColumns?: {
    createdAt?: boolean;
    activeAfter?: boolean;
  };
  showFilters?: boolean;
}

export function TasksTableRowSkeleton({
  showColumns = {
    createdAt: true,
    activeAfter: true,
  },
  showFilters = false,
}: TasksTableRowSkeletonProps) {
  const baseColumns = 8; 
  const dateColumns =
    (showColumns.createdAt ? 1 : 0) + (showColumns.activeAfter ? 1 : 0);
  const columnCount = baseColumns + dateColumns;

  return <TableRowSkeleton columnCount={columnCount} height={30} />;
}
