import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { OrganisationService } from '../services/organisation/organisation-service';
import {
  CreateOrganisationRequest,
  CreateOrganisationResponse,
  CreateOrganisationError,
} from '../services/organisation/organisation-types';
import { ORGANISATION_KEYS } from '../query-constants/queryKeys';

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateOrganisationResponse,
    AxiosError<CreateOrganisationError>,
    CreateOrganisationRequest
  >({
    mutationFn: (data) => OrganisationService.create(data),

    onSuccess: (data) => {
      console.log('Organisation created:', data);
      queryClient.invalidateQueries({ queryKey: ORGANISATION_KEYS.all });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      console.error('Creation failed:', errorMessage);
    },
  });
};
