'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPopper, Instance, Placement } from '@popperjs/core';
import { Button } from '../button/button';
import { Input } from '../input/input';

export interface CreatableMultiSelectOption {
  value: string;
  label: string;
}

export interface CreatableMultiSelectProps {
  options: CreatableMultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  onCreateOption?: (value: string) => void;
  placeholder?: string;
  className?: string;
  placement?: Placement;
}

export function CreatableMultiSelect({
  options,
  values,
  onChange,
  onCreateOption,
  placeholder = 'Select an option or create one',
  className = '',
  placement = 'bottom-start',
}: CreatableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popperInstanceRef = useRef<Instance | null>(null);

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
  }, [open, inputValue]);

  const handleOptionClick = (optionValue: string) => {
    const checked = values.includes(optionValue);
    if (checked) {
      onChange(values.filter((t) => t !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const handleCreateOption = () => {
    if (inputValue.trim() && onCreateOption) {
      onCreateOption(inputValue.trim());
      setInputValue('');
    }
  };

  const handleClearTags = () => {
    onChange([]);
    setOpen(false);
    setInputValue('');
  };

  const handleRemoveTag = (tagValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== tagValue));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleCreateOption();
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`w-full border border-basic-white rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none flex items-center justify-between transition-all ${
          open ? 'border-basic-green' : 'hover:border-basic-green'
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex flex-wrap gap-1 text-left">
          {values.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            options
              .filter((o) => values.includes(o.value))
              .map((o) => (
                <span
                  key={o.value}
                  className="bg-basic-white rounded px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1 group"
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
              ))
          )}
        </div>
        <span className="material-symbols-outlined ml-2">unfold_more</span>
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className="bg-white border border-basic-white rounded-xl shadow-xl max-h-60 overflow-y-auto p-2 min-w-[220px] z-50"
          onMouseDown={(e) => e.stopPropagation()}
          role="listbox"
        >
          <div className="text-sm text-gray-500 mb-2 px-2">{placeholder}</div>

          <Input
            ref={inputRef}
            className="mb-2 w-full"
            placeholder="Type to create new tag..."
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={handleInputKeyDown}
            onMouseDown={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          />

          <div className="flex flex-wrap gap-1">
            {options.map((option) => {
              if (!option.value) return null;
              const checked = values.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`inline-flex items-center text-xs font-normal bg-basic-white px-2.5 py-1.5 rounded cursor-pointer hover:bg-gray-100 ${
                    checked ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <span className="truncate ">{option.label}</span>
                </div>
              );
            })}
          </div>

          <Button
            variant={'tag'}
            size={'sm'}
            className="h-6"
            onClick={handleClearTags}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
