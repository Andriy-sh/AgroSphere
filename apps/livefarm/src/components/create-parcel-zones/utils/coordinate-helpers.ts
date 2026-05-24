export const toNumber = (value: number | string): number => {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const normalizePosition = (
  coords: number[] | [number, number]
): [number, number] => {
  const [lng, lat] = coords as [number, number];
  return [toNumber(lng), toNumber(lat)];
};

export const ensureClosedRing = (ring: [number, number][]): [number, number][] => {
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

