'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CountryRegionData } from 'react-country-region-selector';
import { cn } from '../../utils/cn';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { getRegionLabel } from '../../utils/region-utils';

export interface RegionSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  country?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  warning?: string;
  required?: boolean;
  triggerClassName?: string;
}

export const RegionSelect: React.FC<RegionSelectProps> = ({
  value = '',
  onChange,
  country = '',
  placeholder,
  className = '',
  disabled = false,
  error,
  warning,
  triggerClassName,
}) => {
  const defaultPlaceholder =
    placeholder || `Select ${getRegionLabel(country).toLowerCase()}`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const getRegionsForCountry = (countryName: string) => {
    if (!countryName) return [];

    const countryData = CountryRegionData.default.find(
      ([name]) => name === countryName
    );
    if (!countryData) return [];

    const regionsString = countryData[2];
    if (!regionsString) return [];

    return regionsString.split('|').map((region) => {
      const [name, code] = region.split('~');
      return {
        value: name,
        label: name,
      };
    });
  };

  const regions = getRegionsForCountry(country);
  const selectedRegion = regions.find((region) => region.value === value);
  const filteredRegions = regions.filter((region) =>
    region.label.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelect = (regionValue: string) => {
    onChange?.(regionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getBorderColor = () => {
    if (isOpen) return 'border-basic-green';
    if (error) return 'border-basic-red';
    if (warning) return 'border-basic-yellow';
    return 'border-basic-white';
  };

  const getFocusBorderColor = () => {
    if (error) return 'focus:border-basic-red focus:ring-basic-red';
    if (warning) return 'focus:border-basic-yellow focus:ring-basic-yellow';
    return 'focus:border-basic-green focus:ring-basic-green ';
  };

  const isDisabled = disabled || !country;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        variant="outline"
        className={cn(
          'w-full px-3 py-2 justify-between transition-colors rounded-lg',
          triggerClassName,
          getBorderColor(),
          getFocusBorderColor(),
          'bg-white text-left',
          !isDisabled && ''
        )}
      >
        <span
          className={selectedRegion ? 'text-basic-black' : 'text-basic-gray'}
        >
          {selectedRegion ? selectedRegion.label : defaultPlaceholder}
        </span>
        <span className="material-symbols-outlined text-basic-white text-sm">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-basic-white rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-basic-white">
            <Input
              type="text"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full px-3 py-2 border border-basic-white rounded-md"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredRegions.length > 0 ? (
              filteredRegions.map((region) => (
                <Button
                  key={region.value}
                  type="button"
                  onClick={() => handleSelect(region.value)}
                  variant="ghost"
                  className={cn(
                    'w-full px-3 py-2 text-left justify-start',
                    region.value === value && 'bg-green-50 text-green-700'
                  )}
                >
                  <span>{region.label}</span>
                </Button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                {!country
                  ? 'Please select a country first'
                  : 'No regions found'}
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
