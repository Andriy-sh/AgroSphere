import { BOOK_VALUES } from '../constants/book-values';
import type { ParsedCalculatorValues, CalculationResults } from '../types/nue.types';

export function calculateNUE(values: ParsedCalculatorValues): CalculationResults {
  const chemicalRate = values.chemicalRate;
  const nContent = values.nContent;
  const chemicalN = (chemicalRate * nContent) / 100;

  const slurryRate = values.slurryRate;
  const nAvailability = values.nAvailability;
  const slurryN = slurryRate * nAvailability;

  const soilN = values.soilNMin;
  const totalNIn = chemicalN + slurryN + soilN;

  const silageYield = values.silageYield;
  const silageN = silageYield * BOOK_VALUES.silage;

  const grazingYield = values.grazingYield;
  const grazingN =
    grazingYield * BOOK_VALUES.grazing * BOOK_VALUES.grazingMultiplier;

  const baleYield = values.baleYield;
  const baleN = baleYield * BOOK_VALUES.bale;

  const totalNOut = silageN + grazingN + baleN;

  const nueScore = totalNIn > 0 ? (totalNOut / totalNIn) * 100 : 0;

  return {
    chemicalN,
    slurryN,
    soilN,
    totalNIn,
    silageN,
    grazingN,
    baleN,
    totalNOut,
    nueScore,
  };
}

