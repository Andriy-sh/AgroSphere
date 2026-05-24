'use client';
import React, { useEffect, useState } from 'react';

export interface PageSizeConfig {
  estimatedRowHeight: number;
  headerHeight: number;
  paginationHeight: number;
  padding: number;
  minPageSize: number;
}

export const DEFAULT_PAGE_SIZE_CONFIG: PageSizeConfig = {
  estimatedRowHeight: 60,
  headerHeight: 28,
  paginationHeight: 80,
  padding: 0,
  minPageSize: 1,
};

export function calculateDynamicPageSize(
  containerHeight: number,
  config: Partial<PageSizeConfig> = {}
): number {
  const finalConfig = { ...DEFAULT_PAGE_SIZE_CONFIG, ...config };

  const {
    estimatedRowHeight,
    headerHeight,
    paginationHeight,
    padding,
    minPageSize,
  } = finalConfig;

  if (!containerHeight || containerHeight <= 0) {
    return minPageSize;
  }

  const availableHeight =
    containerHeight - headerHeight - paginationHeight - padding;

  if (availableHeight <= 0) {
    return minPageSize;
  }

  const calculatedPageSize = Math.max(
    minPageSize,
    Math.floor(availableHeight / estimatedRowHeight)
  );

  return calculatedPageSize;
}

export function createPageSizeCalculator(config: Partial<PageSizeConfig> = {}) {
  const finalConfig = { ...DEFAULT_PAGE_SIZE_CONFIG, ...config };

  return {
    calculate: (containerHeight: number) =>
      calculateDynamicPageSize(containerHeight, finalConfig),
    config: finalConfig,
  };
}

export function usePageSizeCalculation(
  containerRef: React.RefObject<HTMLElement | null>,
  config: Partial<PageSizeConfig> = {}
) {
  const calculator = createPageSizeCalculator(config);

  const calculatePageSize = () => {
    if (!containerRef.current) {
      return calculator.config.minPageSize;
    }

    return calculator.calculate(containerRef.current.clientHeight);
  };

  return {
    calculatePageSize,
    config: calculator.config,
  };
}
export function useDynamicPageSize(
  containerRef: React.RefObject<HTMLElement | null>,
  config: Partial<PageSizeConfig> = {}
) {
  const finalConfig = React.useMemo(
    () => ({ ...DEFAULT_PAGE_SIZE_CONFIG, ...config }),
    [config]
  );
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = React.useRef(false);
  const mountedRef = React.useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const updatePageSize = () => {
      if (!mountedRef.current) return;

      if (!containerRef.current) {
        const minSize = finalConfig.minPageSize;
        setPageSize((prev) => {
          if (prev !== minSize) {
            return minSize;
          }
          return prev;
        });
        if (!isReadyRef.current) {
          isReadyRef.current = true;
          setIsReady(true);
        }
        return;
      }

      const newPageSize = calculateDynamicPageSize(
        containerRef.current.clientHeight,
        finalConfig
      );

      setPageSize((prev) => {
        if (prev !== newPageSize) {
          return newPageSize;
        }
        return prev;
      });

      if (!isReadyRef.current) {
        isReadyRef.current = true;
        setIsReady(true);
      }
    };

    const timeoutId = setTimeout(updatePageSize, 0);

    window.addEventListener('resize', updatePageSize);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePageSize);
    };
  }, [containerRef, finalConfig]);

  return { pageSize, isReady };
}

export function useTablePageSize(
  containerRef: React.RefObject<HTMLElement | null>,
  options: {
    estimatedRowHeight?: number;
    headerHeight?: number;
    paginationHeight?: number;
    minPageSize?: number;
  } = {}
) {
  return useDynamicPageSize(containerRef, {
    estimatedRowHeight: 60,
    headerHeight: 36,
    paginationHeight: 80,
    minPageSize: 1,
    ...options,
  });
}
