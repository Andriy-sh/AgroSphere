'use client';
import { Pagination } from '@@agrosphere/shared';

interface ClientsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientsPaginationProps) {
  return (
    <div className="bg-white rounded-b-xl">
      <div className="flex justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          maxVisiblePages={7}
        />
      </div>
    </div>
  );
}
