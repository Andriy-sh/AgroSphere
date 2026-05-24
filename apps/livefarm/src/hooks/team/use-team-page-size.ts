'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTeamPageSizeProps {
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  estimatedRowHeight?: number;
  headerHeight?: number;
  paginationHeight?: number;
  minPageSize?: number;
}

export function useTeamPageSize({
  tableContainerRef,
  estimatedRowHeight = 60,
  headerHeight = 40,
  paginationHeight = 40,
  minPageSize = 1,
}: UseTeamPageSizeProps) {
  const [dynamicPageSize, setDynamicPageSize] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);
  const mountedRef = useRef(false);

  const calculatePageSize = useCallback(() => {
    if (!tableContainerRef.current) {
      const minSize = minPageSize;
      setDynamicPageSize(minSize);
      if (!isReadyRef.current) {
        isReadyRef.current = true;
        setIsReady(true);
      }
      return;
    }

    const containerHeight = tableContainerRef.current.clientHeight;
    const availableHeight = containerHeight - headerHeight - paginationHeight;

    if (availableHeight <= 0) {
      setDynamicPageSize(minPageSize);
      if (!isReadyRef.current) {
        isReadyRef.current = true;
        setIsReady(true);
      }
      return;
    }

    const calculatedPageSize = Math.max(
      minPageSize,
      Math.floor(availableHeight / estimatedRowHeight)
    );

    setDynamicPageSize(calculatedPageSize);

    if (!isReadyRef.current) {
      isReadyRef.current = true;
      setIsReady(true);
    }
  }, [
    tableContainerRef,
    estimatedRowHeight,
    headerHeight,
    paginationHeight,
    minPageSize,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    const updatePageSize = () => {
      if (!mountedRef.current) return;
      calculatePageSize();
    };

    const timeoutId = setTimeout(updatePageSize, 100);

    window.addEventListener('resize', updatePageSize);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePageSize);
    };
  }, [calculatePageSize]);

  return {
    dynamicPageSize,
    isReady,
    calculatePageSize,
  };
}
