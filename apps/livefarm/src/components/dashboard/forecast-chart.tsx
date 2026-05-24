'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { SplitCard } from '@@agrosphere/shared';
import { CustomSelect } from '@@agrosphere/shared';
import { cn } from '@@agrosphere/shared';

type ForecastDay = {
  day: string;
  date: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
};

const mockData: ForecastDay[] = [
  {
    day: 'Mon',
    date: 'Aug 11',
    icon: 'cloud',
    tempMax: 13,
    tempMin: 9,
    precipitation: 0,
  },
  {
    day: 'Tue',
    date: 'Aug 12',
    icon: 'sun',
    tempMax: 13,
    tempMin: 10,
    precipitation: 0,
  },
  {
    day: 'Wed',
    date: 'Aug 13',
    icon: 'sun',
    tempMax: 15,
    tempMin: 12,
    precipitation: 2.5,
  },
  {
    day: 'Thu',
    date: 'Aug 14',
    icon: 'cloud',
    tempMax: 14,
    tempMin: 11,
    precipitation: 5,
  },
  {
    day: 'Fri',
    date: 'Aug 15',
    icon: 'rain',
    tempMax: 13,
    tempMin: 10,
    precipitation: 15,
  },
  {
    day: 'Sat',
    date: 'Aug 16',
    icon: 'rain',
    tempMax: 14,
    tempMin: 11,
    precipitation: 10,
  },
  {
    day: 'Sun',
    date: 'Aug 17',
    icon: 'rain',
    tempMax: 13,
    tempMin: 10,
    precipitation: 7,
  },
  {
    day: 'Mon',
    date: 'Aug 18',
    icon: 'storm',
    tempMax: 15,
    tempMin: 12,
    precipitation: 25,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'sun':
      return <Sun className="w-5 h-5 text-yellow-500" />;
    case 'rain':
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    case 'storm':
      return <CloudLightning className="w-5 h-5 text-gray-500" />;
    default:
      return <Cloud className="w-5 h-5 text-gray-400" />;
  }
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  value?: number;
  color?: string;
  isTemperature?: boolean;
}

const CustomDot = ({ cx, cy, value, color, isTemperature }: CustomDotProps) => {
  if (cx === undefined || cy === undefined) return null;
  const unit = isTemperature ? '°C' : 'mm';

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize={12}
        fill={color}
        fontWeight="bold"
      >
        {value}
        {unit}
      </text>
    </g>
  );
};

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    payload?: ForecastDay;
  };
}

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  const data = payload?.payload;
  if (!data) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {data.day}
      </text>
    </g>
  );
};

export function ForecastChart({ className }: { className?: string }) {
  const [chartType, setChartType] = useState('temperature');

  const isTemperatureChart = chartType === 'temperature';
  const dataKeyPrimary = isTemperatureChart ? 'tempMax' : 'precipitation';
  const dataKeySecondary = isTemperatureChart ? 'tempMin' : undefined;

  const tempsMin = mockData.map((d) => d.tempMin);
  const tempsMax = mockData.map((d) => d.tempMax);
  const precipitations = mockData.map((d) => d.precipitation);

  const minTemp = Math.min(...tempsMin);
  const maxTemp = Math.max(...tempsMax);
  const maxPrecipitation = Math.max(...precipitations);

  const domainMin = isTemperatureChart ? minTemp - 2 : -2;
  const domainMax = isTemperatureChart ? maxTemp + 2 : maxPrecipitation + 5;

  const weatherOptions = [
    { value: 'temperature', label: 'Temperature' },
    { value: 'precipitation', label: 'Precipitation' },
  ];

  return (
    <SplitCard
      topClassName="flex justify-between items-center text-basic-black"
      className={cn('max-h-[370px]', className)}
      topContent={
        <>
          <h2 className="text-base font-semibold">8-day forecast</h2>
          <CustomSelect
            options={weatherOptions}
            defaultValue="temperature"
            placeholder="Select weather type"
            value={chartType}
            onValueChange={setChartType}
            popupClassName="w-[150px]"
            triggerClassName="text-sm w-[150px]"
            className="w-[150px]"
          />
        </>
      }
      bottomContent={
        <>
          <div className="grid grid-cols-8 text-center mb-4">
            {mockData.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">{d.day}</span>
                <span className="text-xs text-gray-500">{d.date}</span>
                {getIcon(d.icon)}
              </div>
            ))}
          </div>

          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid
                  vertical={true}
                  horizontal={false}
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomXAxisTick />}
                />
                <YAxis
                  hide
                  domain={[domainMin, domainMax]}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={dataKeyPrimary}
                  stroke={isTemperatureChart ? '#ef4444' : '#3b82f6'}
                  strokeWidth={2}
                  dot={(props) => (
                    <CustomDot
                      {...props}
                      color={isTemperatureChart ? '#ef4444' : '#3b82f6'}
                      isTemperature={isTemperatureChart}
                    />
                  )}
                  isAnimationActive={false}
                />
                {isTemperatureChart && (
                  <Line
                    type="monotone"
                    dataKey={dataKeySecondary}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={(props) => (
                      <CustomDot
                        {...props}
                        color="#3b82f6"
                        isTemperature={isTemperatureChart}
                      />
                    )}
                    isAnimationActive={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    />
  );
}
