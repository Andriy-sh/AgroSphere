'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  getHours,
  getMinutes,
  isBefore,
  startOfDay,
  isAfter,
  setHours,
  setMinutes,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';
import { TimeInput } from '../time-input';
import { createPopper } from '@popperjs/core';
import ReactDOM from 'react-dom';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  autoSave?: boolean;
  triggerClassName?: string;
  showCurrentDateAsDefault?: boolean;
  minDate?: Date;
  popupClassName?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  className,
  disabled = false,
  autoSave = false,
  triggerClassName,
  showCurrentDateAsDefault = true,
  minDate,
  popupClassName,
}) => {
  const isValidDate = (d: unknown): d is Date =>
    d instanceof Date && !isNaN(d.getTime());
  const initialSafeDate = isValidDate(value)
    ? value
    : showCurrentDateAsDefault
    ? new Date()
    : null;

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialSafeDate || new Date()
  );
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(
    isValidDate(value) ? value : showCurrentDateAsDefault ? new Date() : null
  );
  const referenceElRef = useRef<HTMLDivElement | null>(null);
  const popperElRef = useRef<HTMLDivElement | null>(null);
  const popperInstanceRef = useRef<ReturnType<typeof createPopper> | null>(
    null
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [popupWidth, setPopupWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (value === null) {
      setSelectedDateState(null);
      setCurrentMonth(new Date());
      return;
    }
    if (isValidDate(value)) {
      setSelectedDateState(value);
      setCurrentMonth(value);
    } else {
      setSelectedDateState(showCurrentDateAsDefault ? new Date() : null);
      setCurrentMonth(new Date());
    }
  }, [value, showCurrentDateAsDefault]);

  useEffect(() => {
    if (isOpen && referenceElRef.current && popperElRef.current) {
      if (referenceElRef.current) {
        const { width } = referenceElRef.current.getBoundingClientRect();
        setPopupWidth(width);
      }

      const rafId = requestAnimationFrame(() => {
        if (referenceElRef.current && popperElRef.current) {
          if (popperInstanceRef.current) {
            popperInstanceRef.current.destroy();
            popperInstanceRef.current = null;
          }
          popperInstanceRef.current = createPopper(
            referenceElRef.current,
            popperElRef.current,
            {
              placement: 'bottom-start',
              modifiers: [
                { name: 'offset', options: { offset: [0, 8] } },
                {
                  name: 'flip',
                  options: { fallbackPlacements: ['top-start'] },
                },
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                    padding: 8,
                  },
                },
                {
                  name: 'computeStyles',
                  options: {
                    adaptive: true,
                  },
                },
              ],
            }
          );
        }
      });

      return () => {
        cancelAnimationFrame(rafId);
        if (popperInstanceRef.current) {
          popperInstanceRef.current.destroy();
          popperInstanceRef.current = null;
        }
      };
    }

    return () => {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
  const emptyDaysBefore = Array.from({ length: startingDayIndex });

  const totalCells = 6 * 7;
  const remainingCells =
    totalCells - (emptyDaysBefore.length + daysInMonth.length);
  const emptyDaysAfter = Array.from({
    length: remainingCells > 0 ? remainingCells : 0,
  });

  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getMinTimeForToday = (date: Date): Date | null => {
    const today = new Date();
    const isTodaySelected = isSameDay(date, today);

    if (isTodaySelected) {
      return today;
    }

    return null;
  };

  const handleDayClick = (day: Date) => {
    if (minDate && isBefore(startOfDay(day), startOfDay(minDate))) {
      return;
    }

    const baseDate = selectedDateState || new Date();
    let newDate = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      getHours(baseDate),
      getMinutes(baseDate)
    );

    const minTimeForToday = getMinTimeForToday(day);
    if (minTimeForToday && isBefore(newDate, minTimeForToday)) {
      newDate = new Date(minTimeForToday);
    }

    setSelectedDateState(newDate);

    if (autoSave) {
      onChange(newDate);
      setIsOpen(false);
    }
  };

  const handleOK = () => {
    onChange(selectedDateState);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedDateState(value);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node) &&
      popperElRef.current &&
      !popperElRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen && value && minDate) {
      try {
        const currentDate = new Date(value);
        const minDateValue = new Date(minDate);

        if (!isNaN(currentDate.getTime()) && !isNaN(minDateValue.getTime())) {
          if (currentDate < minDateValue) {
            onChange(null);
          }
        }
      } catch {
        return;
      }
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    if (!isOpen || !referenceElRef.current) return;

    const updatePopupWidth = () => {
      if (referenceElRef.current) {
        const { width } = referenceElRef.current.getBoundingClientRect();
        setPopupWidth(width);
      }
      if (popperInstanceRef.current) {
        popperInstanceRef.current.update();
      }
    };

    updatePopupWidth();

    const resizeObserver = new ResizeObserver(() => {
      updatePopupWidth();
    });

    resizeObserver.observe(referenceElRef.current);

    window.addEventListener('resize', updatePopupWidth);
    window.addEventListener('scroll', updatePopupWidth, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePopupWidth);
      window.removeEventListener('scroll', updatePopupWidth, true);
    };
  }, [isOpen]);

  const displayDate = isValidDate(value)
    ? format(value, 'dd/MM/yyyy')
    : showCurrentDateAsDefault
    ? format(new Date(), 'dd/MM/yyyy')
    : '';

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div
        className={cn(
          `flex items-center w-full pl-10 pr-3 pb-[5px] pt-[5px] border rounded-lg min-h-[36px] ${
            disabled
              ? 'opacity-50 cursor-not-allowed bg-gray-50 border-basic-white'
              : isOpen
              ? 'cursor-pointer bg-[#EEF0F629] border-basic-green focus:outline-none'
              : 'cursor-pointer bg-[#EEF0F629] border-basic-white focus:border-basic-green focus:outline-none'
          }`,
          triggerClassName
        )}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        ref={referenceElRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
        <span
          className={`text-sm ${
            disabled
              ? 'text-gray-500'
              : displayDate
              ? 'text-basic-black'
              : 'text-gray-400'
          }`}
        >
          {displayDate || 'Select date'}
        </span>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide lucide-chevrons-up-down ${
              disabled ? 'text-gray-300' : 'text-gray-400'
            }`}
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </div>
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={popperElRef}
            className={`z-[9999] bg-white p-2 sm:p-2 rounded-lg shadow-lg overflow-hidden`}
            style={{
              width: popupWidth ? `${Math.max(popupWidth, 280)}px` : undefined,
              minWidth: '280px',
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <button
                onClick={goToPrevMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {format(currentMonth, 'MMMM, yyyy')}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            <div
              className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2"
              style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div
                  key={index}
                  className="h-6 sm:h-8 flex items-center justify-center text-xs text-gray-500 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            <div
              className="grid grid-cols-7 gap-0.5 sm:gap-1"
              style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
            >
              {emptyDaysBefore.map((_, index) => (
                <div key={`empty-before-${index}`} className="h-6 sm:h-8"></div>
              ))}
              {daysInMonth.map((day, index) => {
                const isDisabled =
                  !isSameMonth(day, currentMonth) ||
                  (minDate && isBefore(startOfDay(day), startOfDay(minDate)));

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                    h-6 w-6 sm:h-8 sm:w-8 mx-auto flex items-center justify-center rounded-full text-xs sm:text-sm
                    ${
                      isSameMonth(day, currentMonth)
                        ? isDisabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : isSameDay(day, selectedDateState || new Date())
                          ? 'bg-basic-green text-white'
                          : isToday(day)
                          ? 'text-basic-green font-semibold'
                          : 'text-gray-900 hover:bg-gray-100'
                        : 'text-gray-400'
                    }
                  `}
                    disabled={isDisabled}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
              {emptyDaysAfter.map((_, index) => (
                <div key={`empty-after-${index}`} className="h-6 sm:h-8"></div>
              ))}
            </div>

            <div className="flex items-between sm:flex-row sm:justify-between sm:items-center border-t border-basic-white pt-3 sm:pt-4 gap-2">
              <span className="text-sm text-basic-black font-normal truncate flex-nowrap">
                Date & time:
              </span>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex items-center flex-1 min-w-0">
                  <CalendarDays className="absolute left-1 sm:left-2 h-3 w-3 sm:h-4 sm:w-4 text-basic-gray" />
                  <input
                    type="text"
                    readOnly
                    value={
                      selectedDateState &&
                      selectedDateState instanceof Date &&
                      !isNaN(selectedDateState.getTime())
                        ? format(selectedDateState, 'dd/MM/yyyy')
                        : showCurrentDateAsDefault
                        ? format(new Date(), 'dd/MM/yyyy')
                        : ''
                    }
                    className="pl-4 sm:pl-6 py-1 border border-gray-300 rounded-md w-28 text-xs sm:text-sm text-center focus:border-basic-green focus:outline-none"
                  />
                </div>
                <TimeInput
                  value={
                    selectedDateState &&
                    selectedDateState instanceof Date &&
                    !isNaN(selectedDateState.getTime())
                      ? selectedDateState
                      : showCurrentDateAsDefault
                      ? new Date()
                      : new Date()
                  }
                  onChange={(newDate) => {
                    setSelectedDateState(newDate);
                    if (autoSave) {
                      onChange(newDate);
                    }
                  }}
                  minTime={
                    selectedDateState
                      ? getMinTimeForToday(selectedDateState)
                      : null
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-1 sm:space-x-2">
              {!autoSave && (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOK}
                    className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-basic-green rounded-md hover:bg-basic-green-dark"
                  >
                    OK
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
