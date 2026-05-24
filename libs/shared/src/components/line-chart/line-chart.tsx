'use client';

import { ReactNode } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart as RechartsLineChart,
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';

export interface LineChartDataItem {
  [key: string]: any;
}

export interface LineChartProps {
  data: LineChartDataItem[];
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
  strokeWidth?: number;
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
  showDot?: boolean;
  dotColor?: string;
  dotRadius?: number;
  dotStrokeColor?: string;
  dotStrokeWidth?: number;
  showActiveDot?: boolean;
  activeDotRadius?: number;
  lineType?:
    | 'monotone'
    | 'linear'
    | 'natural'
    | 'step'
    | 'stepBefore'
    | 'stepAfter';
}

export function LineChart({
  data,
  height = 300,
  xAxisDataKey = 'x',
  yAxisDataKey = 'y',
  xAxisLabel,
  yAxisLabel,
  xAxisDomain,
  yAxisDomain,
  margin = { top: 20, right: 30, left: 20, bottom: 10 },
  strokeColor = '#3B82F6',
  strokeWidth = 2,
  tooltipFormatter,
  tooltipLabelFormatter,
  className = '',
  showGrid = true,
  hideAxisLines = false,
  hideTickLines = false,
  axisTickStyle = { fontSize: 12 },
  showDot = true,
  dotColor = '#3B82F6',
  dotRadius = 4,
  dotStrokeColor = 'white',
  dotStrokeWidth = 2,
  showActiveDot = true,
  activeDotRadius = 6,
  lineType = 'monotone',
}: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d[yAxisDataKey] || 0));
  const minValue = Math.min(...data.map((d) => d[yAxisDataKey] || 0));

  const defaultTooltipFormatter = (
    value: number | undefined,
    name?: string | undefined
  ) => {
    if (value === undefined) return ['N/A', 'Value'];
    return [`${value.toFixed(1)}`, 'Value'];
  };

  const defaultTooltipLabelFormatter = (
    label: any,
    payload: ReadonlyArray<Payload<number, string>>
  ) => {
    return String(label);
  };

  const CustomDot = ({ cx, cy }: { cx?: number; cy?: number }) => {
    if (cx === undefined || cy === undefined) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={dotRadius}
        fill={dotColor}
        stroke={dotStrokeColor}
        strokeWidth={dotStrokeWidth}
      />
    );
  };

  return (
    <div
      className={className}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={margin}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            dataKey={xAxisDataKey}
            tick={{
              fontSize: axisTickStyle?.fontSize ?? 12,
              fill: axisTickStyle?.fill,
            }}
            tickLine={hideTickLines ? false : undefined}
            axisLine={hideAxisLines ? false : undefined}
            domain={xAxisDomain}
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
            domain={yAxisDomain}
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
          <Line
            type={lineType}
            dataKey={yAxisDataKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dot={showDot ? <CustomDot /> : false}
            activeDot={showActiveDot ? { r: activeDotRadius } : false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
