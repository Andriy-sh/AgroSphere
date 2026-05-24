'use client';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  popupClassName?: string;
  itemClassName?: string;
  forceOpenDown?: boolean;
  renderTrigger?: (props: {
    selectedOption?: SelectOption;
    isOpen: boolean;
    onClick: () => void;
    disabled: boolean;
  }) => React.ReactNode;
  renderPopup?: (props: {
    options: SelectOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    close: () => void;
  }) => React.ReactNode;
  renderItem?: (option: SelectOption, selected: boolean) => React.ReactNode;
}

export const CustomSelect = ({
  options,
  value,
  defaultValue,
  placeholder,
  onValueChange,
  disabled = false,
  className,
  triggerClassName,
  popupClassName,
  itemClassName,
  forceOpenDown = false,
  renderTrigger,
  renderPopup,
  renderItem,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [isInTable, setIsInTable] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const initialValue = value ?? defaultValue ?? options[0]?.value ?? '';
  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  useEffect(() => {
    const calculateWidth = () => {
      if (!ref.current) return;

      const triggerWidth = ref.current.offsetWidth;

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'nowrap';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.fontWeight = '400';
      tempDiv.style.fontFamily = 'inherit';
      tempDiv.style.padding = '8px 12px';
      document.body.appendChild(tempDiv);

      let maxContentWidth = 0;

      options.forEach((option) => {
        tempDiv.textContent = option.label;
        maxContentWidth = Math.max(maxContentWidth, tempDiv.offsetWidth);
      });

      document.body.removeChild(tempDiv);

      const requiredWidth = maxContentWidth + 60;

      setDropdownWidth(Math.max(triggerWidth, requiredWidth));
    };

    calculateWidth();
  }, [options]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const calculateWidth = () => {
      if (!ref.current) return;

      const triggerWidth = ref.current.offsetWidth;

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'nowrap';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.fontWeight = '400';
      tempDiv.style.fontFamily = 'inherit';
      tempDiv.style.padding = '8px 12px';
      document.body.appendChild(tempDiv);

      let maxContentWidth = 0;

      options.forEach((option) => {
        tempDiv.textContent = option.label;
        maxContentWidth = Math.max(maxContentWidth, tempDiv.offsetWidth);
      });

      document.body.removeChild(tempDiv);

      const requiredWidth = maxContentWidth + 60;

      setDropdownWidth(Math.max(triggerWidth, requiredWidth));
    };

    const recalculatePosition = () => {
      if (!ref.current) return;

      if (forceOpenDown) {
        setShowAbove(false);
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = Math.min(options.length * 40 + 20, 240);

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const shouldShowAbove =
        spaceBelow < dropdownHeight + 20 ||
        (spaceBelow < spaceAbove && spaceAbove > dropdownHeight);

      setShowAbove(shouldShowAbove);
    };

    calculateWidth();
    recalculatePosition();

    const handleResize = () => {
      recalculatePosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', recalculatePosition);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', recalculatePosition);
    };
  }, [open, options, forceOpenDown]);

  const selectedOption = options.find(
    (option) => option.value === internalValue
  );

  const handleSelect = (optionValue: string | undefined) => {
    setInternalValue(optionValue ?? '');
    onValueChange?.(optionValue ?? '');
    setOpen(false);
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      const trigger = ref.current;
      if (trigger) {
        const tableElement = trigger.closest('table');
        const scrollableContainer = trigger.closest('[class*="overflow"]');
        const isInComplexLayout = !!tableElement || !!scrollableContainer;
        setIsInTable(isInComplexLayout);

        if (forceOpenDown) {
          setShowAbove(false);
        } else {
          const rect = trigger.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const dropdownHeight = Math.min(options.length * 40 + 20, 240);

          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;

          const shouldShowAbove =
            spaceBelow < dropdownHeight + 20 ||
            (spaceBelow < spaceAbove && spaceAbove > dropdownHeight);

          setShowAbove(shouldShowAbove);
        }
      }
      setOpen(!open);
    }
  };

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      {renderTrigger ? (
        renderTrigger({
          selectedOption,
          isOpen: open,
          onClick: handleTriggerClick,
          disabled,
        })
      ) : (
        <button
          type="button"
          onClick={handleTriggerClick}
          disabled={disabled}
          className={`
          ${triggerClassName || ''}
            flex items-center justify-between gap-2 h-10 px-3 py-2 rounded-md
          ${
            disabled
              ? 'border border-basic-white bg-transparent opacity-50'
              : open
              ? 'border border-basic-green bg-white'
              : 'border border-basic-white bg-white'
          }
           text-left
           cursor-pointer
           focus:border-basic-green 
          disabled:opacity-50 disabled:cursor-not-allowed ${
            disabled ? 'bg-transparent' : 'disabled:bg-gray-50'
          }
          transition-colors duration-200
          
        `}
        >
          <span
            className={` ${
              !selectedOption || internalValue === ''
                ? 'text-gray-400 font-normal text-sm'
                : 'text-basic-black font-medium text-sm'
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
          <span className="material-symbols-outlined text-basic-gray transition-transform duration-200 text-lg">
            expand_all
          </span>
        </button>
      )}

      {open && (
        <div
          className={isInTable ? 'fixed' : 'absolute'}
          style={{
            width: dropdownWidth,
            zIndex: isInTable ? 9999 : 50,
            isolation: 'isolate',
            willChange: 'transform',
            ...(isInTable && {
              top:
                showAbove && ref.current
                  ? `${ref.current.getBoundingClientRect().top - 4}px`
                  : ref.current
                  ? `${ref.current.getBoundingClientRect().bottom + 4}px`
                  : '0px',
              left: ref.current
                ? `${ref.current.getBoundingClientRect().left}px`
                : '0px',
              isolation: 'isolate',
              transform: showAbove ? 'translateY(-100%)' : 'translateZ(0)',
              willChange: 'transform',
            }),
            ...(!isInTable && {
              left: 0,
              top: showAbove ? 'auto' : '100%',
              bottom: showAbove ? '100%' : 'auto',
              marginTop: showAbove ? '0px' : '4px',
              marginBottom: showAbove ? '4px' : '0px',
            }),
          }}
        >
          {renderPopup ? (
            <div className={popupClassName}>
              {renderPopup({
                options,
                value: internalValue,
                onValueChange: handleSelect,
                close: () => setOpen(false),
              })}
            </div>
          ) : (
            <div
              className={`
              bg-white rounded-md shadow-lg border border-basic-white
              max-h-60 overflow-y-auto py-1
              ${popupClassName || ''}
            `}
            >
              {options.map((option) => {
                const isSelected = internalValue === option.value;
                const isDisabled = option.disabled;

                return renderItem ? (
                  <div key={option.value} className={itemClassName}>
                    {renderItem(option, isSelected)}
                  </div>
                ) : (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(option.value)}
                    disabled={isDisabled}
                    className={`
                      ${itemClassName || ''}
                      w-full flex items-center justify-between px-3 py-2 text-sm text-left
                      ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-basic-white focus:bg-basic-white focus:outline-none cursor-pointer'
                      }
                      transition-colors duration-150
                      ${
                        isSelected
                          ? 'text-basic-green font-medium'
                          : isDisabled
                          ? 'text-gray-400'
                          : 'text-basic-black'
                      }
                    `}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span className="truncate flex-1">{option.label}</span>
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 ml-2">
                      {isDisabled ? (
                        <span className="text-xs text-gray-400">Assigned</span>
                      ) : isSelected ? (
                        <Check className="w-4 h-4 text-basic-green" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
