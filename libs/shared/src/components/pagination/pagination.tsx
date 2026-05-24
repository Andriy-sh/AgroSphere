'use client';
import { FC, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  prevButtonText?: string;
  nextButtonText?: string;
  gapIndicator?: string;
  disabledClassName?: string;
  activeClassName?: string;
  itemClassName?: string;
  containerClassName?: string;
  showFirstLast?: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
  prevButtonText = 'Previous',
  nextButtonText = 'Next',
  gapIndicator = '..',
  disabledClassName = 'opacity-50 cursor-not-allowed',
  activeClassName = 'bg-green-600 text-white',
  itemClassName = 'min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ease-in-out',
  containerClassName = 'flex items-center justify-center space-x-2',
}) => {
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const getPageNumbers = (): Array<number | string> => {
    const pageNumbers: Array<number | string> = [];

    if (totalPages <= 0) {
      return [1];
    }

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    const pagesAroundCurrent = 1;

    const startPage = 1;
    const endPage = totalPages;

    let startCentralRange = currentPage - pagesAroundCurrent;
    let endCentralRange = currentPage + pagesAroundCurrent;

    if (startCentralRange <= 1) {
      startCentralRange = 2;
      endCentralRange = maxVisiblePages - 1;
      if (endCentralRange >= totalPages) {
        endCentralRange = totalPages - 1;
      }
    } else if (endCentralRange >= totalPages) {
      endCentralRange = totalPages - 1;
      startCentralRange = totalPages - (maxVisiblePages - 2);
      if (startCentralRange <= 1) {
        startCentralRange = 2;
      }
    }

    pageNumbers.push(startPage);

    if (startCentralRange > startPage + 1) {
      pageNumbers.push(gapIndicator);
    }

    for (let i = startCentralRange; i <= endCentralRange; i++) {
      if (i !== startPage && i !== endPage) {
        pageNumbers.push(i);
      }
    }

    if (endCentralRange < endPage - 1) {
      pageNumbers.push(gapIndicator);
    }

    if (endPage > startPage && !pageNumbers.includes(endPage)) {
      pageNumbers.push(endPage);
    }

    const finalCleanedPageNumbers: Array<number | string> = [];
    let lastPushedWasGap = false;

    for (let i = 0; i < pageNumbers.length; i++) {
      const currentItem = pageNumbers[i];
      const prevItem = pageNumbers[i - 1];
      const nextItem = pageNumbers[i + 1];

      if (i > 0 && currentItem === prevItem) {
        continue;
      }

      if (currentItem === gapIndicator) {
        if (lastPushedWasGap) {
          continue;
        }
        if (
          typeof prevItem === 'number' &&
          typeof nextItem === 'number' &&
          nextItem === prevItem + 1
        ) {
          continue;
        }
        if (prevItem === 1 && nextItem === 2) {
          continue;
        }
        if (nextItem === totalPages && prevItem === totalPages - 1) {
          continue;
        }

        finalCleanedPageNumbers.push(gapIndicator);
        lastPushedWasGap = true;
      } else {
        finalCleanedPageNumbers.push(currentItem);
        lastPushedWasGap = false;
      }
    }

    while (
      finalCleanedPageNumbers.length < maxVisiblePages &&
      totalPages > maxVisiblePages
    ) {
      const firstGapIndex = finalCleanedPageNumbers.indexOf(gapIndicator);
      const lastGapIndex = finalCleanedPageNumbers.lastIndexOf(gapIndicator);

      if (firstGapIndex !== -1 && firstGapIndex === lastGapIndex) {
        const gapPos = firstGapIndex;
        const beforeGap = finalCleanedPageNumbers[gapPos - 1] as number;
        const afterGap = finalCleanedPageNumbers[gapPos + 1] as number;

        if (afterGap - beforeGap > 1) {
          const midpoint = Math.floor((beforeGap + afterGap) / 2);
          finalCleanedPageNumbers.splice(gapPos, 1, midpoint);
          finalCleanedPageNumbers.sort((a, b) => {
            if (typeof a === 'string') return 1;
            if (typeof b === 'string') return -1;
            return a - b;
          });
          break;
        }
      }
      break;
    }

    return finalCleanedPageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (pageNumber: number | string) => {
    if (
      typeof pageNumber === 'number' &&
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      onPageChange
    ) {
      onPageChange(pageNumber);
    }
  };

  const prevNextButtonClasses =
    'min-w-[100px] h-10 px-4 py-2 rounded-lg text-gray-700 bg-white hover:bg-gray-100 flex items-center justify-center focus:outline-none transition-colors duration-200 ease-in-out';

  return (
    <nav
      className={`w-full flex items-center justify-center font-sans text-sm ${containerClassName}`}
      aria-label="Pagination navigation"
    >
      <ul className="flex items-center justify-between w-full">
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1 || totalPages <= 1}
            className={`${prevNextButtonClasses} ${
              currentPage === 1 || totalPages <= 1 ? disabledClassName : ''
            } text-gray-500 hover:text-gray-700`}
            aria-label={`Go to previous page${
              currentPage > 1 ? `, page ${currentPage - 1}` : ''
            }`}
            aria-disabled={currentPage === 1 || totalPages <= 1}
          >
            <span className="mr-2" aria-hidden="true">
              &larr;
            </span>{' '}
            {prevButtonText}
          </button>
        </li>

        <li>
          <ul className="flex items-center space-x-2">
            {pageNumbers.map((pageNumber, index) => (
              <li
                key={index}
                className={`${itemClassName} ${
                  pageNumber === currentPage
                    ? activeClassName
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${pageNumber === gapIndicator ? disabledClassName : ''}`}
              >
                <button
                  onClick={() => handlePageClick(pageNumber)}
                  disabled={pageNumber === gapIndicator}
                  className={`w-full h-full ${
                    pageNumber === currentPage ? 'text-white' : 'text-gray-700'
                  } ${pageNumber === gapIndicator ? 'cursor-default' : ''}`}
                  aria-label={
                    pageNumber === gapIndicator
                      ? 'More pages available'
                      : `Go to page ${pageNumber}${
                          pageNumber === currentPage ? ' (current page)' : ''
                        }`
                  }
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                  aria-disabled={pageNumber === gapIndicator}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages <= 1}
            className={`${prevNextButtonClasses} ${
              currentPage === totalPages || totalPages <= 1
                ? disabledClassName
                : ''
            } text-gray-500 hover:text-gray-700`}
            aria-label={`Go to next page${
              currentPage < totalPages ? `, page ${currentPage + 1}` : ''
            }`}
            aria-disabled={currentPage === totalPages || totalPages <= 1}
          >
            {nextButtonText}{' '}
            <span className="ml-2" aria-hidden="true">
              &rarr;
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
