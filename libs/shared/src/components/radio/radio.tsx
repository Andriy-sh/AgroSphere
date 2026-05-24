import React from 'react';
import { cn } from '../../utils/cn';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioProps {
  name: string;
  options?: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  layout?: 'single-column' | 'two-columns';
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  options = [],
  value,
  onChange,
  label,
  error,
  className = '',
  layout = 'single-column',
  disabled = false,
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="text-sm font-medium text-basic-black mb-3">{label}</div>
      )}

      <div
        className={cn(
          'flex gap-3',
          layout === 'two-columns' ? 'flex-wrap' : 'flex-col'
        )}
      >
        {options?.map((option) => {
          const isChecked = value === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                'flex flex-row items-center gap-2 cursor-pointer transition-colors',
                layout === 'two-columns' ? 'w-[calc(50%-12px)]' : '',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="sr-only"
              />
              <span
                className={cn(
                  'w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200',
                  isChecked
                    ? 'border-basic-green bg-white'
                    : 'border-basic-gray-light bg-white hover:border-basic-green',
                  disabled && 'hover:border-basic-gray-light'
                )}
              >
                {isChecked && (
                  <span className="w-3 h-3 rounded-full bg-basic-green" />
                )}
              </span>
              <span className="text-sm text-basic-black font-normal">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      {error && <div className="text-basic-red text-xs mt-1">{error}</div>}
    </div>
  );
};

export default Radio;
