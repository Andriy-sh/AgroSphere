'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { getAllParcelsPhData } from '@/data/soildashboard-data';
import { PH_MIN, PH_MAX } from './soil-dashboard-map-utils';

interface PhBarChartProps {
  isFullscreen?: boolean;
}

const phRanges = {
  'Beet, Beans, Peas and Oilseeds': 7.0,
  'Cereals and Maize': 6.3,
  Grassland: 6.5,
  Potatoes: 6.0,
  'Grassland (High Molybdenum)': 6.2,
};

export default function PhBarChart({ isFullscreen = false }: PhBarChartProps) {
  const phData = useMemo(() => getAllParcelsPhData(), []);
  const [activeBarName, setActiveBarName] = useState<string | null>(null);

  const handleBarClick = useCallback(
    (data: any) => {
      if (activeBarName === data.name) {
        setActiveBarName(null);
      } else {
        setActiveBarName(data.name);
      }
    },
    [activeBarName]
  );

  const clampedData = useMemo(() => {
    return phData.map((item) => ({
      ...item,
      ph: Math.min(PH_MAX, Math.max(PH_MIN, item.ph)),
    }));
  }, [phData]);

  const CustomBarShape = useCallback(
    (props: any) => {
      const { x, y, width, height, payload } = props;
      const isActive = activeBarName === payload.name;
      const shouldDim = activeBarName !== null && !isActive;
      const barRadius = 6;
      const circleRadius = 8;

      const minPh = PH_MIN;
      const maxPh = PH_MAX;
      const phRange = maxPh - minPh;
      const clampedPh = Math.max(minPh, Math.min(maxPh, payload.ph));

      const phFromMin = clampedPh - minPh;
      const phPercentage = phRange > 0 ? phFromMin / phRange : 0;

      const gradientId = `phGradient-${
        payload.name?.replace(/[^a-zA-Z0-9]/g, '') || 'bar'
      }-${x}-${clampedPh}`;

      const getColorAtPhPosition = (position: number): string => {
        const colors = [
          { pos: 0.0, color: '#FF352E' },
          { pos: 0.08, color: '#E08158' },
          { pos: 0.17, color: '#CD9858' },
          { pos: 0.25, color: '#BAB059' },
          { pos: 0.33, color: '#A5C759' },
          { pos: 0.5, color: '#6AE730' },
          { pos: 0.58, color: '#83E570' },
          { pos: 0.67, color: '#79D571' },
          { pos: 0.75, color: '#73CD8C' },
          { pos: 0.78, color: '#77D6A0' },
          { pos: 0.8, color: '#78D9AE' },
          { pos: 0.83, color: '#77D6B9' },
          { pos: 0.85, color: '#73D1C1' },
          { pos: 0.88, color: '#68C9C8' },
          { pos: 0.91, color: '#5BC0CF' },
          { pos: 0.95, color: '#41B1D5' },
          { pos: 1.0, color: '#5098CD' },
        ];

        for (let i = colors.length - 1; i >= 0; i--) {
          if (position >= colors[i].pos) {
            return colors[i].color;
          }
        }
        return colors[0].color;
      };

      return (
        <g>
          <defs>
            <linearGradient
              id={gradientId}
              gradientUnits="objectBoundingBox"
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop offset="0%" stopColor="#F36B58CC" stopOpacity={0.8} />

              {phPercentage >= 0.08 && (
                <stop
                  offset={`${(0.08 / phPercentage) * 100}%`}
                  stopColor="#E08158CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.17 && (
                <stop
                  offset={`${(0.17 / phPercentage) * 100}%`}
                  stopColor="#CD9858CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.25 && (
                <stop
                  offset={`${(0.25 / phPercentage) * 100}%`}
                  stopColor="#BAB059CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.33 && (
                <stop
                  offset={`${(0.33 / phPercentage) * 100}%`}
                  stopColor="#A5C759CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.42 && (
                <stop
                  offset={`${(0.42 / phPercentage) * 100}%`}
                  stopColor="#83D853CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.5 && (
                <stop
                  offset={`${(0.5 / phPercentage) * 100}%`}
                  stopColor="#7DD962CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.58 && (
                <stop
                  offset={`${(0.58 / phPercentage) * 100}%`}
                  stopColor="#83E570CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.67 && (
                <stop
                  offset={`${(0.67 / phPercentage) * 100}%`}
                  stopColor="#79D571CC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.75 && (
                <stop
                  offset={`${(0.75 / phPercentage) * 100}%`}
                  stopColor="#73CD8CCC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.83 && (
                <stop
                  offset={`${(0.83 / phPercentage) * 100}%`}
                  stopColor="#77D6ABCC"
                  stopOpacity={0.8}
                />
              )}
              {phPercentage >= 0.92 && (
                <stop
                  offset={`${(0.92 / phPercentage) * 100}%`}
                  stopColor="#73D1BCCC"
                  stopOpacity={0.8}
                />
              )}

              <stop
                offset="100%"
                stopColor={getColorAtPhPosition(phPercentage)}
                stopOpacity={0.8}
              />
            </linearGradient>
          </defs>

          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={barRadius}
            fill={`url(#${gradientId})`}
            style={{ cursor: 'pointer' }}
            opacity={shouldDim ? 0.3 : 1}
          />

          {isActive && (
            <>
              <text
                x={x + width / 2}
                y={y - circleRadius - 8}
                textAnchor="middle"
                dominantBaseline="baseline"
                style={{ pointerEvents: 'none', fontSize: '14px' }}
              >
                <tspan fill="#9CA3AF">
                  {payload.name}
                  {payload.id
                    ? ` Parcel ${payload.id.split('-').pop() || ''}`
                    : ''}
                  :
                </tspan>
                <tspan fill="#000000" fontWeight="bold">
                  {' '}
                  {clampedPh.toFixed(1)}
                </tspan>
              </text>
              <circle
                className="z-10"
                cx={x + width / 2}
                cy={y}
                r={circleRadius}
                fill="white"
                stroke="black"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
            </>
          )}
        </g>
      );
    },
    [activeBarName]
  );

  return (
    <div className="w-full h-full flex flex-1 overflow-x-auto">
      {/* <div className="flex-shrink-0 mb-10" style={{ width: '60px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={phData}>
            <YAxis
              domain={[PH_MIN, PH_MAX]}
              ticks={[PH_MIN, 6.0, 6.3, 6.5, 7.0, PH_MAX]}
              tickFormatter={(value) =>
                value === PH_MIN
                  ? `<${PH_MIN}`
                  : value === PH_MAX
                  ? `>${PH_MAX}`
                  : value.toFixed(1)
              }
              axisLine={false}
              tickLine={false}
              width={60}
              tick={{ fontSize: 12, fill: '#666' }}
              interval={0}
            />

            <ReferenceLine
              y={phRanges.Grassland}
              stroke="black"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
            <ReferenceLine
              y={phRanges['Cereals and Maize']}
              stroke="black"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      <div
        className="overflow-x-auto w-full"
        style={{
          minWidth: `${clampedData.length * 40}px`,
          height: '100%',
        }}
      >
        <ResponsiveContainer width="99%" height="100%">
          <BarChart
            data={clampedData}
            margin={{ top: 40, right: 16, left: 0, bottom: 16 }}
            barCategoryGap={4}
          >
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis
              orientation="left"
              domain={[PH_MIN, PH_MAX]}
              ticks={[PH_MIN, 6.0, 6.5, 7.0, PH_MAX]}
              tick={{ fontSize: 12 }}
            />

            <Bar
              dataKey="ph"
              shape={CustomBarShape}
              onClick={handleBarClick}
              minPointSize={1}
              min={40}
              maxBarSize={100}
              // barSize={40}
            />

            <ReferenceLine
              y={phRanges.Grassland}
              stroke="black"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
            <ReferenceLine
              y={phRanges['Cereals and Maize']}
              stroke="black"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
