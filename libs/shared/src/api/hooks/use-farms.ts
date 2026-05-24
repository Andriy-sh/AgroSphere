import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateFarmRequest,
  GetFarmsResponse,
  GetFarmResponse,
  UpdateFarmRequest,
} from '../services/farms/farms-types';
import { FarmsService } from '../services/farms/farms-service';
import { FARMS_KEYS } from '../query-constants/queryKeys';

export const useFarms = (enabled = true) => {
  return useQuery<GetFarmsResponse>({
    queryKey: FARMS_KEYS.lists(),
    queryFn: () => FarmsService.getFarms(),
    enabled,
  });
};

export const useFarm = (farmId: string | null, enabled = true) => {
  return useQuery<GetFarmResponse>({
    queryKey: FARMS_KEYS.details(farmId || ''),
    queryFn: () => {
      if (!farmId) {
        throw new Error('Farm ID is required');
      }
      return FarmsService.getFarm(farmId);
    },
    enabled: enabled && !!farmId,
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFarmRequest) => FarmsService.createFarm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Create farm error:', error);
    },
  });
};

export const useUpdateFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      farmId,
      data,
    }: {
      farmId: string;
      data: UpdateFarmRequest;
    }) => FarmsService.updateFarm(farmId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: FARMS_KEYS.details(variables.farmId),
      });
    },
    onError: (error) => {
      console.error('Update farm error:', error);
    },
  });
};


export const useDeleteFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (farmId: string) => FarmsService.deleteFarm(farmId),
    onSuccess: (_, farmId) => {
      queryClient.removeQueries({
        queryKey: FARMS_KEYS.details(farmId),
      });
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Delete farm error:', error);
    },
  });
};
