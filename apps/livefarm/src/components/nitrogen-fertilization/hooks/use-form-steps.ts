import { useState, useEffect } from 'react';
import { Step } from '../types/form-types';
import type { NitrogenFertilizationParcelOption } from '../types/form-types';
import type { SelectOption } from '@@agrosphere/shared';

export function useFormSteps(
  selectedParcel?: NitrogenFertilizationParcelOption | null,
  imageDateOptions?: SelectOption[]
) {
  const [step, setStep] = useState<Step>(Step.SETUP);
  const [satelliteType, setSatelliteType] = useState('ndvi');
  const [imageDate, setImageDate] = useState('2025-12-07');
  const [zonesCount, setZonesCount] = useState('5');

  useEffect(() => {
    setStep(Step.SETUP);
    setSatelliteType('ndvi');
    setZonesCount('5');
    
    if (imageDateOptions && imageDateOptions.length > 0) {
      setImageDate(imageDateOptions[0].value);
    } else {
      setImageDate('2025-12-07');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParcel?.id]);

  useEffect(() => {
    if (imageDateOptions && imageDateOptions.length > 0) {
      const isValidDate = imageDateOptions.some((opt) => opt.value === imageDate);
      if (!isValidDate) {
        setImageDate(imageDateOptions[0].value);
      }
    }
  }, [imageDateOptions, imageDate]);

  return {
    step,
    setStep,
    satelliteType,
    setSatelliteType,
    imageDate,
    setImageDate,
    zonesCount,
    setZonesCount,
  };
}

