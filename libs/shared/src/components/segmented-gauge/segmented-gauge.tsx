'use client';
import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

type Needle = {
  value: number;
  data: { name: string; value: number; color?: string; gradientId?: string }[];
  cx: number;
  cy: number;
  iR: number;
  oR: number;
  color: string;
};

const needle = ({ value, data, cx, cy, iR, oR, color }: Needle) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const ang = 180.0 * (1 - value / total);
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);

  const offsetX = 0;

  const startRadius = 40;
  const x1 = cx + offsetX + startRadius * cos;
  const y1 = cy + startRadius * sin;

  const lineLength = oR - 1;
  const x2 = cx + offsetX + lineLength * cos;
  const y2 = cy + lineLength * sin;

  return (
    <line
      key="needle-line"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={2}
      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
    />
  );
};

export function SegmentedGauge() {
  const [percentage, setPercentage] = useState(90);

  const cx = 200;
  const cy = 200;
  const iR = 70;
  const oR = 120;

  const segmentGradients = [
    { name: 'Very low', range: [0, 20], colors: ['#FF352E', '#FF6B45'] },
    { name: 'Low', range: [20, 40], colors: ['#FF8B55', '#DFA72C'] },
    { name: 'Normal', range: [40, 60], colors: ['#C9C932', '#9BDB3A'] },
    { name: 'High', range: [60, 80], colors: ['#7DD63F', '#6AE730'] },
    { name: 'Very high', range: [80, 100], colors: ['#5FBE30', '#4B8630'] },
  ];

  const chartData = segmentGradients
    .map((segment, segmentIndex) => {
      const [start, end] = segment.range;
      const segmentSize = 20;

      if (percentage >= end) {
        return {
          name: segment.name,
          value: segmentSize,
          gradientId: `gradient-${segmentIndex}`,
          filled: true,
        };
      } else if (percentage > start && percentage < end) {
        const filledPart = percentage - start;
        const emptyPart = end - percentage;

        return [
          {
            name: `${segment.name}-filled`,
            value: filledPart,
            gradientId: `gradient-${segmentIndex}`,
            filled: true,
          },
          {
            name: `${segment.name}-empty`,
            value: emptyPart,
            color: '#E0E0E0',
            filled: false,
          },
        ];
      } else {
        return {
          name: segment.name,
          value: segmentSize,
          color: '#E0E0E0',
          filled: false,
        };
      }
    })
    .flat();

  const getCurrentSegment = () => {
    for (const segment of segmentGradients) {
      if (percentage >= segment.range[0] && percentage < segment.range[1]) {
        return segment.name;
      }
      if (percentage >= segment.range[1] && segment.range[1] === 100) {
        return segment.name;
      }
    }
    return segmentGradients[segmentGradients.length - 1].name;
  };

  const currentSegment = getCurrentSegment();

  const labels = [
    { name: 'Very low', angle: 180, x: 55, y: 185 },
    { name: 'Low', angle: 144, x: 85, y: 95 },
    { name: 'Normal', angle: 90, x: 200, y: 60 },
    { name: 'High', angle: 36, x: 315, y: 95 },
    { name: 'Very high', angle: 0, x: 330, y: 185 },
  ];

  return (
    <div className="relative">
      <PieChart width={400} height={220}>
        <defs>
          {segmentGradients.map((segment, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={segment.colors[0]} />
              <stop offset="100%" stopColor={segment.colors[1]} />
            </linearGradient>
          ))}
        </defs>

        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={chartData}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`}
              fill={
                entry.gradientId ? `url(#${entry.gradientId})` : entry.color
              }
            />
          ))}
        </Pie>
        {needle({
          value: percentage,
          data: chartData,
          cx,
          cy,
          iR,
          oR,
          color: '#333333',
        })}
      </PieChart>

      {labels.map((label) => (
        <div
          key={label.name}
          className="absolute text-sm font-medium text-basic-black"
          style={{
            left: `${label.x}px`,
            top: `${label.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {label.name}
        </div>
      ))}

      <div className="absolute left-1/2 top-[140px] transform -translate-x-1/2 text-center">
        <div className="text-[28px] font-semibold text-basic-black">
          {percentage}%
        </div>
        <div className="text-xs text-basic-gray">TOP 10% nationally</div>
      </div>
    </div>
  );
}
