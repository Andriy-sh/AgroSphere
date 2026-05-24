'use client';

import React from 'react';
import { Header } from '@@agrosphere/shared';

interface TaskActionsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDownload?: () => void;
}

export function TaskActions({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  onDownload,
}: TaskActionsProps) {
  const searchPlaceholder =
    'Search by task id, sample id, assigned to, client...';

  const tabItemsData = [
    {
      id: 'table',
      label: 'Table',
      icon: "border_all",
    },
    {
      id: 'list',
      label: 'List',
      icon: "sort",
    },
    // {
    //   id: 'kanban',
    //   label: 'Kanban',
    //   icon: <span className="material-symbols-outlined">view_kanban</span>,
    // },
    // {
    //   id: 'timeline',
    //   label: 'Timeline',
    //   icon: (
    //     <span className="material-symbols-outlined">view_object_track</span>
    //   ),
    // },
  ];

  return (
    <Header
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabItemsData={tabItemsData}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      onDownload={onDownload}
    />
  );
}
