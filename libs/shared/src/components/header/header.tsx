'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TabItem } from '../tabs-item/tabs-item';
import { Download, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SearchInput } from '../search-input/search-input';
import { Button } from '../button/button';
interface TabItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabItemsData: TabItemData[];
  className?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  showSearchButton?: boolean;
  showDownloadButton?: boolean;
  searchPlaceholder?: string;
  onDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  tabItemsData,
  className,
  searchTerm,
  onSearchChange,
  showSearchButton = true,
  showDownloadButton = true,
  searchPlaceholder,
  onDownload,
}) => {
  const [isSearchOverlayActive, setIsSearchOverlayActive] =
    useState<boolean>(false);

  const navRef = useRef<HTMLElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (id: string) => {
    onTabChange(id);
    setIsSearchOverlayActive(false);
  };

  const handleSearchIconClick = () => {
    if (isSearchOverlayActive) {
      setIsSearchOverlayActive(false);
      onSearchChange?.('');
    } else {
      setIsSearchOverlayActive(true);
    }
  };

  const handleCloseSearchOverlay = () => {
    setIsSearchOverlayActive(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      return;
    }
    if (e.key === 'Escape') {
      setIsSearchOverlayActive(false);
      onSearchChange?.('');
    }
  };

  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTabElement = tabsContainerRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      ) as HTMLElement;

      if (activeTabElement) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const tabRect = activeTabElement.getBoundingClientRect();

        if (
          tabRect.left < containerRect.left ||
          tabRect.right > containerRect.right
        ) {
          activeTabElement.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          });
        }
      }
    }
  }, [activeTab]);

  return (
    <nav
      ref={navRef}
      className={cn('relative bg-white max-h-full ', className)}
    >
      <SearchInput
        isActive={isSearchOverlayActive}
        searchTerm={searchTerm || ''}
        onSearchChange={handleSearchInputChange}
        onClose={handleCloseSearchOverlay}
        className="min-h-[45px]"
        onKeyDown={handleInputKeyDown}
        placeholder={searchPlaceholder}
        clearOnClose={true}
      />

      {!isSearchOverlayActive && (
        <div
          className="flex justify-between items-center border-b border-gray-200"
          role="tablist"
        >
          <div
            ref={tabsContainerRef}
            className="flex flex-grow overflow-x-auto whitespace-nowrap no-scrollbar"
          >
            {tabItemsData.map((tab) => (
              <TabItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
                data-tab-id={tab.id}
                className="flex-shrink-0"
              />
            ))}
          </div>
          <div className="flex items-center space-x-4 ml-4">
            {showSearchButton && (
              <Button
                variant="ghost"
                onClick={handleSearchIconClick}
                className={`material-symbols-outlined flex text-[20px] items-center p-0 text-basic-black justify-center py-0  rounded-lg focus:outline-none focus-visible:ring-2 `}
                aria-label={
                  isSearchOverlayActive ? 'Clear Search' : 'Activate Search'
                }
              >
                search
              </Button>
            )}
            {showSearchButton && showDownloadButton && (
              <div className="w-px h-6 bg-basic-white mx-2"></div>
            )}
            {showDownloadButton && (
              <Button
                variant="ghost"
                onClick={onDownload}
                className="flex items-center justify-center p-0  rounded-lg text-basic-black "
                aria-label="Download"
              >
                <span className="material-symbols-outlined text-[20px]">
                  download
                </span>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
