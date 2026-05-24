'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Checkbox } from '../checkbox/checkbox';
import { SelectAllCheckbox } from '../select-all-checkbox/select-all-checkbox';
import { Input } from '../input/input';
import { Icon } from '../icon/icon';

export interface MetricOption {
  value: string;
  label: string;
}

export interface MetricCategory {
  value: string;
  label: string;
  icon?: string;
  metrics: MetricOption[];
}

export interface MetricCategorySelectProps {
  categories: MetricCategory[];
  selectedMetrics: Record<string, string[]>;
  onSelectionChange: (
    categoryValue: string,
    selectedMetricValues: string[]
  ) => void;
  className?: string;
  placeholder?: string;
  value?: string;
  onCategoryChange?: (categoryValue: string) => void;
  triggerClassName?: string;
}

export function MetricCategorySelect({
  categories,
  selectedMetrics,
  onSelectionChange,
  className,
  placeholder = 'Search metric',
  value,
  onCategoryChange,
  triggerClassName,
}: MetricCategorySelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [submenuForId, setSubmenuForId] = useState<string | null>(null);
  const [submenuStyle, setSubmenuStyle] = useState<
    React.CSSProperties | undefined
  >();
  const submenuContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const viewportPadding = 8;
  const horizontalGap = 12;
  const submenuMinWidth = 200;

  const openSubmenuForItem = useCallback((categoryId: string) => {
    const itemEl = itemRefs.current[categoryId];
    if (!itemEl) return;

    const itemRect = itemEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const tmp = document.createElement('div');
    tmp.style.position = 'fixed';
    tmp.style.visibility = 'hidden';
    tmp.style.left = '0px';
    tmp.style.top = '0px';
    tmp.style.minWidth = `${submenuMinWidth}px`;
    tmp.className = 'min-w-[200px] bg-white border rounded-xl shadow-xl p-2';
    document.body.appendChild(tmp);
    const { width: sw, height: sh } = tmp.getBoundingClientRect();
    document.body.removeChild(tmp);

    let left = itemRect.right + horizontalGap;
    let top = itemRect.top;

    if (left + sw > vw - viewportPadding) {
      left = itemRect.left - horizontalGap - sw;
      if (left < viewportPadding) {
        left = Math.max(viewportPadding, vw - viewportPadding - sw);
      }
    }

    if (top + sh > vh - viewportPadding) {
      top = Math.max(viewportPadding, vh - viewportPadding - sh);
    }
    if (top < viewportPadding) top = viewportPadding;

    setSubmenuForId(categoryId);
    setSubmenuStyle({ position: 'fixed', left, top, zIndex: 99999 });
  }, []);

  const handleCategoryMouseEnter = (categoryId: string) => {
    const category = categories.find((c) => c.value === categoryId);
    if (!category || category.metrics.length === 0) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredCategoryId(categoryId);
    requestAnimationFrame(() => openSubmenuForItem(categoryId));
  };

  const handleCategoryMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategoryId(null);
      setSubmenuForId(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  const handleSubmenuMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleSubmenuMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategoryId(null);
      setSubmenuForId(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase();
    return categories.filter((category) => {
      if (category.label.toLowerCase().includes(query)) {
        return true;
      }

      return category.metrics.some((metric) =>
        metric.label.toLowerCase().includes(query)
      );
    });
  }, [categories, searchQuery]);

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  useEffect(() => {
    if (
      isOpen &&
      triggerRef.current &&
      dropdownRef.current &&
      containerRef.current
    ) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const dropdownEl = dropdownRef.current;

      const relativeTop = triggerRect.bottom - containerRect.top + 8;
      const relativeLeft = triggerRect.left - containerRect.left;

      dropdownEl.style.width = `${triggerRect.width}px`;
      dropdownEl.style.top = `${relativeTop}px`;
      dropdownEl.style.left = `${relativeLeft}px`;
    }
  }, [isOpen, searchQuery, filteredCategories]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDropdown = !!(
        dropdownRef.current && dropdownRef.current.contains(target)
      );
      const clickedInsideTrigger = !!(
        triggerRef.current && triggerRef.current.contains(target)
      );
      const clickedInsideSubmenu = !!(
        submenuContainerRef.current &&
        submenuContainerRef.current.contains(target)
      );

      if (
        !clickedInsideDropdown &&
        !clickedInsideTrigger &&
        !clickedInsideSubmenu
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedCategory = categories.find((cat) => cat.value === value);

  const handleMetricToggle = (categoryValue: string, metricValue: string) => {
    const currentSelected = selectedMetrics[categoryValue] || [];
    const isSelected = currentSelected.includes(metricValue);

    if (isSelected) {
      onSelectionChange(
        categoryValue,
        currentSelected.filter((v) => v !== metricValue)
      );
    } else {
      onSelectionChange(categoryValue, [...currentSelected, metricValue]);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 h-10 px-3 py-2 rounded-md border text-left cursor-pointer transition-colors duration-200',
          isOpen
            ? 'border border-basic-green bg-white'
            : 'border border-basic-white bg-white',
          'focus:border-basic-green focus:outline-none',
          triggerClassName
        )}
      >
        <span
          className={
            !selectedCategory || !value
              ? 'text-gray-400 font-normal text-sm'
              : 'text-basic-black font-medium text-sm'
          }
        >
          {selectedCategory?.label || placeholder}
        </span>
        <span className="material-symbols-outlined text-basic-gray transition-transform duration-200 text-lg">
          expand_all
        </span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute bg-white rounded-md shadow-lg border border-basic-white z-50"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-2 border-b border-basic-gray-light">
            <Input className="w-full relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Icon icon="search" className="text-basic-black" />
              </div>
              <Input.Content
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full pl-7"
                autoFocus
              />
            </Input>
          </div>

          <div className="flex flex-col gap-1 p-2 max-h-60 overflow-y-auto">
            {filteredCategories.map((category) => {
              const isHovered = hoveredCategoryId === category.value;
              const categorySelectedMetrics =
                selectedMetrics[category.value] || [];
              const isSelected = value === category.value;

              return (
                <div
                  key={category.value}
                  className="relative"
                  ref={(el) => {
                    itemRefs.current[category.value] = el;
                  }}
                  onMouseEnter={() => handleCategoryMouseEnter(category.value)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <div
                    className={cn(
                      'flex items-center justify-between px-[6px] py-1 rounded-lg cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-basic-white'
                        : isHovered
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryChange?.(category.value);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium text-basic-black">
                        {category.label}
                      </span>
                    </div>
                    {category.metrics.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-[1.5px] text-xs font-medium bg-white rounded text-basic-gray hover:text-basic-black transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryMouseEnter(category.value);
                          }}
                        >
                          {categorySelectedMetrics.length ===
                          category.metrics.length
                            ? 'All'
                            : categorySelectedMetrics.length}
                        </button>
                        <Icon
                          icon="chevron_right"
                          className="text-basic-gray"
                        />
                      </div>
                    )}
                  </div>

                  {isHovered &&
                    submenuForId === category.value &&
                    category.metrics.length > 0 &&
                    createPortal(
                      <div
                        ref={submenuContainerRef}
                        className="bg-white border border-basic-gray-light rounded-xl shadow-xl min-w-[200px] p-2"
                        style={submenuStyle}
                        onMouseEnter={handleSubmenuMouseEnter}
                        onMouseLeave={handleSubmenuMouseLeave}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1">
                          <div
                            className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              const allSelected = category.metrics.every((m) =>
                                categorySelectedMetrics.includes(m.value)
                              );
                              if (allSelected) {
                                onSelectionChange(category.value, []);
                              } else {
                                onSelectionChange(
                                  category.value,
                                  category.metrics.map((m) => m.value)
                                );
                              }
                            }}
                          >
                            <SelectAllCheckbox
                              allItems={category.metrics}
                              selectedItems={categorySelectedMetrics}
                              onSelectedItemsChange={(selected) => {
                                onSelectionChange(category.value, selected);
                              }}
                              getIdFromItem={(item) => item.value}
                            />
                            <span className="text-sm font-medium text-basic-black">
                              All
                            </span>
                          </div>

                          {category.metrics.map((metric) => {
                            const isSelected = categorySelectedMetrics.includes(
                              metric.value
                            );
                            return (
                              <div
                                key={metric.value}
                                className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  handleMetricToggle(
                                    category.value,
                                    metric.value
                                  )
                                }
                              >
                                <Checkbox checked={isSelected} readOnly />
                                <span className="text-sm text-basic-black">
                                  {metric.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>,
                      document.body
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
