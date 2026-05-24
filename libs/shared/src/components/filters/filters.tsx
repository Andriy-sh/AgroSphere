'use client';
import { RotateCcw, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Collapsible, RecoveryKeyRow } from '../collapsible/collapsible';
import { Input } from '../input/input';
import React, { useState, useEffect } from 'react';
import { Button } from '../button/button';
import { Icon } from '../icon';

export type FilterRow = {
  checked: boolean;
  label: string;
  badgeCount?: number | string;
  isCustom?: boolean;
  className?: string;
};

export type FilterSection = {
  key: string;
  title: string;
  icon: string;
  rows: FilterRow[];
  className?: string;
};

export type FilterState = Record<string, string[]>;

type FiltersProps = React.ComponentPropsWithoutRef<'div'> & {
  sections: FilterSection[];
  className?: string;
  onReset?: () => void;
  onFiltersChange?: (filters: FilterState) => void;
  initialFilterState?: FilterState;
  loading?: boolean;
  titleClassName?: string;
};

export function Filters({
  sections,
  className,
  onReset,
  onFiltersChange,
  initialFilterState,
  loading = false,
  titleClassName,
  ...props
}: FiltersProps) {
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (initialFilterState) {
      return initialFilterState;
    }

    const initialState: FilterState = {};

    sections.forEach((section) => {
      initialState[section.key] = [];
      section.rows.forEach((row) => {
        if (row.checked) {
          initialState[section.key].push(row.label);
        }
      });
    });

    return initialState;
  });

  const [sectionsState, setSectionsState] = useState<FilterSection[]>(sections);
  const [collapsibleStates, setCollapsibleStates] = useState<
    Record<string, boolean>
  >({});
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {}
  );
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  useEffect(() => {
    setSectionsState(sections);

    const newFilterState: FilterState = initialFilterState || {};

    if (!initialFilterState) {
      sections.forEach((section) => {
        newFilterState[section.key] = [];
        section.rows.forEach((row) => {
          if (row.checked) {
            newFilterState[section.key].push(row.label);
          }
        });
      });
    }

    setFilterState(newFilterState);
  }, [sections, initialFilterState]);

  const handleFilterChange = (
    sectionKey: string,
    rowLabel: string,
    checked: boolean
  ) => {
    const newSectionsState = sectionsState.map((section) => {
      if (section.key === sectionKey) {
        return {
          ...section,
          rows: section.rows.map((row) => {
            if (row.label === rowLabel) {
              return { ...row, checked };
            }
            if (rowLabel === 'All') {
              return { ...row, checked: checked };
            }
            if (row.label === 'All') {
              return { ...row, checked: false };
            }
            return row;
          }),
        };
      }
      return section;
    });

    setSectionsState(newSectionsState);

    const newFilterState = { ...filterState };

    if (!newFilterState[sectionKey]) {
      newFilterState[sectionKey] = [];
    }

    if (rowLabel === 'All') {
      if (checked) {
        newFilterState[sectionKey] = ['All'];
      } else {
        newFilterState[sectionKey] = [];
      }
    } else {
      if (checked) {
        newFilterState[sectionKey] = [...newFilterState[sectionKey], rowLabel];
      } else {
        newFilterState[sectionKey] = newFilterState[sectionKey].filter(
          (item) => item !== rowLabel
        );
      }
      newFilterState[sectionKey] = newFilterState[sectionKey].filter(
        (item) => item !== 'All'
      );
    }

    setFilterState(newFilterState);
    onFiltersChange?.(newFilterState);
  };

  const handleCollapsibleChange = (sectionTitle: string, isOpen: boolean) => {
    setCollapsibleStates((prev) => ({
      ...prev,
      [sectionTitle]: isOpen,
    }));
  };

  const handleExpandSection = (sectionTitle: string) => {
    setVisibleCounts((counts) => {
      const currentCount = counts[sectionTitle] || 10;
      const section = sectionsState.find((s) => s.title === sectionTitle);
      const filteredRows = section ? getFilteredRows(section) : [];

      if (currentCount >= filteredRows.length) {
        return {
          ...counts,
          [sectionTitle]: 10,
        };
      }

      const newCount = Math.min(currentCount + 5, filteredRows.length);
      return {
        ...counts,
        [sectionTitle]: newCount,
      };
    });
  };

  const handleSearchChange = (sectionTitle: string, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [sectionTitle]: value,
    }));
  };

  const getFilteredRows = (section: FilterSection) => {
    const searchTerm = searchTerms[section.title] || '';
    const allRows = section.rows;

    if (!searchTerm) {
      return allRows;
    }

    return allRows.filter((row) =>
      row.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const shouldShowSearchAndExpand = (section: FilterSection) => {
    return section.rows.length > 10;
  };

  const handleReset = () => {
    const resetSections = sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        checked: false,
      })),
    }));

    setSectionsState(resetSections);

    const emptyFilterState: FilterState = {};
    sections.forEach((section) => {
      emptyFilterState[section.key] = [];
    });

    setFilterState(emptyFilterState);
    setVisibleCounts({});
    setSearchTerms({});
    onFiltersChange?.(emptyFilterState);
    onReset?.();
  };

  return (
    <div
      {...props}
      className={cn(
        'w-full max-w-xs min-w-[240px] h-full max-h-full bg-white p-2 flex flex-col overflow-y-auto',
        'font-sans text-gray-800',
        className
      )}
    >
      <div className="flex p-4 justify-between items-center pb-4 mb-6 w-full border-b border-basic-white">
        <h2 className="text-2xl font-semibold text-gray-900">Filters</h2>
        <button
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 group"
          onClick={handleReset}
          aria-label="Reset filters"
        >
          <RotateCcw
            size={24}
            className="text-gray-400 group-hover:text-gray-600 transition-transform duration-300 group-hover:rotate-360"
          />
        </button>
      </div>

      <div className="flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar min-w-0">
        {sectionsState.map((section, index) => {
          const isLastSection = index === sectionsState.length - 1;
          const filteredRows = getFilteredRows(section);
          const shouldShowSearch = shouldShowSearchAndExpand(section);
          const visibleCount = visibleCounts[section.title] || 10;
          const shouldShowExpandButton = filteredRows.length > 10;
          const displayedRows = filteredRows.slice(0, visibleCount);
          const sectionClasses = cn(
            {
              'border-b border-gray-200 pb-5': !isLastSection,
            },
            { 'mb-0': !isLastSection && sectionsState.length > 1 },
            section.className
          );

          return (
            <div key={section.title} className={sectionClasses}>
              <Collapsible
                title={section.title}
                icon={section.icon}
                titleClassName={titleClassName}
                defaultOpen={collapsibleStates[section.title] ?? true}
                onOpenChange={(isOpen) =>
                  handleCollapsibleChange(section.title, isOpen)
                }
              >
                {shouldShowSearch && (
                  <div className="mb-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerms[section.title] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSearchChange(section.title, e.target.value)
                        }
                        className="w-full h-7 px-3 pl-8 text-sm border border-basic-white rounded-lg bg-white focus:outline-none focus:border-basic-green placeholder:text-basic-gray"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Search size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {displayedRows.map((row) => (
                  <RecoveryKeyRow
                    key={row.label}
                    checked={row.checked}
                    label={row.label}
                    badgeCount={row.badgeCount ?? 0}
                    loading={loading}
                    onCheckedChange={(checked) =>
                      handleFilterChange(section.title, row.label, checked)
                    }
                  />
                ))}

                {shouldShowExpandButton && (
                  <Button
                    variant="ghost"
                    about={
                      visibleCount >= filteredRows.length
                        ? 'Show less'
                        : 'View more'
                    }
                    onClick={() => handleExpandSection(section.title)}
                    className="w-full flex justify-start text-start h-5 px-0 py-0 text-sm font-normal text-basic-green rounded-md items-start gap-2"
                  >
                    {visibleCount >= filteredRows.length
                      ? 'Show less'
                      : 'View more'}
                    <Icon
                      icon={
                        visibleCount >= filteredRows.length
                          ? 'expand_less'
                          : 'expand_more'
                      }
                      className="text-basic-green"
                    />
                  </Button>
                )}
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}
