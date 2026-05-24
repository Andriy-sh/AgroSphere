'use client';

import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import { useState, useRef, useEffect } from 'react';
import { Input } from '../input/input';
import { Button } from '../button/button';

interface TimezoneSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const labelStyle = 'original';
const timezones = allTimezones;

export function TimezoneSelect({
  value,
  onChange,
  placeholder = 'Select timezone',
  className = '',
}: TimezoneSelectProps) {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getFormattedText = (option: any) => {
    const name = option.label.replace(/^\(GMT[+-]\d{1,2}:\d{2}\)\s*/, '');
    const sign = option.offset >= 0 ? '+' : '-';
    const hours = Math.abs(option.offset);
    const gmt = `GMT${sign}${hours}:00`;

    return `${name} (${gmt})`;
  };

  const formatLabel = (option: any) => {
    const name = option.label.replace(/^\(GMT[+-]\d{1,2}:\d{2}\)\s*/, '');
    const sign = option.offset >= 0 ? '+' : '-';
    const hours = Math.abs(option.offset);
    const gmt = `GMT${sign}${hours}:00`;

    return (
      <span className="flex items-center gap-1 min-w-0 font-normal">
        <span className="truncate flex-grow min-w-0 x">{name}</span>
        <span className="flex-shrink-0">({gmt})</span>
      </span>
    );
  };

  const getCountryName = (option: any) => {
    return option.label.replace(/^\(GMT[+-]\d{1,2}:\d{2}\)\s*/, '');
  };

  const getCurrentTimezone = () => {
    try {
      const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const currentOption = options.find(
        (option) => option.value === currentTz
      );
      return currentOption || null;
    } catch {
      return null;
    }
  };

  const currentTimezone = getCurrentTimezone();
  const selectedOption = value
    ? options.find((option) => option.value === value)
    : null;

  const filteredAllOptions = searchTerm
    ? options.filter((option) =>
        getFormattedText(option)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const aggregatedOptions = (() => {
    const map = new Map<string, any>();
    for (const option of options) {
      const country = getCountryName(option);
      if (!map.has(country)) {
        map.set(country, option);
      }
    }
    return Array.from(map.values());
  })();

  const displayOptions = searchTerm ? filteredAllOptions : aggregatedOptions;

  const otherOptions = displayOptions.filter(
    (option) => !selectedOption || option.value !== selectedOption.value
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: any) => {
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={`
    w-full h-9 px-3 py-2 text-sm text-basic-black bg-white 
    border rounded-md
    ${isOpen ? 'border-basic-green' : 'border-basic-white'}
    focus:border-basic-green active:border-basic-green
    flex items-center justify-between gap-2 cursor-pointer 
    transition-colors duration-200
  `}
      >
        <div className="flex items-center gap-2 flex-grow min-w-0">
          {selectedOption ? (
            formatLabel(selectedOption)
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </div>

        <span className="material-symbols-outlined text-basic-gray transition-transform duration-200 text-lg flex-shrink-0">
          expand_all
        </span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-basic-white rounded-md shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-3 border-b border-basic-white">
            <Input className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-basic-gray text-lg z-10">
                search
              </span>
              <Input.Content
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 text-sm"
                autoFocus
              />
            </Input>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {selectedOption && (
              <div className="p-3 border-b border-basic-white">
                <div className="text-xs font-medium text-basic-gray mb-2">
                  Current timezone
                </div>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between py-2 !p-0 rounded-md hover:bg-gray-50 cursor-pointer text-basic-green"
                  onClick={() => handleSelect(selectedOption)}
                >
                  <div className="flex items-center gap-2 flex-grow min-w-0">
                    {formatLabel(selectedOption)}
                  </div>
                  <span className="material-symbols-outlined text-basic-green text-lg flex-shrink-0">
                    check
                  </span>
                </Button>
              </div>
            )}

            <div className="p-3">
              <div className="text-xs font-medium text-basic-gray mb-2">
                Select a timezone
              </div>
              <div className="space-y-1">
                {otherOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    className="w-full flex items-center justify-between  py-2 !p-0 rounded-md hover:bg-gray-50 cursor-pointer text-basic-black"
                    onClick={() => handleSelect(option)}
                  >
                    <div className="flex items-center gap-2 flex-grow min-w-0">
                      {formatLabel(option)}
                    </div>
                    {selectedOption &&
                      selectedOption.value === option.value && (
                        <span className="material-symbols-outlined text-basic-green text-lg flex-shrink-0">
                          check
                        </span>
                      )}
                  </Button>
                ))}
                {otherOptions.length === 0 && (
                  <div className="text-sm text-basic-gray p-2">
                    No timezones found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
