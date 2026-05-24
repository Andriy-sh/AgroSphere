export interface ParcelData {
  id: string;
  name: string;
  area: number;
}

export const PARCEL_DATA: ParcelData[] = [
  { id: '1A', name: 'Mollys', area: 12.822579205618702 },
  { id: '1B1', name: 'Road Field', area: 18.888788124613058 },
  { id: '1C', name: 'B Meadow', area: 15.170854733819843 },
  { id: '1D', name: 'Cover Field', area: 12.47892882156372 },
  { id: '1E', name: 'Race Course', area: 8.049277478609365 },
  { id: '2A', name: 'Clocha Stocha', area: 10.175384748277146 },
  { id: '2B', name: 'JD + Clover', area: 7.7248657544510655 },
  { id: '2C', name: 'Darbys', area: 17.12235484853696 },
  { id: '2D', name: 'Dwyers Bottom', area: 14.86879557098636 },
  { id: '2E', name: 'Dwyers Top', area: 15.26605725812188 },
];

export function getParcelById(id: string): ParcelData | undefined {
  return PARCEL_DATA.find((parcel) => parcel.id === id);
}

export function formatParcelDisplay(parcel: ParcelData): string {
  return `${parcel.name} (${parcel.area.toFixed(2)} ha)`;
}

export function getParcelOptions(): Array<{ value: string; label: string }> {
  return PARCEL_DATA.map((parcel) => ({
    value: parcel.id,
    label: formatParcelDisplay(parcel),
  }));
}

