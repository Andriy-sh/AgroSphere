'use client';

import React from 'react';

interface TableRowsSkeletonProps {
  rows?: number;
  className?: string;
}

export function TableRowsSkeleton({
  rows = 5,
  className = '',
}: TableRowsSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className={`h-[60px] border-b border-basic-white bg-white ${className}`}
        >
          <td colSpan={6} className="h-[60px] px-4">
            <div className="w-full h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
