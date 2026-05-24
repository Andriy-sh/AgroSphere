'use client';

import { useMemo } from 'react';
import { AreaChart, SplitCard } from '@@agrosphere/shared';
import { type TimePeriod } from '../../dashboard-tabs';
import { getFilteredFieldPerformanceData } from '../../utils/data-filter';

interface EfficiencyIntensityChartProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function EfficiencyIntensityChart({
  timePeriod,
  customStartDate,
  customEndDate,
}: EfficiencyIntensityChartProps) {
  const filteredData = useMemo(
    () =>
      getFilteredFieldPerformanceData(
        timePeriod,
        customStartDate,
        customEndDate
      ),
    [timePeriod, customStartDate, customEndDate]
  );

  const efficiencyData = useMemo(
    () =>
      [...filteredData]
        .sort((a, b) => a.nIn - b.nIn)
        .map((field) => ({
          input: field.nIn,
          output: field.nOut,
          field: field.field,
        })),
    [filteredData]
  );

  return (
    <SplitCard
      topContent={
        <h2 className="text-lg font-semibold text-basic-black">
          Efficiency vs Intensity
        </h2>
      }
      topClassName="border-b border-basic-gray-light"
      hideBottom={true}
      additionalSections={[
        {
          content: (
            <div className="flex flex-col">
              <AreaChart
                data={efficiencyData}
                height={300}
                xAxisLabel="N Input (kg/ha)"
                yAxisLabel="N Output (kg)"
                tooltipFormatter={(value: number) => [
                  `${value.toFixed(1)} kg`,
                  'N Output',
                ]}
                tooltipLabelFormatter={(label, payload) => {
                  const fieldName = payload?.[0]?.payload?.field || '';
                  return `Field: ${fieldName} | N Input: ${label} kg/ha`;
                }}
              />
            </div>
          ),
          className: 'p-5',
        },
      ]}
    />
  );
}
