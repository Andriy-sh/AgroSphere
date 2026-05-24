import { type TimePeriod } from '../dashboard-tabs';
import {
  monthlyNUEData,
  monthlyNitrogenFlowData,
  combinedViewData,
  fieldLevelFlowData,
  farmGateFlowData,
  fieldLevelChartData,
  farmGateChartData,
  metricCardsData,
  getFieldPerformanceDataFromParcels,
  type CombinedViewData,
  type MonthlyNUEData,
  type MonthlyNitrogenFlowData,
} from '../data/all-tabs-mock-data';

const parseMonthString = (monthStr: string): Date => {
  const [monthName, year] = monthStr.split(' ');
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const monthIndex = monthMap[monthName] ?? 0;
  return new Date(parseInt(year), monthIndex, 1);
};

export const filterMonthlyData = <T extends { month: string; date?: string }>(
  data: T[],
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
): T[] => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  switch (timePeriod) {
    case 'all-time':
      return data;
    case 'year-to-date':
      return data.filter((item) => {
        const itemDate = item.date
          ? new Date(item.date.split('T')[0])
          : parseMonthString(item.month);
        return itemDate.getFullYear() === currentYear;
      });
    case 'full-year-2025':
      return data.filter((item) => item.month.includes('2025'));
    case 'previous-year-2024':
      return data.filter((item) => item.month.includes('2024'));
    case 'custom-range': {
      if (!customStartDate || !customEndDate) {
        return [];
      }
      const startDate = new Date(customStartDate.split('T')[0]);
      const endDate = new Date(customEndDate.split('T')[0]);
      return data.filter((item) => {
        const itemDate = item.date
          ? new Date(item.date.split('T')[0])
          : parseMonthString(item.month);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    default:
      return data;
  }
};

export const getFilteredTrendsData = (
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
) => {
  return {
    nueData: filterMonthlyData(
      monthlyNUEData,
      timePeriod,
      customStartDate,
      customEndDate
    ),
    nitrogenFlowData: filterMonthlyData(
      monthlyNitrogenFlowData,
      timePeriod,
      customStartDate,
      customEndDate
    ),
    combinedData: filterMonthlyData(
      combinedViewData,
      timePeriod,
      customStartDate,
      customEndDate
    ),
  };
};

export const getFilteredTrendsKPIData = (
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
) => {
  const filteredNueData = filterMonthlyData(
    monthlyNUEData,
    timePeriod,
    customStartDate,
    customEndDate
  );

  if (filteredNueData.length === 0) {
    return {
      averageNUE: 0,
      trend: 0,
      bestPerformance: 0,
      lowestPerformance: 0,
    };
  }

  const averageNUE =
    filteredNueData.reduce((sum, item) => sum + item.value, 0) /
    filteredNueData.length;

  const sortedData = [...filteredNueData].sort(
    (a, b) =>
      new Date(a.date || a.month).getTime() -
      new Date(b.date || b.month).getTime()
  );
  const trend =
    sortedData.length > 1
      ? sortedData[sortedData.length - 1].value - sortedData[0].value
      : 0;

  const values = filteredNueData.map((item) => item.value);
  const bestPerformance = Math.max(...values);
  const lowestPerformance = Math.min(...values);

  return {
    averageNUE: Math.round(averageNUE * 10) / 10,
    trend: Math.round(trend * 10) / 10,
    bestPerformance: Math.round(bestPerformance * 10) / 10,
    lowestPerformance: Math.round(lowestPerformance * 10) / 10,
  };
};

export const getFilteredOverviewData = (
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
) => {
  const filteredCombined = filterMonthlyData(
    combinedViewData,
    timePeriod,
    customStartDate,
    customEndDate
  );

  const filteredFields = getFilteredFieldPerformanceData(
    timePeriod,
    customStartDate,
    customEndDate
  );

  const totalArea = filteredFields.reduce((sum, field) => sum + field.area, 0);
  const uniqueFields = new Set(filteredFields.map((f) => f.field)).size;

  if (filteredCombined.length === 0) {
    return {
      fieldLevelChart: fieldLevelChartData,
      farmGateChart: farmGateChartData,
      metrics: {
        ...metricCardsData,
        farmSize: {
          ...metricCardsData.farmSize,
          value: `${Math.round(totalArea)} ha`,
          description: `${uniqueFields} fields managed`,
        },
      },
      fieldLevelFlow: fieldLevelFlowData,
      farmGateFlow: farmGateFlowData,
    };
  }

  const avgNUE =
    filteredCombined.reduce((sum, item) => sum + item.nue, 0) /
    filteredCombined.length;
  const totalInput = filteredCombined.reduce(
    (sum, item) => sum + item.input,
    0
  );
  const totalOutput = filteredCombined.reduce(
    (sum, item) => sum + item.output,
    0
  );

  const avgInputIntensity = totalInput / filteredCombined.length;
  const avgOutputIntensity = totalOutput / filteredCombined.length;
  const nBalance = totalInput - totalOutput;

  const originalInputTotal = fieldLevelFlowData.inputs.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const originalOutputTotal = fieldLevelFlowData.outputs.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const inputRatio = totalInput / originalInputTotal;
  const outputRatio = totalOutput / originalOutputTotal;

  return {
    fieldLevelChart: {
      ...fieldLevelChartData,
      value: Math.round(avgNUE),
    },
    farmGateChart: {
      ...farmGateChartData,
      value: Math.round((totalOutput / totalInput) * 100),
    },
    metrics: {
      ...metricCardsData,
      farmSize: {
        ...metricCardsData.farmSize,
        value: `${Math.round(totalArea)} ha`,
        description: `${uniqueFields} fields managed`,
      },
      nBalance: {
        ...metricCardsData.nBalance,
        value: Math.round(nBalance).toString(),
      },
      inputIntensity: {
        ...metricCardsData.inputIntensity,
        value: Math.round(avgInputIntensity).toString(),
      },
      outputIntensity: {
        ...metricCardsData.outputIntensity,
        value: Math.round(avgOutputIntensity).toString(),
      },
    },
    fieldLevelFlow: {
      inputs: fieldLevelFlowData.inputs.map((item) => ({
        ...item,
        value: item.value * inputRatio,
      })),
      outputs: fieldLevelFlowData.outputs.map((item) => ({
        ...item,
        value: item.value * outputRatio,
      })),
    },
    farmGateFlow: {
      inputs: farmGateFlowData.inputs.map((item) => ({
        ...item,
        value: item.value * inputRatio,
      })),
      outputs: farmGateFlowData.outputs.map((item) => ({
        ...item,
        value: item.value * outputRatio,
      })),
    },
  };
};

export const getFilteredFieldPerformanceData = (
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
) => {
  switch (timePeriod) {
    case 'all-time':
      return getFieldPerformanceDataFromParcels();
    case 'year-to-date': {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDate = new Date();
      return getFieldPerformanceDataFromParcels(
        currentYear as 2024 | 2025,
        `${currentYear}-01-01T00:00:00Z`,
        currentDate.toISOString()
      );
    }
    case 'full-year-2025':
      return getFieldPerformanceDataFromParcels(2025);
    case 'previous-year-2024':
      return getFieldPerformanceDataFromParcels(2024);
    case 'custom-range': {  
      if (customStartDate && customEndDate) {
        return getFieldPerformanceDataFromParcels(
          undefined,
          customStartDate,
          customEndDate
        );
      }
      return getFieldPerformanceDataFromParcels();
    }
    default:
      return getFieldPerformanceDataFromParcels();
  }
};

