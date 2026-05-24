'use client';

import { FarmItem } from '@@agrosphere/shared';

interface TotalActiveAreaProps {
  farmItems: FarmItem[];
}

export function TotalActiveArea({ farmItems }: TotalActiveAreaProps) {
  const totalArea = farmItems.reduce((sum, { area }) => sum + (area ?? 0), 0);

  return (
    <div className="flex items-start gap-2 mt-5 mb-3">
      <span className="text-basic-gray">Total active area -</span>
      <span className="text-basic-black">{totalArea.toFixed(2)} ha</span>
    </div>
  );
}
