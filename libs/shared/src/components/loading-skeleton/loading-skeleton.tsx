import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-1 h-4 bg-gray-200"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="flex gap-4 border-b border-gray-200">
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
          <div className="w-24 h-8 bg-gray-200 rounded"></div>
        </div>

        <div className="space-y-4">
          <div className="w-full h-32 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
