'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  exportSelectedLabItemsToCSV,
  LabItem,
  useLabWithUrl,
} from '@@agrosphere/shared';
import { LabTable } from '@/components/lab/lab-table';
import { LabSideFilters } from '@/components/lab/lab-side-filters';
import { LabHeader } from '@/components/lab/lab-header';
import { LabImportFromCsv } from '@/components/lab/lab-import-from-csv';
import { ImportedLabItem } from '@/components/lab/lab-import-from-csv.types';

function Table({
  labItems,
  allLabItems,
  currentPage,
  searchTerm,
  pageSize,
  totalPages,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  onDeleteSelected,
  onDownload,
  onDownloadSelected,
  selectedItems,
  onSelectedItemsChange,
  showFilters,
  enableDynamicPageSize,
  sortField,
  sortDirection,
  onSortChange,
  loading,
}: {
  labItems: LabItem[];
  allLabItems: LabItem[];
  currentPage: number;
  searchTerm: string;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
  onDownload: (id: string) => void;
  onDownloadSelected: (ids: string[]) => void;
  selectedItems: string[];
  onSelectedItemsChange: (selected: string[]) => void;
  showFilters: boolean;
  enableDynamicPageSize?: boolean;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc' | 'none';
  onSortChange?: (field: string, direction: 'asc' | 'desc' | 'none') => void;
  loading?: boolean;
}) {
  return (
    <LabTable
      labItems={labItems}
      allLabItems={allLabItems}
      currentPage={currentPage}
      searchTerm={searchTerm}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onViewDetails={onViewDetails}
      onEdit={onEdit}
      onDelete={onDelete}
      onDeleteSelected={onDeleteSelected}
      onDownload={onDownload}
      onDownloadSelected={onDownloadSelected}
      selectedItems={selectedItems}
      onSelectedItemsChange={onSelectedItemsChange}
      showFilters={showFilters}
      enableDynamicPageSize={enableDynamicPageSize}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
      loading={loading}
    />
  );
}

export default function LabPage() {
  const router = useRouter();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    currentPage,
    searchTerm,
    showFilters,
    activeFilters,
    sortField,
    sortDirection,
    selectedItems,
    labItems,
    filteredLabItems,
    paginatedLabItems,
    pageSize,
    totalPages,
    searchActive,
    tableContainerRef,
    handleSearchChange,
    handlePageChange,
    handleShowFilters,
    handleFiltersChange,
    handleResetFilters,
    handleSortChange,
    handleDelete,
    handleDeleteSelected,
    handleSelectedItemsChange,
    setSearchActive,
    setLabItems,
  } = useLabWithUrl();

  const handleViewDetails = (id: string) => {
    const taskId = id.startsWith('#') ? id.substring(1) : id;
    router.push(`/tasks/${taskId}?from=lab&tab=samples`);
  };

  const handleEdit = (id: string) => {
    return;
  };

  const handleDownload = (id: string) => {
    return;
  };

  const handleDownloadSelected = (ids: string[]) => {
    try {
      exportSelectedLabItemsToCSV(labItems, ids);
      return;
    } catch {
      return;
    }
  };

  const handleExportAll = () => {
    return;
  };

  const handleImportLabItems = useCallback(
    (importedLabItems: ImportedLabItem[]) => {
      const newLabItems = importedLabItems.map((labItem) => ({
        ...labItem,
        client: {
          ...labItem.client,
          avatarSrc:
            labItem.client.avatarSrc ||
            `https://i.pravatar.cc/40?img=${
              Math.floor(Math.random() * 10) + 1
            }`,
        },
      }));

      setLabItems((prevItems) => [...prevItems, ...newLabItems]);
      setShowImportDialog(false);
    },
    [setLabItems]
  );

  const handleSearchClose = () => {
    setSearchActive(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSearchClose();
    }
  };

  const handleSearchActive = () => {
    setSearchActive(true);
  };

  const handleAddClient = () => {
    return;
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      searchTerm ||
      activeFilters.clients.length > 0 ||
      activeFilters.status.length > 0 ||
      activeFilters.period.length > 0 ||
      activeFilters.taskType.length > 0 ||
      activeFilters.type.length > 0
    ) {
      setLoading(true);
      setLoading(false);
    }
  }, [searchTerm, activeFilters, currentPage, sortField, sortDirection]);

  return (
    <div className="flex flex-row w-full h-full max-h-full overflow-hidden gap-x-2">
      <div className="flex flex-col flex-1 min-h-0 max-h-full">
        <div className="flex flex-row flex-1 min-h-0 max-h-full overflow-hidden gap-x-2">
          {showFilters && (
            <LabSideFilters
              labItems={labItems}
              onReset={handleResetFilters}
              onFiltersChange={handleFiltersChange}
              currentFilterState={activeFilters}
            />
          )}
          <div className="flex flex-col flex-1 min-h-0 max-h-full border border-basic-gray-light rounded-xl bg-white overflow-hidden max-w-full p-5 gap-6">
            <div className="flex-shrink-0 max-h-full">
              <LabHeader
                searchActive={searchActive}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onSearchClose={handleSearchClose}
                onSearchKeyDown={handleSearchKeyDown}
                onSearchActive={handleSearchActive}
                onShowFilters={handleShowFilters}
                onAddClient={handleAddClient}
                onExportCSV={handleExportAll}
                onImportCSV={() => setShowImportDialog(true)}
                showFilters={showFilters}
              />
            </div>

            <div className="flex-1 overflow-hidden min-w-0 max-w-full">
              <div
                ref={tableContainerRef}
                className="w-full h-full overflow-auto max-w-full"
              >
                <Table
                  labItems={paginatedLabItems}
                  allLabItems={filteredLabItems}
                  currentPage={currentPage}
                  searchTerm={searchTerm}
                  pageSize={pageSize || 10}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDeleteSelected={handleDeleteSelected}
                  onDownload={handleDownload}
                  onDownloadSelected={handleDownloadSelected}
                  selectedItems={selectedItems}
                  onSelectedItemsChange={handleSelectedItemsChange}
                  showFilters={showFilters}
                  enableDynamicPageSize={true}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <LabImportFromCsv
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportLabItems}
      />
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
