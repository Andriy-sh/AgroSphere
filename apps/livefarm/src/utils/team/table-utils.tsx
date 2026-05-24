import React from 'react';
import { TableHeightConfig } from '@@agrosphere/shared';

export function calculateEmptyRows(
  dataRowsCount: number,
  config: TableHeightConfig
): number {
  const {
    containerHeight,
    headerHeight,
    rowHeight,
    paginationHeight,
    padding,
  } = config;

  const availableHeight =
    containerHeight - headerHeight - paginationHeight - padding;
  const maxRows = Math.floor(availableHeight / rowHeight);

  return Math.max(0, maxRows - dataRowsCount);
}

export function createEmptyRows(count: number, colSpan: number) {
  return Array.from({ length: count }, (_, index) => (
    <tr
      key={`empty-${index}`}
      className="h-16 border-b border-basic-gray-light bg-white"
    >
      <td colSpan={colSpan} className="h-16 px-4">
        &nbsp;
      </td>
    </tr>
  ));
}
