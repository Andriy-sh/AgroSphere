import { useMutation } from '@tanstack/react-query';
import { useFarmData } from '../../my-farm/hooks/useFarmData';
import type { ViewParcelFormParcelData } from '../types';
import { ParcelItem } from '@@agrosphere/shared';

interface DeleteManagementZoneParams {
  farmId: string;
  parcelId: string;
  parcel: ViewParcelFormParcelData;
  historyEntryId: string;
}

interface DeleteManagementZoneResponse {
  farm: unknown;
  parcel: unknown;
}

export const useDeleteManagementZone = () => {
  const { setFarmItems } = useFarmData();

  return useMutation({
    mutationFn: async (
      params: DeleteManagementZoneParams
    ): Promise<DeleteManagementZoneResponse> => {
      const { farmId, parcelId, parcel } = params;

      return new Promise((resolve, reject) => {
        try {
          setFarmItems((prevFarmItems) => {
            const farmIndex = prevFarmItems.findIndex(
              (farm) => farm.id === farmId
            );

            if (farmIndex === -1) {
              reject(new Error(`Farm with id ${farmId} not found`));
              return prevFarmItems;
            }

            const farm = prevFarmItems[farmIndex];
            const existingChildren = farm.children ?? [];
            const parcelIndex = existingChildren.findIndex(
              (child) =>
                'type' in child &&
                child.type !== 'group' &&
                child.id === parcelId
            );

            if (parcelIndex === -1) {
              reject(new Error(`Parcel with id ${parcelId} not found`));
              return prevFarmItems;
            }

            const existingParcel = existingChildren[parcelIndex] as ParcelItem;

            const updatedParcel: ParcelItem = {
              ...existingParcel,
              name: parcel.parcelName,
              id: parcel.parcelCode,
              area: parseFloat(parcel.effectiveArea) || 0,
              geometry: parcel.geometry,
              ...(parcel.eosdaFieldId && { eosdaFieldId: parcel.eosdaFieldId }),
            } as ParcelItem & { eosdaFieldId?: string; history?: unknown[] };

            const updatedChildren = [...existingChildren];
            updatedChildren[parcelIndex] = updatedParcel;

            const updatedFarm = {
              ...farm,
              children: updatedChildren,
            };

            const updatedFarms = [...prevFarmItems];
            updatedFarms[farmIndex] = updatedFarm;

            resolve({
              farm: updatedFarm,
              parcel: updatedParcel,
            });

            return updatedFarms;
          });
        } catch (error) {
          reject(error);
        }
      });
    },
  });
};
