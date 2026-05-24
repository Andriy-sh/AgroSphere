'use client';
import React, { useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { CustomSelect } from '../select/select';
import { FormField } from '../form-field/form-field';
import type { SelectOption } from '../select/select';

export interface SatellitePKFormData {
  periodStart: string;
  periodEnd: string;
  zonesCount: string;
  satellite: string;
  period?: string;
}

const zonesCountOptions: SelectOption[] = [
  { value: '2', label: '2 zones' },
  { value: '3', label: '3 zones' },
  { value: '4', label: '4 zones' },
  { value: '5', label: '5 zones' },
  { value: '6', label: '6 zones' },
  { value: '7', label: '7 zones' },
];

const satelliteOptions: SelectOption[] = [
  { value: 'sentinel2', label: 'Sentinel-2' },
  { value: 'landsat8', label: 'Landsat-8' },
  { value: 'planet_scope', label: 'PlanetScope' },
];

const periodOptions: SelectOption[] = [
  { value: 'last-3-months', label: 'Last 3 months' },
  { value: 'last-6-months', label: 'Last 6 months' },
  { value: 'last-year', label: 'Last year' },
];

function calculatePeriod(period: string) {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);

  const startDate = new Date();

  if (period === 'last-3-months') startDate.setMonth(startDate.getMonth() - 3);
  if (period === 'last-6-months') startDate.setMonth(startDate.getMonth() - 6);
  if (period === 'last-year')
    startDate.setFullYear(startDate.getFullYear() - 1);

  const start = startDate.toISOString().slice(0, 10);

  return { start, end };
}

const StatusNotice: React.FC<{ message: string }> = ({ message }) => (
  <div className="mt-3 flex flex-col items-center gap-2 text-sm text-gray-600">
    <div
      role="status"
      aria-live="polite"
      className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-green-500"
    />
    <p className="text-center font-medium leading-relaxed">{message}</p>
  </div>
);

export const SatellitePKForm = React.forwardRef<
  { getFormData: () => SatellitePKFormData },
  {
    onFormDataChange?: (data: SatellitePKFormData) => void;
    isLoading?: boolean;
    isCreatingImage?: boolean;
    isImageReady?: boolean;
    onCanCreateChange?: (canCreate: boolean) => void;
  }
>(
  (
    {
      onFormDataChange,
      isLoading = false,
      isCreatingImage = false,
      isImageReady = false,
      onCanCreateChange,
    },
    ref
  ) => {
    const { watch, setValue, getValues } = useForm<SatellitePKFormData>({
      defaultValues: {
        periodStart: '',
        periodEnd: '',
        zonesCount: '5',
        satellite: 'sentinel2',
        period: '',
      },
    });

    const watchedValues = watch();

    useImperativeHandle(ref, () => ({
      getFormData: () => getValues(),
    }));

    useEffect(() => {
      if (onFormDataChange) {
        onFormDataChange(getValues());
      }
    }, [
      watchedValues.period,
      watchedValues.zonesCount,
      watchedValues.satellite,
      watchedValues.periodStart,
      watchedValues.periodEnd,
      onFormDataChange,
    ]);

    const canCreate = Boolean(
      watchedValues.period &&
        watchedValues.zonesCount &&
        watchedValues.satellite &&
        !isCreatingImage
    );

    useEffect(() => {
      if (onCanCreateChange) onCanCreateChange(canCreate);
    }, [canCreate, onCanCreateChange]);

    return (
      <div className="flex flex-col gap-5">
        <FormField label="Satellites">
          <CustomSelect
            options={satelliteOptions}
            value={watchedValues.satellite}
            onValueChange={(value) => setValue('satellite', value)}
            placeholder="Select satellite"
            disabled={isLoading || isCreatingImage}
            className="w-full"
            triggerClassName="w-full"
          />
        </FormField>

        <FormField label="Period">
          <CustomSelect
            options={periodOptions}
            value={watchedValues.period}
            onValueChange={(value) => {
              setValue('period', value);

              const { start, end } = calculatePeriod(value);

              setValue('periodStart', start);
              setValue('periodEnd', end);
            }}
            placeholder="Select period"
            disabled={isLoading || isCreatingImage}
            className="w-full"
            triggerClassName="w-full"
          />
        </FormField>

        <FormField label="Pick the number of zones you want to create">
          <CustomSelect
            options={zonesCountOptions}
            value={watchedValues.zonesCount}
            onValueChange={(value) => setValue('zonesCount', value)}
            placeholder="5 recommended"
            disabled={isLoading || isCreatingImage}
            className="w-full"
            triggerClassName="w-full"
          />
          {isCreatingImage && (
            <StatusNotice message="Processing request and creating P&K map..." />
          )}
          {isImageReady && !isCreatingImage && (
            <StatusNotice message="P&K map is ready! Applying…" />
          )}
        </FormField>
      </div>
    );
  }
);

SatellitePKForm.displayName = 'SatellitePKForm';
