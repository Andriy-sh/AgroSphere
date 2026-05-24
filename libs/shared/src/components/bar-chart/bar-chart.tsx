'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export interface BarChartDataItem {
  name: string;
  value: number;
  fill?: string;
}

const barChartVariants = cva('w-full', {
  variants: {
    colorScheme: {
      default: '',
      black: '',
      blue: '',
      green: '',
    },
    showTooltip: {
      true: '',
      false: '',
    },
    showBorder: {
      true: '',
      false: '',
    },
    labelTruncate: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    colorScheme: 'default',
    showTooltip: true,
    showBorder: false,
    labelTruncate: true,
  },
});

export interface BarChartProps extends VariantProps<typeof barChartVariants> {
  data: BarChartDataItem[];
  height?: number | string;
  xAxisAngle?: number;
  xAxisHeight?: number;
  yAxisDomain?: [number, number] | [string, string];
  yAxisTickFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  tooltipLabelFormatter?: (label: string) => string;
  barRadius?: number | [number, number, number, number];
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  className?: string;
  barWidth?: number;
  minChartWidth?: number;
  labelMaxLength?: number;
}

const CustomTick = ({
  x,
  y,
  payload,
  maxLength = 12,
}: {
  x: number;
  y: number;
  payload: { value: string };
  maxLength?: number;
}) => {
  const text = payload.value;
  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  return (
    <text
      x={x}
      y={y}
      dy={16}
      textAnchor="middle"
      fill="#666"
      fontSize={12}
      className="truncate"
    >
      {truncatedText}
    </text>
  );
};

export function BarChart({
  data,
  height = 256,
  xAxisAngle = -45,
  xAxisHeight = 80,
  yAxisDomain,
  yAxisTickFormatter,
  tooltipFormatter,
  tooltipLabelFormatter,
  barRadius = [4, 4, 0, 0],
  margin = { top: 10, right: 10, left: 10, bottom: 10 },
  className = '',
  colorScheme = 'default',
  showTooltip = true,
  showBorder = false,
  labelTruncate = true,
  barWidth,
  minChartWidth,
  labelMaxLength = 12,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const calculatedYAxisMax = Math.ceil(maxValue / 1000) * 1000;
  const finalYAxisDomain = yAxisDomain || [0, calculatedYAxisMax];

  const getDefaultColor = () => {
    switch (colorScheme) {
      case 'black':
        return '#000000';
      case 'blue':
        return '#3B82F6';
      case 'green':
        return '#10B981';
      default:
        return '#3B82F6';
    }
  };

  const chartWidth =
    barWidth && minChartWidth
      ? Math.max(data.length * barWidth + 100, minChartWidth)
      : undefined;

  const chartContent = (
    <RechartsBarChart
      data={data}
      margin={margin}
      className={showBorder ? 'border border-basic-gray-light rounded' : ''}
    >
      <XAxis
        dataKey="name"
        angle={labelTruncate ? 0 : xAxisAngle}
        textAnchor={labelTruncate ? 'middle' : 'end'}
        height={xAxisHeight}
        tick={
          labelTruncate
            ? (props: { x: number; y: number; payload: { value: string } }) => (
                <CustomTick {...props} maxLength={labelMaxLength} />
              )
            : { fontSize: 12 }
        }
        interval={0}
      />
      <YAxis
        domain={finalYAxisDomain}
        tick={{ fontSize: 12 }}
        tickFormatter={yAxisTickFormatter || ((value) => `${value}`)}
      />
      {showTooltip && (
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const dataItem = payload[0].payload as BarChartDataItem;
              const value = dataItem.value;
              const name = dataItem.name;

              return (
                <div className="bg-white p-2 border border-basic-gray-light rounded shadow-lg">
                  <p className="font-semibold">
                    {tooltipLabelFormatter ? tooltipLabelFormatter(name) : name}
                  </p>
                  <p className="text-sm">
                    {tooltipFormatter
                      ? tooltipFormatter(value, name)[0]
                      : `${value.toFixed(1)}`}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      )}
      <Bar
        dataKey="value"
        radius={barRadius}
        barSize={barWidth ? barWidth * 0.6 : undefined}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill || getDefaultColor()} />
        ))}
      </Bar>
    </RechartsBarChart>
  );

  const chartHeightValue =
    typeof height === 'number'
      ? height
      : typeof height === 'string'
      ? parseInt(height.replace('px', '')) || 256
      : 256;

  return (
    <div
      className={cn(
        barChartVariants({
          colorScheme,
          showTooltip,
          showBorder,
          labelTruncate,
        }),
        className
      )}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {chartWidth ? (
        <div
          className="w-full overflow-x-auto"
          style={{ height: `${chartHeightValue}px` }}
        >
          <div
            style={{
              width: `${chartWidth}px`,
              height: `${chartHeightValue}px`,
            }}
          >
            <ResponsiveContainer width={chartWidth} height={chartHeightValue}>
              {chartContent}
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {chartContent}
        </ResponsiveContainer>
      )}
    </div>
  );
}
