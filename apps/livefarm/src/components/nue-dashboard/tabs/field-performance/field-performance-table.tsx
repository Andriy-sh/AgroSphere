'use client';

import { useState, useMemo } from 'react';
import {
  Pagination,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@@agrosphere/shared';
import { type TimePeriod } from '../../dashboard-tabs';
import { getFilteredFieldPerformanceData } from '../../utils/data-filter';

const ITEMS_PER_PAGE = 5;

interface FieldPerformanceTableProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function FieldPerformanceTable({
  timePeriod,
  customStartDate,
  customEndDate,
}: FieldPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(
    () =>
      getFilteredFieldPerformanceData(timePeriod, customStartDate, customEndDate),
    [timePeriod, customStartDate, customEndDate]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [currentPage, filteredData]);

  return (
    <div className="w-full rounded-lg border border-basic-gray-light">
      <div className="p-5 border-b border-basic-gray-light">
        <h2 className="text-lg font-semibold text-basic-black">
          Field Performance Summary
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-basic-gray-light">
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              Rank
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              Field
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              NUE
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              Area (ha)
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              N In (kg/ha)
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              N Out (kg/ha)
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              Status
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-basic-gray py-3 px-5">
              Trend
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow
              key={row.field}
              className={`border-b border-basic-gray-light ${
                rowIndex === paginatedData.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <TableCell className="py-3 px-5 text-sm text-basic-black">
                {row.rank}
              </TableCell>
              <TableCell className="py-3 px-5 text-sm text-basic-black font-medium">
                {row.field}
              </TableCell>
              <TableCell
                className={`py-3 px-5 text-sm font-semibold ${
                  row.nue >= 90 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {row.nue.toFixed(1)}%
              </TableCell>
              <TableCell className="py-3 px-5 text-sm text-basic-black">
                {row.area.toFixed(1)}
              </TableCell>
              <TableCell className="py-3 px-5 text-sm text-basic-black">
                {row.nIn.toFixed(1)}
              </TableCell>
              <TableCell className="py-3 px-5 text-sm text-basic-black">
                {row.nOut.toFixed(1)}
              </TableCell>
              <TableCell className="py-3 px-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">
                    check_circle
                  </span>
                  <span className="text-sm text-basic-black">{row.status}</span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-5">
                <div className="flex items-center gap-1">
                  {row.trend > 0 ? (
                    <>
                      <span className="material-symbols-outlined text-green-600 text-lg">
                        trending_up
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        +{row.trend.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-red-600 text-lg">
                        trending_down
                      </span>
                      <span className="text-sm text-red-600 font-medium">
                        {row.trend.toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="p-5 border-t border-basic-gray-light">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  );
}
