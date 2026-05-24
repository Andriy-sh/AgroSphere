'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils';

type LabelItem = {
  value: number;
  label: string;
};

type BulletChartProps = {
  className?: string;
  title?: string;
  value?: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  minValueLabel?: string;
  maxValueLabel?: string;
  currentValueLabel?: string;
  targetValue?: number; 
  targetLabel?: string;
  labels?: LabelItem[];
};

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 100;
const CHART_MARGINS = { top: 0, right: 0, left: 0, bottom: 0 } as const;

export function BulletChart({
  className,
  title,
  value = 4,
  min = 0,
  max = 8,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  minValueLabel,
  maxValueLabel,
  currentValueLabel,
  targetValue,
  targetLabel,
  labels,
}: BulletChartProps) {
  const [hoveredLabel, setHoveredLabel] = useState<LabelItem | null>(null);

  const clampedValue = Math.max(min, Math.min(max, value));
  const totalRange = max - min;
  const filledLength = clampedValue - min;
  const remainingLength = max - clampedValue;

  const useMultipleLabels = labels && labels.length > 2;

  const data = [
    {
      name: 'Metric',
      value: filledLength,
      remaining: remainingLength,
    },
  ];

  const plotAreaWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;

  const valueAsPercentage = totalRange > 0 ? filledLength / totalRange : 0;
  const valueWidthInPixels = valueAsPercentage * plotAreaWidth;
  const leftOffsetInPixels = CHART_MARGINS.left + valueWidthInPixels;
  const currentValueLeftPercentage = (leftOffsetInPixels / width) * 100;

  const getLabelPosition = (labelValue: number): number => {
    const clampedLabelValue = Math.max(min, Math.min(max, labelValue));
    const labelLength = clampedLabelValue - min;
    const labelAsPercentage = totalRange > 0 ? labelLength / totalRange : 0;
    const labelWidthInPixels = labelAsPercentage * plotAreaWidth;
    const labelOffsetInPixels = CHART_MARGINS.left + labelWidthInPixels;
    return (labelOffsetInPixels / width) * 100;
  };

  let targetLeftPercentage = 0;
  if (targetValue !== undefined) {
    const clampedTarget = Math.max(min, Math.min(max, targetValue));
    const targetLength = clampedTarget - min;
    const targetAsPercentage = totalRange > 0 ? targetLength / totalRange : 0;
    const targetWidthInPixels = targetAsPercentage * plotAreaWidth;
    const targetOffsetInPixels = CHART_MARGINS.left + targetWidthInPixels;
    targetLeftPercentage = (targetOffsetInPixels / width) * 100;
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: width,
        margin: '0 auto',
      }}
    >
      <div className="relative mb-2 flex items-center text-xs ">
        {title && <div>{title}</div>}
        {targetLabel && targetValue !== undefined && (
          <div
            className={cn(
              'text-basic-gray absolute -translate-x-1/2 whitespace-nowrap transition-all duration-500 ease-out'
            )}
            style={{
              left: `${targetLeftPercentage}%`,
            }}
          >
            {targetLabel}
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        {targetValue !== undefined && (
          <div
            className="absolute top-0 z-10 -translate-x-1/2 flex items-center flex-col transition-all duration-500 ease-out"
            style={{
              height: `${height}px`,
              left: `${targetLeftPercentage}%`,
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: `6px solid #888`,
              }}
            />
            <div
              className="w-px border-l-2 border-dashed border-basic-gray mt-0.5"
              style={{
                flexGrow: 1,
              }}
            />
          </div>
        )}

        {currentValueLabel && (
          <div
            className="absolute top-0 z-10 flex flex-col-reverse items-center -translate-x-1/2 transition-all duration-500 ease-out"
            style={{
              height: `${height}px`,
              left: `${currentValueLeftPercentage}%`,
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '6px solid #000',
              }}
            />
            <div
              className="w-px bg-basic-black"
              style={{
                flexGrow: 1,
              }}
            />
          </div>
        )}

        <div
          className="absolute top-0 left-0 w-full h-full z-[2] pointer-events-none"
          style={{
            zIndex: 2,
          }}
        >
          {[20, 40, 60, 80].map((percentage) => (
            <div
              key={percentage}
              className="absolute top-0 h-full w-px bg-white -translate-x-1/2"
              style={{
                left: `${percentage}%`,
              }}
            />
          ))}
        </div>

        <ResponsiveContainer
          width="100%"
          height={height}
          style={{ outline: 'none' }}
        >
          <BarChart
            style={{ outline: 'none' }}
            width={width}
            height={height}
            data={data}
            layout="vertical"
            margin={CHART_MARGINS}
            stackOffset="expand"
            barCategoryGap={0}
          >
            <defs>
              <linearGradient
                id="fixedGradient"
                gradientUnits="userSpaceOnUse"
                x1={CHART_MARGINS.left}
                y1={0}
                x2={CHART_MARGINS.left + plotAreaWidth}
                y2={0}
              >
                <stop offset="5%" stopColor="#FF352ECC" />
                <stop offset="15%" stopColor="#DFA72CCC" />
                <stop offset="20%" stopColor="#FFFF00CC" />
                <stop offset="25%" stopColor="#6AE730CC" />
                <stop offset="70%" stopColor="#41B0FFCC" />
                <stop offset="80%" stopColor="#0078CDCC" />
              </linearGradient>
            </defs>

            <XAxis type="number" hide domain={[0, totalRange]} />
            <YAxis
              type="category"
              dataKey="name"
              hide
              padding={{ top: 0, bottom: 0 }}
            />

            <Bar
              dataKey="value"
              stackId="a"
              fill="url(#fixedGradient)"
              radius={[4, 0, 0, 4]}
            />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="#EEF0F6"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {useMultipleLabels ? (
        <div
          style={{
            width: '100%',
            margin: '8px auto 0',
            position: 'relative',
            paddingBottom: currentValueLabel ? '2rem' : '0',
          }}
        >
          <div
            className="relative text-xs text-basic-gray"
            style={{
              paddingLeft: `${CHART_MARGINS.left}px`,
              paddingRight: `${CHART_MARGINS.right}px`,
              minHeight: '1.5rem',
            }}
          >
            {labels?.map((labelItem, index) => {
              const labelPosition = getLabelPosition(labelItem.value);
              const isHovered = hoveredLabel?.value === labelItem.value;
              const isFirst = index === 0;
              const isLast = index === (labels?.length || 0) - 1;

              const rangeMatch = labelItem.label.match(/\(([^)]+)\)/);
              const rangeText = rangeMatch ? rangeMatch[1] : labelItem.label;

              const transformClass = isFirst
                ? ''
                : isLast
                ? '-translate-x-full'
                : '-translate-x-1/2';

              return (
                <div
                  key={index}
                  className={cn(
                    'absolute cursor-pointer transition-colors',
                    transformClass
                  )}
                  style={{
                    left: `${labelPosition}%`,
                  }}
                  onMouseEnter={() => setHoveredLabel(labelItem)}
                  onMouseLeave={() => setHoveredLabel(null)}
                >
                  <div
                    className={cn(
                      'whitespace-nowrap text-center',
                      isHovered && 'text-basic-black font-semibold'
                    )}
                  >
                    {labelItem.label.replace(/\([^)]+\)/g, '').trim()}
                  </div>
                  {isHovered && rangeText && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-white border border-basic-gray-light rounded shadow-sm text-xs whitespace-nowrap z-20">
                      {rangeText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {currentValueLabel && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10 text-basic-black text-base font-semibold text-center"
              style={{
                top: '1.75rem',
                width: '100%',
              }}
            >
              {currentValueLabel}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            margin: '4px auto 0',
            position: 'relative',
            height: '1.75rem',
          }}
        >
          {currentValueLabel && (
            <div
              className="absolute top-0 -translate-x-1/2 z-10 text-basic-black text-base font-semibold transition-all duration-500 ease-out"
              style={{
                left: `${currentValueLeftPercentage}%`,
              }}
            >
              {currentValueLabel}
            </div>
          )}

          <div
            className="flex justify-between text-xs text-basic-gray"
            style={{
              paddingLeft: `${CHART_MARGINS.left}px`,
              paddingRight: `${CHART_MARGINS.right}px`,
            }}
          >
            <span>{minValueLabel}</span>
            <span>{maxValueLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
