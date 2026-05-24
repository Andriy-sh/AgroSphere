import { useMutation } from '@tanstack/react-query';
import { useFarmData } from '../../my-farm/hooks/useFarmData';
import type { ViewParcelFormParcelData } from '../types';
import { useUpdateParcel, type UpdateParcelRequest } from '@@agrosphere/shared';

interface SaveParcelParams {
  farmId: string;
  parcelId: string;
  parcel: ViewParcelFormParcelData;
}

interface SaveParcelResponse {
  farm: unknown;
  parcel: unknown;
}

export const useSaveParcel = () => {
  const { refresh } = useFarmData();
  const { mutateAsync: updateParcel } = useUpdateParcel();

  return useMutation({
    mutationFn: async (
      params: SaveParcelParams
    ): Promise<SaveParcelResponse> => {
      const { farmId, parcelId, parcel } = params;

      const boundaries_xy = parcel.geometry.map((coord) => {
        if (Array.isArray(coord) && coord.length >= 2) {
          return [coord[1], coord[0]];
        }
        return [0, 0];
      });

      const hectare = parseFloat(parcel.effectiveArea) || undefined;

      const itemId = parcel.parcelCode
        ? String(parcel.parcelCode)
        : undefined;

      const convertSoilTypeToApi = (soilType: string): string | undefined => {
        if (!soilType) return undefined;
        const normalized = soilType.toLowerCase().trim();
        if (normalized === 'mineral') {
          return 'mineral_soil';
        }
        if (normalized === 'peat') {
          return 'peat';
        }
        if (normalized === 'mineral_soil') {
          return 'mineral_soil';
        }
        return undefined;
      };

      const apiSoilType = convertSoilTypeToApi(parcel.soilType);

      const apiCrop =
        parcel.crop && parcel.crop !== 'not_set' ? parcel.crop : undefined;

      const updateData: UpdateParcelRequest = {
        name: parcel.parcelName,
        itemId: itemId,
        crop: apiCrop,
        soilType: apiSoilType,
        hectare: hectare,
        boundaries_xy: boundaries_xy.length > 0 ? boundaries_xy : undefined,
      };

      const response = await updateParcel({
        farmId,
        parcelId,
        data: updateData,
      });

      await refresh();

      return {
        farm: response.data,
        parcel: response.data,
      };
    },
  });
};
