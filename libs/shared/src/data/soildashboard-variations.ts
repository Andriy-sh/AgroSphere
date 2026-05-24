import { cva, type VariantProps } from 'class-variance-authority';

export const soilDashboardVariants = cva('relative mx-auto', {
  variants: {
    variant: {
      ph: {},
      phRange: {},
      phRangeGrassland: {},
      phRangeCerealsMaize: {},
      lime: {},
      pIndexGrassland: {},
      pIndexOtherCrops: {},
      kIndexMineralSoil: {},
      kIndexPeatSoil: {},
      organicMatter: {},
      // Trace Elements
      magnesiumMg: {},
      calciumC: {},
      copperCu: {},
      manganeseMn: {},
      zincZn: {},
      boronB: {},
    },
  },
  defaultVariants: {
    variant: 'ph',
  },
});

export type SoilDashboardProps = VariantProps<typeof soilDashboardVariants>;
export type GaugeConfig = {
  labels: { value: number; label: string }[];
  min: number;
  max: number;
  subLabel: string;
  valueSuffix: string;
  valueDecimals?: number;
  colorScheme: 'default' | 'redToGreen' | 'redToBlue' | 'greenToRed';
};

export const getGaugeConfig = (
  variant: SoilDashboardProps['variant']
): GaugeConfig => {
  switch (variant) {
    case 'ph':
      return {
        labels: [
          { value: 0, label: 'Very low' },
          { value: 20, label: 'Low' },
          { value: 50, label: 'Normal' },
          { value: 80, label: 'High' },
          { value: 100, label: 'Very high' },
        ],
        min: 0,
        max: 100,
        subLabel: 'TOP 10% nationally',
        valueSuffix: '%',
        valueDecimals: 0,
        colorScheme: 'redToBlue',
      };
    case 'phRange':
      return {
        labels: [
          { value: 4.5, label: '<5.5' },
          { value: 7.5, label: '>7.5' },
        ],
        min: 4.5,
        max: 7.5,
        subLabel: 'TOP 10% nationally',
        valueSuffix: '',
        valueDecimals: 1,
        colorScheme: 'redToBlue',
      };
    case 'phRangeGrassland':
      return {
        labels: [
          { value: 5.5, label: '<5.5' },
          { value: 7.5, label: '>7.5' },
        ],
        min: 5.5,
        max: 7.5,
        subLabel: 'TOP 10% nationally',
        valueSuffix: '',
        valueDecimals: 1,
        colorScheme: 'redToBlue',
      };
    case 'phRangeCerealsMaize':
      return {
        labels: [
          { value: 5.5, label: '<5.5' },
          { value: 7.5, label: '>7.5' },
        ],
        min: 5.5,
        max: 7.5,
        subLabel: 'TOP 10% nationally',
        valueSuffix: '',
        valueDecimals: 1,
        colorScheme: 'redToBlue',
      };
    case 'lime':
      return {
        labels: [
          { value: 0, label: 'Very low' },
          { value: 2, label: 'Low' },
          { value: 5, label: 'Normal' },
          { value: 8, label: 'High' },
          { value: 10, label: 'Very high' },
        ],
        min: 0,
        max: 10,
        subLabel: 'TOP 10% nationally',
        valueSuffix: ' t/ha',
        valueDecimals: 0,
        colorScheme: 'redToGreen',
      };
    case 'pIndexGrassland':
      return {
        labels: [
          { value: 0, label: 'Index 1 (0.0-3.0)' },
          { value: 5, label: 'Index 2 (3.1-5.0)' },
          { value: 10, label: 'Index 3 (5.1-8.0)' },
          { value: 15, label: 'Index 4 (>8.0)' },
        ],
        min: 0,
        max: 15,
        subLabel: 'TOP 10% nationally',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToBlue',
      };
    case 'pIndexOtherCrops':
      return {
        labels: [
          { value: 0, label: 'Index 1 (0.0-3.0)' },
          { value: 5, label: 'Index 2 (3.1-6.0)' },
          { value: 10, label: 'Index 3 (6.1-10.0)' },
          { value: 15, label: 'Index 4 (>10.0)' },
        ],
        min: 0,
        max: 15,
        subLabel: 'TOP 10% nationally',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToBlue',
      };
    case 'kIndexMineralSoil':
      return {
        labels: [
          { value: 0, label: 'Index 1 (0-50)' },
          { value: 66.7, label: 'Index 2 (51-100)' },
          { value: 133.3, label: 'Index 3 (101-150)' },
          { value: 200, label: 'Index 4 (>150)' },
        ],
        min: 0,
        max: 200,
        subLabel: 'TOP 10% nationally',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToBlue',
      };
    case 'kIndexPeatSoil':
      return {
        labels: [
          { value: 0, label: 'Index 1 (0-75)' },
          { value: 100, label: 'Index 2 (76-150)' },
          { value: 200, label: 'Index 3 (151-250)' },
          { value: 300, label: 'Index 4 (>250)' },
        ],
        min: 0,
        max: 300,
        subLabel: 'TOP 10% nationally',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToBlue',
      };
    case 'organicMatter':
      return {
        labels: [
          { value: 0, label: 'Very low' },
          { value: 20, label: 'Low' },
          { value: 50, label: 'Normal' },
          { value: 80, label: 'High' },
          { value: 100, label: 'Very high' },
        ],
        min: 0,
        max: 100,
        subLabel: 'TOP 10% nationally',
        valueSuffix: '%',
        valueDecimals: 0,
        colorScheme: 'redToGreen',
      };
    // Trace Elements - based on DTPA Status Lookup Table
    case 'magnesiumMg':
      return {
        labels: [
          { value: 0, label: 'Very Low' },
          { value: 70, label: 'Low' },
          { value: 175, label: 'Normal' },
          { value: 280, label: 'High' },
          { value: 350, label: 'Very High' },
        ],
        min: 0,
        max: 350,
        subLabel: 'DTPA Status',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToGreen',
      };
    case 'calciumC':
      return {
        labels: [
          { value: 0, label: 'Very Low' },
          { value: 600, label: 'Low' },
          { value: 1500, label: 'Normal' },
          { value: 2400, label: 'High' },
          { value: 3000, label: 'Very High' },
        ],
        min: 0,
        max: 3000,
        subLabel: 'DTPA Status',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToGreen',
      };
    case 'copperCu':
      return {
        labels: [
          { value: 0, label: 'Very Low' },
          { value: 0.84, label: 'Low' },
          { value: 2.1, label: 'Normal' },
          { value: 3.36, label: 'High' },
          { value: 4.2, label: 'Very High' },
        ],
        min: 0,
        max: 4.2,
        subLabel: 'DTPA Status',
        valueSuffix: ' mg/l',
        valueDecimals: 2,
        colorScheme: 'redToGreen',
      };
    case 'manganeseMn':
      return {
        labels: [
          { value: 0, label: 'Very Low' },
          { value: 11, label: 'Low' },
          { value: 27.5, label: 'Normal' },
          { value: 44, label: 'High' },
          { value: 55, label: 'Very High' },
        ],
        min: 0,
        max: 55,
        subLabel: 'DTPA Status',
        valueSuffix: ' mg/l',
        valueDecimals: 1,
        colorScheme: 'redToGreen',
      };
    case 'zincZn':
      return {
        labels: [
          { value: 0, label: 'Very Low' },
          { value: 1, label: 'Low' },
          { value: 2.5, label: 'Normal' },
          { value: 4, label: 'High' },
          { value: 5, label: 'Very High' },
        ],
        min: 0,
        max: 5,
        subLabel: 'DTPA Status',
        valueSuffix: ' mg/l',
        valueDecimals: 2,
        colorScheme: 'redToGreen',
      };
    case 'boronB':
      return {
        labels: [
          { value: 0, label: 'Very Low' },
          { value: 0.7, label: 'Low' },
          { value: 1.75, label: 'Normal' },
          { value: 2.8, label: 'High' },
          { value: 3.5, label: 'Very High' },
        ],
        min: 0,
        max: 3.5,
        subLabel: 'DTPA Status',
        valueSuffix: ' mg/l',
        valueDecimals: 0,
        colorScheme: 'redToGreen',
      };
    default:
      return {
        labels: [],
        min: 0,
        max: 100,
        subLabel: '',
        valueSuffix: '%',
        valueDecimals: 0,
        colorScheme: 'default',
      };
  }
};

