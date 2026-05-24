import { Input } from '@@agrosphere/shared';
import type {
  ZonePrescription,
  ApplicationStrategy,
} from '../types/form-types';
import { getZoneColor, getZoneLabel } from '../utils/zone-helpers';

type ZoneRateRowProps = {
  zone: ZonePrescription;
  allZones: ZonePrescription[];
  percentage: number;
  applicationStrategy: ApplicationStrategy;
  onRateChange: (zoneId: number, value: string) => void;
};

export default function ZoneRateRow({
  zone,
  allZones,
  percentage,
  applicationStrategy,
  onRateChange,
}: ZoneRateRowProps) {
  const zoneColor = getZoneColor(zone, allZones);
  const zoneLabel = getZoneLabel(zone, allZones);
  const isManual = applicationStrategy === 'manual';

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 p-3 border-b border-basic-gray-light last:border-b-0 items-center">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: zoneColor }}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{zoneLabel}</span>
          <span className="text-xs text-basic-gray">
            {zone.zoneAreaHa.toFixed(2)} ha / {percentage.toFixed(2)}%
            {zone.kmean !== undefined && (
              <span className="ml-2">• NDVI: {zone.kmean.toFixed(2)}</span>
            )}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          step="0.1"
          value={zone.rateKgHa}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            const processedValue =
              zone.rateKgHa === '0' &&
              newValue.startsWith('0') &&
              newValue.length > 1
                ? newValue.slice(1)
                : newValue;
            onRateChange(zone.zoneId, processedValue);
          }}
          placeholder="0"
          className="w-28"
          disabled={!isManual}
        />
        <span className="text-xs text-basic-gray">kg/ha</span>
      </div>
    </div>
  );
}
