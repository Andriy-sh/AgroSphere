import React, { useMemo } from 'react';
import { SplitCard } from '../split-card/split-card';
import type { GaugeConfig } from '../../data/soildashboard-variations';

export interface MapLegendLevel {
  level: number;
  color: string;
  label?: string;
}

export interface MapLegendProps {
  title?: string;
  levels?: MapLegendLevel[];
  show?: boolean;
  position?: 'left' | 'right';
  className?: string;
  metricConfig?: GaugeConfig | null;
  metricId?: string | null;
}

const defaultLevels: MapLegendLevel[] = [
  { level: 1, color: '#FF352E', label: '< 5.5' },
  { level: 2, color: '#DFA72C', label: '5.5 – 6.2' },
  { level: 3, color: '#6AE730', label: '6.2 – 6.5' },
  { level: 4, color: '#41B0FF', label: '6.6 – 7.5' },
  { level: 5, color: '#0078CD', label: '> 7.5' },
];

const COLOR_SCHEMES = {
  redToBlue: ['#FF352E', '#DFA72C', '#6AE730', '#41B0FF', '#0078CD'],
  redToGreen: ['#FF352E', '#DFA72C', '#6AE730', '#4B8630', '#4B8630'],
  greenToRed: ['#4B8630', '#6AE730', '#DFA72C', '#FF352E', '#FF352E'],
  default: ['#FF352E', '#DFA72C', '#FFFF00', '#6AE730', '#41B0FF', '#0078CD'],
};

const getMetricTitle = (metricId: string | null | undefined): string => {
  if (!metricId) return 'Soil pH';

  const titleMap: Record<string, string> = {
    'ph-grassland': 'Avg. pH (Grassland)',
    'ph-cereals-maize': 'Avg. pH (Cereals/Maize)',
    'lime-requirement': 'Avg. Lime Requirement',
    'phosphorous-p-grassland': 'Avg. Phosphorous (P) (Grassland)',
    'phosphorous-p-other-crop': 'Avg. Phosphorous (P) (Other Crop)',
    'potassium-k-mineral-soil': 'Avg. Potassium (K) (Mineral Soil)',
    'potassium-k-peat-soil': 'Avg. Potassium (K) (Peat Soil)',
    'organic-matter-om': 'Avg. Organic Matter (OM)',
    'magnesium-mg': 'Avg. Magnesium (Mg)',
    'calcium-c': 'Avg. Calcium (C)',
    'copper-cu': 'Avg. Copper (Cu)',
    'manganese-mn': 'Avg. Manganese (Mn)',
    'zinc-zn': 'Avg. Zinc (Zn)',
    'boron-b': 'Avg. Boron (B)',
    ph: 'Avg. pH',
    'phosphorous-p': 'Avg. Phosphorous (P)',
    'potassium-k': 'Avg. Potassium (K)',
  };

  return titleMap[metricId] || 'Soil pH';
};

const generateLevelsFromConfig = (
  config: GaugeConfig | null,
  metricId?: string | null
): MapLegendLevel[] => {
  if (!config) return defaultLevels;

  const { min, max, colorScheme, labels } = config;
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.redToBlue;

  // Check if this is an index-based metric (phosphorous-p or potassium-k)
  const isIndexMetric =
    metricId &&
    (metricId.includes('phosphorous-p') ||
      metricId.includes('potassium-k') ||
      metricId === 'phosphorous-p' ||
      metricId === 'potassium-k');

  // If it's an index metric and labels contain "Index", use index labels
  const useIndexLabels =
    isIndexMetric &&
    labels &&
    labels.some((label) => label.label.toLowerCase().includes('index'));

  if (useIndexLabels && labels) {
    // Extract index numbers from labels (e.g., "Index 1", "Index 2", etc.)
    const levels: MapLegendLevel[] = [];
    const indexLabels = labels
      .map((label) => {
        const indexMatch = label.label.match(/Index\s+(\d+)/i);
        if (indexMatch) {
          return {
            index: parseInt(indexMatch[1], 10),
            label: `Index ${indexMatch[1]}`,
            value: label.value,
          };
        }
        return null;
      })
      .filter((item): item is { index: number; label: string; value: number } =>
        item !== null
      )
      .sort((a, b) => a.index - b.index);

    // Use all available indices with corresponding colors
    // For index metrics, we typically have 4 indices, so use first 4 colors
    const numIndices = indexLabels.length;

    for (let i = 0; i < numIndices; i++) {
      // Use colors in order (first index = first color, etc.)
      const colorIndex = Math.min(i, colors.length - 1);

      levels.push({
        level: i + 1,
        color: colors[colorIndex],
        label: indexLabels[i].label,
      });
    }

    return levels;
  }

  // Default: generate numeric ranges
  const range = max - min;
  const step = range / 5;

  const levels: MapLegendLevel[] = [];

  for (let i = 0; i < 5; i++) {
    const levelMin = min + i * step;
    const levelMax = min + (i + 1) * step;
    const isLast = i === 4;

    let label: string;
    if (i === 0) {
      label = `< ${levelMax.toFixed(1)}`;
    } else if (isLast) {
      label = `> ${levelMin.toFixed(1)}`;
    } else {
      label = `${levelMin.toFixed(1)} – ${levelMax.toFixed(1)}`;
    }

    levels.push({
      level: i + 1,
      color: colors[i] || colors[colors.length - 1],
      label,
    });
  }

  return levels;
};

export function MapLegend({
  title,
  levels,
  show = false,
  position = 'left',
  className = '',
  metricConfig = null,
  metricId = null,
}: MapLegendProps) {
  const computedTitle = useMemo(() => {
    return title || getMetricTitle(metricId || undefined);
  }, [title, metricId]);

  const computedLevels = useMemo(() => {
    if (levels) return levels;
    if (metricConfig)
      return generateLevelsFromConfig(metricConfig, metricId);
    return defaultLevels;
  }, [levels, metricConfig, metricId]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`absolute ${
        position === 'left' ? 'left-4 bottom-4' : 'right-4 bottom-4'
      } w-fit pointer-events-auto z-10 ${className}`}
      style={{ maxHeight: 'calc(100% - 32px)', maxWidth: 'calc(100% - 32px)' }}
    >
      <SplitCard
        className="bg-white shadow-lg rounded-lg"
        topClassName="!p-0"
        bottomClassName="!p-0"
        hideBottom={false}
        topContent={
          <div className="p-3 border-b border-gray-200 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {computedTitle}
            </h3>
          </div>
        }
        bottomContent={
          <div className="flex flex-col gap-2 p-3 w-fit">
            {computedLevels.map((item) => (
              <div
                key={item.level}
                className="flex items-center gap-2 min-h-[20px] w-full"
              >
                <div
                  className="w-8 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-900 leading-tight whitespace-nowrap">
                  {item.label || item.level}
                </span>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}
