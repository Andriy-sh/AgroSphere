'use client';

import { useMemo } from 'react';
import { BarChart, BarChartDataItem } from '@@agrosphere/shared';
import { SplitCard } from '@@agrosphere/shared';
import { type TimePeriod } from '../../dashboard-tabs';
import { getFilteredFieldPerformanceData } from '../../utils/data-filter';
import { getPerformanceDistribution } from '../../data/all-tabs-mock-data';

interface PerformanceDistributionChartProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function PerformanceDistributionChart({
  timePeriod,
  customStartDate,
  customEndDate,
}: PerformanceDistributionChartProps) {
  const filteredData = useMemo(
    () =>
      getFilteredFieldPerformanceData(
        timePeriod,
        customStartDate,
        customEndDate
      ),
    [timePeriod, customStartDate, customEndDate]
  );

  const distribution = getPerformanceDistribution(filteredData);

  const distributionData: BarChartDataItem[] = [
    { name: '90%+', value: distribution['90%+'], fill: '#000000' },
    { name: '75-89%', value: distribution['75-89%'], fill: '#000000' },
    { name: '60-74%', value: distribution['60-74%'], fill: '#000000' },
    { name: '<60%', value: distribution['<60%'], fill: '#000000' },
  ];

  const maxValue = Math.max(...distributionData.map((d) => d.value));
  return (
    <SplitCard
      topContent={
        <h2 className="text-lg font-semibold text-basic-black">
          Performance Distribution
        </h2>
      }
      topClassName="border-b border-basic-gray-light"
      hideBottom={true}
      additionalSections={[
        {
          content: (
            <div className="flex flex-col w-full">
              <BarChart
                data={distributionData}
                height={300}
                yAxisDomain={[0, Math.max(maxValue, 5)]}
                tooltipFormatter={(value) => [`${value} fields`, '']}
                margin={{ top: 20, right: 10, left: -20, bottom: -40 }}
                xAxisAngle={0}
              />
            </div>
          ),
          className: '!px-0 py-5',
        },
      ]}
    />
  );
}
