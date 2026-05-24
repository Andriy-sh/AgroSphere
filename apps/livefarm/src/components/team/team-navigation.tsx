'use client';

import { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Button, Input } from '@@agrosphere/shared';
import React, { useRef, useEffect } from 'react';

interface CustomTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface CustomTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CustomTab({ label, isActive, onClick }: CustomTabProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Switch to ${label} tab`}
      aria-selected={isActive}
      role="tab"
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300
        ${
          isActive
            ? 'text-basic-black'
            : 'text-basic-gray hover:text-basic-black'
        }
      `}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-basic-green transform transition-transform duration-300 ${
          isActive ? 'scale-x-100 w-full' : 'scale-x-0 w-full'
        }`}
      />
    </button>
  );
}

const CustomSearchInput = ({
  isActive,
  searchTerm,
  onSearchChange,
  onClose,
  onClear,
  onKeyDown,
  className,
  placeholder = 'Search...',
  inputClassName,
  bottomBorder = true,
  closeButton = true,
  iconSize = 20,
}: {
  isActive: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  bottomBorder?: boolean;
  closeButton?: boolean;
  iconSize?: number;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isActive &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className={`flex items-center bg-white first-line:search-overlay-active ${className}`}
    >
      <Input
        className={`relative flex-1 shadow-none overflow-hidden ${inputClassName}`}
      >
        <Input.Content
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={onKeyDown}
          className="pl-10 pr-10 bg-white w-full border-none focus:ring-0 peer"
          aria-label="Search input"
        />
        {bottomBorder && (
          <div
            className="absolute bottom-0 left-1/2 h-[2px] w-full bg-green-500 transition-transform duration-300 ease-out transform -translate-x-1/2 scale-x-0 peer-focus:scale-x-100"
            aria-hidden="true"
          ></div>
        )}
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center"
          aria-hidden="true"
        >
          <Search size={iconSize} className="text-gray-400" />
        </div>
        {closeButton && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-basic-green focus:outline-none focus-visible:ring-2 focus-visible:ring-basic-green rounded-full"
            aria-label="Clear search"
          >
            <X size={iconSize} />
          </button>
        )}
      </Input>
    </div>
  );
};

interface TeamNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInviteUser: () => void;
  onInviteConnection?: () => void;
  onCreateRole?: () => void;
  hideContent?: boolean;
}

export function TeamNavigation({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  onInviteUser,
  onInviteConnection,
  onCreateRole,
  hideContent = false,
}: TeamNavigationProps) {
  const [searchActive, setSearchActive] = useState(false);

  const tabItems = [
    {
      id: 'users',
      label: 'Users',
    },
    {
      id: 'connections',
      label: 'Connections',
    },
    {
      id: 'user-roles',
      label: 'User roles',
    },
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'users':
        return 'Users';
      case 'connections':
        return 'Connections';
      case 'user-roles':
        return 'User roles';
      default:
        return 'Users';
    }
  };

  const getActionButton = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Button
            onClick={onInviteUser}
            className="bg-basic-green hover:bg-basic-green/80 text-white h-9"
            aria-label="Invite new user"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Invite user
          </Button>
        );
      case 'connections':
        return (
          <Button
            onClick={onInviteConnection || (() => {
              return
            })}
            className="bg-basic-green hover:bg-basic-green/80 text-white h-9"
            aria-label="Invite new connection"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Invite connection
          </Button>
        );
      // case 'user-roles':
      //   return (
      //     <Button
      //       onClick={onCreateRole || (() => {
      //         return
      //       })}
      //       className="bg-basic-green hover:bg-basic-green/80 text-white h-9"
      //       aria-label="Create new role"
      //     >
      //       <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
      //       Create role
      //     </Button>
      //   );
      default:
        return null;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e);
  };

  const handleSearchClose = () => {
    setSearchActive(false);
  };

  const handleSearchClear = () => {
    setSearchActive(false);
    onSearchChange({
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSearchClose();
    }
  };

  const handleSearchActive = () => {
    setSearchActive(true);
  };

  return (
    <div className="">
      <div className="mb-4 flex items-center gap-2 pl-5 pt-5">
        <span
          className="material-symbols-outlined text-basic-green"
          aria-hidden="true"
        >
          group
        </span>
        <h1 className="text-2xl font-bold text-basic-black">Team</h1>
      </div>

      <div
        className="flex border-b mb-4"
        role="tablist"
        aria-label="Team navigation tabs"
      >
        {tabItems.map((tab) => (
          <CustomTab
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>

      {!hideContent && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-basic-black pl-5">
              {getTabTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-5">
            {searchActive ? (
              <CustomSearchInput
                isActive={searchActive}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onClose={handleSearchClose}
                onClear={handleSearchClear}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by name, email, department..."
                className=""
                inputClassName="w-[400px] rounded-lg px-1 h-9"
                bottomBorder={false}
              />
            ) : (
              <Button
                variant="cancel"
                size="md"
                className={`h-9 px-2 ${
                  searchTerm && 'bg-green-50 text-green-600'
                }`}
                onClick={handleSearchActive}
                aria-label="Open search"
              >
                <span
                  className="material-symbols-outlined text-basic-black text-xl"
                  aria-hidden="true"
                >
                  search
                </span>
              </Button>
            )}
            <Button
              variant="cancel"
              size="md"
              className="h-9 px-2"
              aria-label="Download data"
            >
              <span
                className="material-symbols-outlined text-basic-black text-xl"
                aria-hidden="true"
              >
                download
              </span>
            </Button>
            {getActionButton()}
          </div>
        </div>
      )}
    </div>
  );
}
