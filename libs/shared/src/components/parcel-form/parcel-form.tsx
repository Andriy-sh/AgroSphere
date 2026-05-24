'use client';

import { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { AddButton } from '../add-button/add-button';
import { Button } from '../button/button';
import {
  CustomSelect,
  type SelectOption,
} from '../custom-select/custom-select';
import { FormField } from '../form-field/form-field';
import { Icon } from '../icon/icon';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { ParcelPreview } from '../parcel-preview/parcel-preview';
import { Separator } from '../separator/separator';
import { SplitCard } from '../split-card/split-card';
import { DropdownActionsNoLib } from '../dropdownitems/dropdownitems';
import type { ParcelWithZones } from '../map/hooks/use-map-polygon-splitting';

interface ManagementZoneHistoryEntry {
  id: string;
  createdAt: Date;
  zonesCount: number;
  method: string;
  parcelWithZones?: ParcelWithZones;
}

interface ParcelFormProps {
  farmField: {
    label?: string;
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    className?: string;
  };
  parcelField?: {
    label?: string;
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    className?: string;
  };
  nameField: {
    label?: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (value: string) => void;
  };
  idField: {
    label?: string;
    value: string;
    placeholder?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (value: string) => void;
  };
  areaField: {
    label?: string;
    value: string;
    placeholder?: string;
    suffix?: string;
    disabled?: boolean;
    readOnly?: boolean;
    autoCalculated?: boolean;
    autoCalculatedLabel?: string;
  };
  effectiveAreaField: {
    label?: string;
    value: string;
    placeholder?: string;
    suffix?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (value: string) => void;
  };
  soilTypeField: {
    label?: string;
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
  };
  cropField?: {
    label?: string;
    options: SelectOption[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
  };
  managementZones: {
    title?: string;
    history: ManagementZoneHistoryEntry[];
    canCreateZones?: boolean;
    addButtonDisabled?: boolean;
    addButtonText?: string;
    disabledMessage?: string;
    onDrawZone?: () => void;
    onSatelliteZone?: () => void;
    onDeleteHistoryEntry?: (entryId: string) => void;
    showAddButton?: boolean;
    sectionDisabled?: boolean;
    emptyState?: {
      icon?: string;
      title: string;
      description: string;
    };
  };
  actions?: {
    cancelText?: string;
    saveText?: string;
    cancelDisabled?: boolean;
    saveDisabled?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    showSaveButton?: boolean;
  };
  parcelFieldsDisabled?: boolean;
  className?: string;
}

export function ParcelForm({
  farmField,
  nameField,
  idField,
  areaField,
  effectiveAreaField,
  soilTypeField,
  cropField,
  managementZones,
  actions,
  parcelFieldsDisabled = false,
  className,
}: ParcelFormProps) {
  const {
    label: farmLabel = 'Farm',
    options: farmOptions,
    value: farmValue,
    placeholder: farmPlaceholder = 'Select farm',
    disabled: farmDisabled = false,
    onChange: onFarmChange,
    className: farmClassName,
  } = farmField;

  const {
    label: nameLabel = 'Name',
    value: nameValue,
    placeholder: namePlaceholder = 'Enter parcel name',
    required: nameRequired = false,
    error: nameError,
    disabled: nameDisabled = false,
    readOnly: nameReadOnly,
    onChange: onNameChange,
  } = nameField;

  const {
    label: idLabel = 'ID',
    value: idValue,
    placeholder: idPlaceholder = 'e.g. 1A',
    error: idError,
    helperText: idHelperText,
    disabled: idDisabled = false,
    readOnly: idReadOnly,
    onChange: onIdChange,
  } = idField;

  const {
    label: areaLabel = 'Area',
    value: areaValue,
    placeholder: areaPlaceholder = '≈0.0',
    suffix: areaSuffix = 'ha',
    disabled: areaDisabled = false,
    readOnly: areaReadOnly = true,
    autoCalculated = false,
    autoCalculatedLabel = '(Auto-calculated)',
  } = areaField;

  const {
    label: effectiveLabel = 'Effective area',
    value: effectiveValue,
    placeholder: effectivePlaceholder = 'Enter area',
    suffix: effectiveSuffix = 'ha',
    disabled: effectiveDisabled = false,
    readOnly: effectiveReadOnly = false,
    onChange: onEffectiveChange,
  } = effectiveAreaField;

  const {
    label: soilLabel = 'Soil type',
    options: soilOptions,
    value: soilValue,
    placeholder: soilPlaceholder = 'Select soil type',
    disabled: soilDisabled = false,
    onChange: onSoilChange,
  } = soilTypeField;

  const {
    label: cropLabel = 'Crop',
    options: cropOptions = [],
    value: cropValue,
    placeholder: cropPlaceholder = 'Select crop',
    disabled: cropDisabled = false,
    onChange: onCropChange,
  } = cropField || {};

  const {
    title: zonesTitle = 'Management zones',
    history: zonesHistory,
    canCreateZones = true,
    addButtonDisabled = false,
    addButtonText = 'Create management zones',
    disabledMessage = 'Draw parcel first',
    onDrawZone,
    onSatelliteZone,
    onDeleteHistoryEntry,
    showAddButton = true,
    sectionDisabled = false,
    emptyState = {
      icon: 'info',
      title: 'Add zones to your parcel',
      description:
        'You can create management zones to better organize your fields. Click "Plus" to get started.',
    },
  } = managementZones;

  const {
    cancelText = 'Cancel',
    saveText = 'Save',
    cancelDisabled = false,
    saveDisabled = false,
    onCancel,
    onSave,
    showSaveButton = true,
  } = actions ?? {};

  const sortedHistory = useMemo(() => {
    return [...zonesHistory].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [zonesHistory]);

  const managementZoneOptions = useMemo(() => {
    const options = [];
    if (onDrawZone) {
      options.push({
        id: 'draw',
        label: 'Draw',
        onClick: onDrawZone,
      });
    }
    if (onSatelliteZone) {
      options.push({
        id: 'satellite',
        label: 'Satellite P&K',
        onClick: onSatelliteZone,
      });
    }
    return options;
  }, [onDrawZone, onSatelliteZone]);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForTitle = (date: Date) => {
    const day = date.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatAreaValue = (value: string | number | undefined): string => {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    const cleanValue =
      typeof value === 'string'
        ? value.replace(/[^\d.-]/g, '').trim()
        : value.toString();
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) {
      return '';
    }
    return numValue.toFixed(1);
  };

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-5">
          <div className={cn('flex flex-col gap-2', farmClassName)}>
            <Label>{farmLabel}</Label>
            <CustomSelect
              options={farmOptions}
              value={farmValue}
              onValueChange={onFarmChange}
              placeholder={farmPlaceholder}
              className="w-full"
              triggerClassName="h-9 w-full"
              disabled={farmDisabled}
            />
          </div>

          <div
            className={cn(
              'flex flex-col gap-2',
              (parcelFieldsDisabled || nameDisabled) &&
                'opacity-50 pointer-events-none'
            )}
          >
            <FormField
              label={nameLabel}
              required={nameRequired}
              error={nameError}
            >
              <Input>
                <Input.Content
                  placeholder={namePlaceholder}
                  className="w-full"
                  value={nameValue}
                  onChange={
                    onNameChange
                      ? (event) => onNameChange(event.target.value)
                      : undefined
                  }
                  readOnly={nameReadOnly ?? !onNameChange}
                  disabled={parcelFieldsDisabled || nameDisabled}
                />
              </Input>
            </FormField>
          </div>

          <div
            className={cn(
              'flex flex-col gap-2',
              (parcelFieldsDisabled || idDisabled) &&
                'opacity-50 pointer-events-none'
            )}
          >
            <FormField label={idLabel} error={idError}>
              <Input>
                <Input.Content
                  placeholder={idPlaceholder}
                  className="w-full"
                  value={idValue}
                  onChange={
                    onIdChange
                      ? (event) => onIdChange(event.target.value)
                      : undefined
                  }
                  readOnly={idReadOnly ?? !onIdChange}
                  disabled={parcelFieldsDisabled || idDisabled}
                />
              </Input>
            </FormField>
            {idHelperText ? (
              <p className="text-sm text-basic-gray">{idHelperText}</p>
            ) : null}
          </div>

          <div
            className={cn(
              'flex gap-5',
              parcelFieldsDisabled && 'opacity-50 pointer-events-none'
            )}
          >
            <div className="flex flex-1 flex-col gap-2">
              <Label>
                {areaLabel}{' '}
                {autoCalculated ? (
                  <span className="text-green-600">{autoCalculatedLabel}</span>
                ) : null}
              </Label>
              <div className="relative">
                <Input>
                  <Input.Content
                    placeholder={areaPlaceholder}
                    className="w-full pr-8"
                    value={
                      typeof areaValue === 'string'
                        ? areaValue.replace(/\s*ha\s*$/i, '')
                        : typeof areaValue === 'number'
                        ? String(areaValue)
                        : formatAreaValue(areaValue)
                    }
                    readOnly={areaReadOnly}
                    disabled={parcelFieldsDisabled || areaDisabled}
                  />
                </Input>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-sm text-basic-gray">{areaSuffix}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label>{effectiveLabel}</Label>
              <div className="relative">
                <Input>
                  <Input.Content
                    placeholder={effectivePlaceholder}
                    className="w-full pr-8"
                    value={effectiveValue}
                    onChange={
                      onEffectiveChange
                        ? (event) => onEffectiveChange(event.target.value)
                        : undefined
                    }
                    readOnly={effectiveReadOnly ?? !onEffectiveChange}
                    disabled={parcelFieldsDisabled || effectiveDisabled}
                  />
                </Input>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-sm text-basic-gray">
                    {effectiveSuffix}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'flex flex-col gap-2',
              (parcelFieldsDisabled || soilDisabled) &&
                'opacity-50 pointer-events-none'
            )}
          >
            <Label>{soilLabel}</Label>
            <CustomSelect
              options={soilOptions}
              value={soilValue}
              onValueChange={onSoilChange}
              placeholder={soilPlaceholder}
              className="w-full"
              triggerClassName="h-9 w-full"
              disabled={parcelFieldsDisabled || soilDisabled}
              forceOpenDown={true}
            />
          </div>

          {cropField && (
            <div
              className={cn(
                'flex flex-col gap-2',
                (parcelFieldsDisabled || cropDisabled) &&
                  'opacity-50 pointer-events-none'
              )}
            >
              <Label>{cropLabel}</Label>
              <CustomSelect
                options={cropOptions}
                value={cropValue}
                onValueChange={onCropChange}
                placeholder={cropPlaceholder}
                className="w-full"
                triggerClassName="h-9 w-full"
                disabled={parcelFieldsDisabled || cropDisabled}
                forceOpenDown={true}
              />
            </div>
          )}

          <SplitCard
            className={cn(sectionDisabled && 'opacity-50 pointer-events-none')}
            topContent={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-basic-black">
                  {zonesTitle}
                </h3>
                {showAddButton ? (
                  canCreateZones ? (
                    <AddButton
                      buttonText={addButtonText}
                      useCustomOptions={managementZoneOptions.length > 0}
                      customOptions={managementZoneOptions}
                      className="flex-shrink-0"
                      disabled={addButtonDisabled}
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500">
                      {disabledMessage}
                    </div>
                  )
                ) : null}
              </div>
            }
            bottomContent={
              <div className="flex flex-col gap-3 text-basic-black">
                {sortedHistory.length > 0 ? (
                  sortedHistory.map((historyEntry, index) => (
                    <div
                      key={historyEntry.id}
                      className={
                        index < sortedHistory.length - 1
                          ? 'border-b border-basic-gray-light pb-3'
                          : ''
                      }
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ParcelPreview
                            parcelWithZones={historyEntry.parcelWithZones}
                            hideParcelFill={true}
                          />
                          <span className="text-basic-black">
                            Management zones{' '}
                            {formatDateForTitle(historyEntry.createdAt)}
                          </span>
                        </div>
                        <DropdownActionsNoLib
                          triggerIcon={<span>⋮</span>}
                          triggerClassName="rounded-full px-2 py-1 text-lg leading-none text-basic-gray transition-colors hover:text-basic-black"
                          contentClassName="py-2"
                          placement="bottom-end"
                          items={[
                            {
                              id: `view-${historyEntry.id}`,
                              label: 'View on map',
                              icon: 'location_searching',
                              onClick: () => undefined,
                            },
                            {
                              id: `edit-name-${historyEntry.id}`,
                              label: 'Edit name',
                              icon: 'title',
                              onClick: () => undefined,
                            },
                            {
                              id: `edit-zones-${historyEntry.id}`,
                              label: 'Edit zones',
                              icon: 'edit',
                              onClick: () => undefined,
                            },
                            {
                              id: `delete-${historyEntry.id}`,
                              label: 'Delete',
                              icon: 'delete',
                              onClick: () => {
                                if (onDeleteHistoryEntry) {
                                  onDeleteHistoryEntry(historyEntry.id);
                                }
                              },
                              className: 'text-red-500 hover:bg-red-50',
                            },
                          ]}
                        />
                      </div>
                      <div className="flex items-center">
                        <p className="text-basic-gray">
                          Created:{' '}
                          <span className="text-basic-black">
                            {formatDate(historyEntry.createdAt)}
                          </span>
                        </p>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-5 w-px"
                        />
                        <p className="text-basic-gray">
                          Zones:{' '}
                          <span className="text-basic-black">
                            {historyEntry.zonesCount}
                          </span>
                        </p>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-5 w-px"
                        />
                        <p className="text-basic-gray">
                          Method:{' '}
                          <span className="text-basic-black">
                            {historyEntry.method}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-3">
                      <Icon icon={emptyState.icon ?? 'info'} />
                      <p className="font-semibold text-basic-black">
                        {emptyState.title}
                      </p>
                    </div>
                    <p className="text-sm text-basic-gray">
                      {emptyState.description}
                    </p>
                  </div>
                )}
              </div>
            }
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          type="button"
          variant="cancel"
          className="flex-1"
          onClick={onCancel}
          disabled={cancelDisabled}
        >
          {cancelText}
        </Button>
        {showSaveButton ? (
          <Button
            type="button"
            variant="default"
            className="flex-1"
            onClick={onSave}
            disabled={saveDisabled}
          >
            {saveText}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
