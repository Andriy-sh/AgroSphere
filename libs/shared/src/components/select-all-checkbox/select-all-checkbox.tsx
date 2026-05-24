'use client';

import { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface SelectAllCheckboxProps {
  allItems: any[];
  selectedItems: string[];
  onSelectedItemsChange: (selectedItems: string[]) => void;
  getIdFromItem?: (item: any) => string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export function SelectAllCheckbox({
  allItems,
  selectedItems,
  onSelectedItemsChange,
  getIdFromItem = (item: any) => item.id,
  className,
  disabled = false,
  'aria-label': ariaLabel = 'Select all items',
}: SelectAllCheckboxProps) {
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const allChecked =
        allItems.length > 0 &&
        allItems.every((item) => selectedItems.includes(getIdFromItem(item)));
      const someChecked =
        selectedItems.length > 0 &&
        allItems.some((item) => selectedItems.includes(getIdFromItem(item)));
      headerCheckboxRef.current.indeterminate = someChecked && !allChecked;
    }
  }, [allItems, selectedItems, getIdFromItem]);

  const handleSelectAll = () => {
    const allSelected = allItems.every((item) =>
      selectedItems.includes(getIdFromItem(item))
    );

    if (allSelected) {
      onSelectedItemsChange([]);
    } else {
      onSelectedItemsChange(allItems.map(getIdFromItem));
    }
  };

  const isAllSelected =
    allItems.length > 0 &&
    allItems.every((item) => selectedItems.includes(getIdFromItem(item)));

  return (
    <label
      className={cn(
        'relative flex items-center justify-center text-center w-4 h-4',
        className
      )}
    >
      <input
        ref={headerCheckboxRef}
        type="checkbox"
        checked={isAllSelected}
        onChange={handleSelectAll}
        disabled={disabled}
        aria-label={ariaLabel}
        className="rounded-[4px] peer appearance-none w-4 h-4 border border-basic-gray-light bg-white cursor-pointer transition-colors checked:bg-black checked:border-black indeterminate:bg-black indeterminate:border-black disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <span className="pointer-events-none absolute left-1 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-all peer-checked:opacity-100 peer-indeterminate:opacity-100"></span>
    </label>
  );
}

export default SelectAllCheckbox;
