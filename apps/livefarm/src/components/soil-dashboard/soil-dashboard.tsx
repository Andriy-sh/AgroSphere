'use client';

import { useState } from 'react';
import SoilDashboardMap from '@/components/soil-dashboard/soil-dashboard-map';
import AveragePhCard from '@/components/soil-dashboard/average-ph-card';
import FarmTree from '@/components/soil-dashboard/farm-tree';
import SoilDashboardCharts from '@/components/soil-dashboard/soil-dashboard-charts';
import type { SelectedEntity } from '@/data/soildashboard-data';
import { getEntityType, getEntityName } from '@/data/soildashboard-data';
import type { MapParcel } from '@@agrosphere/shared';

export default function SoilDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(
    null
  );
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>('ph');

  const handleChartClick = (metricId: string | null) => {
    if (selectedMetricId === metricId) {
      setSelectedMetricId('ph');
    } else {
      setSelectedMetricId(metricId);
    }
  };

  const handleParcelClick = (parcel: MapParcel) => {
    const entityType = getEntityType(parcel.id);
    const entityName = getEntityName(parcel.id);

    if (entityType && entityName) {
      setSelectedEntity({
        type: entityType,
        id: parcel.id,
        name: entityName,
      } as SelectedEntity);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen min-h-0 gap-2">
      <div className="flex-1 flex gap-2 items-stretch overflow-hidden">
        <FarmTree
          selectedEntity={selectedEntity}
          onSelect={setSelectedEntity}
        />

        <div className="flex flex-col h-full w-[30%] border border-basic-gray-light rounded-xl bg-white p-4 overflow-y-auto">
          <SoilDashboardCharts
            selectedEntity={selectedEntity}
            onChartClick={handleChartClick}
          />
        </div>

        <div className="flex flex-col h-full w-[50%] min-h-0 gap-2">
          <div
            className={`${
              isFullscreen ? 'h-full' : 'h-[60%]'
            } border border-basic-gray-light rounded-xl bg-basic-white`}
          >
            <SoilDashboardMap
              selectedEntity={selectedEntity}
              selectedMetricId={selectedMetricId}
              onParcelClick={handleParcelClick}
            />
          </div>

          <AveragePhCard
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </div>
    </div>
  );
}
