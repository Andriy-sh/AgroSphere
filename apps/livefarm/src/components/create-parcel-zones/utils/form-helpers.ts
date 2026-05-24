import type { ParcelData, SelectedFarm } from '../types';

export function getNextParcelName(
  savedParcels: ParcelData[],
  selectedFarm: SelectedFarm | null
): string {
  const parcelsForSelectedFarm = selectedFarm
    ? savedParcels.filter((parcel) => parcel.farm === selectedFarm.id)
    : savedParcels;

  const nextIndex = parcelsForSelectedFarm.length + 1;

  return `parcel-${nextIndex}`;
}

