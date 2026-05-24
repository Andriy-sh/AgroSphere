import type { MapParcel, MapMultiPolygon } from '@@agrosphere/shared';
import { allParcelsData, type ParcelData } from './all-tabs-mock-data';
import type { TimePeriod } from '../dashboard-tabs';

const convertGeometryToMapMultiPolygon = (
  geometry: [number, number][]
): MapMultiPolygon => {
  if (!geometry || geometry.length === 0) {
    // eslint-disable-next-line no-loss-of-precision
    return [
      [
        [
          // eslint-disable-next-line no-loss-of-precision
          [-6.7893373321256805, 52.803046419691846],
          // eslint-disable-next-line no-loss-of-precision
          [-6.7883373321256805, 52.803046419691846],
          // eslint-disable-next-line no-loss-of-precision
          [-6.7883373321256805, 52.804046419691846],
          // eslint-disable-next-line no-loss-of-precision
          [-6.7893373321256805, 52.804046419691846],
          // eslint-disable-next-line no-loss-of-precision
          [-6.7893373321256805, 52.803046419691846],
        ],
      ],
    ];
  }

  const closedGeometry =
    geometry.length > 0 &&
    geometry[0][0] === geometry[geometry.length - 1][0] &&
    geometry[0][1] === geometry[geometry.length - 1][1]
      ? geometry
      : [...geometry, geometry[0]];

  return [[closedGeometry]];
};

export const convertParcelDataToMapParcel = (
  parcelData: ParcelData
): MapParcel & { nue: number } => {
  return {
    id: parcelData.id,
    name: parcelData.name,
    area: parcelData.area,
    coordinates: convertGeometryToMapMultiPolygon(parcelData.geometry),
    visible: true,
    nue: parcelData.nue,
    eosdaFieldId: parcelData.eosdaFieldId,
  };
};

export const getNueMapParcels = (): (MapParcel & { nue: number })[] => {
  return allParcelsData.map((parcel) => convertParcelDataToMapParcel(parcel));
};

export const getNueMapParcelsByPeriod = (
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
): (MapParcel & { nue: number })[] => {
  let filteredParcels = allParcelsData;
  const currentYear = new Date().getFullYear();

  switch (timePeriod) {
    case 'all-time':
      break;
    case 'year-to-date':
      filteredParcels = allParcelsData.filter((item) => {
        const itemDate = new Date(item.date.split('T')[0]);
        return itemDate.getFullYear() === currentYear;
      });
      break;
    case 'full-year-2025':
      filteredParcels = allParcelsData.filter((item) => item.year === 2025);
      break;
    case 'previous-year-2024':
      filteredParcels = allParcelsData.filter((item) => item.year === 2024);
      break;
    case 'custom-range': {
      if (customStartDate && customEndDate) {
        const startDate = new Date(customStartDate.split('T')[0]);
        const endDate = new Date(customEndDate.split('T')[0]);
        filteredParcels = allParcelsData.filter((item) => {
          const itemDate = new Date(item.date.split('T')[0]);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      break;
    }
  }

  return filteredParcels.map((parcel) => convertParcelDataToMapParcel(parcel));
};
