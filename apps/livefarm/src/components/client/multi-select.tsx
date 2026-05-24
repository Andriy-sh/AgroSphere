'use client';
import { Input } from '@@agrosphere/shared';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  values,
  onChange,
  placeholder = 'Select tags',
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = options.filter(
    (option) =>
      option.value === '' ||
      option.label.toLowerCase().includes(search.toLowerCase())
  );

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  const handleOptionClick = (optionValue: string) => {
    const checked = values.includes(optionValue);
    if (checked) {
      onChange(values.filter((value) => value !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const handleClearTags = () => {
    onChange([]);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative`} ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        className={`${className} w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-between transition-all ${
          open ? 'border-basic-green' : 'hover:border-basic-green'
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex flex-wrap gap-1 text-left">
          {values.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            options
              .filter((option) => values.includes(option.value))
              .map((option) => (
                <span
                  key={option.value}
                  className="bg-gray-100 rounded px-2 py-1 text-xs font-medium text-gray-700"
                >
                  {option.label}
                </span>
              ))
          )}
        </div>
        <span className="material-symbols-outlined ml-2">unfold_more</span>
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="bg-white border-2 border-basic-white rounded-xl shadow-xl max-h-60 overflow-y-auto p-2 min-w-[220px]"
            style={dropdownStyle}
            onMouseDown={(e) => e.stopPropagation()}
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
            />
            {filtered.map((option) => {
              if (!option.value) return null;
              const checked = values.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${
                    checked ? 'bg-green-50' : ''
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <input type="checkbox" checked={checked} readOnly />
                  <span>{option.label}</span>
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
          </div>,
          document.body
        )}
    </div>
  );
}
