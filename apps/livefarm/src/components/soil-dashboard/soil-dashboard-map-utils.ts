import {
  type GaugeConfig,
  getChartTypeFromMetricId,
  getVariantFromMetricId,
} from '@@agrosphere/shared';

export const PH_MIN = 5.5;
export const PH_MAX = 7.5;

export const COLOR_SCHEMES = {
  redToBlue: ['#FF352E', '#DFA72C', '#6AE730', '#41B0FF', '#0078CD'],
  redToGreen: ['#FF352E', '#DFA72C', '#6AE730', '#4B8630', '#4B8630'],
  greenToRed: ['#4B8630', '#6AE730', '#DFA72C', '#FF352E', '#FF352E'],
  default: ['#FF352E', '#DFA72C', '#FFFF00', '#6AE730', '#41B0FF', '#0078CD'],
};

export const getPhColor = (pH: number): string => {
  if (pH < PH_MIN) return '#FF352E';
  if (pH < 6.2) return '#DFA72C';
  if (pH < 6.5) return '#6AE730';
  if (pH <= PH_MAX) return '#41B0FF';
  return '#0078CD';
};

export const getMetricColor = (
  value: number,
  gaugeConfig: GaugeConfig | null
): string => {
  if (!gaugeConfig) {
    return getPhColor(value);
  }

  const { min, max, colorScheme } = gaugeConfig;
  const clampedValue = Math.max(min, Math.min(max, value));
  const range = max - min;
  const percentage = range > 0 ? (clampedValue - min) / range : 0;

  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.redToBlue;

  if (percentage < 0.2) return colors[0];
  if (percentage < 0.4) return colors[1];
  if (percentage < 0.6) return colors[2];
  if (percentage < 0.8) return colors[3];
  return colors[4] || colors[colors.length - 1];
};

// Re-export from shared for convenience
export { getChartTypeFromMetricId, getVariantFromMetricId };