export const getChartTypeFromMetricId = (
  metricId: string
): 'bullet' | 'gauge' => {
  const bulletChartIds = [
    'ph-grassland',
    'ph-cereals-maize',
    'phosphorous-p-grassland',
    'phosphorous-p-other-crop',
    'potassium-k-mineral-soil',
    'potassium-k-peat-soil',
  ];
  return bulletChartIds.includes(metricId) ? 'bullet' : 'gauge';
};

export const getVariantFromMetricId = (
  metricId: string
): SoilDashboardProps['variant'] => {
  const variantMap: Record<string, SoilDashboardProps['variant']> = {
    'ph-grassland': 'phRangeGrassland',
    'ph-cereals-maize': 'phRangeCerealsMaize',
    'lime-requirement': 'lime',
    'phosphorous-p-grassland': 'pIndexGrassland',
    'phosphorous-p-other-crop': 'pIndexOtherCrops',
    'potassium-k-mineral-soil': 'kIndexMineralSoil',
    'potassium-k-peat-soil': 'kIndexPeatSoil',
    'organic-matter-om': 'organicMatter',
    'magnesium-mg': 'magnesiumMg',
    'calcium-c': 'calciumC',
    'copper-cu': 'copperCu',
    'manganese-mn': 'manganeseMn',
    'zinc-zn': 'zincZn',
    'boron-b': 'boronB',
    // Group keys
    ph: 'phRangeGrassland',
    'phosphorous-p': 'pIndexGrassland',
    'potassium-k': 'kIndexMineralSoil',
  };
  return variantMap[metricId] || 'ph';
};
