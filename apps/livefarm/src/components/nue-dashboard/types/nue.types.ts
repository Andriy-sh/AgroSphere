export interface CalculatorValues {
  chemicalRate: string;
  nContent: string;
  slurryRate: string;
  nAvailability: string;
  soilNMin: string;
  silageYield: string;
  grazingYield: string;
  baleYield: string;
}

export interface CalculationResults {
  chemicalN: number;
  slurryN: number;
  soilN: number;
  totalNIn: number;
  silageN: number;
  grazingN: number;
  baleN: number;
  totalNOut: number;
  nueScore: number;
}

export interface InputFieldConfig {
  key: keyof CalculatorValues;
  label: string;
  step: '0.1' | '1';
  inputClassName?: string;
}

export interface ParsedCalculatorValues {
  chemicalRate: number;
  nContent: number;
  slurryRate: number;
  nAvailability: number;
  soilNMin: number;
  silageYield: number;
  grazingYield: number;
  baleYield: number;
}

