'use client';

import { AreaChart, SplitCard } from '@@agrosphere/shared';
import { seasonalPerformanceData } from '../../data/all-tabs-mock-data';

const getColorForSeason = (value: number) => {
  if (value >= 95) return 'text-green-600';
  if (value >= 91) return 'text-blue-600';
  if (value >= 88) return 'text-orange-600';
  return 'text-red-600';
};

export function SeasonalPerformanceChart() {
  const chartData = seasonalPerformanceData.map((item) => ({
    ...item,
    input: 0,
    output: item.value,
  }));

  return (
    <SplitCard
      topContent={
        <h2 className="text-base font-semibold text-basic-black">
          Seasonal Performance Analysis
        </h2>
      }
      topClassName="border-b border-basic-gray-light"
      hideBottom={true}
      additionalSections={[
        {
          content: (
            <div className="w-full h-full min-h-[300px]">
              <AreaChart
                data={chartData}
                height={300}
                xAxisDataKey="season"
                yAxisDataKey="value"
                yAxisDomain={[0, 100]}
                strokeColor="#3B82F6"
                fillColor="#3B82F6"
                fillOpacity={{ start: 0.3, end: 0 }}
                showGrid={false}
                hideAxisLines={true}
                hideTickLines={true}
                axisTickStyle={{ fontSize: 12, fill: '#9ca3af' }}
                tooltipFormatter={(value: number) => [
                  `${value}%`,
                  'Performance',
                ]}
                tooltipLabelFormatter={(label: any) => String(label)}
              />
            </div>
          ),
          className: 'flex-1 min-h-0 p-4',
        },
        {
          content: (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seasonalPerformanceData.map((item) => (
                <div
                  key={item.season}
                  className="bg-white rounded-xl border border-basic-gray-light p-5 text-center"
                >
                  <h3 className="text-sm font-medium text-basic-gray mb-2">
                    {item.season}
                  </h3>
                  <div
                    className={`text-3xl font-bold ${getColorForSeason(
                      item.value
                    )}`}
                  >
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          ),
          className: 'p-5',
        },
      ]}
    />
  );
}
