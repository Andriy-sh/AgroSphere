import { useState, useMemo, useEffect } from 'react';
import type { ZonePrescription, NitrogenFertilizationParcelOption } from '../types/form-types';
import { calculateZoneFertilizer, calculateTotalFertilizerConsumption, calculateTotalAreaHa } from '../utils/zone-calculations';

export function useZonePrescriptions(selectedParcel?: NitrogenFertilizationParcelOption | null) {
  const [zones, setZones] = useState<ZonePrescription[]>([]);

  useEffect(() => {
    setZones([]);
  }, [selectedParcel?.id]);

  const updateZoneRate = (zoneId: number, value: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.zoneId === zoneId) {
          const fertilizerAmount = calculateZoneFertilizer(z.zoneAreaHa, value);
          return { ...z, rateKgHa: value, fertilizerAmount };
        }
        return z;
      })
    );
  };

  const totalFertilizerConsumption = useMemo(() => {
    return calculateTotalFertilizerConsumption(zones);
  }, [zones]);

  const totalAreaHa = useMemo(() => {
    return calculateTotalAreaHa(zones);
  }, [zones]);

  return {
    zones,
    setZones,
    updateZoneRate,
    totalFertilizerConsumption,
    totalAreaHa,
  };
}

