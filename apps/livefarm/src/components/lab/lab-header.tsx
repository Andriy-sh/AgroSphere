import { AddButton, Button, Icon, PageHeader } from '@@agrosphere/shared';
import { SearchInput } from '@@agrosphere/shared';
import { DropdownActionsNoLib } from '@@agrosphere/shared';
import { Search } from 'lucide-react';
import { cn } from '@@agrosphere/shared';

interface LabHeaderProps {
  searchActive: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClose: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent) => void;
  onSearchActive: () => void;
  onShowFilters: () => void;
  onAddClient: () => void;
  onExportCSV: () => void;
  onImportCSV: () => void;
  showFilters?: boolean;
}

export function LabHeader({
  searchActive,
  searchTerm,
  onSearchChange,
  onSearchClose,
  onSearchKeyDown,
  onSearchActive,
  onShowFilters,
  onAddClient,
  onExportCSV,
  onImportCSV,
  showFilters = false,
}: LabHeaderProps) {
  return (
    <div className="flex items-center justify-between  bg-white">
      <div className="flex items-center gap-4 flex-1">
        <PageHeader icon="experiment" title="Lab orders" />
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        {searchActive ? (
          <SearchInput
            isActive={searchActive}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onClose={onSearchClose}
            onKeyDown={onSearchKeyDown}
            placeholder="Search by name, farm, lab, test type..."
            className="w-[500px] border border-[#29B54C] rounded-lg px-1 h-9"
            inputClassName="py-0"
            bottomBorder={false}
          />
        ) : (
          <Button
            variant="cancel"
            size="md"
            className={cn('h-9', searchTerm && 'bg-green-50 text-green-600')}
            onClick={onSearchActive}
            aria-label="Open search"
          >
            <Search className="w-6 h-6" />
          </Button>
        )}

        <Button
          variant="filter"
          size="md"
          className={cn(
            'h-9',
            showFilters && 'bg-white border border-basic-green '
          )}
          onClick={onShowFilters}
        >
          <Icon icon="filter_list" />
          Filter
        </Button>

        <AddButton buttonText="Add" />

        <DropdownActionsNoLib
          triggerClassName="h-9 w-9 p-0 bg-basic-white justify-center rounded-lg "
          items={[
            {
              id: 'import-csv',
              label: 'Import from CSV',
              icon: 'download',
              onClick: onImportCSV,
            },
            {
              id: 'export-csv',
              label: 'Export to CSV',
              icon: 'upload',
              onClick: onExportCSV,
            },
          ]}
        />
      </div>
    </div>
  );
}
