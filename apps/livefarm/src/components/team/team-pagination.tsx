'use client';

import { Pagination } from '@@agrosphere/shared';

interface TeamPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TeamPagination({
  currentPage,
  totalPages,
  onPageChange,
}: TeamPaginationProps) {

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-white w-full">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
