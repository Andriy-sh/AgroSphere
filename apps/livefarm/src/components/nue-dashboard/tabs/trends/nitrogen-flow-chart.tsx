'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { type TimePeriod } from '../../dashboard-tabs';
import { filterMonthlyData } from '../../utils/data-filter';
import { monthlyNitrogenFlowData } from '../../data/all-tabs-mock-data';

interface NitrogenFlowChartProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function NitrogenFlowChart({
  timePeriod,
  customStartDate,
  customEndDate,
}: NitrogenFlowChartProps) {
  const filteredData = filterMonthlyData(
    monthlyNitrogenFlowData,
    timePeriod,
    customStartDate,
    customEndDate
  );

  if (filteredData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-basic-gray text-lg mb-2">No data available</p>
          <p className="text-basic-gray text-sm">
            Please select a different time period
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 800]}
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          formatter={(value, name) => {
            if (value === undefined || name === undefined) {
              return ['N/A', 'N/A'];
            }
            return [
              `${value} kg N/ha`,
              name === 'input' ? 'Input' : 'Output',
            ];
          }}
          labelFormatter={(label) => label}
        />
        <Legend
          formatter={(value) => (value === 'input' ? 'Input' : 'Output')}
        />
        <Bar dataKey="input" fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="output" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
