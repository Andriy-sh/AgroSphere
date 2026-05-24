export interface ProductNValue {
  product: string;
  nPercentage: number;
  unit: 'kg/ha' | 'm³/ha';
}

export const PRODUCT_N_VALUES: Record<string, ProductNValue> = {
  CAN: { product: 'CAN', nPercentage: 27, unit: 'kg/ha' },
  Urea: { product: 'Urea', nPercentage: 46, unit: 'kg/ha' },
  '18-6-12': { product: '18-6-12', nPercentage: 18, unit: 'kg/ha' },
  'Cattle Slurry': {
    product: 'Cattle Slurry',
    nPercentage: 1.0,
    unit: 'm³/ha',
  },
  'Pig Slurry': { product: 'Pig Slurry', nPercentage: 1.8, unit: 'm³/ha' },
};

export const HARVEST_N_FACTORS: Record<string, number> = {
  Silage: 4.5,
  'Bale/Hay': 3.6,
  Grazing: 25.6,
};

export const HARVEST_BOOK_VALUES_DISPLAY: Record<string, string> = {
  Silage: '4.5 kg N/tonne',
  'Bale/Hay': '3.6 kg N/tonne',
  Grazing: '25.6 kg N/t DM × 75%',
};

export function calculateNValue(
  product: string,
  rate: number,
  unit: 'kg/ha' | 'm³/ha'
): number {
  const productData = PRODUCT_N_VALUES[product];
  if (!productData) return 0;

  if (productData.unit === 'kg/ha' && unit === 'kg/ha') {
    return (rate * productData.nPercentage) / 100;
  } else if (productData.unit === 'm³/ha' && unit === 'm³/ha') {
    return rate * productData.nPercentage;
  }

  return 0;
}

export function calculateNRemoved(
  harvestType: string,
  yieldValue: number
): number {
  const factor = HARVEST_N_FACTORS[harvestType];
  if (!factor) return 0;

  if (harvestType === 'Grazing') {
    return yieldValue * factor * 0.75;
  }

  return yieldValue * factor;
}

export function calculateNMin(
  minNMin: number,
  maxNMin: number,
  scenario:
    | 'Pessimistic (Low estimate)'
    | 'Medium (Average estimate)'
    | 'Optimistic (High estimate)'
): number {
  switch (scenario) {
    case 'Pessimistic (Low estimate)':
      return minNMin;
    case 'Medium (Average estimate)':
      return (minNMin + maxNMin) / 2;
    case 'Optimistic (High estimate)':
      return maxNMin;
    default:
      return (minNMin + maxNMin) / 2;
  }
}

export function formatDecimal(value: number): string {
  return value.toFixed(1);
}
