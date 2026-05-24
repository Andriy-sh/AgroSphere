import type { ParcelWithZones } from '@@agrosphere/shared';
import type { ViewParcelHistoryEntry } from '../types';

export function getLatestSatellitePKEntry(
  history: ViewParcelHistoryEntry[]
): ViewParcelHistoryEntry | null {
  if (!history || history.length === 0) {
    return null;
  }

  const satelliteEntries = history.filter(
    (entry) => entry.method === 'Satellite P&K'
  );

  if (satelliteEntries.length === 0) {
    return null;
  }

  const sortedEntries = satelliteEntries.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return sortedEntries[0];
}

export function getLatestSatellitePKParcelWithZones(
  history: ViewParcelHistoryEntry[]
): ParcelWithZones | null {
  const entry = getLatestSatellitePKEntry(history);
  return entry?.parcelWithZones || null;
}


