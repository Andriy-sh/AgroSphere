'use client';
import { useCallback } from 'react';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

export const useTeamNavigationWithUrl = () => {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsString.withDefault('users')
  );
  
  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

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
    [setActiveTab, setSearchTerm]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value;
      setSearchTerm(searchValue);
    },
    [setSearchTerm]
  );

  return {
    activeTab: activeTab || 'users',
    searchTerm: searchTerm || '',
    handleTabChange,
    handleSearchChange,
  };
}; 