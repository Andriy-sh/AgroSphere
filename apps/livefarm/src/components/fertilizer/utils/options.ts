import { getParcelOptions } from '../data/parcel-data';

export const FIELD_OPTIONS = getParcelOptions();

export const APPLICATION_TYPE_OPTIONS = [
  { value: 'chemical', label: 'Chemical' },
  { value: 'slurry', label: 'Slurry' },
];

export const CHEMICAL_PRODUCT_OPTIONS = [
  { value: 'can-27', label: 'CAN (27% N)' },
  { value: 'urea-46', label: 'Urea (46% N)' },
  { value: '18-6-12', label: '18-6-12 (18% N)' },
];

export const SLURRY_PRODUCT_OPTIONS = [
  { value: 'cattle-slurry', label: 'Cattle Slurry (1 kg N/m³)' },
  { value: 'pig-slurry', label: 'Pig Slurry (1.8 kg N/m³)' },
];

export const PRODUCT_OPTIONS = [
  ...CHEMICAL_PRODUCT_OPTIONS,
  ...SLURRY_PRODUCT_OPTIONS,
];

export const HARVEST_TYPE_OPTIONS = [
  { value: 'silage', label: 'Silage Cut' },
  { value: 'grazing', label: 'Grazing' },
  { value: 'bale', label: 'Bale/Hay' },
];

export const SCENARIO_OPTIONS = [
  { value: 'pessimistic', label: 'Pessimistic (Low estimate)' },
  { value: 'medium', label: 'Medium (Average estimate)' },
  { value: 'optimistic', label: 'Optimistic (High estimate)' },
];
