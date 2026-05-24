'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface NotificationStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },
      toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      open: () => {
        set({ isOpen: true });
      },
      close: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'notification-store',
    }
  )
);
