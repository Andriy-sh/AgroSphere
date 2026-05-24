import type {
  ZonePrescription,
  ApplicationStrategy,
} from '../types/form-types';
import {
  calculateTotalAreaHa,
  calculateTotalFertilizerConsumption,
} from '../utils/zone-calculations';
import ZoneRateRow from './zone-rate-row';

type RatesDistributionSummaryProps = {
  zones: ZonePrescription[];
  baseRate: string;
  applicationStrategy: ApplicationStrategy;
  onZoneRateChange: (zoneId: number, value: string) => void;
};

export default function RatesDistributionSummary({
  zones,
  baseRate,
  applicationStrategy,
  onZoneRateChange,
}: RatesDistributionSummaryProps) {
  const totalAreaHa = calculateTotalAreaHa(zones);
  const totalFertilizerConsumption = calculateTotalFertilizerConsumption(zones);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-basic-black">
          Rates distribution summary
        </div>
      </div>

      <div className="border border-basic-gray-light rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-3 text-xs font-medium text-basic-gray border-b border-basic-gray-light">
          <div>Zone</div>
          <div>Rate (kg/ha)</div>
        </div>
        {zones.map((zone) => {
          const percentage =
            totalAreaHa > 0 ? (zone.zoneAreaHa / totalAreaHa) * 100 : 0;
          return (
            <ZoneRateRow
              key={zone.zoneId}
              zone={zone}
              allZones={zones}
              percentage={percentage}
              applicationStrategy={applicationStrategy}
              onRateChange={onZoneRateChange}
            />
          );
        })}
      </div>

      <div className="border-t border-basic-gray-light pt-3 flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-basic-gray">VRA zones:</span>
          <span className="font-medium">
            {totalFertilizerConsumption.toFixed(2)} kg
          </span>
        </div>
        {applicationStrategy !== 'manual' && (
          <div className="flex justify-between text-sm">
            <span className="text-basic-gray">Base rate:</span>
            <span className="font-medium">
              {totalAreaHa > 0
                ? (totalAreaHa * parseFloat(baseRate || '0')).toFixed(2)
                : '0'}{' '}
              kg
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
