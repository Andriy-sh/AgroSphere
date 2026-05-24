'use client';

import { CustomSelect, type SelectOption } from '@@agrosphere/shared';
import { useMemo } from 'react';

export interface ParcelOption {
  id: string;
  parcelCode: string;
  parcelName: string;
}

interface ParcelSelectorProps {
  parcels: ParcelOption[];
  activeParcelId?: string;
  parcelCode: string;
  parcelName: string;
  onParcelSelect?: (parcelId: string) => void;
  disabled?: boolean;
}

export function ParcelSelector({
  parcels,
  activeParcelId,
  parcelCode,
  parcelName,
  onParcelSelect,
  disabled = false,
}: ParcelSelectorProps) {
  const parcelOptions: SelectOption[] = useMemo(
    () =>
      parcels.map((parcel) => ({
        value: parcel.id,
        label: `${parcel.parcelCode} ${parcel.parcelName}`,
        parcelCode: parcel.parcelCode,
        parcelName: parcel.parcelName,
      })),
    [parcels]
  );

  const handleValueChange = (value: string) => {
    onParcelSelect?.(value);
  };

  if (parcels.length === 0 || !onParcelSelect) {
    return (
      <span className="text-2xl font-semibold text-basic-black md:text-[28px] truncate min-w-0 block">
        <span className="text-basic-green">{parcelCode}</span>{' '}
        <span className="truncate">{parcelName}</span>
      </span>
    );
  }

  return (
    <CustomSelect
      options={parcelOptions}
      value={activeParcelId}
      onValueChange={handleValueChange}
      disabled={disabled}
      triggerClassName="h-auto px-3 py-1 text-[28px] font-semibold text-basic-black border-none shadow-none hover:bg-transparent"
      renderTrigger={({
        selectedOption,
        isOpen,
        onClick,
        disabled: isDisabled,
      }) => {
        const displayCode = selectedOption
          ? (selectedOption as SelectOption & { parcelCode?: string })
              .parcelCode || parcelCode
          : parcelCode;
        const displayName = selectedOption
          ? (selectedOption as SelectOption & { parcelName?: string })
              .parcelName || parcelName
          : parcelName;

        return (
          <div
            onClick={isDisabled ? undefined : onClick}
            className={`flex items-center justify-between w-full min-w-0 ${
              isDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:opacity-80'
            }`}
          >
            <span className="text-2xl font-semibold text-basic-black md:text-[28px] truncate min-w-0">
              <span className="text-basic-green">{displayCode}</span>{' '}
              <span className="truncate">{displayName}</span>
            </span>
            <span
              className={`material-symbols-outlined text-xl transition-transform flex-shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </div>
        );
      }}
      popupClassName="max-h-60"
      itemClassName="px-4 py-2 hover:bg-basic-gray-light cursor-pointer"
      renderItem={(option, selected) => {
        const optionCode =
          (option as SelectOption & { parcelCode?: string }).parcelCode || '';
        const optionName =
          (option as SelectOption & { parcelName?: string }).parcelName || '';

        return (
          <div
            className={`flex items-center justify-between gap-2 min-w-0 ${
              selected ? 'font-medium' : ''
            }`}
          >
            <span className="text-basic-black truncate min-w-0 flex-1">
              <span className="text-basic-green">{optionCode}</span>{' '}
              <span>{optionName}</span>
            </span>
            {selected && (
              <span className="material-symbols-outlined text-lg text-basic-green flex-shrink-0">
                check
              </span>
            )}
          </div>
        );
      }}
    />
  );
}
