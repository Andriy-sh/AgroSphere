'use client';

import { NueChart, NueChartProps } from './nue-chart';

interface FarmGateChartProps
  extends Omit<NueChartProps, 'title' | 'description' | 'filledColor'> {
  filledColor?: string;
}

export function FarmGateChart({
  value,
  max,
  target,
  benchmark,
  filledColor = '#ff323f',
}: FarmGateChartProps) {
  const description = (
    <div className="flex flex-col items-center text-xs text-basic-black">
      <p>Business Efficiency</p>
      <p className="font-normal text-basic-gray">
        How well farm converts purchased inputs → saleable products
      </p>
    </div>
  );

  return (
    <NueChart
      title="Farm-Gate NUE"
      description={description}
      value={value}
      max={max}
      target={target}
      benchmark={benchmark}
      filledColor={filledColor}
    />
  );
}
