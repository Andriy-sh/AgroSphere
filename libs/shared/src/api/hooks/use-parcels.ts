import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateParcelRequest,
  GetParcelResponse,
  UpdateParcelRequest,
} from '../services/parcels/parcels-types';
import { ParcelsService } from '../services/parcels/parcels-service';
import { FARMS_KEYS, PARCELS_KEYS } from '../query-constants/queryKeys';

export const useParcel = (
  farmId: string | null,
  parcelId: string | null,
  enabled = true
) => {
  return useQuery<GetParcelResponse>({
    queryKey: PARCELS_KEYS.details(farmId || '', parcelId || ''),
    queryFn: () => {
      if (!farmId || !parcelId) {
        throw new Error('Farm ID and Parcel ID are required');
      }
      return ParcelsService.getParcel(farmId, parcelId);
    },
    enabled: enabled && !!farmId && !!parcelId,
  });
};

export const useCreateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      farmId,
      data,
    }: {
      farmId: string;
      data: CreateParcelRequest;
    }) => ParcelsService.createParcel(farmId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: FARMS_KEYS.details(variables.farmId),
      });
    },
    onError: (error) => {
      console.error('Create parcel error:', error);
    },
  });
};

export const useUpdateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      farmId,
      parcelId,
      data,
    }: {
      farmId: string;
      parcelId: string;
      data: UpdateParcelRequest;
    }) => ParcelsService.updateParcel(farmId, parcelId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PARCELS_KEYS.details(variables.farmId, variables.parcelId),
      });
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: FARMS_KEYS.details(variables.farmId),
      });
    },
    onError: (error) => {
      console.error('Update parcel error:', error);
    },
  });
};

export const useDeleteParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ farmId, parcelId }: { farmId: string; parcelId: string }) =>
      ParcelsService.deleteParcel(farmId, parcelId),
    onSuccess: (_, variables) => {
      // Remove parcel from cache
      queryClient.removeQueries({
        queryKey: PARCELS_KEYS.details(variables.farmId, variables.parcelId),
      });
      // Invalidate farms queries to refresh farm data without deleted parcel
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: FARMS_KEYS.details(variables.farmId),
      });
    },
    onError: (error) => {
      console.error('Delete parcel error:', error);
    },
  });
};
