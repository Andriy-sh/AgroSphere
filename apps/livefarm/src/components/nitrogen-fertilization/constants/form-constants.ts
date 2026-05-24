import type { SelectOption } from '@@agrosphere/shared';

export const satelliteTypeOptions: SelectOption[] = [
  { value: 'ndvi', label: 'NDVI' },
  { value: 'ndre', label: 'NDRE' },
];

export const imageDateOptions: SelectOption[] = [
  '2025-12-14',
  '2025-12-07',
  '2025-12-01',
  '2025-11-30',
  '2025-11-28',
].map((d) => ({ value: d, label: d }));

export const zonesCountOptions: SelectOption[] = ['2', '3', '4', '5', '6', '7'].map((v) => ({
  value: v,
  label: v,
}));

export const rateStepOptions: SelectOption[] = [
  { value: 'auto', label: 'Auto' },
  ...['5', '10', '15', '20', '25'].map((v) => ({
    value: v,
    label: v,
  })),
];

export const applicationStrategyOptions: SelectOption[] = [
  { value: 'increase', label: 'Increase' },
  { value: 'decrease', label: 'Decrease' },
  { value: 'manual', label: 'Manual' },
];

export const INPUT_LIKE_CLASS_NAME =
  'w-full h-9 px-3 py-2 border border-basic-gray-light rounded-lg bg-white text-sm flex items-center justify-between';

