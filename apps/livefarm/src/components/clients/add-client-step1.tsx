'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  CustomSelect,
  UserSelect,
  clientFormSchema,
  type ClientFormData,
  checkDuplicateClient,
  type ExistingClient,
  FormField,
  Radio,
  PhoneInput,
  CountrySelect,
  RegionSelect,
  getPostalCodeLabel,
  getRegionLabel,
  mockClients,
  farmTypeOptions,
  consultantOptions,
  businessTypeOptions,
  contactRoleOptions,
  MultiSelect,
  Icon,
} from '@@agrosphere/shared';

export interface AddClientStep1Props {
  clientData: ClientFormData;
  onClientDataChange: (data: ClientFormData) => void;
  onAddClient: (inviteClient: boolean) => void;
  existingClients?: ExistingClient[];
  errors?: Record<string, string>;
  serverErrors?: Record<string, string>;
  canProceed?: boolean;
  onFieldTouch?: (fieldName: string) => void;
  onClearErrors?: () => void;
  onClearTouchedFields?: () => void;
  loading?: boolean;
  createError?: string | null;
  mode?: 'add' | 'edit';
  excludeClientId?: string;
}

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

const FormInput = ({
  label,
  required = false,
  error,
  validationError,
  onFieldTouch,
  ...inputProps
}: {
  label: string;
  required?: boolean;
  error?: string;
  validationError?: { type?: string; message?: string };
  onFieldTouch?: (fieldName: string) => void;
} & React.ComponentProps<typeof Input>) => {
  const hasError = error || validationError?.type === 'error';

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFieldTouch && inputProps.name) {
      onFieldTouch(inputProps.name);
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

export function AddClientStep1({
  clientData,
  onClientDataChange,
  onAddClient,
  existingClients = mockClients as ExistingClient[],
  errors = {},
  serverErrors = {},
  canProceed = false,
  onFieldTouch,
  onClearErrors,
  onClearTouchedFields,
  loading = false,
  createError,
  mode = 'add',
  excludeClientId,
}: AddClientStep1Props) {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleFieldTouch = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    onFieldTouch?.(fieldName);
  };

  useEffect(() => {
    if (Object.keys(serverErrors).length > 0 && onClearErrors) {
      onClearErrors();
    }
  }, [serverErrors, onClearErrors]);

  useEffect(() => {
    if (onClearTouchedFields) {
      onClearTouchedFields();
    }
  }, [onClearTouchedFields]);

  const getFieldError = (
    serverError: string | undefined,
    localError: string | undefined,
    clientError: string | undefined,
    fieldName?: string
  ) => {
    const hasServerErrors = Object.keys(serverErrors).length > 0;
    let result: string | undefined;

    if (serverError) {
      result = serverError;
    } else if (!hasServerErrors) {
      result = localError || clientError;
    } else {
      result = undefined;
    }

    return result;
  };

  const { register, handleSubmit, setValue, watch } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: clientData,
    mode: 'onChange',
  });

  const watchedValues = watch();
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim();

    setValue('businessName', fullName, { shouldValidate: true });
    setValue('contactName', fullName, { shouldValidate: true });
  }, [firstName, lastName, setValue]);

  const handleClientDataChange = useCallback(
    (data: ClientFormData) => {
      onClientDataChange(data);
    },
    [onClientDataChange]
  );

  const lastReportedValues = useRef<ClientFormData>(watchedValues);

  useEffect(() => {
    if (
      JSON.stringify(watchedValues) !==
      JSON.stringify(lastReportedValues.current)
    ) {
      lastReportedValues.current = watchedValues;
      handleClientDataChange(watchedValues);
    }
  }, [watchedValues, handleClientDataChange]);

  const validationIssues = useMemo(() => {
    return checkDuplicateClient(
      watchedValues,
      existingClients,
      excludeClientId
    );
  }, [watchedValues, existingClients, excludeClientId]);

  const getValidationMessage = (field: string) => {
    return validationIssues.find((i) => i.field === field);
  };

  const hasCriticalErrors = useMemo(() => {
    const criticalFields = ['email', 'accountNo', 'herdNo', 'phone'];
    return validationIssues.some(
      (issue) => issue.type === 'error' && criticalFields.includes(issue.field)
    );
  }, [validationIssues]);

  const hasRequiredFieldErrors = useMemo(() => {
    const requiredFields = [
      'firstName',
      'lastName',
      'businessType',
      'businessName',
      'email',
      'phone',
      'addressLine1',
    ];
    return requiredFields.some((field) => {
      const value = watchedValues[field as keyof ClientFormData];
      return !value || (typeof value === 'string' && !value.trim());
    });
  }, [watchedValues]);

  const localErrors = useMemo(() => {
    const localErrorMessages: Record<string, string> = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'businessType',
      'businessName',
      'email',
      'phone',
      'addressLine1',
    ];

    requiredFields.forEach((field) => {
      if (touchedFields.has(field)) {
        const value = watchedValues[field as keyof ClientFormData];
        if (!value || (typeof value === 'string' && !value.trim())) {
          switch (field) {
            case 'firstName':
              localErrorMessages.firstName = 'First name is required';
              break;
            case 'lastName':
              localErrorMessages.lastName = 'Last name is required';
              break;
            case 'businessType':
              localErrorMessages.businessType = 'Business type is required';
              break;
            case 'businessName':
              localErrorMessages.businessName = 'Business name is required';
              break;
            case 'email':
              localErrorMessages.email = 'Email is required';
              break;
            case 'phone':
              localErrorMessages.phone = 'Phone number is required';
              break;
            case 'addressLine1':
              localErrorMessages.addressLine1 = 'Address line 1 is required';
              break;
          }
        }
      }
    });

    return localErrorMessages;
  }, [touchedFields, watchedValues]);

  const validateAndProceed = (inviteClient: boolean) => {
    if (hasCriticalErrors) {
      alert('Please fix the validation errors before proceeding!');
      return;
    }
    if (hasRequiredFieldErrors) {
      alert('Please fill in all required fields before proceeding!');
      return;
    }
    onAddClient(inviteClient);
  };

  const onSubmit = (data: ClientFormData) => {
    validateAndProceed(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {mode === 'add' && (
          <FormField
            label="Please select your business type"
            required
            error={getFieldError(
              serverErrors.businessType,
              localErrors.businessType,
              errors.businessType,
              'businessType'
            )}
          >
            <div className="relative">
              <Radio
                name="businessType"
                options={businessTypeOptions}
                value={watchedValues.businessType || ''}
                onChange={(value) => {
                  setValue('businessType', value);
                  handleFieldTouch('businessType');
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
            error={getFieldError(
              serverErrors.firstName,
              localErrors.firstName,
              errors.firstName,
              'firstName'
            )}
            onFieldTouch={handleFieldTouch}
            {...register('firstName')}
            placeholder="Enter first name"
          />

          <FormInput
            label="Last name"
            required
            error={getFieldError(
              serverErrors.lastName,
              localErrors.lastName,
              errors.lastName
            )}
            onFieldTouch={handleFieldTouch}
            {...register('lastName')}
            placeholder="Enter last name"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Email"
            required
            error={getFieldError(
              serverErrors.email,
              localErrors.email,
              errors.email,
              'email'
            )}
            validationError={getValidationMessage('email')}
            type="email"
            onFieldTouch={handleFieldTouch}
            {...register('email', {
              onChange: (e) => {
                const value = e.target.value.toLowerCase();
                e.target.value = value;
                setValue('email', value);
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
              value={watchedValues.phone || ''}
              onChange={(value) => setValue('phone', value)}
              onBlur={() => handleFieldTouch('phone')}
              placeholder="Enter phone number"
              error={getFieldError(
                serverErrors.phone,
                localErrors.phone,
                errors.phone,
                'phone'
              )}
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
            error={getFieldError(
              serverErrors.businessName,
              localErrors.businessName,
              errors.businessName
            )}
            onFieldTouch={handleFieldTouch}
            {...register('businessName')}
            placeholder="Enter your business name"
          />

          <FormField label="Farm Type">
            <CustomSelect
              options={farmTypeOptions}
              value={watchedValues.farmType?.[0] || ''}
              onValueChange={(value) =>
                setValue('farmType', value ? [value] : [])
              }
              placeholder="Select Type"
              triggerClassName={`${inputStyles.base}`}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Contact name"
            error={getFieldError(
              serverErrors.contactName,
              undefined,
              errors.contactName
            )}
            onFieldTouch={handleFieldTouch}
            {...register('contactName')}
            placeholder="Enter contact name"
          />

          <FormField label="Contact role">
            <CustomSelect
              options={contactRoleOptions}
              value={watchedValues.contactRole || ''}
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
            error={getFieldError(
              serverErrors.addressLine1,
              localErrors.addressLine1,
              errors.addressLine1
            )}
            onFieldTouch={handleFieldTouch}
            {...register('addressLine1')}
            placeholder="Enter address line 1"
          />

          <FormInput
            label="Address line 2"
            error={getFieldError(
              serverErrors.addressLine2,
              undefined,
              errors.addressLine2
            )}
            onFieldTouch={handleFieldTouch}
            {...register('addressLine2')}
            placeholder="Enter address line 2"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Country">
            <CountrySelect
              value={watchedValues.country || 'Ireland'}
              onChange={(value) => {
                setValue('country', value);
              }}
              placeholder="Select country"
              className={`${inputStyles.base}`}
            />
          </FormField>

          <FormInput
            label={getPostalCodeLabel(watchedValues.country || 'Ireland')}
            error={getFieldError(
              serverErrors.eircode,
              undefined,
              errors.eircode
            )}
            onFieldTouch={handleFieldTouch}
            {...register('eircode')}
            placeholder={getPostalCodePlaceholder(
              watchedValues.country || 'Ireland'
            )}
          />
        </div>

        <FormField label={getRegionLabel(watchedValues.country || 'Ireland')}>
          <RegionSelect
            value={watchedValues.county || ''}
            onChange={(value) => setValue('county', value)}
            country={watchedValues.country || 'Ireland'}
            placeholder={`Select ${getRegionLabel(
              watchedValues.country || 'Ireland'
            ).toLowerCase()}`}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Account No"
            error={getFieldError(
              serverErrors.accountNo,
              undefined,
              errors.accountNo
            )}
            validationError={getValidationMessage('accountNo')}
            onFieldTouch={handleFieldTouch}
            {...register('accountNo')}
            placeholder="Enter account no"
          />

          <FormInput
            label="Herd No"
            error={getFieldError(serverErrors.herdNo, undefined, errors.herdNo)}
            validationError={getValidationMessage('herdNo')}
            onFieldTouch={handleFieldTouch}
            {...register('herdNo')}
            placeholder="Enter herd no"
          />
        </div>

        <FormField label="Lead consultant">
          <div className="h-9">
            <UserSelect
              options={consultantOptions}
              value={watchedValues.leadConsultant || ''}
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
              values={watchedValues.tags || []}
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
