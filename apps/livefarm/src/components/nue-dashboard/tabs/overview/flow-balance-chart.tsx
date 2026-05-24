'use client';

import { BarChart, BarChartDataItem, SplitCard } from '@@agrosphere/shared';

interface FlowBalanceChartProps {
  title: string;
  inputsValue: number;
  outputsValue: number;
  efficiency: number;
  efficiencyDescription: string;
}

export function FlowBalanceChart({
  title,
  inputsValue,
  outputsValue,
  efficiency,
  efficiencyDescription,
}: FlowBalanceChartProps) {
  const data: BarChartDataItem[] = [
    {
      name: 'Nitrogen Inputs',
      value: inputsValue,
      fill: '#10B981',
    },
    {
      name: 'Nitrogen Outputs',
      value: outputsValue,
      fill: '#3B82F6',
    },
  ];

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
            <div className="flex flex-col">
              <div className="mb-4">
                <BarChart
                  data={data}
                  height={256}
                  tooltipFormatter={(value) => [`${value.toFixed(1)} kg N`, '']}
                  xAxisAngle={0}
                  labelMaxLength={20}
                />
              </div>

              <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-basic-black">
                    Nitrogen Use Efficiency
                  </h3>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-4xl font-bold text-blue-600">
                    {efficiency.toFixed(1)}
                  </p>
                  <span className="text-xl font-semibold text-blue-500">%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(efficiency, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-basic-gray leading-relaxed">
                  {efficiencyDescription}
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
