'use client';

import { ReactNode } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart as RechartsAreaChart,
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';

export interface AreaChartDataItem {
  input: number;
  output: number;
  field?: string;
  [key: string]: any;
}

export interface AreaChartProps {
  data: AreaChartDataItem[];
  height?: number | string;
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisDomain?: [number, number] | [string, string];
  yAxisDomain?: [number, number] | [string, string];
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: {
    start?: number;
    end?: number;
  };
  tooltipFormatter?: (
    value: number,
    name: string,
    props: any
  ) => [string, string];
  tooltipLabelFormatter?: (
    label: any,
    payload: ReadonlyArray<Payload<number, string>>
  ) => ReactNode;
  className?: string;
  showGrid?: boolean;
  hideAxisLines?: boolean;
  hideTickLines?: boolean;
  axisTickStyle?: {
    fontSize?: number;
    fill?: string;
  };
}

export function AreaChart({
  data,
  height = 300,
  xAxisDataKey = 'input',
  yAxisDataKey = 'output',
  xAxisLabel,
  yAxisLabel,
  xAxisDomain,
  yAxisDomain,
  margin = { top: 20, right: 30, left: 20, bottom: 10 },
  strokeColor = '#3B82F6',
  fillColor = '#3B82F6',
  fillOpacity = { start: 0.3, end: 0 },
  tooltipFormatter,
  tooltipLabelFormatter,
  className = '',
  showGrid = true,
  hideAxisLines = false,
  hideTickLines = false,
  axisTickStyle = { fontSize: 12 },
}: AreaChartProps) {
  const maxOutput = Math.max(...data.map((d) => d[yAxisDataKey]));
  const maxInput = Math.max(...data.map((d) => d[xAxisDataKey]));

  const gradientId = `areaGradient-${Math.random().toString(36).substr(2, 9)}`;

  // #region agent log
  const defaultTooltipFormatter = (
    value: number | undefined,
    name?: string | undefined
  ) => {
    
    if (value === undefined) return ['N/A', 'N Output'];
    return [`${value.toFixed(1)} kg`, 'N Output'];
  };
  // #endregion

  const defaultTooltipLabelFormatter = (
    label: any,
    payload: ReadonlyArray<Payload<number, string>>
  ) => {
    const fieldName = payload?.[0]?.payload?.field || '';
    return `Field: ${fieldName} | N Input: ${label} kg/ha`;
  };

  return (
    <div
      className={className}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={margin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={fillColor}
                stopOpacity={fillOpacity.start ?? 0.3}
              />
              <stop
                offset="100%"
                stopColor={fillColor}
                stopOpacity={fillOpacity.end ?? 0}
              />
            </linearGradient>
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            dataKey={xAxisDataKey}
            tick={{
              fontSize: axisTickStyle?.fontSize ?? 12,
              fill: axisTickStyle?.fill,
            }}
            tickLine={hideTickLines ? false : undefined}
            axisLine={hideAxisLines ? false : undefined}
            domain={xAxisDomain || [0, Math.ceil(maxInput / 5) * 5]}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: 'insideBottom',
                    offset: -5,
                    style: { fontSize: 12 },
                  }
                : undefined
            }
          />
          <YAxis
            tick={{
              fontSize: axisTickStyle?.fontSize ?? 12,
              fill: axisTickStyle?.fill,
            }}
            tickLine={hideTickLines ? false : undefined}
            axisLine={hideAxisLines ? false : undefined}
            domain={yAxisDomain || [0, Math.ceil(maxOutput / 5) * 5]}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 12 },
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value, name) => {
              if (
                tooltipFormatter &&
                value !== undefined &&
                name !== undefined
              ) {
                return tooltipFormatter(value, name, {});
              }
              return defaultTooltipFormatter(value, name);
            }}
            labelFormatter={
              tooltipLabelFormatter || defaultTooltipLabelFormatter
            }
          />
          <Area
            type="monotone"
            dataKey={yAxisDataKey}
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
