'use client';

import { FlowDonutChart } from './flow-donut-chart';
import { FlowBalanceChart } from './flow-balance-chart';
import { type FlowDataItem } from '../../data/all-tabs-mock-data';

interface FarmGateFlowProps {
  flowData: {
    inputs: FlowDataItem[];
    outputs: FlowDataItem[];
  };
  isEmpty: boolean;
}

export function FarmGateFlow({ flowData, isEmpty }: FarmGateFlowProps) {
  if (isEmpty) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-basic-gray text-lg mb-2">No data available</p>
          <p className="text-basic-gray text-sm">
            Please select a different time period
          </p>
        </div>
      </div>
    );
  }

  const inputsData = flowData.inputs;
  const inputsTotal = inputsData.reduce((sum, item) => sum + item.value, 0);

  const outputsData = flowData.outputs;
  const outputsTotal = outputsData.reduce((sum, item) => sum + item.value, 0);

  const efficiency = inputsTotal > 0 ? (outputsTotal / inputsTotal) * 100 : 0;
  const efficiencyDescription = `${outputsTotal.toFixed(
    1
  )} kg out of ${inputsTotal.toFixed(1)} kg utilized`;

  return (
    <div className="space-y-4">
      <FlowDonutChart
        title="Nitrogen Inputs"
        data={inputsData}
        total={inputsTotal}
      />
      <FlowDonutChart
        title="Nitrogen Outputs"
        data={outputsData}
        total={outputsTotal}
      />
      <FlowBalanceChart
        title="Nitrogen Flow Balance"
        inputsValue={inputsTotal}
        outputsValue={outputsTotal}
        efficiency={efficiency}
        efficiencyDescription={efficiencyDescription}
      />
    </div>
  );
}
