import { CustomSelect } from '../../select/select';
import type { SelectOption } from '../../select/select';

export interface MapBandSelectorProps {
  options: readonly string[];
  value: string | null;
  onChange?: (band: string) => void;
  className?: string;
}

export const MapBandSelector = ({
  options,
  value,
  onChange,
  className = '',
}: MapBandSelectorProps) => {
  if (!options || options.length === 0) {
    return null;
  }

  const selectOptions: SelectOption[] = options.map((band) => ({
    value: band,
    label: band,
  }));

  const resolvedValue =
    value && options.includes(value)
      ? value
      : selectOptions[0]?.value ?? 'NDVI';

  return (
    <CustomSelect
      options={selectOptions}
      value={resolvedValue}
      onValueChange={(band) => onChange?.(band)}
      placeholder="Band"
      className={className}
      triggerClassName="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-800"
      useTriggerWidth={false}
      popupClassName="w-[200px]"
    />
  );
};
