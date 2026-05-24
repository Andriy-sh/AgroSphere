'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { type TimePeriod } from '../../dashboard-tabs';
import { filterMonthlyData } from '../../utils/data-filter';
import { combinedViewData } from '../../data/all-tabs-mock-data';

const CustomDot = ({ cx, cy }: { cx?: number; cy?: number }) => {
  if (cx === undefined || cy === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#EF4444"
      stroke="white"
      strokeWidth={2}
    />
  );
};

interface CombinedViewChartProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function CombinedViewChart({
  timePeriod,
  customStartDate,
  customEndDate,
}: CombinedViewChartProps) {
  const filteredData = filterMonthlyData(
    combinedViewData,
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
      <ComposedChart
        data={filteredData}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          domain={[0, 800]}
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
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
          content={({ active, payload, label }) => {
            if (!active || !payload || !payload.length) return null;

            // Сортуємо payload: спочатку input, output, потім nue
            const sortedPayload = [...payload].sort((a, b) => {
              const order: { [key: string]: number } = {
                input: 1,
                output: 2,
                nue: 3,
              };
              return (
                (order[a.dataKey as string] || 999) -
                (order[b.dataKey as string] || 999)
              );
            });

            return (
              <div className="bg-white p-2 border border-basic-gray-light rounded shadow-lg">
                <p className="font-semibold mb-2">{label}</p>
                {sortedPayload.map((entry, index) => {
                  const value = entry.value as number;
                  const name = entry.dataKey as string;
                  let displayValue: string;
                  let displayName: string;

                  if (name === 'nue') {
                    displayValue = `${value}%`;
                    displayName = 'NUE';
                  } else {
                    displayValue = `${value} kg N/ha`;
                    displayName = name === 'input' ? 'Input' : 'Output';
                  }

                  return (
                    <p
                      key={index}
                      className="text-sm"
                      style={{ color: entry.color }}
                    >
                      <span className="font-medium">{displayName}:</span>{' '}
                      {displayValue}
                    </p>
                  );
                })}
              </div>
            );
          }}
        />
        <Legend
          formatter={(value) => {
            if (value === 'input') return 'Input';
            if (value === 'output') return 'Output';
            if (value === 'nue') return 'NUE';
            return value;
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="input"
          fill="#10B981"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="left"
          dataKey="output"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="nue"
          stroke="#EF4444"
          strokeWidth={2}
          dot={<CustomDot />}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
