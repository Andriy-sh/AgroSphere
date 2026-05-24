'use client';

import Skeleton from '@mui/material/Skeleton';
import { cn } from '@@agrosphere/shared';

interface ClientHeaderSkeletonProps {
  className?: string;
}

export function ClientHeaderSkeleton({ className }: ClientHeaderSkeletonProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Skeleton variant="circular" width={36} height={36} />

      <Skeleton variant="text" width={192} height={32} />
    </div>
  );
}
