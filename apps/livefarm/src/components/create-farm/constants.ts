export const MAP_SIZE_SMALL = 40;
export const MAP_SIZE_FULL = 100;

export const MAP_SIZE_THRESHOLD = 50;

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export const CREATE_FARM_PROGRESS_STEPS: ProgressStep[] = [
  {
    id: 'step-1',
    title: 'Click on the map to set farm location',
    description: 'Select the exact spot for your farm by clicking on the map.',
    completed: false,
  },
  {
    id: 'step-2',
    title: 'Enter farm name in the form',
    description: 'Provide a name for your farm in the form on the left.',
    completed: false,
  },
  {
    id: 'step-3',
    title: 'Ready to save your farm',
    description: 'All information is complete. You can now save your farm.',
    completed: false,
  },
];

export function calculateCreateFarmProgressStep(
  hasLocation: boolean,
  hasFarmName: boolean
): number {
  if (!hasLocation) return 0;
  if (!hasFarmName) return 1;
  return 2;
}
