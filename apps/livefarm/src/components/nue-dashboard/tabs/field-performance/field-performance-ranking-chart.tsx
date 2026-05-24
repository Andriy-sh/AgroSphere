'use client';

import { useMemo } from 'react';
import { BarChart, BarChartDataItem } from '@@agrosphere/shared';
import { SplitCard } from '@@agrosphere/shared';
import { type TimePeriod } from '../../dashboard-tabs';
import { getFilteredFieldPerformanceData } from '../../utils/data-filter';

interface FieldPerformanceRankingChartProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function FieldPerformanceRankingChart({
  timePeriod,
  customStartDate,
  customEndDate,
}: FieldPerformanceRankingChartProps) {
  const filteredData = useMemo(
    () =>
      getFilteredFieldPerformanceData(
        timePeriod,
        customStartDate,
        customEndDate
      ),
    [timePeriod, customStartDate, customEndDate]
  );

  const fieldData: BarChartDataItem[] = filteredData.map((field) => ({
    name: field.field,
    value: field.nue,
    fill: '#000000',
  }));

  const maxNue = Math.max(...filteredData.map((f) => f.nue));
  return (
    <SplitCard
      topContent={
        <h2 className="text-lg font-semibold text-basic-black">
          Field Performance Ranking
        </h2>
      }
      topClassName="border-b border-basic-gray-light"
      hideBottom={true}
      additionalSections={[
        {
          content: (
            <div className="flex flex-col w-full">
              <BarChart
                data={fieldData}
                height={400}
                yAxisDomain={[0, Math.ceil(maxNue / 10) * 10]}
                tooltipFormatter={(value) => [`${value.toFixed(1)}%`, 'NUE']}
                xAxisAngle={0}
                xAxisHeight={60}
                colorScheme="black"
                showTooltip={true}
                showBorder={false}
                labelMaxLength={12}
              />
            </div>
          ),
          className: 'p-5',
        },
      ]}
    />
  );
}
