'use client';

import React, { useState, useMemo } from 'react';
import { ActionCard } from '../../components/action-card';
import { StatsCard } from '../../components/stats-card';
import { ApplicationHistoryTable } from './application-history-table';
import { RecordApplicationForm } from './record-application-form';
import { MOCK_APPLICATIONS } from '../../utils/mock-data';

export function NitrogenInputsContent() {
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const totalApplications = MOCK_APPLICATIONS.length;
    const totalNApplied = MOCK_APPLICATIONS.reduce(
      (sum, app) => sum + app.nValue,
      0
    );
    const avgPerApplication =
      totalApplications > 0 ? totalNApplied / totalApplications : 0;

    return {
      totalApplications,
      totalNApplied: totalNApplied.toFixed(1),
      avgPerApplication: avgPerApplication.toFixed(1),
    };
  }, []);

  if (showForm) {
    return (
      <RecordApplicationForm
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
          title="Record Application"
          subtitle="Log fertilizer or slurry application"
          icon="water_drop"
          iconColor="#2563eb"
          bgColor="bg-blue-50"
          onClick={() => setShowForm(true)}
        />
        <ActionCard
          title="Quick Entry"
          subtitle="Add multiple applications"
          icon="add"
          iconColor="#16a34a"
          bgColor="bg-green-50"
          onClick={() => {
            // TODO: Implement quick entry
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications.toString()}
          valueColor="text-blue-600"
        />
        <StatsCard
          title="Total N Applied"
          value={`${stats.totalNApplied} kg/ha`}
          valueColor="text-green-600"
        />
        <StatsCard
          title="Avg per Application"
          value={`${stats.avgPerApplication} kg/ha`}
          valueColor="text-orange-600"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-basic-black mb-4">
          Application History
        </h2>
        <ApplicationHistoryTable applications={MOCK_APPLICATIONS} />
      </div>
    </div>
  );
}
