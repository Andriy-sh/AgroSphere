'use client';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Input } from '../input/input';
import { Button } from '../button/button';
import countryList from 'react-select-country-list';

export interface CountrySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  warning?: string;
  required?: boolean;
  triggerClassName?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value = '',
  onChange,
  placeholder = 'Select country',
  className = '',
  disabled = false,
  error,
  warning,
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countriesData] = useState(() => countryList());
  const countries = countriesData.data;
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((country) => country.label === value);

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (countryValue: string, countryLabel: string) => {
    onChange?.(countryLabel);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getBorderColor = () => {
    if (isOpen) return '!border-basic-green';
    if (error) return '!border-basic-red';
    if (warning) return '!border-basic-yellow';
    return 'border-basic-white';
  };

  const getFocusBorderColor = () => {
    if (error) return 'focus:border-basic-red ';
    if (warning) return 'focus:border-basic-yellow ';
    return 'focus:border-basic-green ';
  };

  return (
    <div ref={containerRef} className={cn('relative')}>
      <Button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        variant="outline"
        className={cn(
          'w-full px-3 py-2 justify-between transition-colors rounded-lg',
          getBorderColor(),
          getFocusBorderColor(),
          'bg-white text-left',
          !disabled && '',
          triggerClassName,
          className
        )}
      >
        <span
          className={
            selectedCountry
              ? 'text-basic-black font-medium text-sm'
              : 'text-basic-gray font-normal text-sm placeholder:text-basic-gray placeholder:text-sm placeholder:font-normal'
          }
        >
          {selectedCountry ? selectedCountry.label : placeholder}
        </span>
        <span className="material-symbols-outlined text-basic-gray text-lg">
          expand_all
        </span>
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-basic-white rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-basic-white">
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full px-3 py-2 border border-basic-white rounded-lg "
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <Button
                  key={country.value}
                  type="button"
                  onClick={() => handleSelect(country.value, country.label)}
                  variant="ghost"
                  className={cn(
                    'w-full px-3 py-2 text-left justify-start',
                    country.label === value && 'bg-green-50 text-green-700'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{country.label}</span>
                  </div>
                </Button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}

      {(error || warning) && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-red-600' : 'text-yellow-600'
          )}
        >
          {error || warning}
        </p>
      )}
    </div>
  );
};
