import type { InputFieldConfig } from '../types/nue.types';

export const INPUT_FIELDS_CONFIG: {
  nIn: InputFieldConfig[];
  nOut: InputFieldConfig[];
} = {
  nIn: [
    { key: 'chemicalRate', label: 'Chemical Rate (kg/ha)', step: '1' },
    { key: 'nContent', label: 'N% Content', step: '1' },
    {
      key: 'slurryRate',
      label: 'Slurry Rate (m³/ha)',
      step: '1',
      inputClassName: 'w-full pr-2',
    },
    { key: 'nAvailability', label: 'N Availability (kg/m³)', step: '0.1' },
    { key: 'soilNMin', label: 'Soil N-Min (kg/ha)', step: '1' },
  ],
  nOut: [
    { key: 'silageYield', label: 'Silage Yield (t/ha)', step: '0.1' },
    { key: 'grazingYield', label: 'Grazing Yield (t DM/ha)', step: '0.1' },
    { key: 'baleYield', label: 'Bale Yield (t/ha)', step: '0.1' },
  ],
} as const;

