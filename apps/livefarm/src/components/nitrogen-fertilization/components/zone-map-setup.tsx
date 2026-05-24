import { CustomSelect } from '@@agrosphere/shared';
import type { SelectOption } from '@@agrosphere/shared';
import {
  satelliteTypeOptions,
  zonesCountOptions,
  INPUT_LIKE_CLASS_NAME,
} from '../constants/form-constants';

type ZoneMapSetupProps = {
  satelliteType: string;
  onSatelliteTypeChange: (value: string) => void;
  imageDate: string;
  onImageDateChange: (value: string) => void;
  zonesCount: string;
  onZonesCountChange: (value: string) => void;
  imageDateOptions?: SelectOption[];
  imageDateLoading?: boolean;
};

export default function ZoneMapSetup({
  satelliteType,
  onSatelliteTypeChange,
  imageDate,
  onImageDateChange,
  zonesCount,
  onZonesCountChange,
  imageDateOptions = [],
  imageDateLoading = false,
}: ZoneMapSetupProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-medium text-basic-black">Create zone map</div>

      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-basic-gray">Select satellite type</div>
        <CustomSelect
          options={satelliteTypeOptions}
          value={satelliteType}
          onValueChange={onSatelliteTypeChange}
          triggerClassName={INPUT_LIKE_CLASS_NAME}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-basic-gray">Select image date</div>
        <CustomSelect
          options={imageDateOptions}
          value={imageDate}
          onValueChange={onImageDateChange}
          triggerClassName={INPUT_LIKE_CLASS_NAME}
          disabled={imageDateLoading || imageDateOptions.length === 0}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-basic-gray">Number of zones</div>
        <CustomSelect
          options={zonesCountOptions}
          value={zonesCount}
          onValueChange={onZonesCountChange}
          triggerClassName={INPUT_LIKE_CLASS_NAME}
        />
      </div>
    </div>
  );
}

