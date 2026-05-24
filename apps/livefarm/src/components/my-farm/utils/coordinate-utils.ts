export const isValidCoord = (value?: number | null): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const normalizePolygonToMapMultiPolygon = (
  coords: [number, number][]
): [number, number][][][] => {
  if (!coords || coords.length === 0) {
    return [];
  }

  const ring: [number, number][] = coords.map(([lat, lng]) => [lng, lat]);

  const first = ring[0];
  const last = ring[ring.length - 1];
  const closedRing =
    first && last && first[0] === last[0] && first[1] === last[1]
      ? ring
      : [...ring, ring[0]];

  return [[closedRing]];
};
