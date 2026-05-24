'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import {
  type ClientFormData,
  type ExistingClient,
  type ClientData,
  checkDuplicateClient,
  mockClients,
  useCreateClient,
  useUpdateClient,
  Button,
  type Client,
  Icon,
  ClientService,
} from '@@agrosphere/shared';
import { AddClientStep1 } from './add-client-step1';
import { Toggle } from '@@agrosphere/shared';

const dialogVariants = cva(
  'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
  {
    variants: {
      mode: {
        add: '',
        edit: '',
      },
    },
    defaultVariants: {
      mode: 'add',
    },
  }
);

const titleVariants = cva('text-xl font-bold text-gray-900', {
  variants: {
    mode: {
      add: '',
      edit: '',
    },
  },
  defaultVariants: {
    mode: 'add',
  },
});

const iconVariants = cva('material-symbols-outlined text-green-600 text-2xl', {
  variants: {
    mode: {
      add: 'text-green-600',
      edit: 'text-blue-600',
    },
  },
  defaultVariants: {
    mode: 'add',
  },
});

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (clientData: ClientFormData, inviteClient: boolean) => void;
  mode?: 'add' | 'edit';
  clientData?: ClientData;
  onClientUpdated?: (updatedClient: Client) => void;
  updateClientState?: (clientData: Partial<ClientData>) => void;
}

