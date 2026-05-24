'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { type TimePeriod } from '../../dashboard-tabs';
import { filterMonthlyData } from '../../utils/data-filter';
import { monthlyNUEData } from '../../data/all-tabs-mock-data';

const CustomDot = ({ cx, cy }: { cx?: number; cy?: number }) => {
  if (cx === undefined || cy === undefined) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#3B82F6"
      stroke="white"
      strokeWidth={2}
    />
  );
};

interface NUEPerformanceChartProps {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function NUEPerformanceChart({
  timePeriod,
  customStartDate,
  customEndDate,
}: NUEPerformanceChartProps) {
  const filteredData = filterMonthlyData(
    monthlyNUEData,
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
      <LineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[75, 100]}
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
          formatter={(value) => {
            if (value === undefined) return ['N/A', 'NUE'];
            return [`${value}%`, 'NUE'];
          }}
          labelFormatter={(label) => label}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={<CustomDot />}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
