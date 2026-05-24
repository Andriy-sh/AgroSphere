'use client';

import { useState, useMemo } from 'react';
import { Calendar, Eye } from 'lucide-react';
import { Button, CustomSelect, SplitCard } from '@@agrosphere/shared';
import { NUEPerformanceChart } from './nue-performance-chart';
import { NitrogenFlowChart } from './nitrogen-flow-chart';
import { CombinedViewChart } from './combined-view-chart';
import { SeasonalPerformanceChart } from './seasonal-performance-chart';
import { getFilteredTrendsKPIData } from '../../utils/data-filter';
import { type TimePeriod } from '../../dashboard-tabs';

type ViewType = 'nue-performance' | 'nitrogen-flow' | 'combined-view';

const viewOptions = [
  { value: 'nue-performance', label: 'NUE Performance' },
  { value: 'nitrogen-flow', label: 'Nitrogen Flow' },
  { value: 'combined-view', label: 'Combined View' },
];

interface TrendsContentProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function TrendsContent({
  timePeriod,
  customStartDate,
  customEndDate,
}: TrendsContentProps) {
  const [viewType, setViewType] = useState<ViewType>('nue-performance');
  const [showSeasons, setShowSeasons] = useState(false);

  const kpiData = useMemo(
    () =>
      getFilteredTrendsKPIData(timePeriod, customStartDate, customEndDate),
    [timePeriod, customStartDate, customEndDate]
  );

  const handleViewChange = (value: string) => {
    setViewType(value as ViewType);
  };

  const toggleSeasons = () => {
    setShowSeasons(!showSeasons);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-basic-black">
            Trend Analysis
          </h2>
          <Calendar className="w-5 h-5 text-basic-gray" />
          <span className="text-sm text-basic-gray">Monthly View</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-basic-gray">View:</span>
            <CustomSelect
              options={viewOptions}
              value={viewType}
              onValueChange={handleViewChange}
              className="w-[180px]"
            />
          </div>
          <Button
            onClick={toggleSeasons}
            variant={showSeasons ? 'update' : 'outline'}
            size="sm"
            className={
              showSeasons
                ? ''
                : 'bg-white text-basic-black border-basic-gray-light hover:bg-basic-gray-light'
            }
          >
            <Eye className="w-4 h-4" />
            Seasons
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-basic-gray-light p-5">
          <h3 className="text-sm font-medium text-basic-gray mb-2">
            Average NUE
          </h3>
          <div className="text-3xl font-bold text-blue-600">
            {kpiData.averageNUE}%
          </div>
        </div>
        <div className="bg-white rounded-xl border border-basic-gray-light p-5">
          <h3 className="text-sm font-medium text-basic-gray mb-2">Trend</h3>
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <div className="text-3xl font-bold text-red-500">
              {kpiData.trend > 0 ? '+' : ''}
              {kpiData.trend}%
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-basic-gray-light p-5">
          <h3 className="text-sm font-medium text-basic-gray mb-2">
            Best Performance
          </h3>
          <div className="text-3xl font-bold text-green-600">
            {kpiData.bestPerformance}%
          </div>
        </div>
        <div className="bg-white rounded-xl border border-basic-gray-light p-5">
          <h3 className="text-sm font-medium text-basic-gray mb-2">
            Lowest Performance
          </h3>
          <div className="text-3xl font-bold text-red-600">
            {kpiData.lowestPerformance}%
          </div>
        </div>
      </div>

      <SplitCard
        topContent={
          <h2 className="text-base font-semibold text-basic-black">
            {viewType === 'nue-performance'
              ? 'NUE Performance'
              : viewType === 'nitrogen-flow'
              ? 'Nitrogen Flow'
              : 'Combined View'}
          </h2>
        }
        topClassName="border-b border-basic-gray-light"
        hideBottom={true}
        additionalSections={[
          {
            content: (
              <div className="w-full h-full min-h-[400px]">
                {viewType === 'nue-performance' && (
                  <NUEPerformanceChart
                    timePeriod={timePeriod}
                    customStartDate={customStartDate}
                    customEndDate={customEndDate}
                  />
                )}
                {viewType === 'nitrogen-flow' && (
                  <NitrogenFlowChart
                    timePeriod={timePeriod}
                    customStartDate={customStartDate}
                    customEndDate={customEndDate}
                  />
                )}
                {viewType === 'combined-view' && (
                  <CombinedViewChart
                    timePeriod={timePeriod}
                    customStartDate={customStartDate}
                    customEndDate={customEndDate}
                  />
                )}
              </div>
            ),
            className: 'flex-1 min-h-0 p-4',
          },
        ]}
      />

      {showSeasons && <SeasonalPerformanceChart />}
    </div>
  );
}

