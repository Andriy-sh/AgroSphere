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
import { SoilTestRecord } from '../../utils/mock-data';

interface TestHistoryTableProps {
  tests: SoilTestRecord[];
}

const PAGE_SIZE = 10;

export function TestHistoryTable({ tests }: TestHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return tests.slice(startIndex, endIndex);
  }, [tests, currentPage]);

  const totalPages = Math.ceil(tests.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayRows = useMemo(() => {
    const rows: (SoilTestRecord | null)[] = [...paginatedTests];
    while (rows.length < PAGE_SIZE) {
      rows.push(null);
    }
    return rows;
  }, [paginatedTests]);

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
                N-Min Range
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                Scenario
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[20%] px-4 py-2">
                N Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((test, index) => (
              <TableRow
                key={test?.id || `empty-${index}`}
                className={index === 0 ? 'border-t-0' : ''}
              >
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {test?.date || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {test?.field || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {test?.nMinRange || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {test?.scenario || ''}
                </TableCell>
                <TableCell className="text-sm text-purple-600 font-medium text-left px-4 py-3">
                  {test ? `${test.nValue.toFixed(1)} kg/ha` : ''}
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
