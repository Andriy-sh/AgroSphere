'use client';

import React, { useState, useMemo } from 'react';
import { ActionCard } from '../../components/action-card';
import { StatsCard } from '../../components/stats-card';
import { TestHistoryTable } from './test-history-table';
import { RecordSoilTestForm } from './record-soil-test-form';
import { MOCK_SOIL_TESTS } from '../../utils/mock-data';

export function SoilAnalysisContent() {
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const totalTests = MOCK_SOIL_TESTS.length;
    const avgSoilN =
      MOCK_SOIL_TESTS.reduce((sum, test) => sum + test.nValue, 0) / totalTests;
    const latestTest = MOCK_SOIL_TESTS[0]?.date || 'N/A';

    return {
      totalTests,
      avgSoilN: avgSoilN.toFixed(1),
      latestTest,
    };
  }, []);

  if (showForm) {
    return (
      <RecordSoilTestForm
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
          title="Record Soil Test"
          subtitle="Log soil N-Min test results"
          icon="description"
          iconColor="#9333ea"
          bgColor="bg-purple-50"
          onClick={() => setShowForm(true)}
        />
        <ActionCard
          title="Lab Results Upload"
          subtitle="Import test results from lab"
          icon="science"
          iconColor="#ea580c"
          bgColor="bg-orange-50"
          onClick={() => {
            // TODO: Implement lab results upload
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Tests"
          value={stats.totalTests.toString()}
          valueColor="text-purple-600"
        />
        <StatsCard
          title="Avg Soil N"
          value={`${stats.avgSoilN} kg/ha`}
          valueColor="text-green-600"
        />
        <StatsCard
          title="Latest Test"
          value={stats.latestTest}
          valueColor="text-blue-600"
        />
      </div>

      {/* Test History Table */}
      <div>
        <h2 className="text-lg font-semibold text-basic-black mb-4">
          Test History
        </h2>
        <TestHistoryTable tests={MOCK_SOIL_TESTS} />
      </div>
    </div>
  );
}
