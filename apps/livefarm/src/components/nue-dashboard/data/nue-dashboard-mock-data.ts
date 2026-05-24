export const fieldLevelChartData = {
  value: 87,
  max: 100,
  target: 85,
  benchmark: 70,
  filledColor: '#FFC652',
};

export const farmGateChartData = {
  value: 50,
  max: 100,
  target: 80,
  benchmark: 65,
  filledColor: '#ff323f',
};

export const metricCardsData = {
  farmSize: {
    title: 'Farm Size',
    value: '55 ha',
    description: '5 fields managed',
  },
  nBalance: {
    title: 'N Balance',
    value: '515',
    description: 'kg N surplus/deficit',
  },
  inputIntensity: {
    title: 'Input Intensity',
    value: '144',
    description: 'kg N/ha total inputs',
  },
  outputIntensity: {
    title: 'Output Intensity',
    value: '135',
    description: 'kg N/ha total outputs',
  },
};

export interface FlowDataItem {
  name: string;
  value: number;
  color: string;
}

export const fieldLevelFlowData = {
  inputs: [
    {
      name: 'Manure/Slurry N',
      value: 162.0,
      color: '#10B981',
    },
    {
      name: 'Fertilizer N',
      value: 356.4,
      color: '#3B82F6',
    },
    {
      name: 'Soil N Mineralisation',
      value: 200.0,
      color: '#F59E0B',
    },
  ] as FlowDataItem[],
  outputs: [
    {
      name: 'Silage N Offtake',
      value: 522.0,
      color: '#10B981',
    },
    {
      name: 'Grazed N Offtake',
      value: 105.6,
      color: '#F59E0B',
    },
  ] as FlowDataItem[],
};

export const farmGateFlowData = {
  inputs: [
    {
      name: 'N in Purchased Feed',
      value: 10920.0,
      color: '#10B981',
    },
    {
      name: 'N in Purchased Fertilizer',
      value: 356.4,
      color: '#3B82F6',
    },
    {
      name: 'N from Legumes',
      value: 1365.0,
      color: '#F59E0B',
    },
  ] as FlowDataItem[],
  outputs: [
    {
      name: 'N in Crops Sold',
      value: 600.6,
      color: '#10B981',
    },
    {
      name: 'N in Milk Sold',
      value: 3549.0,
      color: '#8B5CF6',
    },
  ] as FlowDataItem[],
};

export const trendsKPIData = {
  averageNUE: 90.2,
  trend: -6.2,
  bestPerformance: 95.0,
  lowestPerformance: 82.1,
};

export interface MonthlyNUEData {
  month: string;
  value: number;
}

export const monthlyNUEData: MonthlyNUEData[] = [
  { month: 'Jan 2024', value: 88 },
  { month: 'Feb 2024', value: 90 },
  { month: 'Mar 2024', value: 85 },
  { month: 'Apr 2024', value: 94 },
  { month: 'May 2024', value: 94 },
  { month: 'Jun 2024', value: 94 },
  { month: 'Jul 2024', value: 94 },
  { month: 'Aug 2024', value: 82 },
  { month: 'Sep 2024', value: 85 },
  { month: 'Oct 2024', value: 88 },
  { month: 'Nov 2024', value: 82 },
  { month: 'Dec 2024', value: 87 },
  { month: 'Jan 2025', value: 89 },
  { month: 'Feb 2025', value: 91 },
  { month: 'Mar 2025', value: 87 },
  { month: 'Apr 2025', value: 93 },
  { month: 'May 2025', value: 95 },
  { month: 'Jun 2025', value: 96 },
  { month: 'Jul 2025', value: 94 },
  { month: 'Aug 2025', value: 90 },
  { month: 'Sep 2025', value: 88 },
  { month: 'Oct 2025', value: 86 },
  { month: 'Nov 2025', value: 84 },
  { month: 'Dec 2025', value: 88 },
];

export interface MonthlyNitrogenFlowData {
  month: string;
  input: number;
  output: number;
}

