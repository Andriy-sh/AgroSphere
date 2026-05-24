import { cn } from '../../utils/cn';
import Skeleton from '@mui/material/Skeleton';

interface CompanySelectSkeletonProps {
  className?: string;
  collapsed?: boolean;
}

export function CompanySelectSkeleton({
  className,
  collapsed = false,
}: CompanySelectSkeletonProps) {
  return (
    <div
      className={cn('flex items-center gap-2 w-full rounded-md p-4', className)}
      aria-busy="true"
      aria-label="Loading company selector"
      role="status"
    >
      <Skeleton
        variant="rectangular"
        width={28}
        height={28}
        className="rounded-md flex-shrink-0"
      />

      <div
        className={cn(
          'flex flex-col gap-2 min-w-0 flex-1',
          collapsed && 'sr-only'
        )}
      >
        <div className="flex items-center gap-2">
          <Skeleton variant="text" width={128} height={16} />
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
        </div>
      </div>

      <Skeleton
        variant="rectangular"
        width={16}
        height={28}
        className="rounded flex-shrink-0"
        sx={{ display: collapsed ? 'none' : 'block' }}
      />
    </div>
  );
}
