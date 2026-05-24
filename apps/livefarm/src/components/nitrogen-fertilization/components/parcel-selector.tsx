import { CustomSelect, ParcelPreview } from '@@agrosphere/shared';
import type { SelectOption } from '@@agrosphere/shared';
import { INPUT_LIKE_CLASS_NAME } from '../constants/form-constants';

type ParcelSelectorProps = {
  options: SelectOption[];
  selectedParcelId: string;
  onSelectParcel: (parcelId: string) => void;
  parcelGeometry?: number[][];
  parcelArea?: number;
  parcelName?: string;
};

export default function ParcelSelector({
  options,
  selectedParcelId,
  onSelectParcel,
  parcelGeometry,
  parcelArea,
  parcelName,
  showSelector = false,
}: ParcelSelectorProps & { showSelector?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      {parcelGeometry && parcelGeometry.length > 0 && (
        <ParcelPreview geometry={parcelGeometry} />
      )}
      <div className="flex flex-col">
        {parcelName && (
          <div className="text-sm font-semibold text-basic-black">{parcelName}</div>
        )}
        {parcelArea !== undefined && (
          <div className="text-xs text-basic-gray">{parcelArea.toFixed(2)} ha</div>
        )}
      </div>
      {showSelector && (
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-xs font-medium text-basic-gray">Select parcel</div>
          <CustomSelect
            options={options}
            value={selectedParcelId}
            onValueChange={onSelectParcel}
            triggerClassName={INPUT_LIKE_CLASS_NAME}
          />
        </div>
      )}
    </div>
  );
}

