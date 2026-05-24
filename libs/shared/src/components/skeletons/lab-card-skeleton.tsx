'use client';

import { cn } from '../../utils/cn';

interface LabCardSkeletonProps {
  className?: string;
  count?: number;
}

export function LabCardSkeleton({
  className,
  count = 6,
}: LabCardSkeletonProps) {
  const renderSkeletonCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-24 h-4 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1">
              <div className="w-24 h-3 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}



        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-200 rounded-md animate-pulse" />
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 flex gap-2 flex-wrap">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-20 rounded-full bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div className="flex justify-end">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{renderSkeletonCard()}</div>
        ))}
      </div>
    </div>
  );
}
