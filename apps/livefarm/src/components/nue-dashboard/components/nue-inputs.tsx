import { Button } from '@@agrosphere/shared';
import { NumberInputField } from './number-input-field';
import { INPUT_FIELDS_CONFIG } from '../constants/input-fields-config';
import type { CalculatorValues } from '../types/nue.types';

interface NueInputsProps {
  values: CalculatorValues;
  onInputChange: (field: keyof CalculatorValues, value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export function NueInputs({
  values,
  onInputChange,
  onCalculate,
  onReset,
}: NueInputsProps) {
  const gridFields = INPUT_FIELDS_CONFIG.nIn.slice(0, 4);
  const singleColumnFields = INPUT_FIELDS_CONFIG.nIn.slice(4);

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-grow">
        <div>
          <h3 className="text-sm font-semibold text-basic-green mb-3">
            N-In Sources (kg/ha)
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {gridFields.map((field) => (
              <NumberInputField
                key={field.key}
                label={field.label}
                value={values[field.key]}
                step={field.step}
                onChange={(value) => onInputChange(field.key, value)}
                inputClassName={field.inputClassName}
              />
            ))}
          </div>
          {singleColumnFields.length > 0 && (
            <div className="space-y-3">
              {singleColumnFields.map((field) => (
                <NumberInputField
                  key={field.key}
                  label={field.label}
                  value={values[field.key]}
                  step={field.step}
                  onChange={(value) => onInputChange(field.key, value)}
                  inputClassName={field.inputClassName}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-blue-600 mb-3">
            N-Out Sources
          </h3>
          <div className="space-y-3">
            {INPUT_FIELDS_CONFIG.nOut.map((field) => (
              <NumberInputField
                key={field.key}
                label={field.label}
                value={values[field.key]}
                step={field.step}
                onChange={(value) => onInputChange(field.key, value)}
                inputClassName={field.inputClassName}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 mt-auto">
        <Button onClick={onCalculate} variant="complete" className="flex-1">
          Calculate NUE
        </Button>
        <Button onClick={onReset} variant="cancel" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}

