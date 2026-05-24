'use client';

import React, { useCallback } from 'react';
import {
  Button,
  Input,
  FormField,
  CustomSelect,
  DateSelector,
  Icon,
  SplitCard,
} from '@@agrosphere/shared';
import { useHarvestForm } from '../../hooks/use-harvest-form';
import { FIELD_OPTIONS, HARVEST_TYPE_OPTIONS } from '../../utils/options';
import { HARVEST_BOOK_VALUES_DISPLAY } from '../../utils/calculations';
import type { HarvestFormData } from '../../utils/validation';

interface RecordHarvestFormProps {
  harvestType: 'silage' | 'grazing';
  onCancel: () => void;
  onSave: () => void;
}

export function RecordHarvestForm({
  harvestType,
  onCancel,
  onSave,
}: RecordHarvestFormProps) {
  const { form, nFactor, nRemoved, harvestYieldDisplay, handleSubmit } =
    useHarvestForm(harvestType);

  const watchedValues = form.watch(['field', 'date', 'harvestType', 'yield']);
  const [field, date, harvestTypeValue, yieldValue] = watchedValues;
  const { formState } = form;
  const { errors } = formState;

  const { setError } = form;
  const onSubmit = useCallback(
    async (data: HarvestFormData) => {
      try {
        // await saveHarvest(data);
        console.log('Harvest data:', data);
        onSave();
      } catch (error) {
        setError('root', {
          message:
            error instanceof Error ? error.message : 'Failed to save harvest',
        });
      }
    },
    [setError, onSave]
  );

  const isSubmitting = formState.isSubmitting;
  const isValid = formState.isValid;
  const rootError = errors.root?.message;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          aria-label="Go back"
        >
          <Icon icon="arrow_back" size="lg" />
        </Button>
        <h2 className="text-xl font-semibold text-basic-black">
          Record Harvest
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <SplitCard
          className="h-full"
          topContent={
            <h3 className="text-lg font-semibold text-basic-black">
              Harvest Details
            </h3>
          }
          bottomClassName="flex flex-col flex-1"
          bottomContent={
            <>
              <form
                id="harvest-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col flex-1 space-y-4"
              >
                {rootError && (
                  <div
                    className="p-3 rounded-lg border border-red-200 bg-red-50"
                    role="alert"
                    aria-live="polite"
                  >
                    <p className="text-sm text-red-700">{rootError}</p>
                  </div>
                )}

                <FormField label="Field" required error={errors.field?.message}>
                  <CustomSelect
                    options={FIELD_OPTIONS}
                    value={field}
                    onValueChange={(value) => {
                      form.setValue('field', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    placeholder="Select field"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <FormField label="Date" required error={errors.date?.message}>
                  <DateSelector
                    value={date}
                    onChange={(dateValue) => {
                      form.setValue('date', dateValue, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    placeholder="DD/MM/YYYY"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <FormField
                  label="Harvest Type"
                  required
                  error={errors.harvestType?.message}
                >
                  <CustomSelect
                    options={HARVEST_TYPE_OPTIONS}
                    value={harvestTypeValue}
                    onValueChange={(value) => {
                      form.setValue('harvestType', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    placeholder="Select harvest type"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <FormField
                  label="Yield (tonnes/ha)"
                  required
                  error={errors.yield?.message}
                >
                  <Input className="w-full">
                    <Input.Content
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g., 20"
                      value={yieldValue ?? ''}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numValue = Number(inputValue);
                        form.setValue(
                          'yield',
                          inputValue === ''
                            ? undefined
                            : isNaN(numValue)
                            ? undefined
                            : numValue,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        );
                      }}
                      className="w-full"
                      aria-invalid={errors.yield ? 'true' : 'false'}
                      aria-describedby={
                        errors.yield ? 'yield-error' : undefined
                      }
                    />
                  </Input>
                </FormField>
              </form>
              <div className="flex gap-3 pt-4 mt-auto">
                <Button
                  type="button"
                  variant="cancel"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="harvest-form"
                  variant="default"
                  className="flex-1"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save Harvest
                </Button>
              </div>
            </>
          }
        />

        <SplitCard
          topContent={
            <h3 className="text-lg font-semibold text-basic-black">
              Calculation Preview
            </h3>
          }
          bottomContent={
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-basic-gray mb-1">Harvest Yield:</p>
                <p className="text-lg font-medium text-basic-black">
                  {harvestYieldDisplay} t/ha
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-basic-gray mb-1">N Factor:</p>
                <p className="text-lg font-medium text-basic-black">
                  {Number.isFinite(nFactor)
                    ? `${nFactor.toFixed(1)} kg N/t`
                    : '—'}
                </p>
              </div>
              {harvestTypeValue === 'grazing' && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-basic-gray mb-1">
                    Utilization Rate:
                  </p>
                  <p className="text-lg font-medium text-basic-black">75%</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-basic-gray mb-1">N Removed:</p>
                <p className="text-lg font-medium text-blue-600">
                  {Number.isFinite(nRemoved)
                    ? `${nRemoved.toFixed(1)} kg/ha`
                    : '—'}
                </p>
                {Number.isFinite(nRemoved) && nRemoved > 0 && (
                  <>
                    <p className="text-sm text-basic-gray mt-1">
                      Total Nitrogen: {nRemoved.toFixed(1)} kg/ha will be added
                      to the field&apos;s N-Out total.
                    </p>
                    {harvestTypeValue === 'grazing' && (
                      <p className="text-sm text-basic-gray mt-1 italic">
                        * Grazing calculation includes 75% utilization factor
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-basic-black mb-3">
                  Book Values Used
                </p>
                <div className="space-y-2 text-sm text-basic-gray">
                  <p>Silage: {HARVEST_BOOK_VALUES_DISPLAY['Silage']}</p>
                  <p>Bale/Hay: {HARVEST_BOOK_VALUES_DISPLAY['Bale/Hay']}</p>
                  <p>Grazing: {HARVEST_BOOK_VALUES_DISPLAY['Grazing']}</p>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
