'use client';

import { useState } from 'react';

export type FertilizerTabId = 'nitrogen-inputs' | 'crop-outputs' | 'soil-analysis';

export function useFertilizerTabs() {
  const [activeTab, setActiveTab] = useState<FertilizerTabId>('nitrogen-inputs');

  const handleTabChange = (tabId: FertilizerTabId) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    handleTabChange,
  };
}

