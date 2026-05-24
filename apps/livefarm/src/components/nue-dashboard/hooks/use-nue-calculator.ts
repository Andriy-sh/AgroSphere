import { useState } from 'react';
import type { CalculatorValues, CalculationResults } from '../types/nue.types';
import { parseNumber } from '../utils/parse-number';
import { calculateNUE } from '../utils/calculate-nue';

const INITIAL_VALUES: CalculatorValues = {
  chemicalRate: '',
  nContent: '',
  slurryRate: '',
  nAvailability: '',
  soilNMin: '',
  silageYield: '',
  grazingYield: '',
  baleYield: '',
};

export function useNueCalculator() {
  const [values, setValues] = useState<CalculatorValues>(INITIAL_VALUES);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleInputChange = (field: keyof CalculatorValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    const parsedValues = {
      chemicalRate: parseNumber(values.chemicalRate),
      nContent: parseNumber(values.nContent),
      slurryRate: parseNumber(values.slurryRate),
      nAvailability: parseNumber(values.nAvailability),
      soilNMin: parseNumber(values.soilNMin),
      silageYield: parseNumber(values.silageYield),
      grazingYield: parseNumber(values.grazingYield),
      baleYield: parseNumber(values.baleYield),
    };

    const calculatedResults = calculateNUE(parsedValues);
    setResults(calculatedResults);
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setResults(null);
  };

  return {
    values,
    results,
    handleInputChange,
    calculate,
    reset,
  };
}

