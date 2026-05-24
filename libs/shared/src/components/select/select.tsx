'use client';
import { Check } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPopper, Instance } from '@popperjs/core';
import ReactDOM from 'react-dom';
import { cn } from '../../utils';

export interface SelectOption {
  value: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  isAssigned?: boolean;
  className?: string;
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
  useTriggerWidth?: boolean;
  iconClassName?: string;
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
  iconClassName,
  useTriggerWidth = true,
  renderTrigger,
  renderPopup,
  renderItem,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const initialValue = value ?? defaultValue ?? options[0]?.value ?? '';
  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerDivRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const popperInstance = useRef<Instance | null>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  useEffect(() => {
    const currentTrigger = triggerRef.current || triggerDivRef.current;
    if (open && currentTrigger && popperRef.current) {
      popperInstance.current = createPopper(currentTrigger, popperRef.current, {
        placement: 'bottom-start',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: [
                'top-start',
                'bottom-start',
                'top-end',
                'bottom-end',
              ],
              padding: 8,
            },
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
      });

      if (useTriggerWidth && currentTrigger) {
        const { width } = currentTrigger.getBoundingClientRect();
        setDropdownWidth(width);
      }

      return () => {
        if (popperInstance.current) {
          popperInstance.current.destroy();
          popperInstance.current = null;
        }
      };
    }

    return undefined;
  }, [open, useTriggerWidth]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const currentTrigger = triggerRef.current || triggerDivRef.current;
      if (
        currentTrigger &&
        popperRef.current &&
        !currentTrigger.contains(event.target as Node) &&
        !popperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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
      setOpen(!open);
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      {renderTrigger ? (
        <div
          ref={triggerDivRef}
          onClick={disabled ? undefined : handleTriggerClick}
          className={`cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed ' : ''
          }`}
        >
          {renderTrigger({
            selectedOption,
            isOpen: open,
            onClick: handleTriggerClick,
            disabled,
          })}
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleTriggerClick}
          disabled={disabled}
          className={cn(`
          ${triggerClassName || ''}
            flex items-center justify-between gap-2 h-9 px-3 py-2
          ${
            disabled
              ? 'border border-basic-white bg-transparent rounded-lg opacity-50'
              : 'border border-basic-white rounded-lg '
          }
           text-left
           text-sm font-medium text-basic-gray
           cursor-pointer
           active:border-basic-green focus:border-basic-green 
          disabled:opacity-50 disabled:cursor-not-allowed ${
            disabled ? 'bg-transparent' : 'disabled:bg-gray-50'
          }
          transition-colors duration-200
          ${triggerClassName}
        `)}
        >
          <span
            className={` ${
              !selectedOption || internalValue === ''
                ? 'text-basic-gray font-normal'
                : 'text-sm font-medium text-basic-black'
            }`}
          >
            {!selectedOption || internalValue === ''
              ? selectedOption?.placeholder || placeholder
              : selectedOption?.label}
          </span>
          <span
            className={cn(
              'material-symbols-outlined text-lg text-basic-gray',
              iconClassName
            )}
          >
            expand_all
          </span>
        </button>
      )}

