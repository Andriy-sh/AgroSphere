import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const isServer = typeof window === 'undefined';

interface MapPanelState {
  panelWidth: number;
  setPanelWidth: (width: number) => void;
  resetPanelWidth: () => void;
}

const DEFAULT_WIDTH = 30;
const MIN_WIDTH = 5;
const MAX_WIDTH = 50;

export const useMapPanelStore = create<MapPanelState>()(
  persist(
    (set, get) => ({
      panelWidth: DEFAULT_WIDTH,
      setPanelWidth: (width: number) => {
        const clampedWidth = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
        set({ panelWidth: clampedWidth });
      },
      resetPanelWidth: () => {
        set({ panelWidth: DEFAULT_WIDTH });
      },
    }),
    {
      name: 'map-panel-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        return state;
      },
    }
  )
);
