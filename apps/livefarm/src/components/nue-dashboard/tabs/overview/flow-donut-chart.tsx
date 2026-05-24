'use client';

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from 'recharts';
import { SplitCard } from '@@agrosphere/shared';

interface FlowDonutChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: unknown;
}

interface FlowDonutChartProps {
  title: string;
  data: FlowDonutChartData[];
  total: number;
  totalLabel?: string;
}

export function FlowDonutChart({
  title,
  data,
  total,
  totalLabel = 'Total',
}: FlowDonutChartProps) {
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius =
      (innerRadius ?? 0) + ((outerRadius ?? 0) - (innerRadius ?? 0)) * 0.5;
    const x = (cx ?? 0) + radius * Math.cos(-midAngle * RADIAN);
    const y = (cy ?? 0) + radius * Math.sin(-midAngle * RADIAN);

    if ((percent ?? 0) < 0.05) return null; 

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > (cx ?? 0) ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${((percent ?? 0) * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <SplitCard
      topContent={
        <h2 className="text-lg font-semibold text-basic-black">{title}</h2>
      }
      topClassName="border-b border-basic-gray-light"
      hideBottom={true}
      additionalSections={[
        {
          content: (
            <div className="flex flex-col items-center">
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="80%"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" content={renderCustomLabel} />
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border border-basic-gray-light rounded shadow-lg">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-sm">
                                {data.value.toFixed(1)} kg
                              </p>
                              <p className="text-xs text-basic-gray">
                                {((data.value / total) * 100).toFixed(1)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-2">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-basic-black">{item.name}</span>
                    </div>
                    <span className="text-basic-gray font-medium">
                      {item.value.toFixed(1)} kg
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full mt-4 pt-4 border-t border-basic-gray-light text-center">
                <p className="text-sm font-semibold text-basic-black">
                  {totalLabel}: {total.toFixed(1)} kg N
                </p>
              </div>
            </div>
          ),
          className: 'p-5',
        },
      ]}
    />
  );
}