      {open &&
        ReactDOM.createPortal(
          <div
            ref={popperRef}
            className="bg-white rounded-lg shadow-lg border border-basic-white max-h-60 overflow-y-auto"
            style={{
              width: useTriggerWidth ? dropdownWidth : 'auto',
              zIndex: 999999,
            }}
            onMouseDown={(e) => e.stopPropagation()}
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
              <div className={popupClassName || ''}>
                {options.map((option) => {
                  const isSelected = internalValue === option.value;

                  return renderItem ? (
                    <div
                      key={option.value}
                      className={itemClassName}
                      onClick={() => handleSelect(option.value)}
                    >
                      {renderItem(option, isSelected)}
                    </div>
                  ) : (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        !option.disabled && handleSelect(option.value)
                      }
                      disabled={option.disabled}
                      className={`
    ${itemClassName || ''}
    ${option.className || ''}
    w-full flex items-center gap-2 px-3 py-2 text-sm text-left
    ${
      option.disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:bg-basic-white focus:bg-basic-white focus:outline-none cursor-pointer'
    }
    transition-colors duration-150
    ${
      isSelected
        ? 'text-basic-green font-semibold'
        : option.disabled
        ? 'text-gray-400'
        : 'text-gray-900'
    }
  `}
                    >
                      <span className="truncate flex-grow">{option.label}</span>
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        {option.disabled ? (
                          <span className="text-xs text-gray-400 mr-5">
                            Assigned
                          </span>
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-basic-green" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export const ExampleSelect = () => {
  const fontOptions = [
    { value: 'sans', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
  ];

  return (
    <CustomSelect
      options={fontOptions}
      defaultValue="sans"
      placeholder="Choose a font"
      onValueChange={(value) => {
        return;
      }}
    />
  );
};

export const Select: React.FC<{
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  triggerClassName?: string;
}> = ({
  options,
  value,
  onChange,
  disabled,
  placeholder = 'Select option',
  triggerClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const [isInTable, setIsInTable] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const recalculatePosition = () => {
      if (!ref.current) return;

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
  }, [open, options.length]);

  const selected = options.find((o) => o.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
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
      setOpen(!open);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={cn(
          `w-full border border-basic-white rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-between transition-all ${
            disabled
              ? 'bg-transparent cursor-not-allowed opacity-50'
              : 'hover:border-basic-green'
          }`,
          triggerClassName
        )}
        onClick={handleTriggerClick}
        disabled={disabled}
      >
        <span className={selected ? 'text-black' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="material-symbols-outlined ml-2">unfold_more</span>
      </button>
      {open && (
        <div
          style={{
            width: '100%',
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
              transform: showAbove ? 'translateY(-100%)' : 'translateZ(0)',
            }),
            ...(!isInTable && {
              left: 0,
              top: showAbove ? 'auto' : '100%',
              bottom: showAbove ? '100%' : 'auto',
              marginTop: showAbove ? '0px' : '8px',
              marginBottom: showAbove ? '8px' : '0px',
            }),
          }}
          className={`${
            isInTable ? 'fixed' : 'absolute'
          } z-50 left-0 w-full bg-white border-2 rounded-xl shadow-xl max-h-60 overflow-y-auto`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 rounded-lg transition-all flex items-center text-sm font-medium ${
                option.disabled
                  ? 'opacity-50 cursor-not-allowed text-gray-400'
                  : 'cursor-pointer hover:bg-gray-50'
              }`}
              onClick={() =>
                !option.disabled && handleOptionClick(option.value)
              }
            >
              <span className="flex-1">{option.label}</span>
              {option.disabled && (
                <span className="text-xs text-gray-400 ml-2">Assigned</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export interface OrganizationOption extends SelectOption {
  distance?: number;
  tasks?: number;
  own?: boolean;
  users?: Array<{ value: string; label: string; photo?: string }>;
}

interface OrganizationSelectProps extends Omit<SelectProps, 'options'> {
  options: OrganizationOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export const OrganizationSelect: React.FC<OrganizationSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select organization',
  disabled,
  className,
  triggerClassName,
}) => {
  const [sort, setSort] = useState<'distance' | 'tasks'>('distance');

  const sortedOptions = useMemo(() => {
    if (sort === 'distance') {
      return [...options].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    } else {
      return [...options].sort((a, b) => (b.tasks ?? 0) - (a.tasks ?? 0));
    }
  }, [options, sort]);
  return (
    <CustomSelect
      options={sortedOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      triggerClassName={
        triggerClassName ||
        'w-full border border-basic-green rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400'
      }
      popupClassName="bg-white border-2  rounded-xl p-0 min-w-[400px] max-h-[350px] overflow-y-auto"
      renderPopup={({
        options,
        value,
        onValueChange,
        close,
      }: {
        options: OrganizationOption[];
        value?: string;
        onValueChange?: (value: string) => void;
        close: () => void;
      }) => (
        <div className="p-0">
          <div className="flex mb-0 gap-0">
            <button
              className={`flex-1 flex items-center justify-center py-4 rounded-t-xl border-0 text-lg font-medium transition-all ${
                sort === 'distance'
                  ? 'bg-basic-white text-black'
                  : 'bg-white text-gray-400'
              }`}
              onClick={() => setSort('distance')}
              type="button"
              style={{ borderTopLeftRadius: 12 }}
            >
              <span className="material-symbols-outlined mr-2">swap_vert</span>
              Sort by distance
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-4 rounded-t-xl border-0 text-lg font-medium transition-all ${
                sort === 'tasks'
                  ? 'bg-basic-white text-black'
                  : 'bg-white text-gray-400'
              }`}
              onClick={() => setSort('tasks')}
              type="button"
              style={{ borderTopRightRadius: 12 }}
            >
              <span className="material-symbols-outlined mr-2">swap_vert</span>
              Sort by tasks
            </button>
          </div>
          <div className="border border-dashed  rounded-b-xl p-0">
            <div className="text-green-500 text-lg font-semibold mb-2 px-6 pt-4">
              -- Select organization --
            </div>
            <div className="max-h-[220px] overflow-y-auto px-2 pb-2">
              {options.map((opt: OrganizationOption) => (
                <div
                  key={opt.value}
                  className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-basic-white ${
                    value === opt.value ? 'bg-basic-white' : ''
                  }`}
                  onClick={() => {
                    onValueChange?.(opt.value);
                    close();
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-black text-lg">
                      {opt.label}
                    </span>
                    {opt.own && (
                      <span className="text-gray-400 text-base ml-1">
                        (own)
                      </span>
                    )}
                    {typeof opt.distance === 'number' && (
                      <span className="text-gray-400 text-base ml-2">
                        • {opt.distance} km
                      </span>
                    )}
                    {typeof opt.tasks === 'number' && (
                      <span className="text-gray-400 text-base ml-2">
                        • {opt.tasks} tasks
                      </span>
                    )}
                  </div>
                  {value === opt.value && (
                    <Check className="w-6 h-6 text-green-500 ml-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export const TaskTypeDropdown: React.FC<{
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ options, value, onChange, disabled }) => {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className={`w-auto text-left text-[28px] font-semibold bg-transparent ${
          disabled
            ? 'text-gray-300 cursor-not-allowed opacity-50'
            : 'text-black'
        }`}
        onClick={() => {
          if (!disabled) {
            optionRefs.current = [];
            setOpen((v) => !v);
          }
        }}
        disabled={disabled}
        style={{ boxShadow: 'none' }}
      >
        {selected ? selected.label : 'Select task'}
        <span className="material-symbols-outlined align-middle ml-2 text-base text-gray-400">
          expand_all
        </span>
      </button>
      {open && !disabled && (
        <div
          style={{
            width: '300px',
            position: 'absolute',
            left: 0,
            top: '100%',
            marginTop: '4px',
            zIndex: 30,
          }}
          className="bg-white rounded-lg shadow-lg border border-basic-white p-2 gap-2"
        >
          {options.map((opt, i) => (
            <div
              key={opt.value}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              className={`p-2 text-sm font-medium transition-colors ${
                opt.disabled
                  ? 'opacity-50 cursor-not-allowed text-gray-400'
                  : value === opt.value
                  ? 'text-green-600 bg-[#F6F7FA] cursor-pointer'
                  : 'text-black cursor-pointer hover:bg-gray-50'
              }`}
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                if (!opt.disabled) {
                  onChange(opt.value);
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span>{opt.label}</span>
                {opt.disabled && (
                  <span className="text-xs text-gray-400 ml-2">Assigned</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
