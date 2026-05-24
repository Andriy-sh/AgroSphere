'use client';
import React, { useRef, useEffect } from 'react';
import { PhoneInput as InternationalPhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { cn } from '../../utils/cn';

export interface PhoneInputProps {
  value: string;
  onChange: (formattedValue: string) => void; 
  onBlur?: () => void;
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  warning?: string;
  required?: boolean;
  preferredCountries?: string[];
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  defaultCountry = 'ie',
  placeholder = 'Enter phone number',
  className = '',
  disabled = false,
  error,
  warning,
  required = false,
  preferredCountries = ['ie', 'gb', 'us'],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current.querySelector(
        '.react-international-phone-input-container'
      ) as HTMLElement;

      if (container) {
        container.className = cn(
          container.className,
          'w-full border border-basic-white box-border rounded-md focus-within:border-basic-green focus:outline-none transition-colors',
          error && 'border-basic-red focus-within:border-basic-red',
          warning && 'border-basic-yellow focus-within:border-basic-yellow'
        );
      }

      const countrySelector = containerRef.current.querySelector(
        '.react-international-phone-country-selector'
      ) as HTMLElement;
      const input = containerRef.current.querySelector(
        '.react-international-phone-input'
      ) as HTMLElement;

      if (countrySelector) {
        countrySelector.style.border = 'none';
        countrySelector.style.borderRadius = '4px 0 0 4px';
      }

      if (input) {
        input.style.border = 'none';
        input.style.borderRadius = '0 4px 4px 0';
        input.style.outline = 'none';
      }
    }
  }, [error, warning]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <InternationalPhoneInput
        defaultCountry={defaultCountry}
        value={value}
        onChange={(_, meta) => {
          const formatted = meta?.inputValue || value;
          onChange(formatted); 
        }}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        preferredCountries={preferredCountries}
        inputStyle={{
          width: '100%',
          padding: '7px 12px',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          fontSize: '14px',
          outline: 'none',
        }}
        countrySelectorStyleProps={{
          buttonStyle: {
            border: 'none',
            borderRadius: '4px 0 0 4px',
            backgroundColor: '#ffffff',
            padding: '7px 12px',
          },
          dropdownStyleProps: {
            style: {
              overflowY: 'auto',
            },
          },
        }}
        inputProps={{
          className: cn(disabled && 'opacity-50 cursor-not-allowed'),
          onBlur,
        }}
      />

      {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pb-6 pr-3 pointer-events-none z-10">
          <span className="material-symbols-outlined text-basic-red text-sm">
            error
          </span>
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

export default PhoneInput;
