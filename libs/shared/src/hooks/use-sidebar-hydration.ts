'use client';
import { useEffect, useState } from 'react';
import { useSidebarStore } from '../stores/useSidebarStore';

export function useSidebarHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      if (useSidebarStore.persist) {
        useSidebarStore.persist.rehydrate();
      }
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return isHydrated;
}
