export const SCENARIO_LABELS = {
  pessimistic: 'Pessimistic (Low estimate)',
  medium: 'Medium (Average estimate)',
  optimistic: 'Optimistic (High estimate)',
} as const;

export const SCENARIO_SHORT_LABELS = {
  pessimistic: 'Pessimistic',
  medium: 'Medium',
  optimistic: 'Optimistic',
} as const;

export type ScenarioKey = keyof typeof SCENARIO_LABELS;

export function getScenarioLabel(scenario: string | undefined): string {
  if (!scenario) return '';
  return SCENARIO_LABELS[scenario as ScenarioKey] || '';
}

export function getScenarioShortLabel(scenario: string | undefined): string {
  if (!scenario) return '';
  return SCENARIO_SHORT_LABELS[scenario as ScenarioKey] || '';
}
