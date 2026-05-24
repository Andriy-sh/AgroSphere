'use client';
import React, { useEffect } from 'react';
import {
  Input,
  CustomSelect,
  UserSelect,
  FormField,
  Radio,
  PhoneInput,
  CountrySelect,
  RegionSelect,
  getPostalCodeLabel,
  getRegionLabel,
  farmTypeOptions,
  consultantOptions,
  businessTypeOptions,
  contactRoleOptions,
  MultiSelect,
  Icon,
} from '@@agrosphere/shared';
import { useAddClientForm } from './use-add-client-form';
import type { AddClientFormProps } from './add-client.types';

const inputStyles = {
  base: 'w-full h-9 border border-basic-white rounded-lg focus:border-basic-green focus:outline-none transition-colors',
  error: 'border-basic-red focus:border-basic-red',
};

const errorIcon = (
  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
    <Icon size="sm" icon="error" className="text-basic-red" />
  </div>
);

const getPostalCodePlaceholder = (country: string) => {
  const placeholders: Record<string, string> = {
    Ireland: 'Enter eircode',
    'United States': 'Enter ZIP code',
    USA: 'Enter ZIP code',
    US: 'Enter ZIP code',
    'United Kingdom': 'Enter postcode',
    UK: 'Enter postcode',
    Canada: 'Enter postal code',
    Australia: 'Enter postcode',
    'New Zealand': 'Enter postcode',
    Germany: 'Enter postcode',
    France: 'Enter postcode',
    Netherlands: 'Enter postcode',
  };
  return placeholders[country] || 'Enter postcode';
};

const tagOptions = [
  { value: 'Farm', label: 'Farm' },
  { value: 'Mixed Crops', label: 'Mixed Crops' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Beef', label: 'Beef' },
  { value: 'Pig', label: 'Pig' },
  { value: 'Sheep', label: 'Sheep' },
  { value: 'Goat', label: 'Goat' },
  { value: 'Poultry', label: 'Poultry' },
  { value: 'Horse', label: 'Horse' },
  { value: 'Other', label: 'Other' },
];

const FormInput = ({
  label,
  required = false,
  error,
  validationError,
  onFieldBlur,
  ...inputProps
}: {
  label: string;
  required?: boolean;
  error?: string;
  validationError?: { type?: string; message?: string };
  onFieldBlur?: (fieldName: string) => void;
} & React.ComponentProps<typeof Input>) => {
  const hasError = error || validationError?.type === 'error';

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFieldBlur && inputProps.name) {
      onFieldBlur(inputProps.name);
    }
    if (inputProps.onBlur) {
      inputProps.onBlur(e);
    }
  };

  return (
    <FormField
      label={label}
      required={required}
      error={
        validationError?.type === 'error' ? validationError?.message : error
      }
    >
      <div className="relative">
        <Input
          {...inputProps}
          onBlur={handleBlur}
          className={`${inputStyles.base} ${hasError ? inputStyles.error : ''}`}
        />
        {hasError && errorIcon}
      </div>
    </FormField>
  );
};

