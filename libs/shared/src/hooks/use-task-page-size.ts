'use client';

import { useCallback, useEffect } from 'react';

export interface UseTaskPageSizeProps {
  setDynamicPageSize: (size: number) => void;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useTaskPageSize({
  setDynamicPageSize,
  tableContainerRef,
}: UseTaskPageSizeProps) {
  const calculatePageSize = useCallback(() => {
    if (!tableContainerRef.current) {
      setDynamicPageSize(9);
      return;
    }

    const containerHeight = tableContainerRef.current.clientHeight;
    const estimatedRowHeight = 60;
    const headerHeight = 28;
    const paginationHeight = 80;
    const padding = 32;

    const availableHeight =
      containerHeight - headerHeight - paginationHeight - padding;
    const calculatedPageSize = Math.max(
      5,
      Math.floor(availableHeight / estimatedRowHeight) - 1
    );

    setDynamicPageSize(calculatedPageSize);
  }, [tableContainerRef, setDynamicPageSize]);

  useEffect(() => {
    calculatePageSize();

    const handleResize = () => {
      calculatePageSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePageSize]);

  return {
    calculatePageSize,
  };
}
