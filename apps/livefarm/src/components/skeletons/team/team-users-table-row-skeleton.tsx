'use client';

import React from 'react';
import { TableRowSkeleton } from '../table-row-skeleton';

interface TeamUsersTableRowSkeletonProps {
  showColumns?: {
    email?: boolean;
    role?: boolean;
    status?: boolean;
    actions?: boolean;
  };
}

export function TeamUsersTableRowSkeleton({
  showColumns = { email: true, role: true, status: true, actions: true },
}: TeamUsersTableRowSkeletonProps) {
  // Base columns: checkbox + name (always present)
  const baseColumns = 2;

  // Conditional columns based on showColumns
  const conditionalColumns =
    (showColumns.email ? 1 : 0) +
    (showColumns.role ? 1 : 0) +
    (showColumns.status ? 1 : 0) +
    (showColumns.actions ? 1 : 0);

  const columnCount = baseColumns + conditionalColumns;

  return <TableRowSkeleton columnCount={columnCount} height={30} />;
}
