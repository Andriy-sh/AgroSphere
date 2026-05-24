import type { ZonePrescription, ApplicationStrategy } from '../types/form-types';
import { calculateZoneFertilizer } from './zone-calculations';

export function applyApplicationStrategy(
  zones: ZonePrescription[],
  strategy: ApplicationStrategy,
  baseRate: number,
  rateStep: number
): ZonePrescription[] {
  const zonesWithNdvi = zones.filter((z) => z.kmean !== undefined);
  
  if (zonesWithNdvi.length === 0) {
    return zones.map((zone) => {
      const fertilizerAmount = calculateZoneFertilizer(
        zone.zoneAreaHa,
        baseRate.toString()
      );
      return {
        ...zone,
        rateKgHa: baseRate > 0 ? baseRate.toFixed(1) : '0',
        fertilizerAmount,
      };
    });
  }

  const ndviValues = zonesWithNdvi.map((z) => z.kmean!);
  const minNdvi = Math.min(...ndviValues);
  const maxNdvi = Math.max(...ndviValues);
  const ndviRange = maxNdvi - minNdvi;

  const maxStep = (zonesWithNdvi.length - 1) * rateStep;

  return zones.map((zone) => {
    if (zone.kmean === undefined) {
      const fertilizerAmount = calculateZoneFertilizer(
        zone.zoneAreaHa,
        baseRate.toString()
      );
      return {
        ...zone,
        rateKgHa: baseRate > 0 ? baseRate.toFixed(1) : '0',
        fertilizerAmount,
      };
    }

    const normalizedNdvi = ndviRange > 0 
      ? (zone.kmean - minNdvi) / ndviRange 
      : 0.5; 

    let calculatedRate: number;

    if (strategy === 'increase') {
      calculatedRate = baseRate + normalizedNdvi * maxStep;
    } else {
      calculatedRate = baseRate + (1 - normalizedNdvi) * maxStep;
    }

    const fertilizerAmount = calculateZoneFertilizer(
      zone.zoneAreaHa,
      calculatedRate.toString()
    );

    return {
      ...zone,
      rateKgHa: calculatedRate > 0 ? calculatedRate.toFixed(1) : '0',
      fertilizerAmount,
    };
  });
}

