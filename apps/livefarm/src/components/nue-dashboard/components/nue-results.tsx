import { BOOK_VALUES } from '../constants/book-values';
import type { CalculationResults } from '../types/nue.types';

interface NueResultsProps {
  results: CalculationResults | null;
}

export function NueResults({ results }: NueResultsProps) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg border border-basic-gray-light">
        <span className="material-symbols-outlined text-6xl text-basic-gray mb-4">
          calculate
        </span>
        <p className="text-sm text-basic-gray text-center px-4">
          Enter values and click &apos;Calculate NUE&apos; to see results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-basic-black mb-3">
          Scenario Results
        </h3>

        <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-100">
          <h4 className="text-xs font-semibold text-basic-green mb-2">
            N-In Breakdown
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-basic-gray">Chemical N:</span>
              <span className="text-basic-black font-medium">
                {results.chemicalN.toFixed(1)} kg/ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basic-gray">Slurry N:</span>
              <span className="text-basic-black font-medium">
                {results.slurryN.toFixed(1)} kg/ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basic-gray">Soil N:</span>
              <span className="text-basic-black font-medium">
                {results.soilN.toFixed(1)} kg/ha
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-green-200">
              <span className="text-basic-black font-semibold">
                Total N-In:
              </span>
              <span className="text-blue-600 font-bold">
                {results.totalNIn.toFixed(1)} kg/ha
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
          <h4 className="text-xs font-semibold text-blue-600 mb-2">
            N-Out Breakdown
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-basic-gray">Silage N:</span>
              <span className="text-basic-black font-medium">
                {results.silageN.toFixed(1)} kg/ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basic-gray">Grazing N:</span>
              <span className="text-basic-black font-medium">
                {results.grazingN.toFixed(1)} kg/ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-basic-gray">Bale N:</span>
              <span className="text-basic-black font-medium">
                {results.baleN.toFixed(1)} kg/ha
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="text-basic-black font-semibold">
                Total N-Out:
              </span>
              <span className="text-blue-600 font-bold">
                {results.totalNOut.toFixed(1)} kg/ha
              </span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-100">
          <h4 className="text-xs font-semibold text-purple-600 mb-2">
            NUE Score
          </h4>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {results.nueScore.toFixed(0)}%
            </div>
            <div className="text-xs text-basic-gray">
              ({results.totalNOut.toFixed(1)} ÷{' '}
              {results.totalNIn.toFixed(1)}) × 100
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-basic-gray-light">
        <h3 className="text-sm font-semibold text-basic-black mb-2">
          Book Values Used
        </h3>
        <div className="space-y-1 text-xs text-basic-gray">
          <div>Silage: {BOOK_VALUES.silage} kg N/t</div>
          <div>Bale: {BOOK_VALUES.bale} kg N/t</div>
          <div>
            Grazing: {BOOK_VALUES.grazing} kg N/t DM ×{' '}
            {BOOK_VALUES.grazingMultiplier * 100}%
          </div>
        </div>
      </div>
    </div>
  );
}

