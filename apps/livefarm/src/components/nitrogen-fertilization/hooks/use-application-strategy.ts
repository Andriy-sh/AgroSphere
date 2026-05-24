import { useState, useEffect, useRef } from 'react';
import type {
  ApplicationStrategy,
  ZonePrescription,
} from '../types/form-types';
import { Step } from '../types/form-types';
import { applyApplicationStrategy } from '../utils/strategy-calculations';

type StrategyParams = {
  applicationStrategy: ApplicationStrategy;
  baseRate: string;
  rateStep: string;
};

export function useApplicationStrategy(
  zones: ZonePrescription[],
  setZones: (
    zones:
      | ZonePrescription[]
      | ((prev: ZonePrescription[]) => ZonePrescription[])
  ) => void,
  step: Step
) {
  const [applicationStrategy, setApplicationStrategy] =
    useState<ApplicationStrategy>('increase');
  const [baseRate, setBaseRate] = useState<string>('0');
  const [rateStep, setRateStep] = useState<string>('auto');

  const prevStrategyParamsRef = useRef<StrategyParams | null>(null);

  const calculateAutoRateStep = (zonesCount: number): number => {
    if (zonesCount <= 2) return 5;
    if (zonesCount <= 3) return 10;
    if (zonesCount <= 5) return 15;
    return 20;
  };

  useEffect(() => {
    if (zones.length === 0) {
      setApplicationStrategy('increase');
      setBaseRate('0');
      setRateStep('auto');
      prevStrategyParamsRef.current = null;
    }
  }, [zones.length]);

  useEffect(() => {
    if (step === Step.ZONES && zones.length > 0) {
      const currentParams: StrategyParams = {
        applicationStrategy,
        baseRate,
        rateStep,
      };

      if (applicationStrategy === 'manual') {
        const wasManual =
          prevStrategyParamsRef.current?.applicationStrategy === 'manual';
        if (!wasManual) {
          const resetZones = zones.map((zone) => ({
            ...zone,
            rateKgHa: '0',
            fertilizerAmount: 0,
          }));
          setZones(resetZones);
          prevStrategyParamsRef.current = currentParams;
          return;
        }
      }

      if (applicationStrategy !== 'manual') {
        const paramsChanged = prevStrategyParamsRef.current
          ? prevStrategyParamsRef.current.applicationStrategy !==
              currentParams.applicationStrategy ||
            prevStrategyParamsRef.current.baseRate !== currentParams.baseRate ||
            prevStrategyParamsRef.current.rateStep !== currentParams.rateStep
          : false;

        const effectiveRateStep =
          rateStep === 'auto'
            ? calculateAutoRateStep(zones.length)
            : parseFloat(rateStep) || 0;

        const shouldApplyStrategy =
          paramsChanged &&
          (rateStep || rateStep === 'auto') &&
          baseRate &&
          parseFloat(baseRate) > 0;

        if (shouldApplyStrategy && effectiveRateStep > 0) {
          const base = parseFloat(baseRate) || 0;

          const newZones = applyApplicationStrategy(
            zones,
            applicationStrategy,
            base,
            effectiveRateStep
          );
          setZones(newZones);
          prevStrategyParamsRef.current = currentParams;
        } else if (!prevStrategyParamsRef.current) {
          prevStrategyParamsRef.current = currentParams;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationStrategy, baseRate, rateStep, step]);

  return {
    applicationStrategy,
    setApplicationStrategy,
    baseRate,
    setBaseRate,
    rateStep,
    setRateStep,
  };
}
