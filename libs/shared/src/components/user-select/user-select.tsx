'use client';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { createPopper, Instance } from '@popperjs/core';
import { Avatar } from '../avatar/avatar';
import { Input } from '../input/input';

export interface UserSelectOption {
  value: string;
  label: string;
  avatar?: string;
  initials?: string;
  className?: string;
  triggerClassName?: string;
  avatarClassName?: string;
}

export interface UserSelectProps {
  options: UserSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  avatarClassName?: string;
  triggerClassName?: string;
  disabled?: boolean;
  width?: 'static' | 'dynamic';
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  searchValue?: string;
}

export function UserSelect({
  options,
  value,
  onChange,
  placeholder = 'Select assignee',
  className = '',
  avatarClassName = '',
  disabled = false,
  triggerClassName = '',
  width = 'static',
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  onSearchChange,
  searchValue,
}: UserSelectProps) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popperInstance = useRef<Instance | null>(null);

  // Use controlled search value if provided, otherwise use local state
  const search = searchValue !== undefined ? searchValue : localSearch;

  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      popperInstance.current = createPopper(
        buttonRef.current,
        dropdownRef.current,
        {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: [
                  'top-start',
                  'bottom-start',
                  'top-end',
                  'bottom-end',
                ],
                padding: 8,
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8,
              },
            },
            {
              name: 'computeStyles',
              options: {
                adaptive: true,
              },
            },
          ],
        }
      );

      if (buttonRef.current) {
        const { width: buttonWidth } =
          buttonRef.current.getBoundingClientRect();
        setDropdownWidth(buttonWidth);
      }

      return () => {
        if (popperInstance.current) {
          popperInstance.current.destroy();
          popperInstance.current = null;
        }
      };
    }

    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !onLoadMore || !hasMore || isLoadingMore) return;

    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdown;
      const threshold = 100; // Load more when 100px from bottom

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        onLoadMore();
      }
    };

    dropdown.addEventListener('scroll', handleScroll);
    return () => {
      dropdown.removeEventListener('scroll', handleScroll);
    };
  }, [open, onLoadMore, hasMore, isLoadingMore]);

  const filtered = onSearchChange
    ? options
    : options.filter(
        (o) =>
          o.value === '' || o.label.toLowerCase().includes(search.toLowerCase())
      );
  const selected = options.find((o) => o.value === value);

  const handleSearchChange = (newSearch: string) => {
    if (onSearchChange) {
      onSearchChange(newSearch);
    } else {
      setLocalSearch(newSearch);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    if (onSearchChange) {
      onSearchChange('');
    } else {
      setLocalSearch('');
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

  const getDropdownClasses = () => {
    return 'bg-white border-2 rounded-xl shadow-xl max-h-60 overflow-y-auto p-2';
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        ref={buttonRef}
        className={`px-3 py-[7px] text-basic-black focus:outline-none focus:ring-1 focus:border-basic-green flex items-center justify-between transition-all ${
          disabled
            ? 'border border-basic-white bg-transparent rounded-lg cursor-not-allowed opacity-50'
            : open
            ? 'border border-basic-green bg-white rounded-lg cursor-pointer'
            : 'border border-basic-white rounded-lg cursor-pointer'
        } ${triggerClassName}`}
        onClick={(e) => {
          e.stopPropagation();
          handleButtonClick();
        }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selected && selected.value && (
            <Avatar
              row={{
                original: {
                  client: {
                    name: selected.label,
                    surname: '',
                    avatarSrc: selected.avatar,
                  },
                },
              }}
              tooltipText={selected.label}
              rounded="lsm"
              size="xs"
              className={`${avatarClassName} flex-shrink-0`}
            />
          )}
          <span
            className={`${
              selected && selected.value ? 'text-black' : 'text-basic-gray'
            } truncate whitespace-nowrap overflow-hidden flex-1 min-w-0 text-sm`}
          >
            {selected && selected.value ? selected.label : placeholder}
          </span>
        </div>
        <span
          className={`material-symbols-outlined ml-2 text-sm text-basic-gray transition-transform flex-shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        >
          expand_all
        </span>
      </div>
      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={getDropdownClasses()}
            style={{
              width: dropdownWidth,
              zIndex: 9999,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={inputRef}
              className="w-full border mb-2 rounded px-2 py-1"
              placeholder="Search by name..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchChange(e.target.value)
              }
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            />
            {filtered.length > 0 ? (
              <>
                {filtered.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100 ${
                      value === option.value ? 'bg-green-50' : ''
                    }`}
                    onClick={() => handleOptionClick(option.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {option.value && (
                      <Avatar
                        row={{
                          original: {
                            client: {
                              name: option.label,
                              surname: '',
                              avatarSrc: option.avatar,
                            },
                          },
                        }}
                        tooltipText={option.label}
                        rounded="lsm"
                        size="xs"
                      />
                    )}
                    <span className="truncate whitespace-nowrap text-sm font-medium text-basic-black overflow-hidden">
                      {option.label}
                    </span>
                    {value === option.value && (
                      <span className="material-symbols-outlined text-green-600 ml-auto">
                        check_small
                      </span>
                    )}
                  </div>
                ))}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-2">
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">
                  person_off
                </span>
                <p className="text-sm">No users found</p>
                {search && (
                  <p className="text-xs mt-1">Try a different search term</p>
                )}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
