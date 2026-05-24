'use client';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

export interface TableHeightConfig {
  containerHeight: number;
  headerHeight: number;
  rowHeight: number;
  paginationHeight: number;
  padding: number;
}

const DEFAULT_PAGE_SIZE = 9;

export const useTeamPageSize = () => {
  const [dynamicPageSize, setDynamicPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [connectionPageSize, setConnectionPageSize] =
    useState(DEFAULT_PAGE_SIZE);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableHeightConfig: TableHeightConfig = useMemo(() => {
    const containerHeight = tableContainerRef.current?.clientHeight || 600;
    return {
      containerHeight,
      headerHeight: 48,
      rowHeight: 64,
      paginationHeight: 80,
      padding: 32,
    };
  }, [tableContainerRef.current?.clientHeight]);

  const calculatePageSize = useCallback(() => {
    if (!tableContainerRef.current) {
      setDynamicPageSize(DEFAULT_PAGE_SIZE);
      setConnectionPageSize(DEFAULT_PAGE_SIZE);
      return;
    }

    const containerHeight = tableContainerRef.current.clientHeight;
    const estimatedRowHeight = 60;
    const headerHeight = 60;
    const paginationHeight = 60;
    const padding = 32;

    const availableHeight =
      containerHeight - headerHeight - paginationHeight - padding;
    const calculatedPageSize = Math.max(
      5,
      Math.floor(availableHeight / estimatedRowHeight)
    );

    setDynamicPageSize(calculatedPageSize);
    setConnectionPageSize(calculatedPageSize);
  }, []);

  useEffect(() => {
    calculatePageSize();

    const handleResize = () => {
      calculatePageSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePageSize]);

  return {
    dynamicPageSize,
    connectionPageSize,
    tableContainerRef,
    tableHeightConfig,
    calculatePageSize,
  };
};
