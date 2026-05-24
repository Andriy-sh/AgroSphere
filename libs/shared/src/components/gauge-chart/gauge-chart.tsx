'use client';

import React, { useId } from 'react';
import { PieChart, Pie, Sector, Customized } from 'recharts';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const gaugeVariants = cva('relative flex items-center justify-center', {
  variants: {
    colorScheme: {
      default: '',
      redToGreen: '',
      redToBlue: '',
      greenToRed: '',
    },
  },
  defaultVariants: {
    colorScheme: 'default',
  },
});

type Label = {
  value: number;
  label: string;
  position?: 'arc' | 'bottom-left' | 'bottom-right' | 'top-center';
  color?: string;
};

export interface GaugeChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof gaugeVariants> {
  value?: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  showValueLabel?: boolean;
  valueSuffix?: string;
  subLabel?: string;
  labels?: Label[];
  showPointer?: boolean;
  valueDecimals?: number;
}

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 250;
const DEFAULT_MIN_WIDTH = 100;
const DEFAULT_MIN_HEIGHT = 100;
const START_ANGLE_PIE = 180;
const END_ANGLE_PIE = 0;

export function GaugeChart(props: GaugeChartProps) {
  const {
    className,
    colorScheme,
    value = 4,
    min = 0,
    max = 8,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    minWidth = DEFAULT_MIN_WIDTH,
    minHeight = DEFAULT_MIN_HEIGHT,
    showValueLabel = true,
    valueSuffix = '%',
    subLabel = '',
    labels = [],
    showPointer = true,
    valueDecimals = 0,
  } = props;

  const uniqueGradientId = `gaugeGradient-${useId()}`;

  const clampedValue = Math.max(min, Math.min(max, value));
  const totalRange = max - min;
  const filledLength = clampedValue - min;
  const remainingLength = totalRange - filledLength;

  const chartCenter = { cx: width / 2, cy: height - 30 };
  const outerRadius = Math.min(width / 2, height) * 0.9;
  const innerRadius = outerRadius * 0.8;

  const gradientX1 = chartCenter.cx - outerRadius;
  const gradientX2 = chartCenter.cx + outerRadius;

  const pieData = [
    { name: 'Filled', value: filledLength, fill: `url(#${uniqueGradientId})` },
    { name: 'Remaining', value: remainingLength, fill: '#EEF0F6' },
  ];

  const getPositionOnArc = (val: number, radius: number, offset = 0) => {
    const angleRange = START_ANGLE_PIE - END_ANGLE_PIE;
    const percentage = totalRange > 0 ? (val - min) / totalRange : 0;
    const angle = START_ANGLE_PIE - percentage * angleRange;
    const radians = (angle * Math.PI) / 180;
    const x = chartCenter.cx + (radius + offset) * Math.cos(radians);
    const y = chartCenter.cy - (radius + offset) * Math.sin(radians);
    return { x, y, angle };
  };

  const pointerPosition = getPositionOnArc(clampedValue, innerRadius);

  const divisionMarkers: number[] = [];
  [0.2, 0.4, 0.6, 0.8].forEach((p) => {
    divisionMarkers.push(min + totalRange * p);
  });

  const renderGradientStops = () => {
    switch (colorScheme) {
      case 'redToGreen':
        return (
          <>
            <stop offset="8.29%" stopColor="#FF352E" stopOpacity="0.8" />
            <stop offset="34.76%" stopColor="#DFA72C" stopOpacity="0.8" />
            <stop offset="69.64%" stopColor="#6AE730" stopOpacity="0.8" />
            <stop offset="95.8%" stopColor="#4B8630" stopOpacity="0.8" />
          </>
        );

      case 'redToBlue':
        return (
          <>
            <stop offset="8.29%" stopColor="#FF352E" stopOpacity="0.8" />
            <stop offset="40.17%" stopColor="#6AE730" stopOpacity="0.8" />
            <stop offset="85.17%" stopColor="#41B0FF" stopOpacity="0.8" />
            <stop offset="95.8%" stopColor="#0078CD" stopOpacity="0.8" />
          </>
        );

      case 'greenToRed':
        return (
          <>
            <stop offset="8.29%" stopColor="#4B8630" stopOpacity="0.8" />
            <stop offset="34.45%" stopColor="#6AE730" stopOpacity="0.8" />
            <stop offset="69.33%" stopColor="#DFA72C" stopOpacity="0.8" />
            <stop offset="95.8%" stopColor="#FF352E" stopOpacity="0.8" />
          </>
        );

      case 'default':
      default:
        return (
          <>
            <stop offset="5%" stopColor="#FF352ECC" />
            <stop offset="15%" stopColor="#DFA72CCC" />
            <stop offset="20%" stopColor="#FFFF00CC" />
            <stop offset="30%" stopColor="#6AE730CC" />
            <stop offset="70%" stopColor="#41B0FFCC" />
            <stop offset="80%" stopColor="#0078CDCC" />
          </>
        );
    }
  };

  return (
    <div
      className={clsx(
        gaugeVariants({ colorScheme, className }),
        'outline-none'
      )}
      style={{
        width,
        height,
        minWidth,
        minHeight,
      }}
    >
      <PieChart width={width} height={height} className="outline-none">
        <defs>
          <linearGradient
            className="outline-none"
            id={uniqueGradientId}
            gradientUnits="userSpaceOnUse"
            x1={gradientX1}
            y1={chartCenter.cy}
            x2={gradientX2}
            y2={chartCenter.cy}
          >
            {renderGradientStops()}
          </linearGradient>
        </defs>

        <Pie
          data={pieData}
          dataKey="value"
          cx={chartCenter.cx}
          cy={chartCenter.cy}
          startAngle={START_ANGLE_PIE}
          endAngle={END_ANGLE_PIE}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={0}
          cornerRadius={10}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-in-out"
          animationBegin={0}
          className="outline-none"
        ></Pie>

        <Customized
          component={() => (
            <>
              {divisionMarkers.map((divValue, index) => {
                const innerOffset = -7;
                const { x: x1, y: y1 } = getPositionOnArc(
                  divValue,
                  innerRadius + innerOffset
                );
                const { x: x2, y: y2 } = getPositionOnArc(
                  divValue,
                  outerRadius
                );

                const offsetX = 6;
                const offsetY = -2;

                return (
                  <line
                    key={`div-${index}`}
                    x1={x1 + offsetX}
                    y1={y1 + offsetY}
                    x2={x2 + offsetX}
                    y2={y2 + offsetY}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              })}
            </>
          )}
        />

        <g>
          {labels.map((label, index) => {
            if (label.value === min) {
              return (
                <text
                  key={index}
                  x={chartCenter.cx - outerRadius}
                  y={chartCenter.cy + 20}
                  fill={label.color || '#333'}
                  textAnchor="start"
                  dominantBaseline="hanging"
                  fontSize="12"
                  fontWeight="500"
                >
                  {label.label}
                </text>
              );
            }
            if (label.value === max) {
              return (
                <text
                  key={index}
                  x={chartCenter.cx + outerRadius}
                  y={chartCenter.cy + 20}
                  fill={label.color || '#333'}
                  textAnchor="end"
                  dominantBaseline="hanging"
                  fontSize="12"
                  fontWeight="500"
                >
                  {label.label}
                </text>
              );
            }

            const { x, y, angle } = getPositionOnArc(
              label.value,
              outerRadius + 15
            );
            let textAnchor = 'middle';
            if (angle > 90 && angle <= 180) textAnchor = 'end';
            else if (angle >= 0 && angle < 90) textAnchor = 'start';

            return (
              <text
                key={index}
                x={x}
                y={y}
                fill={label.color || '#333'}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="500"
              >
                {label.label}
              </text>
            );
          })}
        </g>

        {showPointer && (
          <g style={{ zIndex: 9999 }}>
            {(() => {
              const { angle } = pointerPosition;
              const RAD = Math.PI / 180;

              const iR = innerRadius;
              const oR = outerRadius;
              const cx = chartCenter.cx;
              const cy = chartCenter.cy;
              const total = totalRange;
              const current = clampedValue - min;

              const ang = 180.0 * (1 - current / total);
              const sin = Math.sin(-RAD * ang);
              const cos = Math.cos(-RAD * ang);

              const length = oR * 1;
              const startLength = iR * 0.9;
              const arrowHeight = 8;
              const arrowWidth = 6;

              const x0 = cx + 5;
              const y0 = cy + 5;

              const innerPointX = x0 + startLength * cos;
              const innerPointY = y0 + startLength * sin;

              const baseLength = startLength + arrowHeight;
              const outerPointX = x0 + baseLength * cos;
              const outerPointY = y0 + baseLength * sin;

              const perpAng = ang - 90;
              const pSin = Math.sin(-RAD * perpAng);
              const pCos = Math.cos(-RAD * perpAng);
              const halfWidth = arrowWidth / 2;

              const newTipX = outerPointX;
              const newTipY = outerPointY;

              const xBase1 = innerPointX + halfWidth * pCos;
              const yBase1 = innerPointY + halfWidth * pSin;
              const xBase2 = innerPointX - halfWidth * pCos;
              const yBase2 = innerPointY - halfWidth * pSin;

              const xp = x0 + length * cos;
              const yp = y0 + length * sin;

              return (
                <>
                  <line
                    x1={innerPointX}
                    y1={innerPointY}
                    x2={xp}
                    y2={yp}
                    stroke="#000"
                    strokeWidth={1}
                  />

                  <path
                    d={`M ${xBase1},${yBase1} L ${newTipX},${newTipY} L ${xBase2},${yBase2} Z`}
                    fill="#000"
                    stroke="none"
                  />
                </>
              );
            })()}
          </g>
        )}
      </PieChart>

      {showValueLabel && (
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center font-semibold text-basic-black z-10 text-[28px] flex flex-col"
          style={{
            bottom: `${(height - outerRadius) / 2 + 16}px`,
          }}
        >
          {clampedValue.toFixed(valueDecimals)}
          {valueSuffix}
          {subLabel && (
            <div className="font-normal text-xs text-basic-gray whitespace-nowrap">
              {subLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
