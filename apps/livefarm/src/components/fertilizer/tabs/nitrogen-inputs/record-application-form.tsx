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
import { useApplicationForm } from '../../hooks/use-application-form';
import {
  FIELD_OPTIONS,
  APPLICATION_TYPE_OPTIONS,
  CHEMICAL_PRODUCT_OPTIONS,
  SLURRY_PRODUCT_OPTIONS,
} from '../../utils/options';
import type { ApplicationFormData } from '../../utils/validation';

interface RecordApplicationFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export function RecordApplicationForm({
  onCancel,
  onSave,
}: RecordApplicationFormProps) {
  const {
    form,
    applicationRate,
    rateUnit,
    nValue,
    nPercentage,
    nAvailability,
    handleSubmit,
  } = useApplicationForm();

  const watchedValues = form.watch([
    'field',
    'date',
    'applicationType',
    'product',
    'rate',
  ]);
  const [field, date, applicationType, product, rate] = watchedValues;
  const { formState } = form;
  const { errors } = formState;

  const onSubmit = useCallback(
    async (data: ApplicationFormData) => {
      try {
        // await saveApplication(data);
        console.log('Application data:', data);
        onSave();
      } catch (error) {
        form.setError('root', {
          message:
            error instanceof Error
              ? error.message
              : 'Failed to save application',
        });
      }
    },
    [form, onSave]
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
          Record Application
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <SplitCard
          className="h-full"
          topContent={
            <h3 className="text-lg font-semibold text-basic-black">
              Application Details
            </h3>
          }
          bottomClassName="flex flex-col flex-1"
          bottomContent={
            <>
              <form
                id="application-form"
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
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      if (value) {
                        form.trigger('field');
                      }
                    }}
                    placeholder="Select field"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <FormField label="Date" required error={errors.date?.message}>
                  <DateSelector
                    value={date}
                    onChange={(dateValue: string) => {
                      form.setValue('date', dateValue, {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      if (dateValue) {
                        form.trigger('date');
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <FormField
                  label="Application Type"
                  required
                  error={errors.applicationType?.message}
                >
                  <CustomSelect
                    options={APPLICATION_TYPE_OPTIONS}
                    value={applicationType}
                    onValueChange={(value) => {
                      form.setValue('applicationType', value, {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      if (value) {
                        form.trigger('applicationType');
                      }
                      form.setValue('product', '', {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                    }}
                    placeholder="Select application type"
                    className="w-full"
                    triggerClassName="w-full h-9"
                  />
                </FormField>

                <FormField
                  label="Product"
                  required
                  error={errors.product?.message}
                >
                  <CustomSelect
                    options={
                      applicationType === 'chemical'
                        ? CHEMICAL_PRODUCT_OPTIONS
                        : applicationType === 'slurry'
                        ? SLURRY_PRODUCT_OPTIONS
                        : []
                    }
                    value={product}
                    onValueChange={(value) => {
                      form.setValue('product', value, {
                        shouldValidate: false,
                        shouldDirty: true,
                      });
                      if (value) {
                        form.trigger('product');
                      }
                    }}
                    placeholder={
                      applicationType
                        ? 'Select product'
                        : 'Select application type first'
                    }
                    className="w-full"
                    triggerClassName="w-full h-9"
                    disabled={!applicationType}
                  />
                  {!applicationType && (
                    <p className="text-sm text-basic-gray mt-1">
                      Please select an application type first
                    </p>
                  )}
                </FormField>

                <FormField
                  label={`Application Rate (${rateUnit})`}
                  required
                  error={errors.rate?.message}
                >
                  <Input className="w-full">
                    <Input.Content
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder={
                        applicationType === 'chemical'
                          ? 'e.g., 200'
                          : applicationType === 'slurry'
                          ? 'e.g., 30'
                          : 'e.g., 200'
                      }
                      value={rate ?? ''}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numValue = Number(inputValue);
                        form.setValue(
                          'rate',
                          inputValue === ''
                            ? undefined
                            : isNaN(numValue)
                            ? undefined
                            : numValue,
                          {
                            shouldValidate: false,
                            shouldDirty: true,
                          }
                        );
                      }}
                      onBlur={() => {
                        form.trigger('rate');
                      }}
                      className="w-full"
                      aria-invalid={errors.rate ? 'true' : 'false'}
                      aria-describedby={errors.rate ? 'rate-error' : undefined}
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
                  form="application-form"
                  variant="default"
                  className="flex-1"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save Application
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
                <p className="text-sm text-basic-gray mb-1">
                  Application Rate:
                </p>
                <p className="text-lg font-medium text-basic-black">
                  {applicationRate}
                  {rateUnit}
                </p>
              </div>
              {applicationType === 'chemical' && nPercentage !== null && (
                <>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-basic-gray mb-1">
                      N Percentage:
                    </p>
                    <p className="text-lg font-medium text-basic-black">
                      {nPercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-basic-gray mb-1">N Applied:</p>
                    <p className="text-lg font-medium text-blue-600">
                      {Number.isFinite(nValue) && nValue > 0
                        ? `${nValue.toFixed(1)}kg/ha`
                        : '0.0kg/ha'}
                    </p>
                    <p className="text-sm text-basic-gray mt-1">
                      Total Nitrogen:{' '}
                      {Number.isFinite(nValue) && nValue > 0
                        ? `${nValue.toFixed(1)}`
                        : '0.0'}{' '}
                      kg/ha will be added to the field&apos;s N-In total.
                    </p>
                  </div>
                </>
              )}
              {applicationType === 'slurry' && nAvailability !== null && (
                <>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-basic-gray mb-1">
                      N Availability:
                    </p>
                    <p className="text-lg font-medium text-basic-black">
                      {nAvailability.toFixed(1)} kg N/m³
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-basic-gray mb-1">N Applied:</p>
                    <p className="text-lg font-medium text-blue-600">
                      {Number.isFinite(nValue) && nValue > 0
                        ? `${nValue.toFixed(1)}kg/ha`
                        : '0.0kg/ha'}
                    </p>
                    <p className="text-sm text-basic-gray mt-1">
                      Total Nitrogen:{' '}
                      {Number.isFinite(nValue) && nValue > 0
                        ? `${nValue.toFixed(1)}`
                        : '0.0'}{' '}
                      kg/ha will be added to the field&apos;s N-In total.
                    </p>
                  </div>
                </>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
