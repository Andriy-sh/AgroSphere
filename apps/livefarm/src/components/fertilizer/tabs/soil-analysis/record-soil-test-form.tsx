'use client';

import React, { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import {
  Button,
  FormField,
  CustomSelect,
  DateSelector,
  Icon,
  SplitCard,
} from '@@agrosphere/shared';
import { useSoilTestForm } from '../../hooks/use-soil-test-form';
import { FIELD_OPTIONS, SCENARIO_OPTIONS } from '../../utils/options';
import { getScenarioShortLabel } from '../../utils/scenario';
import { NumberFormField } from '../../components/number-form-field';
import type { SoilTestFormData } from '../../utils/validation';

interface RecordSoilTestFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export function RecordSoilTestForm({
  onCancel,
  onSave,
}: RecordSoilTestFormProps) {
  const { form, nMinRange, nValue, scenarioValues, handleSubmit } =
    useSoilTestForm(onSave);

  const field = useWatch({ control: form.control, name: 'field' });
  const testDate = useWatch({ control: form.control, name: 'testDate' });
  const minNMin = useWatch({ control: form.control, name: 'minNMin' });
  const maxNMin = useWatch({ control: form.control, name: 'maxNMin' });
  const scenario = useWatch({ control: form.control, name: 'scenario' });

  const scenarioLabel = useMemo(
    () => getScenarioShortLabel(scenario),
    [scenario]
  );

  const { formState } = form;
  const { errors } = formState;
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
          Record Soil Test
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Panel: Soil Test Details */}
        <SplitCard
          className="h-full"
          topContent={
            <h3 className="text-lg font-semibold text-basic-black">
              Soil Test Details
            </h3>
          }
          bottomClassName="flex flex-col flex-1"
          bottomContent={
            <>
              <form
                id="soil-test-form"
                onSubmit={handleSubmit}
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

                <FormField
                  label="Test Date"
                  required
                  error={errors.testDate?.message}
                >
                  <DateSelector
                    value={testDate}
                    onChange={(dateValue) => {
                      form.setValue('testDate', dateValue, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    placeholder="DD/MM/YYYY"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <NumberFormField<SoilTestFormData>
                  name="minNMin"
                  label="Min N-Min (kg/ha)"
                  required
                  error={errors.minNMin?.message}
                  value={minNMin}
                  setValue={(name, value, options) => {
                    form.setValue(name, value, options);
                    setTimeout(() => {
                      form.trigger(['minNMin', 'maxNMin']);
                    }, 0);
                  }}
                  placeholder="e.g., 30"
                  step="0.1"
                  min="0"
                />

                <NumberFormField<SoilTestFormData>
                  name="maxNMin"
                  label="Max N-Min (kg/ha)"
                  required
                  error={errors.maxNMin?.message}
                  value={maxNMin}
                  setValue={(name, value, options) => {
                    form.setValue(name, value, options);
                    setTimeout(() => {
                      form.trigger(['minNMin', 'maxNMin']);
                    }, 0);
                  }}
                  placeholder="e.g., 60"
                  step="0.1"
                  min="0"
                />

                <FormField
                  label="Scenario Selection"
                  required
                  error={errors.scenario?.message}
                >
                  <CustomSelect
                    options={SCENARIO_OPTIONS}
                    value={scenario}
                    onValueChange={(value) => {
                      form.setValue('scenario', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    placeholder="Select scenario"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
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
                  form="soil-test-form"
                  variant="default"
                  className="flex-1"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save Test Result
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
                <p className="text-sm text-basic-gray mb-1">N-Min Range:</p>
                <p className="text-lg font-medium text-basic-black">
                  {nMinRange}
                </p>
              </div>
              {scenarioLabel && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-basic-gray mb-1">
                    Selected Scenario:
                  </p>
                  <p className="text-lg font-medium text-basic-black">
                    {scenarioLabel}
                  </p>
                </div>
              )}
              {Number.isFinite(nValue) && nValue > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-basic-gray mb-1">
                    Applied N Value:
                  </p>
                  <p className="text-lg font-medium text-blue-600">
                    {nValue.toFixed(1)} kg/ha
                  </p>
                  <div className="mt-3">
                    <p className="text-sm text-basic-gray">
                      <span className="font-medium text-basic-black">
                        Soil Nitrogen:
                      </span>{' '}
                      {nValue.toFixed(1)} kg/ha will be added to the
                      field&apos;s N-In total from soil mineralization.
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-basic-black mb-3">
                  Scenario Explanation:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-basic-black">
                      Pessimistic (Low estimate):
                    </span>{' '}
                    <span className="text-basic-gray">
                      Uses minimum value (
                      {Number.isFinite(scenarioValues.pessimistic)
                        ? `${scenarioValues.pessimistic.toFixed(1)} kg/ha`
                        : '—'}
                      )
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-basic-black">
                      Medium (Average estimate):
                    </span>{' '}
                    <span className="text-basic-gray">
                      Uses average value (
                      {Number.isFinite(scenarioValues.medium)
                        ? `${scenarioValues.medium.toFixed(1)} kg/ha`
                        : '—'}
                      )
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-basic-black">
                      Optimistic (High estimate):
                    </span>{' '}
                    <span className="text-basic-gray">
                      Uses maximum value (
                      {Number.isFinite(scenarioValues.optimistic)
                        ? `${scenarioValues.optimistic.toFixed(1)} kg/ha`
                        : '—'}
                      )
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-basic-black mb-2">
                  Lab Test Information
                </p>
                <p className="text-sm text-basic-gray">
                  N-Min tests measure the nitrogen available for crop uptake
                  through soil mineralization. The range reflects natural
                  variation in soil conditions and testing methodology.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
