'use client';

import { FieldPerformanceRankingChart } from './field-performance-ranking-chart';
import { PerformanceDistributionChart } from './performance-distribution-chart';
import { EfficiencyIntensityChart } from './efficiency-intensity-chart';
import { FieldPerformanceTable } from './field-performance-table';
import { type TimePeriod } from '../../dashboard-tabs';

interface FieldPerformanceContentProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function FieldPerformanceContent({
  timePeriod,
  customStartDate,
  customEndDate,
}: FieldPerformanceContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <FieldPerformanceRankingChart
            timePeriod={timePeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceDistributionChart
          timePeriod={timePeriod}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
        />
        <EfficiencyIntensityChart
          timePeriod={timePeriod}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
        />
      </div>
      <FieldPerformanceTable
        timePeriod={timePeriod}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
      />
    </>
  );
}

