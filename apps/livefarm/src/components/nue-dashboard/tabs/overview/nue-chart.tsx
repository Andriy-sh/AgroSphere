'use client';

import { ActivePieChart, SplitCard } from '@@agrosphere/shared';
import { Progress } from '@base-ui-components/react';
import { ReactNode } from 'react';

export interface NueChartProps {
  title: string;
  description: ReactNode;
  value: number;
  max: number;
  target: number;
  benchmark: number;
  filledColor?: string;
  emptyColor?: string;
  scale?: number;
}

export function NueChart({
  title,
  description,
  value,
  max,
  target,
  benchmark,
  filledColor = '#FFC652',
  emptyColor = '#dbdee8',
  scale = 1,
}: NueChartProps) {
  const percentage = (value / max) * 100;

  return (
    <SplitCard
      className="h-full"
      topContent={
        <h2 className="text-base font-semibold text-basic-black">{title}</h2>
      }
      topClassName="border-b border-basic-gray-light"
      hideBottom={true}
      additionalSections={[
        {
          content: (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="w-full h-[300px] flex items-center justify-center">
                <ActivePieChart
                  value={value}
                  max={max}
                  filledColor={filledColor}
                  emptyColor={emptyColor}
                  showPercentage={true}
                  percentage={percentage}
                  scale={scale}
                />
              </div>

              <div className="w-full px-4 space-y-1 mt-2">
                <div className="flex items-center justify-center text-xs text-basic-gray">
                  <span>
                    Target: {target}%+ • Benchmark: {benchmark}%+
                  </span>
                </div>
                <Progress.Root
                  className="h-3 bg-basic-gray-light rounded-full overflow-hidden"
                  value={percentage}
                >
                  <Progress.Track className="h-full bg-basic-gray-light rounded-full">
                    <Progress.Indicator
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: filledColor,
                      }}
                    />
                  </Progress.Track>
                </Progress.Root>
              </div>
            </div>
          ),
          className: 'flex-1 min-h-0 p-2',
        },
        {
          content: (
            <p className="text-xs text-basic-gray leading-relaxed">
              {description}
            </p>
          ),
          className: 'p-2',
        },
      ]}
    />
  );
}
