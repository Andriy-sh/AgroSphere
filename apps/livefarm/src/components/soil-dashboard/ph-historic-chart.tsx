'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { PH_MIN, PH_MAX } from './soil-dashboard-map-utils';

interface PhHistoricChartProps {
  isFullscreen?: boolean;
}

const generateData = () => {
  const data = [];
  for (let year = 2000; year <= 2025; year++) {
    const grassland = 6.0 + Math.sin(year * 0.3) * 0.8 + Math.random() * 0.3;
    const cereals = 6.1 + Math.sin(year * 0.25) * 0.7 + Math.random() * 0.3;
    data.push({
      year: year.toString(),
      grassland: parseFloat(grassland.toFixed(1)),
      cereals: parseFloat(cereals.toFixed(1)),
    });
  }
  return data;
};

const data = generateData();

const getColorByValue = (value: number) => {
  const normalized = (value - PH_MIN) / (PH_MAX - PH_MIN);
  const clamped = Math.max(0, Math.min(1, normalized));

  const brown = { r: 139, g: 115, b: 85 };
  const blue = { r: 37, g: 99, b: 235 };

  const r = Math.round(brown.r + (blue.r - brown.r) * clamped);
  const g = Math.round(brown.g + (blue.g - brown.g) * clamped);
  const b = Math.round(brown.b + (blue.b - brown.b) * clamped);

  return `rgb(${r}, ${g}, ${b})`;
};

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: Record<string, unknown>;
  dataKey?: string;
}) => {
  const { cx, cy, payload, dataKey } = props;
  if (!payload || !dataKey) return null;

  const value = payload[dataKey] as number;
  const color = getColorByValue(value);

  return (
    <circle cx={cx} cy={cy} r={5} fill="white" stroke={color} strokeWidth={2} />
  );
};

export default function PhHistoricChart({
  isFullscreen = false,
}: PhHistoricChartProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        isFullscreen ? 'w-full h-screen' : 'w-full'
      }`}
    >
      <ResponsiveContainer width="100%" height={isFullscreen ? 500 : 300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
        >
          <defs>
            <linearGradient
              id="colorGrassland"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8B7355" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="colorCereals" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8B7355" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <YAxis
            domain={[PH_MIN, PH_MAX]}
            ticks={[PH_MIN, 6.0, 6.3, 6.5, 7.0, PH_MAX]}
            width={50}
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />

          <XAxis
            dataKey="year"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            interval={2}
          />

          <ReferenceLine
            y={6.3}
            stroke="#d1d5db"
            strokeDasharray="5 5"
            strokeWidth={1}
          />
          <ReferenceLine
            y={6.5}
            stroke="#d1d5db"
            strokeDasharray="5 5"
            strokeWidth={1}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number | undefined) =>
              value !== undefined ? value.toFixed(1) : ''
            }
          />
          <Legend />

          <Line
            type="monotone"
            dataKey="grassland"
            stroke="url(#colorGrassland)"
            strokeWidth={3}
            dot={(props) => {
              const { key, ...restProps } = props;
              return <CustomDot key={key} {...restProps} dataKey="grassland" />;
            }}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="cereals"
            stroke="url(#colorCereals)"
            strokeWidth={3}
            dot={(props) => {
              const { key, ...restProps } = props;
              return <CustomDot key={key} {...restProps} dataKey="cereals" />;
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
