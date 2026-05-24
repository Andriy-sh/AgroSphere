'use client';

import Skeleton from '@mui/material/Skeleton';
import { cn } from '@@agrosphere/shared';

interface AssignedUsersListSkeletonProps {
  className?: string;
}

export function AssignedUsersListSkeleton({
  className,
}: AssignedUsersListSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-basic-white h-full flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between p-5 border-b border-basic-white">
        <h3 className="text-base font-semibold">
          <Skeleton variant="text" width={200} height={20} />
        </h3>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full transition text-white"
          aria-label="Add user"
        >
          <Skeleton variant="circular" width={32} height={32} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-5">
        <div className="my-3">
          <div className="flex items-center text-sm font-medium">
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              className="rounded-sm bg-[#00AF4D1F] mr-4"
            />
            <Skeleton
              variant="text"
              width={96}
              height={16}
              className="text-black"
            />
            <Skeleton
              variant="rounded"
              width={80}
              height={24}
              className="ml-auto bg-basic-white text-basic-black py-[1.5px] text-xs rounded-[4px] px-2 font-normal"
            />
          </div>
          <div className="w-full h-px bg-basic-white mt-3" />
        </div>

        <div className="my-3">
          <div className="flex items-center text-sm font-medium">
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              className="rounded-sm bg-[#00AF4D1F] mr-4"
            />
            <Skeleton
              variant="text"
              width={112}
              height={16}
              className="text-black"
            />
            <Skeleton
              variant="rounded"
              width={64}
              height={24}
              className="ml-auto bg-basic-white text-basic-black py-[1.5px] text-xs rounded-[4px] px-2 font-normal"
            />
          </div>
          <div className="w-full h-px bg-basic-white mt-3" />
        </div>

        <div className="my-3">
          <div className="flex items-center text-sm font-medium">
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              className="rounded-sm bg-[#00AF4D1F] mr-4"
            />
            <Skeleton
              variant="text"
              width={80}
              height={16}
              className="text-black"
            />
            <Skeleton
              variant="rounded"
              width={96}
              height={24}
              className="ml-auto bg-basic-white text-basic-black py-[1.5px] text-xs rounded-[4px] px-2 font-normal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
