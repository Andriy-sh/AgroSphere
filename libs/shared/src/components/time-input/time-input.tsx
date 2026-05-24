'use client';
import React, { useState, useEffect } from 'react';
import {
  format,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  isBefore,
  isAfter,
} from 'date-fns';
import { Clock } from 'lucide-react';
import { cn } from '../../utils';

interface TimeInputProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  autoSave?: boolean;
  minTime?: Date | null;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  className,
  disabled = false,
  placeholder = 'HH:mm',
  autoSave = false,
  minTime,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateMinTime = (newDate: Date): Date => {
    if (minTime && isBefore(newDate, minTime)) {
      return new Date(minTime);
    }
    return newDate;
  };

  useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      setInputValue(format(value, 'HH:mm'));
      setIsValid(true);
    }
  }, [value]);

  const validateTimeString = (
    timeString: string
  ): { isValid: boolean; hours?: number; minutes?: number } => {
    if (timeString === '') {
      return { isValid: true };
    }

    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    const match = timeString.match(timeRegex);

    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return { isValid: true, hours, minutes };
    }

    const numericRegex = /^([0-9]{1,4})$/;
    const numericMatch = timeString.match(numericRegex);

    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      const hours = Math.floor(num / 100);
      const minutes = num % 100;

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return { isValid: true, hours, minutes };
      }
    }

    const partialRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5]?[0-9]?)$/;
    const partialMatch = timeString.match(partialRegex);

    if (partialMatch) {
      const hours = parseInt(partialMatch[1], 10);
      const minutes = partialMatch[2] ? parseInt(partialMatch[2], 10) : 0;

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return { isValid: true, hours, minutes };
      }
    }

    return { isValid: false };
  };

  const formatTimeString = (timeString: string): string => {
    const validation = validateTimeString(timeString);

    if (!validation.isValid) {
      return timeString;
    }

    if (validation.hours !== undefined && validation.minutes !== undefined) {
      return `${validation.hours
        .toString()
        .padStart(2, '0')}:${validation.minutes.toString().padStart(2, '0')}`;
    }

    return timeString;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    let digitsOnly = raw.replace(/\D/g, '').slice(0, 4);

    if (digitsOnly.length >= 1) {
      const h1 = parseInt(digitsOnly[0], 10);
      if (!isNaN(h1) && h1 > 2) {
        digitsOnly = '2' + digitsOnly.slice(1);
      }
    }
    if (digitsOnly.length >= 2) {
      const h1 = parseInt(digitsOnly[0], 10);
      const h2 = parseInt(digitsOnly[1], 10);
      if (!isNaN(h1) && !isNaN(h2)) {
        if (h1 === 2 && h2 > 3) {
          digitsOnly = `${digitsOnly[0]}3` + digitsOnly.slice(2);
        }
      }
    }

    if (digitsOnly.length >= 3) {
      const m1 = parseInt(digitsOnly[2], 10);
      if (!isNaN(m1) && m1 > 5) {
        digitsOnly = digitsOnly.slice(0, 2) + '5' + digitsOnly.slice(3);
      }
    }

    const hoursPart = digitsOnly.slice(0, 2);
    const minutesPart = digitsOnly.slice(2, 4);

    let nextDisplay = '';
    if (hoursPart.length < 2) {
      nextDisplay = hoursPart;
    } else if (hoursPart.length === 2 && minutesPart.length === 0) {
      nextDisplay = `${hoursPart}:`;
    } else {
      nextDisplay = `${hoursPart}:${minutesPart}`;
    }

    setInputValue(nextDisplay);

    if (hoursPart.length === 2 && minutesPart.length === 2) {
      const hours = parseInt(hoursPart, 10);
      const minutes = parseInt(minutesPart, 10);
      const ok = hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      setIsValid(ok);

      if (ok) {
        const newDate = setMinutes(setHours(value, hours), minutes);
        const validatedDate = validateMinTime(newDate);
        if (autoSave) {
          onChange(validatedDate);
        }
      }
      return;
    }

    setIsValid(true);
  };

  const handleBlur = () => {
    const digitsOnly = inputValue.replace(/\D/g, '').slice(0, 4);
    const hoursPart = digitsOnly.slice(0, 2);
    const minutesPart = digitsOnly.slice(2, 4);

    if (hoursPart.length === 2 && minutesPart.length === 2) {
      const hours = parseInt(hoursPart, 10);
      const minutes = parseInt(minutesPart, 10);
      const ok = hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;

      if (ok) {
        const newDate = setMinutes(setHours(value, hours), minutes);
        const validatedDate = validateMinTime(newDate);
        setInputValue(format(validatedDate, 'HH:mm'));
        setIsValid(true);
        onChange(validatedDate);
        return;
      }
    }

    setInputValue(format(value, 'HH:mm'));
    setIsValid(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    let newDate = value;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cursorPosition <= 2) {
        const currentHours = getHours(value);
        const newHours = currentHours === 23 ? 0 : currentHours + 1;
        newDate = setHours(value, newHours);
      } else {
        const currentMinutes = getMinutes(value);
        const newMinutes = currentMinutes === 59 ? 0 : currentMinutes + 1;
        newDate = setMinutes(value, newMinutes);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursorPosition <= 2) {
        const currentHours = getHours(value);
        const newHours = currentHours === 0 ? 23 : currentHours - 1;
        newDate = setHours(value, newHours);
      } else {
        const currentMinutes = getMinutes(value);
        const newMinutes = currentMinutes === 0 ? 59 : currentMinutes - 1;
        newDate = setMinutes(value, newMinutes);
      }
    }

    if (newDate !== value) {
      const validatedDate = validateMinTime(newDate);
      onChange(validatedDate);
      setInputValue(format(validatedDate, 'HH:mm'));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="relative flex items-center justify-center">
      <Clock className="absolute left-1 sm:left-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={cn(
          'pl-4 sm:pl-7 pr-2 py-1 border rounded-md w-24 sm:w-28 text-xs sm:text-sm text-center focus:outline-none',
          {
            'border-gray-300 focus:border-basic-green': isValid && !disabled,
            'border-red-300 focus:border-red-500': !isValid && !disabled,
            'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed':
              disabled,
          },
          className
        )}
        maxLength={5}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
