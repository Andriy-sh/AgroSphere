'use client';

import { cn } from '@@agrosphere/shared';
import { ClientDetailsCardSkeleton } from './client-details-card-skeleton';
import { AssignedUsersListSkeleton } from './assigned-users-list-skeleton';
import { CommentsSectionSkeleton } from './comments-section-skeleton';

interface OverviewSkeletonProps {
  className?: string;
}

export function OverviewSkeleton({ className }: OverviewSkeletonProps) {
  return (
    <div
      className={cn(
        'flex-1 min-h-0 flex flex-col overflow-hidden m-2 text-sm',
        className
      )}
    >
      <div className="flex-1 min-h-0 grid grid-cols-[2fr_1fr] gap-6 items-start overflow-hidden p-1">
        <div className="flex flex-col min-h-0 h-full gap-6">
          <div className="h-1/2 min-h-0 overflow-hidden">
            <ClientDetailsCardSkeleton />
          </div>
          <div className="h-1/2 min-h-0 overflow-hidden">
            <AssignedUsersListSkeleton />
          </div>
        </div>
        <div className="flex flex-col min-h-0 h-full overflow-hidden">
          <CommentsSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
