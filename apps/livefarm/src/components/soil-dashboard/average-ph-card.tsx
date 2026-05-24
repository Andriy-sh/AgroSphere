'use client';

import { useState } from 'react';
import { Button, Icon } from '@@agrosphere/shared';
import { SplitCard } from '@@agrosphere/shared';
import PhBarChart from './ph-bar-chart';
import PhHistoricChart from './ph-historic-chart';

const TABS = [
  { key: 'barchart', label: 'Barchart', icon: 'bar_chart_4_bars' },
  { key: 'historic', label: 'Historic', icon: 'line_axis' },
] as const;

interface AveragePhCardProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function AveragePhCard({
  isFullscreen,
  onToggleFullscreen,
}: AveragePhCardProps) {
  const [activeTab, setActiveTab] = useState<'barchart' | 'historic'>(
    'barchart'
  );

  return (
    <SplitCard
      className={`${
        isFullscreen ? 'h-auto' : 'h-[40%]'
      } rounded-xl border bg-white !border-basic-gray-light`}
      topClassName="flex justify-between items-center"
      bottomClassName="flex items-stretch justify-center h-full relative flex-1 min-h-0 p-0"
      hideBottom={isFullscreen}
      topContent={
        <div className="flex justify-between w-full items-center">
          <h2 className="text-base font-semibold">Avr. pH</h2>

          <div className="flex gap-2 items-center">
            <div className="bg-basic-white rounded-lg p-1 flex gap-1">
              {TABS.map(({ key, label, icon }) => (
                <div
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`h-7 px-2 flex items-center justify-center transition-colors cursor-pointer ${
                    activeTab === key ? 'bg-white shadow-sm' : 'text-basic-gray'
                  }`}
                >
                  <Icon icon={icon} className="w-6 h-6 mr-1" />
                  {label}
                </div>
              ))}
            </div>

            <span className="w-px h-5 bg-basic-gray-light mx-1" />

            <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
              <Icon icon="close_fullscreen" className="w-6 h-6" />
            </Button>
          </div>
        </div>
      }
      bottomContent={
        <>
          {activeTab === 'barchart' ? (
            <PhBarChart />
          ) : (
            // <PhHistoricChart isFullscreen={isFullscreen} />
            <div>
              <h2>Historic</h2>
            </div>
          )}
        </>
      }
    />
  );
}
