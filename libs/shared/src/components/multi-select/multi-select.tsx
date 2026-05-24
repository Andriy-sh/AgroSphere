'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPopper, Instance, Placement } from '@popperjs/core';
import Checkbox from '../checkbox/checkbox';
import { TagItem } from '../tag-item/tag-item';
import { Input } from '../input/input';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  placement?: Placement;
}

export function MultiSelect({
  options,
  values,
  onChange,
  placeholder = 'Select tags',
  className = '',
  placement = 'bottom-start',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const popperInstanceRef = useRef<Instance | null>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tagsContainerRef.current || values.length === 0) {
      setVisibleTags(values);
      return;
    }

    const container = tagsContainerRef.current;
    const containerWidth = container.offsetWidth;
    const selectedOptions = options.filter((o) => values.includes(o.value));

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.whiteSpace = 'nowrap';
    tempContainer.className = 'flex gap-1';
    document.body.appendChild(tempContainer);

    let currentWidth = 0;
    const visible: string[] = [];
    const reservedSpace = 80;

    for (let i = 0; i < selectedOptions.length; i++) {
      const tempTag = document.createElement('span');
      tempTag.className =
        'bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-basic-black flex items-center gap-1 flex-shrink-0';
      tempTag.textContent = selectedOptions[i].label;
      tempContainer.appendChild(tempTag);

      const tagWidth = tempTag.offsetWidth;

      const wouldFit =
        currentWidth +
          tagWidth +
          (i < selectedOptions.length - 1 ? reservedSpace : 0) <=
        containerWidth - 40;

      if (wouldFit) {
        visible.push(selectedOptions[i].value);
        currentWidth += tagWidth + 4;
      } else {
        break;
      }
    }

    document.body.removeChild(tempContainer);
    setVisibleTags(visible);
  }, [values, options]);

  useEffect(() => {
    if (open && triggerRef.current && dropdownRef.current) {
      popperInstanceRef.current = createPopper(
        triggerRef.current,
        dropdownRef.current,
        {
          placement,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                padding: 8,
              },
            },
          ],
        }
      );
    }

    return () => {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
    };
  }, [open, placement]);

  useEffect(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.update();
    }
  }, [open, search]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const filtered = options.filter(
    (o) =>
      o.value === '' || o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptionClick = (optionValue: string) => {
    const checked = values.includes(optionValue);
    if (checked) {
      onChange(values.filter((t) => t !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const handleClearTags = () => {
    onChange([]);
    setOpen(false);
    setSearch('');
  };

  const handleRemoveTag = (tagValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== tagValue));
  };

  const handleToggleDropdown = () => {
    setOpen((prev) => !prev);
    if (!open) {
      setSearch('');
    }
  };

  const selectedOptions = options.filter((o) => values.includes(o.value));
  const visibleOptions = selectedOptions.filter((o) =>
    visibleTags.includes(o.value)
  );
  const hiddenCount = values.length - visibleTags.length;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`w-full px-3 py-[3px] text-basic-black flex items-center justify-between transition-all border rounded-lg bg-white focus:outline-none  ${
          open ? 'border-basic-green' : ''
        }`}
        onClick={handleToggleDropdown}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div
          ref={tagsContainerRef}
          className="flex flex-wrap gap-1 text-left flex-1 min-w-0"
        >
          {values.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <>
              {visibleOptions.map((o) => (
                <span
                  key={o.value}
                  className="bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-basic-black flex items-center gap-1 group flex-shrink-0"
                >
                  {o.label}
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) => handleRemoveTag(o.value, e)}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="bg-basic-white flex justify-center items-center text-basic-green rounded px-2 py-0.5 text-xs font-medium flex-shrink-0">
                  +{hiddenCount} more
                </span>
              )}
            </>
          )}
        </div>
        <span className="material-symbols-outlined ml-2 text-basic-gray text-lg flex-shrink-0">
          expand_all
        </span>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="bg-white border-2 rounded-xl shadow-xl max-h-60 overflow-y-auto p-2 w-full z-50"
          onMouseDown={(e) => e.stopPropagation()}
          role="listbox"
        >
          <Input
            className="w-full border mb-2 rounded px-2 py-1"
            placeholder="Search tags..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            onMouseDown={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
            autoFocus
          />
          {filtered.map((option) => {
            if (!option.value) return null;
            const checked = values.includes(option.value);
            return (
              <div
                key={option.value}
                className={`flex items-center text-sm font-normal px-2 py-1.5 gap-1.5 rounded cursor-pointer hover:bg-gray-50 ${
                  checked ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleOptionClick(option.value)}
                onMouseDown={(e) => e.stopPropagation()}
                role="option"
                aria-selected={checked}
              >
                <Checkbox checked={checked} readOnly />
                <TagItem className="text-basic-black bg-basic-white p-[1.5px] text-xs px-1 rounded-[4px] ">
                  {option.label}
                </TagItem>
              </div>
            );
          })}
          <button
            className="mt-2 w-full bg-gray-100 hover:bg-gray-200 rounded p-1 text-sm"
            onClick={handleClearTags}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Clear tags
          </button>
        </div>
      )}
    </div>
  );
}
