'use client';
import {
  AddButton,
  Button,
  DropdownActionsNoLib,
  SearchInput,
} from '@@agrosphere/shared';
import { useState } from 'react';
import { sortOptions, SortState, sortingUtils, type SortField } from './sorting.config';

interface MyFarmHeaderProps {
  onToggleFilters: () => void;
  showFilters: boolean;
  onSortChange?: (sortState: SortState) => void;
  currentSort?: SortState;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const HEADER_ACTIONS = [
  { icon: 'search', label: 'Search' },
  { icon: 'filter_list', label: 'Filter' },
] as const;

export function MyFarmHeader({
  onToggleFilters,
  showFilters,
  onSortChange,
  currentSort = sortingUtils.getDefaultSort(),
  onSearch,
  searchQuery = '',
}: MyFarmHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  const isSearchActive = showSearchInput || searchQuery.length > 0;

  const handleSortChange = (optionId: string) => {
    const newField = optionId as SortField;
    const newDirection =
      newField === currentSort.field
        ? sortingUtils.toggleDirection(currentSort.direction)
        : 'asc';

    const newSortState: SortState = {
      field: newField,
      direction: newDirection,
    };

    onSortChange?.(newSortState);
    setIsDropdownOpen(false);
  };

  const handleSearchClick = () => {
    setShowSearchInput(true);
  };

  const handleSearchClose = () => {
    setShowSearchInput(false);
    if (onSearch && searchQuery.length > 0) {
      onSearch('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearch?.(query);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleSearchClose();
    }
  };

  const handleClearSearch = () => {
    onSearch?.('');
  };

  return (
    <header className="flex justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-basic-green hidden min-[600px]:block">
          home_work
        </span>
        <h1 className="text-28 font-semibold text-basic-black flex-nowrap truncate text-ellipsis hidden min-[600px]:block">
          My farm
        </h1>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <SearchInput
            isActive={isSearchActive}
            searchTerm={searchQuery}
            onSearchChange={handleSearchChange}
            onClose={handleSearchClose}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search farms..."
            className="flex-1"
            closeButton={true}
            clearOnClose={true}
          />
          {isSearchActive && searchQuery && (
            <Button
              variant="filter"
              size="md"
              className="p-11"
              onClick={handleClearSearch}
            >
              <span className="material-symbols-outlined text-[20px] text-basic-black">
                clear
              </span>
            </Button>
          )}
        </div>

        {!isSearchActive && (
          <Button
            variant="filter"
            size="md"
            className="p-11"
            onClick={handleSearchClick}
          >
            <span className="material-symbols-outlined text-[20px] text-basic-black">
              search
            </span>
          </Button>
        )}

        <Button
          variant="filter"
          size="md"
          className={`p-11 ${
            showFilters ? 'bg-white shadow-[0_0_0_1px_#29B54C]' : ''
          }`}
          onClick={onToggleFilters}
        >
          <span className="material-symbols-outlined text-[20px] text-basic-black">
            filter_list
          </span>
        </Button>

        <DropdownActionsNoLib
          items={sortOptions.map((option) => ({
            id: option.id,
            label: sortingUtils.getSortLabel(option.id, currentSort.direction),
            icon: sortingUtils.getSortIcon(
              option.id,
              currentSort.field,
              currentSort.direction
            ),
            onClick: () => handleSortChange(option.id),
          }))}
          rowClassName="text-basic-black rounded-lg"
          contentClassName="min-w-[100px]"
          triggerIcon={
            <Button
              variant="filter"
              size="md"
              className={`p-11 ${
                isDropdownOpen ? 'bg-white shadow-[0_0_0_1px_#29B54C]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-basic-black">
                format_line_spacing
              </span>
            </Button>
          }
          triggerClassName="p-0"
          placement="bottom-start"
          onOpenChange={setIsDropdownOpen}
        />

        <Button variant="filter" size="md" className="p-11">
          Edit parcels
        </Button>

        <AddButton />
      </div>
    </header>
  );
}
