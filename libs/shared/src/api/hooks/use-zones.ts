import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateZoneRequest,
  CreateZoneResponse,
  DeleteZoneResponse,
} from '../services/zones/zones-types';
import { ZonesService } from '../services/zones/zones-service';
import {
  FARMS_KEYS,
  PARCELS_KEYS,
  ZONES_KEYS,
} from '../query-constants/queryKeys';

export const useCreateZone = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateZoneResponse,
    Error,
    {
      farmId: string;
      parcelId: string;
      data: CreateZoneRequest;
    }
  >({
    mutationFn: ({ farmId, parcelId, data }) =>
      ZonesService.createZone(farmId, parcelId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PARCELS_KEYS.details(variables.farmId, variables.parcelId),
      });
      queryClient.invalidateQueries({
        queryKey: ZONES_KEYS.list(variables.farmId, variables.parcelId),
      });
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: FARMS_KEYS.details(variables.farmId),
      });
    },
    onError: (error) => {
      console.error('Create zone error:', error);
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteZoneResponse,
    Error,
    {
      farmId: string;
      parcelId: string;
      zoneId: string;
    }
  >({
    mutationFn: ({ farmId, parcelId, zoneId }) =>
      ZonesService.deleteZone(farmId, parcelId, zoneId),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: ZONES_KEYS.details(
          variables.farmId,
          variables.parcelId,
          variables.zoneId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: ZONES_KEYS.list(variables.farmId, variables.parcelId),
      });
      queryClient.invalidateQueries({
        queryKey: PARCELS_KEYS.details(variables.farmId, variables.parcelId),
      });
      queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: FARMS_KEYS.details(variables.farmId),
      });
    },
    onError: (error) => {
      console.error('Delete zone error:', error);
    },
  });
};