export function AddClientForm({
  mode,
  defaultValues,
  existingClients = [],
  excludeClientId,
  serverErrors = {},
  onSubmit,
  onFieldBlur,
  formSubmitRef,
}: AddClientFormProps) {
  const {
    form,
    validationIssues,
    setServerErrors: setFormServerErrors,
    clearErrors,
  } = useAddClientForm({
    defaultValues,
    existingClients,
    excludeClientId,
  });

  const { register, handleSubmit, setValue, watch, formState } = form;

  // Watch only specific fields that need reactive updates (optimization)
  // This reduces re-renders significantly compared to watch() without arguments
  const businessType = watch('businessType');
  const phone = watch('phone');
  const country = watch('country');
  const county = watch('county');
  const farmType = watch('farmType');
  const contactRole = watch('contactRole');
  const leadConsultant = watch('leadConsultant');
  const tags = watch('tags');

  // Sync server errors with form errors
  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      setFormServerErrors(serverErrors);
    } else {
      clearErrors();
    }
  }, [serverErrors, setFormServerErrors, clearErrors]);

  // Expose submit function via ref
  useEffect(() => {
    if (formSubmitRef) {
      formSubmitRef.current = () => {
        handleSubmit(onSubmit)();
      };
    }
  }, [handleSubmit, onSubmit, formSubmitRef]);

  const getFieldError = (fieldName: string): string | undefined => {
    // Priority: form error (includes server errors set via setError) > server errors > validation warnings
    const formError =
      formState.errors[fieldName as keyof typeof formState.errors]?.message;
    if (formError) return String(formError);

    // Fallback to server errors (for cases not yet synced)
    const serverError = serverErrors[fieldName];
    if (serverError) return serverError;

    // Show warnings only if no errors
    const validationWarning = validationIssues.find(
      (issue) => issue.field === fieldName && issue.type === 'warning'
    );
    return validationWarning?.message;
  };

  const getValidationMessage = (field: string) => {
    return validationIssues.find((i) => i.field === field);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {mode === 'add' && (
          <FormField
            label="Please select your business type"
            required
            error={getFieldError('businessType')}
          >
            <div className="relative">
              <Radio
                name="businessType"
                options={businessTypeOptions}
                value={businessType || ''}
                onChange={(value) => {
                  setValue('businessType', value, { shouldValidate: false });
                  onFieldBlur?.('businessType');
                }}
                layout="two-columns"
                className="!mb-0"
              />
            </div>
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="First name"
            required
            error={getFieldError('firstName')}
            onFieldBlur={onFieldBlur}
            {...register('firstName')}
            placeholder="Enter first name"
          />

          <FormInput
            label="Last name"
            required
            error={getFieldError('lastName')}
            onFieldBlur={onFieldBlur}
            {...register('lastName')}
            placeholder="Enter last name"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Email"
            required
            error={getFieldError('email')}
            validationError={getValidationMessage('email')}
            type="email"
            onFieldBlur={onFieldBlur}
            {...register('email', {
              onChange: (e) => {
                const value = e.target.value.toLowerCase();
                e.target.value = value;
                setValue('email', value, { shouldValidate: false });
              },
              onBlur: () => {
                form.trigger('email');
              },
            })}
            placeholder="Enter email"
          />

          <FormField
            label="Phone number"
            required
            warning={
              getValidationMessage('phone')?.type === 'warning'
                ? getValidationMessage('phone')?.message
                : undefined
            }
          >
            <PhoneInput
              value={phone || ''}
              onChange={(value) =>
                setValue('phone', value, { shouldValidate: false })
              }
              onBlur={() => {
                onFieldBlur?.('phone');
                form.trigger('phone');
              }}
              placeholder="Enter phone number"
              error={getFieldError('phone')}
              required={true}
              warning={
                getValidationMessage('phone')?.type === 'warning'
                  ? getValidationMessage('phone')?.message
                  : undefined
              }
              defaultCountry="ie"
              className="rounded-lg"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Business name"
            required
            error={getFieldError('businessName')}
            onFieldBlur={onFieldBlur}
            {...register('businessName')}
            placeholder="Enter your business name"
          />

          <FormField label="Farm Type">
            <CustomSelect
              options={farmTypeOptions}
              value={farmType?.[0] || ''}
              onValueChange={(value) =>
                setValue('farmType', value ? [value] : [], {
                  shouldValidate: false,
                })
              }
              placeholder="Select Type"
              triggerClassName={`${inputStyles.base}`}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Contact name"
            error={getFieldError('contactName')}
            onFieldBlur={onFieldBlur}
            {...register('contactName')}
            placeholder="Enter contact name"
          />

          <FormField label="Contact role">
            <CustomSelect
              options={contactRoleOptions}
              value={contactRole || ''}
              onValueChange={(value) => setValue('contactRole', value)}
              placeholder="Select contact role"
              triggerClassName={`${inputStyles.base}`}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Address line 1"
            required
            error={getFieldError('addressLine1')}
            onFieldBlur={onFieldBlur}
            {...register('addressLine1')}
            placeholder="Enter address line 1"
          />

          <FormInput
            label="Address line 2"
            error={getFieldError('addressLine2')}
            onFieldBlur={onFieldBlur}
            {...register('addressLine2')}
            placeholder="Enter address line 2"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Country">
            <CountrySelect
              value={country || 'Ireland'}
              onChange={(value) => {
                setValue('country', value);
              }}
              placeholder="Select country"
              className={`${inputStyles.base}`}
            />
          </FormField>

          <FormInput
            label={getPostalCodeLabel(country || 'Ireland')}
            error={getFieldError('eircode')}
            onFieldBlur={onFieldBlur}
            {...register('eircode')}
            placeholder={getPostalCodePlaceholder(country || 'Ireland')}
          />
        </div>

        <FormField label={getRegionLabel(country || 'Ireland')}>
          <RegionSelect
            value={county || ''}
            onChange={(value) => setValue('county', value)}
            country={country || 'Ireland'}
            placeholder={`Select ${getRegionLabel(
              country || 'Ireland'
            ).toLowerCase()}`}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Account No"
            error={getFieldError('accountNo')}
            validationError={getValidationMessage('accountNo')}
            onFieldBlur={onFieldBlur}
            {...register('accountNo')}
            placeholder="Enter account no"
          />

          <FormInput
            label="Herd No"
            error={getFieldError('herdNo')}
            validationError={getValidationMessage('herdNo')}
            onFieldBlur={onFieldBlur}
            {...register('herdNo')}
            placeholder="Enter herd no"
          />
        </div>

        <FormField label="Lead consultant">
          <div className="h-9">
            <UserSelect
              options={consultantOptions}
              value={leadConsultant || ''}
              onChange={(value) => setValue('leadConsultant', value)}
              placeholder="Select lead consultant"
              triggerClassName="w-full"
            />
          </div>
        </FormField>

        {mode === 'edit' && (
          <FormField label="Tags">
            <MultiSelect
              options={tagOptions}
              values={tags || []}
              onChange={(values) => setValue('tags', values)}
              placeholder="Select tags"
              className="w-full"
            />
          </FormField>
        )}

        {serverErrors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <Icon icon="error" className="text-red-500 mr-2" />
              <span className="text-red-700 text-sm">
                {serverErrors.general}
              </span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
