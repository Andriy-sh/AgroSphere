'use client';

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
  PieSectorDataItem,
} from 'recharts';

interface ActivePieChartProps {
  value: number;
  max: number;
  filledColor?: string;
  emptyColor?: string;
  width?: number | string;
  height?: number | string;
  innerRadius?: number | `${number}%`;
  outerRadius?: number | `${number}%`;
  isAnimationActive?: boolean;
  showPercentage?: boolean;
  percentage?: number;
  scale?: number;
  showTooltip?: boolean;
  activeShape?: boolean;
}

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name === 'filled' ? 'Filled' : 'Remaining'}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`Value ${value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export function ActivePieChart({
  value,
  max,
  filledColor = '#FFC652',
  emptyColor = '#dbdee8',
  width,
  height,
  innerRadius,
  outerRadius,
  isAnimationActive = true,
  showPercentage = false,
  percentage,
  scale = 1,
  showTooltip = false,
  activeShape = false,
}: ActivePieChartProps) {
  const clampedValue = Math.max(0, Math.min(max, value));
  const remainingValue = max - clampedValue;

  const data = [
    { name: 'filled', value: clampedValue },
    { name: 'empty', value: remainingValue },
  ];

  const innerRadiusFinal: number | `${number}%` = innerRadius ?? '60%';
  const outerRadiusFinal: number | `${number}%` = outerRadius ?? '80%';

  const displayPercentage = percentage ?? (clampedValue / max) * 100;
  const shouldShowPercentage = showPercentage || percentage !== undefined;

  if (width && height) {
    const chartWidth = typeof width === 'number' ? width : 300;
    const chartHeight = typeof height === 'number' ? height : 300;

    return (
      <div
        className="relative w-full h-full"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        <PieChart
          width={chartWidth}
          height={chartHeight}
          margin={
            activeShape
              ? { top: 50, right: 120, bottom: 50, left: 120 }
              : undefined
          }
        >
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataItem = payload[0].payload as {
                    name: string;
                    value: number;
                  };
                  const displayValue =
                    dataItem.name === 'filled' ? value : max - value;
                  const displayPercentage = (
                    (displayValue / max) *
                    100
                  ).toFixed(1);
                  return (
                    <div className="bg-white p-2 border border-basic-gray-light rounded shadow-lg">
                      <p className="font-semibold text-sm">
                        {dataItem.name === 'filled' ? 'Filled' : 'Remaining'}
                      </p>
                      <p className="text-sm">
                        {displayValue} / {max} ({displayPercentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadiusFinal}
            outerRadius={outerRadiusFinal}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={isAnimationActive}
            animationBegin={0}
            animationDuration={1000}
            activeShape={activeShape ? renderActiveShape : undefined}
          >
            <Cell key="filled" fill={filledColor} />
            <Cell key="empty" fill={emptyColor} />
          </Pie>
        </PieChart>
        {shouldShowPercentage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-basic-black">
              {displayPercentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={
            activeShape
              ? { top: 50, right: 120, bottom: 50, left: 120 }
              : undefined
          }
        >
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataItem = payload[0].payload as {
                    name: string;
                    value: number;
                  };
                  const displayValue =
                    dataItem.name === 'filled' ? value : max - value;
                  const displayPercentage = (
                    (displayValue / max) *
                    100
                  ).toFixed(1);
                  return (
                    <div className="bg-white p-2 border border-basic-gray-light rounded shadow-lg">
                      <p className="font-semibold text-sm">
                        {dataItem.name === 'filled' ? 'Filled' : 'Remaining'}
                      </p>
                      <p className="text-sm">
                        {displayValue} / {max} ({displayPercentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadiusFinal}
            outerRadius={outerRadiusFinal}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={isAnimationActive}
            animationBegin={0}
            animationDuration={1000}
            activeShape={activeShape ? renderActiveShape : undefined}
          >
            <Cell key="filled" fill={filledColor} />
            <Cell key="empty" fill={emptyColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {shouldShowPercentage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-basic-black">
            {displayPercentage.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
