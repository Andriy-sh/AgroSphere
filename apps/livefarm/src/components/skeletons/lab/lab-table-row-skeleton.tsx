'use client';

import React from 'react';
import { TableRowSkeleton } from '../table-row-skeleton';

interface LabTableRowSkeletonProps {
  showColumns?: {
    client?: boolean;
    type?: boolean;
    labName?: boolean;
    taskId?: boolean;
    labOrderNo?: boolean;
    samples?: boolean;
    sentDate?: boolean;
    receivedDate?: boolean;
    status?: boolean;
    updatedAt?: boolean;
  };
  showFilters?: boolean;
}

export function LabTableRowSkeleton({
  showColumns = {
    client: true,
    type: true,
    labName: true,
    taskId: true,
    labOrderNo: true,
    samples: true,
    sentDate: true,
    receivedDate: true,
    status: true,
    updatedAt: true,
  },
  showFilters = false,
}: LabTableRowSkeletonProps) {

  const baseColumns = 11;
  const conditionalColumns = showColumns.updatedAt && !showFilters ? 1 : 0;
  const otherColumns = 1;
  const columnCount = baseColumns + conditionalColumns + otherColumns;

  return <TableRowSkeleton columnCount={columnCount} height={30} />;
}