export const monthlyNitrogenFlowData: MonthlyNitrogenFlowData[] = [
  { month: 'Jan 2024', input: 600, output: 725 },
  { month: 'Feb 2024', input: 700, output: 665 },
  { month: 'Mar 2024', input: 755, output: 705 },
  { month: 'Apr 2024', input: 525, output: 725 },
  { month: 'May 2024', input: 500, output: 485 },
  { month: 'Jun 2024', input: 565, output: 685 },
  { month: 'Jul 2024', input: 785, output: 725 },
  { month: 'Aug 2024', input: 525, output: 495 },
  { month: 'Sep 2024', input: 700, output: 600 },
  { month: 'Oct 2024', input: 415, output: 525 },
  { month: 'Nov 2024', input: 555, output: 725 },
  { month: 'Dec 2024', input: 600, output: 465 },
  { month: 'Jan 2025', input: 620, output: 740 },
  { month: 'Feb 2025', input: 710, output: 680 },
  { month: 'Mar 2025', input: 765, output: 720 },
  { month: 'Apr 2025', input: 540, output: 735 },
  { month: 'May 2025', input: 510, output: 500 },
  { month: 'Jun 2025', input: 580, output: 700 },
  { month: 'Jul 2025', input: 800, output: 740 },
  { month: 'Aug 2025', input: 540, output: 510 },
  { month: 'Sep 2025', input: 720, output: 620 },
  { month: 'Oct 2025', input: 430, output: 540 },
  { month: 'Nov 2025', input: 570, output: 740 },
  { month: 'Dec 2025', input: 620, output: 480 },
];

export interface CombinedViewData {
  month: string;
  input: number;
  output: number;
  nue: number;
}

export const combinedViewData: CombinedViewData[] = [
  { month: 'Jan 2024', input: 600, output: 720, nue: 85 },
  { month: 'Feb 2024', input: 700, output: 680, nue: 88 },
  { month: 'Mar 2024', input: 700, output: 750, nue: 90 },
  { month: 'Apr 2024', input: 520, output: 720, nue: 90 },
  { month: 'May 2024', input: 500, output: 480, nue: 90 },
  { month: 'Jun 2024', input: 550, output: 680, nue: 90 },
  { month: 'Jul 2024', input: 780, output: 720, nue: 90 },
  { month: 'Aug 2024', input: 520, output: 480, nue: 70 },
  { month: 'Sep 2024', input: 700, output: 600, nue: 72 },
  { month: 'Oct 2024', input: 420, output: 520, nue: 80 },
  { month: 'Nov 2024', input: 550, output: 780, nue: 70 },
  { month: 'Dec 2024', input: 600, output: 480, nue: 80 },
  { month: 'Jan 2025', input: 620, output: 735, nue: 86 },
  { month: 'Feb 2025', input: 710, output: 690, nue: 89 },
  { month: 'Mar 2025', input: 765, output: 760, nue: 91 },
  { month: 'Apr 2025', input: 540, output: 735, nue: 91 },
  { month: 'May 2025', input: 510, output: 490, nue: 91 },
  { month: 'Jun 2025', input: 580, output: 695, nue: 91 },
  { month: 'Jul 2025', input: 800, output: 735, nue: 91 },
  { month: 'Aug 2025', input: 540, output: 490, nue: 71 },
  { month: 'Sep 2025', input: 720, output: 610, nue: 73 },
  { month: 'Oct 2025', input: 430, output: 530, nue: 81 },
  { month: 'Nov 2025', input: 570, output: 790, nue: 71 },
  { month: 'Dec 2025', input: 620, output: 490, nue: 81 },
];
  
export interface SeasonalPerformanceData {
  season: string;
  value: number;
}

export const seasonalPerformanceData: SeasonalPerformanceData[] = [
  { season: 'Winter', value: 91.2 },
  { season: 'Spring', value: 95.0 },
  { season: 'Summer', value: 88.8 },
  { season: 'Autumn', value: 85.9 },
];

