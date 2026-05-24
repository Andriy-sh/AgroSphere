'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { useCreateFarm } from '@@agrosphere/shared';
import {
  createFarmFormSchema,
  type CreateFarmFormData,
  mapFormDataToApiRequest,
  isValidFormField,
} from './create-farm-form.schema';

export function useCreateFarmForm() {
  const router = useRouter();
  const createFarmMutation = useCreateFarm();

  const form = useForm<CreateFarmFormData>({
    resolver: zodResolver(createFarmFormSchema),
    defaultValues: {
      name: '',
      farmLocation: undefined,
    },
    mode: 'onChange',
  });

  const { handleSubmit, setValue, setError, watch } = form;

  const farmName = watch('name');
  const farmLocation = watch('farmLocation');

  const selectedLocation = useMemo(
    () =>
      farmLocation?.location
        ? {
            latitude: farmLocation.location[0],
            longitude: farmLocation.location[1],
          }
        : null,
    [farmLocation]
  );

  const updateLocation = (
    latitude: number,
    longitude: number,
    location_xy?: [number, number]
  ) => {
    setValue(
      'farmLocation',
      {
        location: [latitude, longitude],
        location_xy,
      },
      { shouldValidate: true }
    );
  };

  const submit = async (data: CreateFarmFormData) => {
    const validatedData = createFarmFormSchema.parse(data);
    const apiRequest = mapFormDataToApiRequest(validatedData);

    if (!apiRequest) {
      throw new Error('Location is required');
    }

    console.log(JSON.stringify(apiRequest, null, 2));
    await createFarmMutation.mutateAsync(apiRequest);
    router.push('/my-farm');
  };

  const handleApiError = (error: unknown) => {
    console.error('Failed to save farm', error);

    if (
      error instanceof AxiosError &&
      error.response?.status === 422 &&
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'errors' in error.response.data
    ) {
      const validationErrors = error.response.data.errors as Record<
        string,
        string | string[]
      >;

      Object.entries(validationErrors).forEach(([key, message]) => {
        if (!isValidFormField(key)) {
          return;
        }

        const errorMessage = Array.isArray(message) ? message[0] : message;
        setError(key, {
          type: 'server',
          message: errorMessage,
        });
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await submit(data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  });

  return {
    register: form.register,
    formState: form.formState,
    handleSubmit: onSubmit,
    updateLocation,
    submit: async (data: CreateFarmFormData) => {
      try {
        await submit(data);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    farmName,
    selectedLocation,
    isSubmitting: createFarmMutation.isPending,
  };
}
