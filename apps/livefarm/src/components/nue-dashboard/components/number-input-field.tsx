import { Input } from '@@agrosphere/shared';

interface NumberInputFieldProps {
  label: string;
  value: string;
  step: string;
  onChange: (value: string) => void;
  inputClassName?: string;
}

export function NumberInputField({
  label,
  value,
  step,
  onChange,
  inputClassName = 'w-full pr-2',
}: NumberInputFieldProps) {
  return (
    <div>
      <label className="block text-sm text-basic-gray mb-1">{label}</label>
      <Input className="pr-0 overflow-visible">
        <Input.Content
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={inputClassName}
        />
      </Input>
    </div>
  );
}

