import type { ViewParcelHistoryEntry } from '../types';
import type { ParcelWithZones } from '@@agrosphere/shared';


export interface SerializedHistoryEntry {
  id: string;
  createdAt: string; 
  zonesCount: number;
  method: string;
  parcelWithZones: ParcelWithZones;
}

const INFINITY_MARKER = '__INFINITY__';

function serializeCoordinates(coordinates: number[][]): (number[] | string[])[] {
  return coordinates.map((coord) => {
    if (coord[0] === Infinity && coord[1] === Infinity) {
      return [INFINITY_MARKER, INFINITY_MARKER];
    }
    return coord;
  });
}


function deserializeCoordinates(
  coordinates: (number[] | string[] | null[])[]
): number[][] {
  return coordinates.map((coord) => {
    if (coord === null || (Array.isArray(coord) && coord[0] === null && coord[1] === null)) {
      return [Infinity, Infinity];
    }
    if (
      Array.isArray(coord) &&
      coord.length >= 2 &&
      coord[0] === INFINITY_MARKER &&
      coord[1] === INFINITY_MARKER
    ) {
      return [Infinity, Infinity];
    }
    if (Array.isArray(coord) && coord.length >= 2) {
      const x = typeof coord[0] === 'string' ? parseFloat(coord[0]) : Number(coord[0]);
      const y = typeof coord[1] === 'string' ? parseFloat(coord[1]) : Number(coord[1]);
      if (!isNaN(x) && !isNaN(y)) {
        return [x, y];
      }
    }
    return [0, 0];
  });
}

function serializeParcelWithZones(
  parcelWithZones: ParcelWithZones
): ParcelWithZones {
  return {
    ...parcelWithZones,
    parcelCoordinates: serializeCoordinates(
      parcelWithZones.parcelCoordinates
    ) as unknown as number[][],
    zones: parcelWithZones.zones.map((zone) => ({
      ...zone,
      coordinates: serializeCoordinates(zone.coordinates) as unknown as number[][],
    })),
    splitLines: parcelWithZones.splitLines.map((line) => ({
      ...line,
      coordinates: serializeCoordinates(line.coordinates) as unknown as number[][],
    })),
  };
}

function deserializeParcelWithZones(
  parcelWithZones: ParcelWithZones
): ParcelWithZones {
  return {
    ...parcelWithZones,
    parcelCoordinates: deserializeCoordinates(
      parcelWithZones.parcelCoordinates as (number[] | string[] | null[])[]
    ),
    zones: parcelWithZones.zones.map((zone) => ({
      ...zone,
      coordinates: deserializeCoordinates(
        zone.coordinates as (number[] | string[] | null[])[]
      ),
    })),
    splitLines: parcelWithZones.splitLines.map((line) => ({
      ...line,
      coordinates: deserializeCoordinates(
        line.coordinates as (number[] | string[] | null[])[]
      ),
    })),
  };
}

export function serializeHistory(
  history: ViewParcelHistoryEntry[]
): SerializedHistoryEntry[] {
  return history.map((entry) => ({
    id: entry.id,
    createdAt: entry.createdAt.toISOString(),
    zonesCount: entry.zonesCount,
    method: entry.method,
    parcelWithZones: serializeParcelWithZones(entry.parcelWithZones),
  }));
}

export function deserializeHistory(
  serializedHistory: SerializedHistoryEntry[]
): ViewParcelHistoryEntry[] {
  return serializedHistory.map((entry) => ({
    id: entry.id,
    createdAt: new Date(entry.createdAt),
    zonesCount: entry.zonesCount,
    method: entry.method,
    parcelWithZones: deserializeParcelWithZones(entry.parcelWithZones),
  }));
}

