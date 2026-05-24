'use client';
import { useState, useCallback } from 'react';

export const useTeamNavigation = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = useCallback(
    (
      tabId: string,
      callbacks: {
        resetUsersSearch: () => void;
        resetConnectionsSearch: () => void;
        resetRolesSearch: () => void;
        resetUsersPage: () => void;
        resetConnectionsPage: () => void;
        resetUsersSelection: () => void;
        resetConnectionsSelection: () => void;
        resetSelectedRole: () => void;
      }
    ) => {
      setActiveTab(tabId);
      setSearchTerm('');

      callbacks.resetUsersPage();
      callbacks.resetConnectionsPage();
      callbacks.resetUsersSelection();
      callbacks.resetConnectionsSelection();
      callbacks.resetSelectedRole();

      if (tabId === 'users') {
        callbacks.resetUsersSearch();
      } else if (tabId === 'connections') {
        callbacks.resetConnectionsSearch();
      } else if (tabId === 'user-roles') {
        callbacks.resetRolesSearch();
      }
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value;
      setSearchTerm(searchValue);
    },
    []
  );

  return {
    activeTab,
    searchTerm,
    handleTabChange,
    handleSearchChange,
  };
};
