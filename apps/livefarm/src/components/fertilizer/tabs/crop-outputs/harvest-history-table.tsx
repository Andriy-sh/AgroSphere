'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
} from '@@agrosphere/shared';
import { HarvestRecord } from '../../utils/mock-data';

interface HarvestHistoryTableProps {
  harvests: HarvestRecord[];
}

const PAGE_SIZE = 10;

export function HarvestHistoryTable({ harvests }: HarvestHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedHarvests = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return harvests.slice(startIndex, endIndex);
  }, [harvests, currentPage]);

  const totalPages = Math.ceil(harvests.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayRows = useMemo(() => {
    const rows: (HarvestRecord | null)[] = [...paginatedHarvests];
    while (rows.length < PAGE_SIZE) {
      rows.push(null);
    }
    return rows;
  }, [paginatedHarvests]);

  return (
    <div className="flex flex-col h-[700px]">
      <div className="overflow-x-auto flex-1">
        <Table className="w-full h-full">
          <TableHeader>
            <TableRow className="h-auto border-b-0">
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                Date
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                Field
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                Type
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                Yield
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                N Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((harvest, index) => (
              <TableRow
                key={harvest?.id || `empty-${index}`}
                className={index === 0 ? 'border-t-0' : ''}
              >
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {harvest?.date || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {harvest?.field || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {harvest?.type || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {harvest?.yield || ''}
                </TableCell>
                <TableCell className="text-sm text-green-600 font-medium text-left px-4 py-3">
                  {harvest ? `${harvest.nValue.toFixed(1)} kg/ha` : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center py-2 flex-shrink-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisiblePages={7}
        />
      </div>
    </div>
  );
}

