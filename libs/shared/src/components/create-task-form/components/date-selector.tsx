import React, { useMemo, useEffect, useRef } from 'react';
import { DateTimePicker } from '../../date-time-picker/date-time-picker';
import { cn } from '../../../utils';
import { format as formatDate } from 'date-fns';

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  className?: string;
  showCurrentDateAsDefault?: boolean;
  minDate?: Date;
  popupClassName?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  triggerClassName,
  className,
  showCurrentDateAsDefault = true,
  minDate,
  popupClassName,
}) => {
  const hasSetDefault = useRef(false);

  useEffect(() => {
    if (showCurrentDateAsDefault && !value && !disabled && !hasSetDefault.current) {
      const currentDate = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
      onChange(currentDate);
      hasSetDefault.current = true;
    }
    if (!value) {
      hasSetDefault.current = false;
    }
  }, [showCurrentDateAsDefault, value, disabled, onChange]);
  const handleDateChange = (date: Date | null) => {
    if (disabled) return;

    if (date) {
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();

      if (isToday && date < today) {
        const currentTime = new Date();
        const formattedDateTime = formatDate(
          currentTime,
          "yyyy-MM-dd'T'HH:mm:ssXXX"
        );
        onChange(formattedDateTime);
      } else {
        const formattedDateTime = formatDate(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
        onChange(formattedDateTime);
      }
    } else {
      onChange('');
    }
  };

  const dateValue = useMemo(() => {
    if (!value) return null;

    try {
      let date: Date;

      if (value.includes('-') && value.split('-')[0].length === 4) {
        date = new Date(value);
      } else if (value.includes('-') && value.split('-').length === 3) {
        const parts = value.split('-');
        if (parts[2].length <= 4 && !parts[2].includes('T')) {
          const [day, month, year] = parts;
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          date = new Date(value);
        }
      } else if (value.includes('/')) {
        const [day, month, year] = value.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(value);
      }

      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }, [value]);

  return (
    <div className={`relative ${className || ''}`}>
      <span
        className={cn(
          `material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl z-10 ${
            disabled ? 'text-gray-300' : 'text-basic-gray'
          }`
        )}
      >
        edit_calendar
      </span>
      <DateTimePicker
        value={dateValue}
        onChange={handleDateChange}
        disabled={disabled}
        autoSave={true}
        className="w-full"
        triggerClassName={cn(
          triggerClassName,
          'focus:border-basic-green focus:outline-none'
        )}
        showCurrentDateAsDefault={showCurrentDateAsDefault}
        minDate={minDate}
        popupClassName={popupClassName}
      />
    </div>
  );
};
