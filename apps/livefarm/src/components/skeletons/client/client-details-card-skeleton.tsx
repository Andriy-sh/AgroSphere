'use client';

import Skeleton from '@mui/material/Skeleton';
import { cn } from '@@agrosphere/shared';

interface ClientDetailsCardSkeletonProps {
  className?: string;
}

export function ClientDetailsCardSkeleton({
  className,
}: ClientDetailsCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-basic-white relative h-full flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="absolute top-6 right-6">
        <Skeleton variant="circular" width={24} height={24} />
      </div>

      <div className="text-base font-medium text-black p-5 border-b border-basic-white text-start">
        <Skeleton variant="text" width={120} height={20} />
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-y-2 gap-x-4 items-center p-5">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <Skeleton variant="text" width={96} height={14} />
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={64} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <Skeleton variant="text" width={192} height={14} />
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={96} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <Skeleton variant="text" width={128} height={14} />
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={48} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <Skeleton variant="text" width={160} height={14} />
        </div>

        {/* Herd No row */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={64} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <Skeleton variant="text" width={80} height={14} />
        </div>

        {/* Assigned consultant row */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={128} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" width={96} height={14} />
          </div>
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={48} height={14} />
        </div>
        <div className="text-black text-sm font-medium">
          <div className="flex gap-2 flex-wrap">
            <Skeleton variant="rounded" width={64} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
            <Skeleton variant="rounded" width={56} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
