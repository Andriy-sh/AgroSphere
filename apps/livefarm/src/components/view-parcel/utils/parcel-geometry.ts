import type { Coordinate } from '../types';

export const ensureClosedRing = (ring: Coordinate[]): Coordinate[] => {
  if (ring.length === 0) {
    return ring;
  }

  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];

  if (firstLng === lastLng && firstLat === lastLat) {
    return ring;
  }

  return [...ring, ring[0]];
};

export const calculateCentroid = (ring: Coordinate[]): Coordinate => {
  if (ring.length === 0) {
    return [0, 0];
  }

  const hasClosingPoint =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1];

  const points = hasClosingPoint ? ring.slice(0, -1) : ring;

  const totals = points.reduce(
    (accumulator, [lng, lat]) => ({
      sumLng: accumulator.sumLng + lng,
      sumLat: accumulator.sumLat + lat,
    }),
    { sumLng: 0, sumLat: 0 }
  );

  const count = points.length || ring.length;

  return [totals.sumLng / count, totals.sumLat / count];
};
