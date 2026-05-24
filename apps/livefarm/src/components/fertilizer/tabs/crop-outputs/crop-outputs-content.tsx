'use client';

import React, { useState, useMemo } from 'react';
import { ActionCard } from '../../components/action-card';
import { StatsCard } from '../../components/stats-card';
import { HarvestHistoryTable } from './harvest-history-table';
import { RecordHarvestForm } from './record-harvest-form';
import { MOCK_HARVESTS } from '../../utils/mock-data';

export function CropOutputsContent() {
  const [showForm, setShowForm] = useState(false);
  const [harvestType, setHarvestType] = useState<'silage' | 'grazing'>(
    'silage'
  );

  const stats = useMemo(() => {
    const totalHarvests = MOCK_HARVESTS.length;
    const totalNRemoved = MOCK_HARVESTS.reduce(
      (sum, harvest) => sum + harvest.nValue,
      0
    );
    const totalYield = MOCK_HARVESTS.reduce((sum, harvest) => {
      const yieldNum = parseFloat(harvest.yield.replace(/[^\d.]/g, ''));
      return sum + (isNaN(yieldNum) ? 0 : yieldNum);
    }, 0);
    const avgYield = totalHarvests > 0 ? totalYield / totalHarvests : 0;

    return {
      totalHarvests,
      totalNRemoved: totalNRemoved.toFixed(1),
      avgYield: avgYield.toFixed(1),
    };
  }, []);

  if (showForm) {
    return (
      <RecordHarvestForm
        harvestType={harvestType}
        onCancel={() => setShowForm(false)}
        onSave={() => {
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          title="Record Silage Cut"
          subtitle="Log silage harvest and yield"
          icon="content_cut"
          iconColor="#16a34a"
          bgColor="bg-green-50"
          onClick={() => {
            setHarvestType('silage');
            setShowForm(true);
          }}
        />
        <ActionCard
          title="Record Grazing"
          subtitle="Log grazing activity and yield"
          icon="eco"
          iconColor="#9333ea"
          bgColor="bg-purple-50"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Harvests"
          value={stats.totalHarvests.toString()}
          valueColor="text-green-600"
        />
        <StatsCard
          title="Total N Removed"
          value={`${stats.totalNRemoved} kg/ha`}
          valueColor="text-blue-600"
        />
        <StatsCard
          title="Avg Yield"
          value={`${stats.avgYield} t/ha`}
          valueColor="text-orange-600"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-basic-black mb-4">
          Harvest History
        </h2>
        <HarvestHistoryTable harvests={MOCK_HARVESTS} />
      </div>
    </div>
  );
}
