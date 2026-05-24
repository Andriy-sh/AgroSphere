import type { ZonePrescription } from '../types/form-types';

export function m2ToHa(m2: number): number {
  return m2 / 10000;
}

export function calculateZoneFertilizer(areaHa: number, rateKgHa: string): number {
  const rate = parseFloat(rateKgHa);
  if (isNaN(rate) || rate < 0) return 0;
  return areaHa * rate;
}

export function calculateTotalFertilizerConsumption(zones: ZonePrescription[]): number {
  return zones.reduce((total, zone) => {
    const amount = calculateZoneFertilizer(zone.zoneAreaHa, zone.rateKgHa);
    return total + amount;
  }, 0);
}

export function calculateTotalAreaHa(zones: ZonePrescription[]): number {
  return zones.reduce((sum, zone) => sum + zone.zoneAreaHa, 0);
}

