'use client';

import React from 'react';
import { TableRowSkeleton } from '../table-row-skeleton';

interface ClientsTableRowSkeletonProps {
  showColumns?: {
    phone?: boolean;
    herdNo?: boolean;
    tags?: boolean;
  };
}

export function ClientsTableRowSkeleton({
  showColumns = { phone: true, herdNo: true, tags: true },
}: ClientsTableRowSkeletonProps) {

  const baseColumns = 5; 
  const conditionalColumns =
    (showColumns.phone ? 1 : 0) +
    (showColumns.herdNo ? 1 : 0) +
    (showColumns.tags ? 1 : 0);
  const otherColumns = 2; 
  const columnCount = baseColumns + conditionalColumns + otherColumns;

  return <TableRowSkeleton columnCount={columnCount} height={30} />;
}
