'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  businessProfileSchema,
  type BusinessProfileFormData,
} from '../types/form';
import {
  useCreateOrganisation,
  type CreateOrganisationRequest,
  type OrganisationType,
  type FarmType,
} from '@@agrosphere/shared';

const mapFarmCategoryToFarmType = (category: string): FarmType | undefined => {
  const mapping: Record<string, FarmType> = {
    Dairy: 'dairy',
    Beef: 'cattle',
    Tillage: 'tillage',
    'Mixed livestock': 'mixed_livestock',
    'Mixed livestock/Cereals': 'mixed_livestock',
    Other: 'cattle_other',
  };
  return mapping[category];
};

const mapBusinessCategoryToOrganisationType = (
  category: string
): OrganisationType => {
  const mapping: Record<string, OrganisationType> = {
    'Advisor/Agronomist': 'advisor',
    Contractor: 'contractor',
    'Agri-Merchant': 'lab',
    'Co-operative': 'lab',
  };
  return mapping[category] || 'advisor';
};

const mapFormDataToApiRequest = (
  data: BusinessProfileFormData
): CreateOrganisationRequest => {
  if (data.userType === 'farmer') {
    return {
      name: data.businessName,
      email: data.email,
      type: 'farmer',
      farm_type: mapFarmCategoryToFarmType(data.farmCategory || ''),
      business_type: data.businessType || undefined,
    };
  } else {
    // agri-business
    return {
      name: data.businessName,
      email: data.email,
      type: mapBusinessCategoryToOrganisationType(data.businessCategory || ''),
      business_type: data.businessType || undefined,
    };
  }
};

export function useBusinessForm() {
  const router = useRouter();
  const createOrganisation = useCreateOrganisation();

  const form = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      userType: 'farmer',
      businessName: '',
      email: '',
      businessType: '',
      farmCategory: '',
      businessCategory: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch, setValue, reset } = form;
  const userType = watch('userType');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const apiRequest = mapFormDataToApiRequest(data);
      await createOrganisation.mutateAsync(apiRequest);
      router.push('/organisation-selection');
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 422 &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'errors' in error.response.data
      ) {
        const apiErrors = (
          error.response.data as { errors: Record<string, string[]> }
        ).errors;
        Object.keys(apiErrors).forEach((key) => {
          const fieldMapping: Record<string, keyof BusinessProfileFormData> = {
            name: 'businessName',
            email: 'email',
            type: 'userType',
            farm_type: 'farmCategory',
            business_type: 'businessType',
          };
          const formField = fieldMapping[key] || key;
          form.setError(formField, {
            message: apiErrors[key][0],
          });
        });
      }
    }
  });

  return {
    form,
    onSubmit,
    isFormValid: formState.isValid,
    errors: formState.errors,
    userType,
    setValue,
    reset,
    isLoading: createOrganisation.isPending,
  };
}
