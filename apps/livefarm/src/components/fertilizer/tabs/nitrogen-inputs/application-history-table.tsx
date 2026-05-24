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
import { ApplicationRecord } from '../../utils/mock-data';

interface ApplicationHistoryTableProps {
  applications: ApplicationRecord[];
}

const PAGE_SIZE = 10;

export function ApplicationHistoryTable({
  applications,
}: ApplicationHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return applications.slice(startIndex, endIndex);
  }, [applications, currentPage]);

  const totalPages = Math.ceil(applications.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayRows = useMemo(() => {
    const rows: (ApplicationRecord | null)[] = [...paginatedApplications];
    while (rows.length < PAGE_SIZE) {
      rows.push(null);
    }
    return rows;
  }, [paginatedApplications]);

  return (
    <div className="flex flex-col h-[700px]">
      <div className="overflow-x-auto flex-1">
        <Table className="w-full h-full">
          <TableHeader>
            <TableRow className="h-auto border-b-0">
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[16.67%] px-4 py-2">
                Date
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[16.67%] px-4 py-2">
                Field
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[16.67%] px-4 py-2">
                Type
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[16.67%] px-4 py-2">
                Product
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[16.67%] px-4 py-2">
                Rate
              </TableHead>
              <TableHead className="text-sm font-normal text-basic-gray bg-basic-white text-left w-[16.67%] px-4 py-2">
                N Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((app, index) => (
              <TableRow
                key={app?.id || `empty-${index}`}
                className={index === 0 ? 'border-t-0' : ''}
              >
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {app?.date || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {app?.field || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {app?.type || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {app?.product || ''}
                </TableCell>
                <TableCell className="text-sm text-basic-black text-left px-4 py-3">
                  {app?.rate || ''}
                </TableCell>
                <TableCell className="text-sm text-blue-600 font-medium text-left px-4 py-3">
                  {app ? `${app.nValue.toFixed(1)} kg/ha` : ''}
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
