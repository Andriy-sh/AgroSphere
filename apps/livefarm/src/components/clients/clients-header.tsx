import { AddButton, Button, Icon, PageHeader } from '@@agrosphere/shared';
import { SearchInput } from '@@agrosphere/shared';
import { DropdownActionsNoLib } from '@@agrosphere/shared';
import { cn } from '@@agrosphere/shared';
import { Search } from 'lucide-react';
interface ClientsHeaderProps {
  searchActive: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClose: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent) => void;
  onSearchActive: () => void;
  onShowFilters: () => void;
  onImportFromCSV?: () => void;
  onAddClient?: () => void;
  showFilters?: boolean;
}

export function ClientsHeader({
  searchActive,
  searchTerm,
  onSearchChange,
  onSearchClose,
  onSearchKeyDown,
  onSearchActive,
  onShowFilters,
  onImportFromCSV,
  onAddClient,
  showFilters = false,
}: ClientsHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl ">
      <div className="flex items-center gap-4 flex-1">
        <PageHeader icon="groups" title="Clients" />
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        {searchActive ? (
          <SearchInput
            isActive={searchActive}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onClose={onSearchClose}
            onKeyDown={onSearchKeyDown}
            placeholder="Search by name, phone, address, herd no"
            className="w-full border border-[#29B54C] rounded-lg px-1 h-9"
            inputClassName="py-0"
            bottomBorder={false}
          />
        ) : (
          <Button
            variant="cancel"
            size="md"
            className="h-9 w-9"
            onClick={onSearchActive}
            aria-label="Open search"
          >
            <Icon icon="search" />
          </Button>
        )}

        <Button
          variant="filter"
          size="md"
          className={cn(
            'h-9',
            showFilters && 'bg-white border border-basic-green'
          )}
          onClick={onShowFilters}
        >
          <Icon icon="filter_list" />
          Filter
        </Button>
        <AddButton buttonText="Add" onAddClient={onAddClient} />
        <DropdownActionsNoLib
          triggerClassName="h-9 w-9 p-0 bg-basic-white flex items-center justify-center rounded-lg"
          items={[
            {
              id: 'import-csv',
              label: 'Import from CSV',
              icon: 'download',
              onClick: onImportFromCSV,
            },
            {
              id: 'export-csv',
              label: 'Export to CSV',
              icon: 'upload',
              onClick: () => {
                return;
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
