import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  FarmItem,
  useFarms,
  FarmData,
  Parcel,
  SampleZone,
  ZoneItem,
  ParcelItem,
} from '@@agrosphere/shared';
import { normalizeFarmItemsGeometry } from '../utils/geo-transformers';
// import farmDataJson from '@/data/json/farm-data.json';

interface UseFarmDataResult {
  farmItems: FarmItem[];
  loading: boolean;
  setFarmItems: Dispatch<SetStateAction<FarmItem[]>>;
  refresh: () => Promise<void>;
}

// interface FarmRecord {
//   id: string;
//   name: string;
//   area?: number;
//   parcels?: number;
//   lat?: number;
//   lng?: number;
//   latitude?: number;
//   longitude?: number;
//   children?: unknown[];
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }

// const normalizeFarmData = (farms: FarmRecord[]): FarmItem[] => {
//   if (!Array.isArray(farms)) {
//     return [];
//   }

//   return farms.map((farm: FarmRecord) => {
//     const latitude = farm.latitude ?? farm.lat;
//     const longitude = farm.longitude ?? farm.lng;

//     return {
//       ...farm,
//       area: farm.area ?? 0,
//       parcels: farm.parcels ?? 0,
//       lat: latitude,
//       lng: longitude,
//       children: farm.children ?? [],
//     } as FarmItem;
//   });
// };

// const loadFarms = (): FarmItem[] => {
//   try {
//     const farms = normalizeFarmData(farmDataJson as FarmRecord[]);
//     return farms;
//   } catch (error) {
//     console.error('Failed to load farm data from JSON', error);
//     return [];
//   }
// };

const transformFarmDataToFarmItem = (farmData: FarmData): FarmItem => {
  const [latitude, longitude] = farmData.location || [0, 0];

  const children = farmData.parcels
    ? farmData.parcels.map((parcel: Parcel) => {
        const zones: ZoneItem[] = parcel.sample_zones
          ? parcel.sample_zones.map((zone) => {
              const hectareValue =
                typeof zone.hectare === 'string'
                  ? parseFloat(zone.hectare)
                  : zone.hectare || 0;
              const area = isNaN(hectareValue) ? 0 : hectareValue;

              return {
                id: zone.id,
                name: zone.name,
                area: area,
              };
            })
          : [];

        // Convert parcel hectare from string to number if needed
        const parcelHectareValue =
          typeof parcel.hectare === 'string'
            ? parseFloat(parcel.hectare)
            : parcel.hectare || 0;
        const parcelArea = isNaN(parcelHectareValue) ? 0 : parcelHectareValue;

        return {
          id: parcel.id,
          name: parcel.name,
          area: parcelArea,
          type: 'parcel',
          geometry: parcel.boundaries || [],
          eosdaFieldId: undefined,
          children: zones,
          item_id: parcel.item_id,
          soil_type: parcel.soil_type,
          crop: parcel.crop,
        } as ParcelItem & {
          item_id?: string | number;
          soil_type?: string;
          crop?: string;
        };
      })
    : [];

  const totalHectares = children.reduce(
    (sum, parcel) => sum + (parcel.area || 0),
    0
  );

  return {
    id: farmData.id,
    name: farmData.name,
    area: totalHectares,
    parcels: farmData.parcels?.length || 0,
    lat: latitude,
    lng: longitude,
    children: children,
  };
};

export const useFarmData = (): UseFarmDataResult => {
  const { data: farmsResponse, isLoading, isFetching, refetch } = useFarms();

  const apiFarmItems = useMemo(() => {
    if (!farmsResponse?.farms) {
      return [];
    }
    const transformed = farmsResponse.farms.map(transformFarmDataToFarmItem);
    return normalizeFarmItemsGeometry(transformed);
  }, [farmsResponse]);

  const [localFarmItems, setLocalFarmItems] =
    useState<FarmItem[]>(apiFarmItems);

  useEffect(() => {
    setLocalFarmItems(apiFarmItems);
  }, [apiFarmItems]);

  const setFarmItems = useCallback<Dispatch<SetStateAction<FarmItem[]>>>(
    (updater) => {
      setLocalFarmItems((prev) => {
        if (typeof updater === 'function') {
          return (updater as (prevState: FarmItem[]) => FarmItem[])(prev);
        }
        return updater ?? [];
      });
    },
    []
  );

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    farmItems: localFarmItems,
    loading: isLoading || isFetching,
    setFarmItems,
    refresh,
  };
};
