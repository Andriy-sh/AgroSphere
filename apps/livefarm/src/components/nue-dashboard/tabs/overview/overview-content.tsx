'use client';

import { useMemo } from 'react';
import { FieldLevelChart } from './field-level-chart';
import { FarmGateChart } from './farm-gate-chart';
import { FieldLevelFlow } from './field-level-flow';
import { FarmGateFlow } from './farm-gate-flow';
import { MetricCard } from './metric-card';
import { type TimePeriod } from '../../dashboard-tabs';
import { getFilteredOverviewData } from '../../utils/data-filter';

interface OverviewContentProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function OverviewContent({
  timePeriod,
  customStartDate,
  customEndDate,
}: OverviewContentProps) {
  const filteredData = useMemo(
    () => getFilteredOverviewData(timePeriod, customStartDate, customEndDate),
    [timePeriod, customStartDate, customEndDate]
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FieldLevelChart
          value={filteredData.fieldLevelChart.value}
          max={filteredData.fieldLevelChart.max}
          target={filteredData.fieldLevelChart.target}
          benchmark={filteredData.fieldLevelChart.benchmark}
          filledColor={filteredData.fieldLevelChart.filledColor}
        />
        <FarmGateChart
          value={filteredData.farmGateChart.value}
          max={filteredData.farmGateChart.max}
          target={filteredData.farmGateChart.target}
          benchmark={filteredData.farmGateChart.benchmark}
          filledColor={filteredData.farmGateChart.filledColor}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={filteredData.metrics.farmSize.title}
          value={filteredData.metrics.farmSize.value}
          description={filteredData.metrics.farmSize.description}
        />
        <MetricCard
          title={filteredData.metrics.nBalance.title}
          value={filteredData.metrics.nBalance.value}
          description={filteredData.metrics.nBalance.description}
        />
        <MetricCard
          title={filteredData.metrics.inputIntensity.title}
          value={filteredData.metrics.inputIntensity.value}
          description={filteredData.metrics.inputIntensity.description}
        />
        <MetricCard
          title={filteredData.metrics.outputIntensity.title}
          value={filteredData.metrics.outputIntensity.value}
          description={filteredData.metrics.outputIntensity.description}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FieldLevelFlow
          flowData={filteredData.fieldLevelFlow}
          isEmpty={
            timePeriod === 'custom-range' &&
            (!customStartDate || !customEndDate)
          }
        />
        <FarmGateFlow
          flowData={filteredData.farmGateFlow}
          isEmpty={
            timePeriod === 'custom-range' &&
            (!customStartDate || !customEndDate)
          }
        />
      </div>
    </>
  );
}

