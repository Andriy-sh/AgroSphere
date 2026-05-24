'use client';

import Skeleton from '@mui/material/Skeleton';
import { cn } from '@@agrosphere/shared';

interface CommentsSectionSkeletonProps {
  className?: string;
}

export function CommentsSectionSkeleton({
  className,
}: CommentsSectionSkeletonProps) {
  return (
    <div
      className={cn(
        'flex-1 min-h-0 bg-white rounded-xl border border-basic-white h-full flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between p-5 border-b border-basic-white">
        <h3 className="text-base font-semibold">
          <Skeleton variant="text" width={80} height={20} />
        </h3>
        <button className="flex items-center justify-center">
          <Skeleton variant="circular" width={20} height={20} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-auto p-5">
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                  className="text-basic-green font-bold mr-1 rounded-lg"
                />
                <Skeleton
                  variant="text"
                  width={64}
                  height={16}
                  className="font-semibold text-black text-sm"
                />
                <Skeleton
                  variant="text"
                  width={1}
                  height={16}
                  className="w-px h-4 bg-basic-white"
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={12}
                  className="flex items-center gap-2 text-basic-gray font-normal text-xs tracking-normal"
                />
              </div>
              <div className="mt-2">
                <Skeleton
                  variant="text"
                  width="100%"
                  height={16}
                  className="text-black font-normal leading-snug mb-1"
                />
                <Skeleton
                  variant="text"
                  width="75%"
                  height={16}
                  className="text-black font-normal leading-snug"
                />
              </div>
            </div>
            <div className="w-full h-px bg-basic-white my-3" />
          </div>

          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                  className="text-basic-green font-bold mr-1 rounded-lg"
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={16}
                  className="font-semibold text-black text-sm"
                />
                <Skeleton
                  variant="text"
                  width={1}
                  height={16}
                  className="w-px h-4 bg-basic-white"
                />
                <Skeleton
                  variant="text"
                  width={96}
                  height={12}
                  className="flex items-center gap-2 text-basic-gray font-normal text-xs tracking-normal"
                />
              </div>
              <div className="mt-2">
                <Skeleton
                  variant="text"
                  width="100%"
                  height={16}
                  className="text-black font-normal leading-snug mb-1"
                />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={16}
                  className="text-black font-normal leading-snug"
                />
              </div>
            </div>
            <div className="w-full h-px bg-basic-white my-3" />
          </div>

          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                  className="text-basic-green font-bold mr-1 rounded-lg"
                />
                <Skeleton
                  variant="text"
                  width={56}
                  height={16}
                  className="font-semibold text-black text-sm"
                />
                <Skeleton
                  variant="text"
                  width={1}
                  height={16}
                  className="w-px h-4 bg-basic-white"
                />
                <Skeleton
                  variant="text"
                  width={72}
                  height={12}
                  className="flex items-center gap-2 text-basic-gray font-normal text-xs tracking-normal"
                />
              </div>
              <div className="mt-2">
                <Skeleton
                  variant="text"
                  width="100%"
                  height={16}
                  className="text-black font-normal leading-snug mb-1"
                />
                <Skeleton
                  variant="text"
                  width="66%"
                  height={16}
                  className="text-black font-normal leading-snug"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
