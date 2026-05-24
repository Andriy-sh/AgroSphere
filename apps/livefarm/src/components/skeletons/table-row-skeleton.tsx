'use client';

import React from 'react';
import Skeleton from '@mui/material/Skeleton';

interface TableRowSkeletonProps {
  columnCount: number;
  height?: number;
  className?: string;
}

export function TableRowSkeleton({
  columnCount,
  height = 30,
  className = '',
}: TableRowSkeletonProps) {
  return (
    <tr
      className={`h-[60px] border-b border-basic-white bg-white ${className}`}
    >
      <td colSpan={columnCount} className="h-[60px] px-4">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={height}
          className="rounded-lg"
        />
      </td>
    </tr>
  );
}
