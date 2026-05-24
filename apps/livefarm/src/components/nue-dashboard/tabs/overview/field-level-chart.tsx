'use client';

import { NueChart, NueChartProps } from './nue-chart';

interface FieldLevelChartProps
  extends Omit<NueChartProps, 'title' | 'description' | 'filledColor'> {
  filledColor?: string;
}

export function FieldLevelChart({
  value,
  max,
  target,
  benchmark,
  filledColor = '#FFC652',
}: FieldLevelChartProps) {
  const description = (
    <div className="flex flex-col items-center text-xs text-basic-black">
      <p>Land Efficiency</p>
      <p className="font-normal text-basic-gray">
        How well fields convert fertilizer & slurry → grass production
      </p>
    </div>
  );

  return (
    <NueChart
      title="Field-Level NUE"
      description={description}
      value={value}
      max={max}
      target={target}
      benchmark={benchmark}
      filledColor={filledColor}
    />
  );
}
