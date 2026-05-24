import { Tooltip } from '@base-ui-components/react';
import { CustomSelect, Icon, Input } from '@@agrosphere/shared';
import type { ApplicationStrategy } from '../types/form-types';
import {
  applicationStrategyOptions,
  rateStepOptions,
  INPUT_LIKE_CLASS_NAME,
} from '../constants/form-constants';

type ApplicationParametersProps = {
  applicationStrategy: ApplicationStrategy;
  onApplicationStrategyChange: (strategy: ApplicationStrategy) => void;
  baseRate: string;
  onBaseRateChange: (value: string) => void;
  rateStep: string;
  onRateStepChange: (value: string) => void;
};

export default function ApplicationParameters({
  applicationStrategy,
  onApplicationStrategyChange,
  baseRate,
  onBaseRateChange,
  rateStep,
  onRateStepChange,
}: ApplicationParametersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-medium text-basic-black">
        Set application parameters
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-basic-gray">
            Application rate strategy
          </div>
          <Tooltip.Provider delay={100}>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Icon
                  icon="info"
                  size="xs"
                  className="text-basic-gray cursor-pointer"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner
                  className="z-[99999]"
                  sideOffset={10}
                  side="right"
                >
                  <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-gray-light max-w-xs z-[99999]">
                    <div className="text-sm text-basic-black">
                      The &quot;Increase&quot; strategy applies more resources
                      to zones with better vegetation, while
                      &quot;Decrease&quot; does the opposite — prioritizing
                      zones with weaker vegetation. The &quot;Manual&quot;
                      strategy allows you to define zone values manually.
                    </div>
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <CustomSelect
          options={applicationStrategyOptions}
          value={applicationStrategy}
          onValueChange={(value) =>
            onApplicationStrategyChange(value as ApplicationStrategy)
          }
          triggerClassName={INPUT_LIKE_CLASS_NAME}
        />
      </div>

      {applicationStrategy !== 'manual' && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-basic-gray">Base rate</div>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={baseRate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              const processedValue =
                baseRate === '0' &&
                newValue.startsWith('0') &&
                newValue.length > 1
                  ? newValue.slice(1)
                  : newValue;
              onBaseRateChange(processedValue);
            }}
            placeholder="0"
            className={INPUT_LIKE_CLASS_NAME}
          />
        </div>
      )}

      {applicationStrategy !== 'manual' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-basic-gray">Rate step</div>
            <Tooltip.Provider delay={100}>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Icon
                    icon="info"
                    size="xs"
                    className="text-basic-gray cursor-pointer"
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner
                    className="z-[99999]"
                    sideOffset={10}
                    side="right"
                  >
                    <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-gray-light max-w-xs z-[99999]">
                      <div className="text-sm text-basic-black">
                        We recommend using the Auto mode for the most reasonable
                        and efficient resource distribution across zones based
                        on vegetation data.
                      </div>
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          <CustomSelect
            options={rateStepOptions}
            value={rateStep}
            onValueChange={onRateStepChange}
            triggerClassName={INPUT_LIKE_CLASS_NAME}
            placeholder="Select rate step..."
          />
        </div>
      )}
    </div>
  );
}
