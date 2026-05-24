import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const isServer = typeof window === 'undefined';

interface SidebarState {
  width: number;
  isOpen: boolean;
  setWidth: (width: number) => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const MIN_WIDTH = 76;
const MAX_WIDTH = 256;
const COLLAPSE_THRESHOLD = MIN_WIDTH + 10;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      width: MAX_WIDTH,
      isOpen: true,
      setWidth: (width: number) => {
        const clampedWidth = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
        const isOpen = clampedWidth > COLLAPSE_THRESHOLD;
        set({ width: clampedWidth, isOpen });
      },
      toggleSidebar: () => {
        const { width } = get();
        const newWidth = width > MIN_WIDTH ? MIN_WIDTH : MAX_WIDTH;
        const isOpen = newWidth > COLLAPSE_THRESHOLD;
        set({ width: newWidth, isOpen });
      },
      openSidebar: () => {
        set({ width: MAX_WIDTH, isOpen: true });
      },
      closeSidebar: () => {
        set({ width: MIN_WIDTH, isOpen: false });
      },
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
);
