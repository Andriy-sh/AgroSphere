'use client';

import { Dialog } from '@@agrosphere/shared';
import { useNueCalculator } from './hooks/use-nue-calculator';
import { NueInputs } from './components/nue-inputs';
import { NueResults } from './components/nue-results';

export function WhatIfCalculator({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { values, results, handleInputChange, calculate, reset } =
    useNueCalculator();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl"
      title={
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-basic-green">
            calculate
          </span>
          <span>What-If NUE Calculator</span>
        </div>
      }
    >
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[621px]">
          <NueInputs
            values={values}
            onInputChange={handleInputChange}
            onCalculate={calculate}
            onReset={reset}
          />

          <NueResults results={results} />
        </div>
      </div>
    </Dialog>
  );
}
