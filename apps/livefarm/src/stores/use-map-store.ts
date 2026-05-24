import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapState {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

interface MapStore {
  mapSize: number;
  mapState: MapState | null;
  setMapSize: (size: number) => void;
  resetMapSize: () => void;
  setMapState: (state: MapState) => void;
  clearMapState: () => void;
  validateAndSetMapSize: (size: number, isTasksPage: boolean) => void;
}

// Valid width values for different page types
const TASKS_PAGE_VALID_WIDTHS = [0, 30, 40, 100];
const OTHER_PAGES_VALID_WIDTHS = [0, 40, 100];

// Function to find the nearest valid width
const findNearestValidWidth = (
  currentWidth: number,
  validWidths: number[]
): number => {
  if (validWidths.includes(currentWidth)) {
    return currentWidth;
  }

  // Find the closest valid width
  return validWidths.reduce((closest, validWidth) => {
    const currentDiff = Math.abs(currentWidth - closest);
    const validDiff = Math.abs(currentWidth - validWidth);
    return validDiff < currentDiff ? validWidth : closest;
  });
};

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      mapSize: 0,
      mapState: null,
      setMapSize: (size: number) => set({ mapSize: size }),
      resetMapSize: () => set({ mapSize: 0 }),
      setMapState: (state: MapState) => set({ mapState: state }),
      clearMapState: () => set({ mapState: null }),
      validateAndSetMapSize: (size: number, isTasksPage: boolean) => {
        const validWidths = isTasksPage
          ? TASKS_PAGE_VALID_WIDTHS
          : OTHER_PAGES_VALID_WIDTHS;
        const validatedSize = findNearestValidWidth(size, validWidths);
        set({ mapSize: validatedSize });
      },
    }),
    {
      name: 'map-store',
    }
  )
);
