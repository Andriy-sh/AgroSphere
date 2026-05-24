'use client';
import { ClientsHeader } from '@/components/clients/clients-header';
import {
  ClientsFilters,
  ClientFilters,
} from '@/components/clients/clients-filters';
import { ClientsTable } from '@/components/clients/clients-table';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { type ClientFormData, MapToggleButton } from '@@agrosphere/shared';
import { AddClientDialog } from '@/components/clients/add-client-dialog';
import { ClientsImportFromCsv } from '@/components/clients/clients-import-from-csv';
import { useClientsParams } from '@/utils/clients/url-params';
import { ImportedClient } from '@/components/clients/clients-import-from-csv.types';
import { ClientsMap } from '@/components/clients/clients-map';
import { useMapStore } from '@/stores/use-map-store';
import { useClients } from '@@agrosphere/shared';
import { useUIStore } from '@/stores/ui-store';

export default function Clients({
  userOptions,
}: {
  userOptions?: {
    value: string;
    label: string;
    initials?: string;
    avatar?: string;
  }[];
} = {}) {
  const { currentParams, updateParams } = useClientsParams();
  const { mapSize, setMapSize, validateAndSetMapSize } = useMapStore();
  const { clients } = useClients();
  const { isAddClientModalOpen, closeAddClientModal } = useUIStore();

  const searchTerm = currentParams.search || '';
  const currentPage = currentParams.page || 1;

  const [searchActive, setSearchActive] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [filters, setFilters] = useState<ClientFilters>({
    assignee: '',
    tags: [],
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const zoomToClientRef = useRef<((clientId: string) => void) | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const prevFiltersRef = useRef({
    search: '',
    type: '',
    tasks: '',
    assignee: '',
    tags: [] as string[],
  });

  const selectedType = currentParams.type || '';
  const selectedTasks = currentParams.tasks || '';
  const selectedAssignee = currentParams.assignee || '';
  const selectedTags = useMemo(
    () => currentParams.tags || [],
    [currentParams.tags]
  );

  useEffect(() => {
    validateAndSetMapSize(mapSize, false);
  }, [mapSize, validateAndSetMapSize]);

  useEffect(() => {
    return () => {
      closeAddClientModal();
    };
  }, [closeAddClientModal]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm]);

  const showFilters = currentParams.showFilters || false;

  const handleFiltersChange = useCallback((newFilters: ClientFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ assignee: '', tags: [] });
  }, []);

  const handleImportClients = useCallback(
    (importedClients: ImportedClient[]) => {
      setShowImportDialog(false);
    },
    []
  );

  const handleAddClient = useCallback(
    async (clientData: ClientFormData, inviteClient: boolean) => {
      setRefreshTrigger((prev) => prev + 1);
    },
    []
  );

  const handleClientClick = useCallback((clientId: string) => {
    setSelectedClientId(null);
    setSelectedFarmId(null);
    setTimeout(() => {
      setSelectedClientId(clientId);
      if (zoomToClientRef.current) {
        zoomToClientRef.current(clientId);
      }
    }, 0);
  }, []);

  const handleFarmClick = useCallback((farmId: string, clientId: string) => {
    setSelectedFarmId(null);
    setSelectedClientId(null);
    setTimeout(() => {
      setSelectedFarmId(farmId);
      setSelectedClientId(clientId);
    }, 0);
  }, []);

  useEffect(() => {
    const currentFilters = {
      search: debouncedSearchTerm,
      type: selectedType,
      tasks: selectedTasks,
      assignee: selectedAssignee,
      tags: selectedTags,
    };

    const prevFilters = prevFiltersRef.current;
    const hasChanged =
      currentFilters.search !== prevFilters.search ||
      currentFilters.type !== prevFilters.type ||
      currentFilters.tasks !== prevFilters.tasks ||
      currentFilters.assignee !== prevFilters.assignee ||
      JSON.stringify(currentFilters.tags) !== JSON.stringify(prevFilters.tags);

    if (hasChanged && currentPage !== 1) {
      updateParams({ page: 1 });
    }

    prevFiltersRef.current = currentFilters;
  }, [
    debouncedSearchTerm,
    selectedType,
    selectedTasks,
    selectedAssignee,
    selectedTags,
    currentPage,
    updateParams,
  ]);

  return (
    <div className="flex flex-row w-full h-full max-h-full gap-2">
      {mapSize < 100 && (
        <div className="flex flex-col flex-1 min-h-0 max-h-full">
          <div className="flex flex-col h-full bg-white border border-basic-gray-light rounded-xl p-5 gap-6">
            <ClientsHeader
              searchActive={searchActive}
              searchTerm={localSearchTerm}
              onSearchChange={(e) => {
                const value = e.target.value;
                setLocalSearchTerm(value);

                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                }

                searchTimeoutRef.current = setTimeout(() => {
                  updateParams({ search: value });
                }, 500);
              }}
              onSearchClose={() => setSearchActive(false)}
              onSearchKeyDown={(e) => {
                if (e.key === 'Escape') setSearchActive(false);
              }}
              onSearchActive={() => setSearchActive(true)}
              onShowFilters={() => updateParams({ showFilters: !showFilters })}
              onImportFromCSV={() => setShowImportDialog(true)}
              onAddClient={() => {
                const { openAddClientModal } = useUIStore.getState();
                openAddClientModal();
              }}
              showFilters={showFilters}
            />

            <ClientsFilters
              showFilters={showFilters}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              loading={false}
            />

            <div
              className="flex-1 rounded-b-xl"
              data-list-container
              ref={tableContainerRef}
            >
              <ClientsTable
                userOptions={userOptions}
                filters={filters}
                searchTerm={debouncedSearchTerm}
                currentPage={currentPage}
                isActive={true}
                onPageReset={() => updateParams({ page: 1 })}
                onOpenMenuIdChange={() => undefined}
                onEditingIdChange={() => undefined}
                onEditingDataChange={() => undefined}
                refreshTrigger={refreshTrigger}
                enableDynamicPageSize={!showFilters}
                mapSize={mapSize}
                onClientClick={handleClientClick}
                selectedFarmId={selectedFarmId}
                selectedClientId={selectedClientId}
              />
            </div>
          </div>
        </div>
      )}

      {mapSize > 0 && (
        <ClientsMap
          clients={
            (clients || []).map((client) => ({
              ...client,
              farms: client.farms
                ? Array.from({ length: client.farms }, (_, i) => ({
                    id: `${client.id}-farm-${i}`,
                    name: `Farm ${i + 1}`,
                    address: client.full_address || '',
                    latitude: 0,
                    longitude: 0,
                    size: 0,
                    fields: [],
                  }))
                : [],
            })) as unknown as Parameters<typeof ClientsMap>[0]['clients']
          }
          selectedClientId={selectedClientId}
          selectedFarmId={selectedFarmId}
          onClientSelect={setSelectedClientId}
          onFarmSelect={handleFarmClick}
          onMapSizeChange={setMapSize}
          onZoomToClientRef={zoomToClientRef}
        />
      )}
      <MapToggleButton
        mapSize={mapSize}
        showFilters={showFilters}
        onMapSizeChange={setMapSize}
      />

      <AddClientDialog
        isOpen={isAddClientModalOpen}
        onClose={() => {
          closeAddClientModal();
        }}
        onAddClient={handleAddClient}
      />

      <ClientsImportFromCsv
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportClients}
      />
    </div>
  );
}
