import { Button } from '@@agrosphere/shared';
import { Step } from '../types/form-types';

type FormNavigationButtonsProps = {
  step: Step;
  isLoading?: boolean;
  isSceneSearchLoading?: boolean;
  onBack?: () => void;
  onBackToParcelList?: () => void;
  onCalculate?: () => void;
  onSave?: () => void;
  onExport?: () => void;
};

export default function FormNavigationButtons({
  step,
  isLoading = false,
  isSceneSearchLoading = false,
  onBack,
  onBackToParcelList,
  onCalculate,
  onSave,
  onExport,
}: FormNavigationButtonsProps) {
  const isCalculateDisabled = isLoading || isSceneSearchLoading;

  return (
    <div className="border-t border-basic-gray-light pt-4 mt-4 flex justify-between gap-2 flex-shrink-0">
      <div>
        {step === Step.SETUP && onBackToParcelList && (
          <Button variant="secondary" onClick={onBackToParcelList}>
            Back to parcels
          </Button>
        )}
        {step === Step.ZONES && onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {step === Step.SETUP && (
          <Button onClick={onCalculate} disabled={isCalculateDisabled}>
            {isLoading ? 'Calculating...' : 'Calculate'}
          </Button>
        )}

        {step === Step.ZONES && (
          <>
            <Button onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={onExport}>
              Export SHP
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
