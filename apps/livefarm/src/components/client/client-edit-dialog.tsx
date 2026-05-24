'use client';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  type ClientData,
  Input,
  CustomSelect,
  UserSelect,
  PhoneInput,
  CountrySelect,
  RegionSelect,
  FormField,
  Button,
  CreatableMultiSelect,
  getPostalCodeLabel,
  farmTypeOptions,
  consultantOptions,
  contactRoleOptions,
  useUpdateClient,
} from '@@agrosphere/shared';

interface ClientEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<ClientData>) => void;
  client: ClientData;
}

const inputStyles = {
  base: 'w-full h-9 border border-basic-white rounded-lg focus:border-basic-green focus:outline-none transition-colors',
  error: 'border-basic-red focus:border-basic-red',
};

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

export function ClientEditDialog({
  isOpen,
  onClose,
  onSave,
  client,
}: ClientEditDialogProps) {
  const [formData, setFormData] = useState({
    firstName: client.name?.split(' ')[0] || '',
    lastName: client.name?.split(' ').slice(1).join(' ') || '',
    email: client.email || '',
    phone: client.phone || '',
    addressLine1: client.address || '',
    addressLine2: '',
    city: '',
    county: '',
    country: 'Ireland',
    eircode: '',
    farmType: client.farmType || '',
    herdNo: client.herdNo || '',
    assignedConsultant: client.assignedConsultant || '',
    tags: client.tags || [],
  });

  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [selectedCountry, setSelectedCountry] = useState('Ireland');
  const [contactRole, setContactRole] = useState('');

  const {
    updateClient,
    loading: updateLoading,
    error: updateError,
  } = useUpdateClient();

  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  const updateField = (
    field: keyof typeof formData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const errors = useMemo(() => {
    const formErrors: Record<string, string> = {};

    if (touchedFields.has('firstName') && !formData.firstName?.trim()) {
      formErrors.firstName = 'First name is required';
    }
    if (touchedFields.has('lastName') && !formData.lastName?.trim()) {
      formErrors.lastName = 'Last name is required';
    }
    if (touchedFields.has('email') && !formData.email?.trim()) {
      formErrors.email = 'Email is required';
    } else if (
      touchedFields.has('email') &&
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      formErrors.email = 'Please enter a valid email address';
    }
    if (touchedFields.has('phone') && !formData.phone?.trim()) {
      formErrors.phone = 'Phone number is required';
    }
    if (touchedFields.has('addressLine1') && !formData.addressLine1?.trim()) {
      formErrors.addressLine1 = 'Address line 1 is required';
    }

    return formErrors;
  }, [formData, touchedFields]);

  const canSave = useMemo(() => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'addressLine1',
    ];
    const hasRequiredFields = requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData]?.toString().trim();
      return value;
    });
    const hasNoErrors = requiredFields.every((field) => !errors[field]);
    return hasRequiredFields && hasNoErrors;
  }, [formData, errors]);

  const handleClose = () => {
    setTouchedFields(new Set());
    onClose();
  };

  const handleSave = async () => {
    if (canSave) {
      try {
        const updateData = {
          first_name: formData.firstName || '',
          last_name: formData.lastName || '',
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email || '',
          mobile: formData.phone || '',
          address_line_1: formData.addressLine1 || '',
          address_line_2: formData.addressLine2 || '',
          city: formData.city || '',
          county: formData.county || '',
          country: formData.country || '',
          eircode: formData.eircode || '',
          contact_name: `${formData.firstName} ${formData.lastName}`.trim(),
          contact_role: contactRole || null,
          account_number: client.id || '',
          farm_type: formData.farmType || '',
          herd_no: formData.herdNo || '',
        };

        await updateClient(client.id, updateData);

        toast.success('Client updated successfully!');

        const updatedClientData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          address: formData.addressLine1,
          herdNo: formData.herdNo,
          assignedConsultant: formData.assignedConsultant,
          tags: formData.tags,
        };

        onSave(updatedClientData);
        handleClose();
      } catch {
        toast.error('Failed to update client. Please try again.');
      }
    }
  };

  const renderFormField = (
    label: string,
    type: 'input' | 'select' | 'phone' | 'userSelect' | 'country' | 'region',
    value: string,
    onChange: (value: string) => void,
    options?: Array<{ value: string; label: string }>,
    placeholder?: string,
    required = false
  ) => {
    const fieldName = label.toLowerCase().replace(/\s+/g, '');
    const hasError = errors[fieldName];

    const commonProps = {
      className: `${inputStyles.base} ${hasError ? inputStyles.error : ''}`,
    };

    const renderInput = () => {
      switch (type) {
        case 'input':
          return (
            <Input
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              placeholder={placeholder}
              onBlur={() => markFieldAsTouched(fieldName)}
              {...commonProps}
            />
          );
        case 'phone':
          return (
            <PhoneInput
              value={value}
              onChange={onChange}
              onBlur={() => markFieldAsTouched(fieldName)}
              placeholder={placeholder}
              error={hasError}
              defaultCountry="ie"
              className="rounded-lg"
            />
          );
        case 'select':
          return (
            <CustomSelect
              options={options || []}
              value={value}
              onValueChange={onChange}
              placeholder={placeholder}
              triggerClassName={`${inputStyles.base} ${
                hasError ? inputStyles.error : ''
              }`}
            />
          );
        case 'userSelect':
          return (
            <UserSelect
              options={options || []}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              triggerClassName={`${inputStyles.base} ${
                hasError ? inputStyles.error : ''
              }`}
            />
          );
        case 'country':
          return (
            <CountrySelect
              value={value}
              onChange={(newValue) => {
                onChange(newValue);
                setSelectedCountry(newValue);
              }}
              placeholder={placeholder}
              className={`${inputStyles.base} ${
                hasError ? inputStyles.error : ''
              }`}
            />
          );
        case 'region':
          return (
            <RegionSelect
              value={value}
              onChange={onChange}
              country={selectedCountry}
              placeholder={placeholder}
              className={`${inputStyles.base} ${
                hasError ? inputStyles.error : ''
              }`}
            />
          );
        default:
          return null;
      }
    };

    return (
      <FormField label={label} required={required} error={hasError}>
        {renderInput()}
      </FormField>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600 text-2xl">
                groups
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                Client details
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {renderFormField(
                'First name',
                'input',
                formData.firstName || '',
                (value) => updateField('firstName', value),
                undefined,
                'Enter first name',
                true
              )}
              {renderFormField(
                'Last name',
                'input',
                formData.lastName || '',
                (value) => updateField('lastName', value),
                undefined,
                'Enter last name',
                true
              )}

              {renderFormField(
                'Email',
                'input',
                formData.email || '',
                (value) => updateField('email', value),
                undefined,
                'Enter email',
                true
              )}
              {renderFormField(
                'Phone',
                'phone',
                formData.phone || '',
                (value) => updateField('phone', value),
                undefined,
                'Enter phone number',
                true
              )}

              {renderFormField(
                'Contact name',
                'input',
                formData.firstName + ' ' + formData.lastName || '',
                (value) => {
                  const parts = value.split(' ');
                  updateField('firstName', parts[0] || '');
                  updateField('lastName', parts.slice(1).join(' ') || '');
                },
                undefined,
                'Enter contact name'
              )}
              {renderFormField(
                'Contact role',
                'select',
                contactRole,
                setContactRole,
                contactRoleOptions,
                'Enter contact role'
              )}

              {renderFormField(
                'Address line 1',
                'input',
                formData.addressLine1 || '',
                (value) => updateField('addressLine1', value),
                undefined,
                'Enter address line 1',
                true
              )}
              {renderFormField(
                'Address line 2',
                'input',
                formData.addressLine2 || '',
                (value) => updateField('addressLine2', value),
                undefined,
                'Enter address line 2'
              )}

              {renderFormField(
                'Country',
                'country',
                formData.country || 'Ireland',
                (value) => updateField('country', value),
                undefined,
                'Select country'
              )}
              {renderFormField(
                getPostalCodeLabel(selectedCountry),
                'input',
                formData.eircode || '',
                (value) => updateField('eircode', value),
                undefined,
                getPostalCodePlaceholder(selectedCountry)
              )}

              {renderFormField(
                'County',
                'region',
                formData.county || '',
                (value) => updateField('county', value),
                undefined,
                'Select county'
              )}
              {renderFormField(
                'Farm type',
                'select',
                formData.farmType || '',
                (value) => updateField('farmType', value),
                farmTypeOptions,
                'Select farm type'
              )}

              {renderFormField(
                'Account No',
                'input',
                client.id || '',
                (value: string) => {
                  return;
                },
                undefined,
                'Enter account number'
              )}
              {renderFormField(
                'Herd No',
                'input',
                formData.herdNo || '',
                (value) => updateField('herdNo', value),
                undefined,
                'Enter herd number'
              )}

              {renderFormField(
                'Lead consultant',
                'userSelect',
                formData.assignedConsultant || '',
                (value) => updateField('assignedConsultant', value),
                consultantOptions,
                'Select consultant'
              )}
            </div>

            <div className="mt-6">
              <FormField label="Tags">
                <CreatableMultiSelect
                  options={[
                    { value: 'Trial User', label: 'Trial User' },
                    { value: 'Lab Partner', label: 'Lab Partner' },
                    { value: 'New Client', label: 'New Client' },
                    { value: 'Multi-location', label: 'Multi-location' },
                    { value: 'Organic Certified', label: 'Organic Certified' },
                    { value: 'Pilot Program', label: 'Pilot Program' },
                    {
                      value: 'Regenerative Farming',
                      label: 'Regenerative Farming',
                    },
                    { value: 'Health Focus', label: 'Health Focus' },
                    { value: 'Large Fields', label: 'Large Fields' },
                    { value: 'Organic', label: 'Organic' },
                  ]}
                  values={formData.tags}
                  onChange={(values) => updateField('tags', values)}
                  placeholder="Select an option or create one"
                  className="w-full"
                />
              </FormField>
            </div>

            {updateError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  Error updating client: {updateError}
                </p>
              </div>
            )}

            <div className="mt-8">
              <Button
                type="submit"
                variant="complete"
                size="md"
                className="w-full"
                disabled={!canSave || updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