export function AddClientDialog({
  isOpen,
  onClose,
  onAddClient,
  mode = 'add',
  clientData: existingClientData,
  onClientUpdated,
  updateClientState,
}: AddClientDialogProps) {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const rewriteErrorMessage = (message: string): string => {
    if (
      message.includes(
        'A client with this email is already exists in your clients list'
      )
    ) {
      return 'Client with this email already exists';
    }
    if (
      message.includes('Mobile number must be a valid Irish or UK phone number')
    ) {
      return 'Invalid UK/IE phone number';
    }
    return message;
  };
  const { loading: createLoading, error: createError } = useCreateClient();

  const {
    updateClient,
    loading: updateLoading,
    error: updateError,
  } = useUpdateClient();
  const [clientData, setClientData] = useState<ClientFormData>(() => {
    if (mode === 'edit' && existingClientData) {
      return {
        firstName: existingClientData.first_name || '',
        lastName: existingClientData.last_name || '',
        businessType: existingClientData.business_type || 'farmer',
        businessName: existingClientData.business_name || '',
        email: existingClientData.email || '',
        phone: existingClientData.mobile || '',
        contactName: existingClientData.contact_name || '',
        contactRole: existingClientData.contact_role || '',
        address: existingClientData.full_address || '',
        addressLine1: existingClientData.addressLine1 || '',
        addressLine2: existingClientData.addressLine2 || '',
        city: existingClientData.city || '',
        county: existingClientData.county || '',
        country: existingClientData.country || 'Ireland',
        eircode: existingClientData.eircode || '',
        accountNo: existingClientData.account_number || '',
        accountNo2: '',
        leadConsultant: '',
        farmType: existingClientData.farmType
          ? [existingClientData.farmType]
          : [],
        herdNo: existingClientData.herdNo || '',
        tags: existingClientData.tags || [],
      };
    }
    return {
      firstName: '',
      lastName: '',
      businessType: 'farmer',
      businessName: '',
      email: '',
      phone: '',
      contactName: '',
      contactRole: '',
      address: '',
      addressLine1: '',
      country: 'Ireland',
      eircode: '',
      accountNo: '',
      accountNo2: '',
      leadConsultant: '',
      farmType: [],
      herdNo: '',
    };
  });
  const [sendInvitation, setSendInvitation] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && existingClientData) {
      setClientData({
        firstName: existingClientData.first_name || '',
        lastName: existingClientData.last_name || '',
        businessType: existingClientData.business_type || 'farmer',
        businessName: existingClientData.business_name || '',
        email: existingClientData.email || '',
        phone: existingClientData.mobile || '',
        contactName: existingClientData.contact_name || '',
        contactRole: existingClientData.contact_role || '',
        address: existingClientData.full_address || '',
        addressLine1: existingClientData.addressLine1 || '',
        addressLine2: existingClientData.addressLine2 || '',
        city: existingClientData.city || '',
        county: existingClientData.county || '',
        country: existingClientData.country || 'Ireland',
        eircode: existingClientData.eircode || '',
        accountNo: existingClientData.account_number || '',
        accountNo2: '',
        leadConsultant: '',
        farmType: existingClientData.farmType
          ? [existingClientData.farmType]
          : [],
        herdNo: existingClientData.herdNo || '',
        tags: existingClientData.tags || [],
      });
    }
  }, [existingClientData, mode]);

  const markFieldAsTouched = useCallback((fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  }, []);

  const handleClearErrors = useCallback(() => {
    setTouchedFields(new Set());
  }, []);

  const handleClearTouchedFields = useCallback(() => {
    setTouchedFields(new Set());
  }, []);

  const transformToCreateRequest = (data: ClientFormData) => {
    return {
      business_name: data.businessName || '',
      business_type: data.businessType || 'farmer',
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      mobile: data.phone || '',
      email: data.email?.toLowerCase() || '',
      address_line_1: data.addressLine1 || '',
      address_line_2: data.addressLine2 || '',
      city: data.city || '',
      county: data.county || '',
      country: data.country || 'Ireland',
      eircode: data.eircode || '',
      contact_name: data.contactName || '',
      contact_role: data.contactRole || undefined,
      account_number: data.accountNo || undefined,
      derogation: false,
      farm_type: data.farmType?.[0] || undefined,
      herd_no: data.herdNo || undefined,
      organic: false,
    };
  };

  const errors = useMemo(() => {
    const validationIssues = checkDuplicateClient(
      clientData,
      mockClients as unknown as ExistingClient[],
      mode === 'edit' ? existingClientData?.id : undefined
    );
    const formErrors: Record<string, string> = {};

    if (touchedFields.has('firstName') && !clientData.firstName?.trim()) {
      formErrors.firstName = 'First name is required';
    }
    if (touchedFields.has('lastName') && !clientData.lastName?.trim()) {
      formErrors.lastName = 'Last name is required';
    }
    if (touchedFields.has('businessType') && !clientData.businessType?.trim()) {
      formErrors.businessType = 'Business type is required';
    }
    if (touchedFields.has('businessName') && !clientData.businessName?.trim()) {
      formErrors.businessName = 'Business name is required';
    }
    if (touchedFields.has('email') && !clientData.email?.trim()) {
      formErrors.email = 'Email is required';
    } else if (
      touchedFields.has('email') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)
    ) {
      formErrors.email = 'Please enter a valid email address';
    }
    if (touchedFields.has('phone') && !clientData.phone?.trim()) {
      formErrors.phone = 'Phone number is required';
    }
    if (touchedFields.has('addressLine1') && !clientData.addressLine1?.trim()) {
      formErrors.addressLine1 = 'Address line 1 is required';
    }

    validationIssues.forEach((issue) => {
      if (issue.type === 'error' && touchedFields.has(issue.field)) {
        formErrors[issue.field] = issue.message;
      }
    });

    return formErrors;
  }, [clientData, touchedFields, mode, existingClientData?.id]);

  const canProceedToNextStep = useMemo(() => {
    const requiredFields = [
      'firstName',
      'lastName',
      'businessType',
      'businessName',
      'email',
      'phone',
      'addressLine1',
    ];
    const hasRequiredFields = requiredFields.every((field) =>
      clientData[field as keyof ClientFormData]?.toString().trim()
    );
    const hasNoErrors = requiredFields.every((field) => !errors[field]);
    return hasRequiredFields && hasNoErrors;
  }, [clientData, errors]);

  const handleClose = () => {
    setTouchedFields(new Set());
    if (mode === 'edit' && existingClientData) {
      setClientData({
        firstName: existingClientData.first_name || '',
        lastName: existingClientData.last_name || '',
        businessType: existingClientData.business_type || 'farmer',
        businessName: existingClientData.business_name || '',
        email: existingClientData.email || '',
        phone: existingClientData.mobile || '',
        contactName: existingClientData.contact_name || '',
        contactRole: existingClientData.contact_role || '',
        address: existingClientData.full_address || '',
        addressLine1: existingClientData.addressLine1 || '',
        addressLine2: existingClientData.addressLine2 || '',
        city: existingClientData.city || '',
        county: existingClientData.county || '',
        country: existingClientData.country || 'Ireland',
        eircode: existingClientData.eircode || '',
        accountNo: existingClientData.account_number || '',
        accountNo2: '',
        leadConsultant: '',
        farmType: existingClientData.farmType
          ? [existingClientData.farmType]
          : [],
        herdNo: existingClientData.herdNo || '',
        tags: existingClientData.tags || [],
      });
    } else {
      setClientData({
        firstName: '',
        lastName: '',
        businessType: 'farmer',
        businessName: '',
        email: '',
        phone: '',
        contactName: '',
        contactRole: '',
        address: '',
        addressLine1: '',
        country: 'Ireland',
        eircode: '',
        accountNo: '',
        accountNo2: '',
        leadConsultant: '',
        farmType: [],
        herdNo: '',
      });
    }
    onClose();
  };

  const handleAddClientClick = async (inviteClient = false) => {
    if (canProceedToNextStep) {
      try {
        setServerErrors({});

        if (mode === 'edit' && existingClientData) {
          if (updateClientState) {
            const fullName =
              `${clientData.firstName} ${clientData.lastName}`.trim();
            const fullAddress = [
              clientData.addressLine1,
              clientData.addressLine2,
              clientData.city,
              clientData.county,
              clientData.country,
              clientData.eircode,
            ]
              .filter(Boolean)
              .join(', ');

            updateClientState({
              first_name: clientData.firstName,
              last_name: clientData.lastName,
              full_name: fullName,
              business_name: clientData.businessName,
              business_type: clientData.businessType,
              email: clientData.email,
              mobile: clientData.phone,
              phone: clientData.phone,
              contact_name: clientData.contactName,
              contact_role: clientData.contactRole,
              address: fullAddress,
              addressLine1: clientData.addressLine1,
              addressLine2: clientData.addressLine2,
              city: clientData.city,
              county: clientData.county,
              country: clientData.country,
              eircode: clientData.eircode,
              account_number: clientData.accountNo,
              farmType: clientData.farmType?.[0],
              herdNo: clientData.herdNo,
              tags: clientData.tags,
            });
          }

          const updateRequest = transformToCreateRequest(clientData);
          await updateClient(existingClientData.id, updateRequest);
          onAddClient(clientData, inviteClient);
          setServerErrors({});
        } else {
          const createRequest = transformToCreateRequest(clientData);

          try {
            await ClientService.createClient(createRequest);

            onAddClient(clientData, inviteClient);
            setClientData({
              firstName: '',
              lastName: '',
              businessType: 'farmer',
              businessName: '',
              email: '',
              phone: '',
              contactName: '',
              contactRole: '',
              address: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              county: '',
              country: 'Ireland',
              eircode: '',
              accountNo: '',
              accountNo2: '',
              leadConsultant: '',
              farmType: [],
              herdNo: '',
              tags: [],
            });
            setServerErrors({});
            setTouchedFields(new Set());
          } catch (createError) {
            if (
              createError &&
              typeof createError === 'object' &&
              'response' in createError
            ) {
              const axiosError = createError as {
                response?: { data?: unknown };
              };
              const errorData = axiosError.response?.data;

              if (
                errorData &&
                typeof errorData === 'object' &&
                'errors' in errorData
              ) {
                const errorObj = errorData as {
                  errors: Record<string, string[]>;
                };
                const fieldMapping: Record<string, string> = {
                  mobile: 'phone',
                  email: 'email',
                  firstName: 'firstName',
                  lastName: 'lastName',
                  businessName: 'businessName',
                  addressLine1: 'addressLine1',
                  addressLine2: 'addressLine2',
                  city: 'city',
                  county: 'county',
                  country: 'country',
                  eircode: 'eircode',
                  accountNo: 'accountNo',
                  herdNo: 'herdNo',
                };

                const serverErrors: Record<string, string> = {};
                Object.keys(errorObj.errors).forEach((field) => {
                  const fieldErrors = errorObj.errors[field];
                  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    const formField = fieldMapping[field] || field;
                    let errorMessage = fieldErrors[0];

                    errorMessage = rewriteErrorMessage(errorMessage);

                    serverErrors[formField] = errorMessage;
                  }
                });

                setServerErrors(serverErrors);
                return;
              }
            }

            setServerErrors({
              general: 'An error occurred while creating the client',
            });
            return;
          }
        }
      } catch (error: unknown) {
        const serverErrors: Record<string, string> = {};
        let generalMessage = '';

        if (error && typeof error === 'object') {
          let errorData: unknown = null;

          if ('response' in error && error.response) {
            errorData = (error as { response: { data: unknown } }).response
              .data;
          } else if ('errors' in error || 'message' in error) {
            errorData = error;
          } else {
            errorData = error;
          }

          if (errorData && typeof errorData === 'object') {
            const errorObj = errorData as {
              errors?: Record<string, string[]>;
              message?: string;
            };

            if (errorObj.errors && typeof errorObj.errors === 'object') {
              const fieldMapping: Record<string, string> = {
                mobile: 'phone',
                email: 'email',
                firstName: 'firstName',
                lastName: 'lastName',
                businessName: 'businessName',
                addressLine1: 'addressLine1',
                addressLine2: 'addressLine2',
                city: 'city',
                county: 'county',
                country: 'country',
                eircode: 'eircode',
                accountNo: 'accountNo',
                herdNo: 'herdNo',
              };

              Object.keys(errorObj.errors).forEach((field) => {
                const fieldErrors = errorObj.errors?.[field];
                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                  const formField = fieldMapping[field] || field;
                  serverErrors[formField] = fieldErrors[0];
                }
              });
            } else {
              return;
            }

            if (errorObj.message) {
              generalMessage = errorObj.message;

              generalMessage = rewriteErrorMessage(generalMessage);
            }
          }
        }

        if (Object.keys(serverErrors).length > 0 || generalMessage) {
          const finalErrors = {
            ...serverErrors,
            ...(generalMessage && { general: generalMessage }),
          };
          setServerErrors(finalErrors);
        } else {
          setServerErrors({
            general: 'An error occurred while saving the client',
          });
        }
      }
    }
  };

  const renderForm = () => {
    return (
      <AddClientStep1
        clientData={clientData}
        onClientDataChange={setClientData}
        onAddClient={handleAddClientClick}
        errors={errors}
        serverErrors={serverErrors}
        canProceed={canProceedToNextStep}
        onFieldTouch={markFieldAsTouched}
        onClearErrors={handleClearErrors}
        onClearTouchedFields={handleClearTouchedFields}
        loading={mode === 'edit' ? updateLoading : createLoading}
        createError={mode === 'edit' ? updateError : createError}
        mode={mode}
        excludeClientId={mode === 'edit' ? existingClientData?.id : undefined}
      />
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={dialogVariants({ mode })} onClick={handleClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={iconVariants({ mode })}>
                {mode === 'add' ? 'person_add' : 'edit'}
              </span>
              <h2 className={titleVariants({ mode })}>
                {mode === 'add' ? 'Add client' : 'Edit client'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="close" className="text-xl" />
            </button>
          </div>

          {renderForm()}
        </div>

        <div className="border-t border-basic-white p-5">
          <div className="space-y-5">
            {mode === 'add' && (
              <div className="flex items-center gap-3">
                <Toggle
                  checked={sendInvitation}
                  onCheckedChange={setSendInvitation}
                />
                <span className="text-sm text-gray-700">
                  Send the client an email invitation to join the platform.
                </span>
              </div>
            )}

            <div className="flex gap-4">
              {mode === 'add' ? (
                <>
                  <Button
                    type="button"
                    variant="complete"
                    size="md"
                    className="flex-1"
                    disabled={!canProceedToNextStep}
                    onClick={() => handleAddClientClick(sendInvitation)}
                  >
                    Add client
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="complete"
                  size="md"
                  className="w-full"
                  disabled={!canProceedToNextStep || updateLoading}
                  onClick={() => handleAddClientClick(false)}
                >
                  {updateLoading ? 'Saving...' : 'Save changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
