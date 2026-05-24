'use client';
import { MyFarmHeader } from './my-farm-header';
import { MyFarmFilters } from './my-farm-filters';
import { MyFarmList } from './my-farm-list';
import { TotalActiveArea } from './total-active-area';
import { useState, useCallback, useEffect } from 'react';
import { MyFarmMap } from './my-farm-map';
import { MapToggleButton } from '@@agrosphere/shared';
import { SortState, sortingUtils } from './sorting.config';
import { useMapStore } from '@/stores/use-map-store';
import { useLocationSelection } from './hooks/useLocationSelection';
import { useSelectedFarm } from './hooks/useSelectedFarm';
import { useFarmData } from './hooks/useFarmData';
import { useUpdateFarmLocation } from './hooks/use-update-farm-location';

export function MyFarm() {
  const [showFilters, setShowFilters] = useState(false);
  const { farmItems } = useFarmData();
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [sortState, setSortState] = useState<SortState>(
    sortingUtils.getDefaultSort()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedFarmId, selectFarm } = useSelectedFarm();
  const { mapSize, setMapSize } = useMapStore();
  const { updateLocation } = useUpdateFarmLocation();

  const ensureMapVisible = useCallback(() => {
    if (mapSize === 0) {
      setMapSize(40);
    }
  }, [mapSize, setMapSize]);

  const {
    pendingLocationFarmId,
    requestLocationChange,
    confirmLocationSelection,
    cancelLocationSelection,
  } = useLocationSelection({
    ensureMapVisible,
    onApplyLocation: updateLocation,
  });

  useEffect(() => {
    if (!pendingLocationFarmId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelLocationSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pendingLocationFarmId, cancelLocationSelection]);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleFiltersChange = useCallback(
    (filters: Record<string, string[]>) => {
      setActiveFilters(filters);
    },
    []
  );

  const handleSortChange = useCallback((sort: SortState) => {
    setSortState(sort);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleZoomToFarm = useCallback(
    (farmId: string) => {
      const farm = farmItems.find((f) => f.id === farmId);
      if (farm && farm.lat && farm.lng) {
        selectFarm(farmId);
      }
    },
    [farmItems, selectFarm]
  );
  const showSceneTimeline = true;

  return (
    <div className="flex flex-row w-full h-full max-h-full gap-2">
      {mapSize < 100 && (
        <div className="flex flex-col flex-1 min-h-0 max-h-full">
          <div className="flex flex-row flex-1 min-h-0 max-h-full gap-2">
            {showFilters && (
              <MyFarmFilters
                activeFilters={activeFilters}
                onFiltersChange={handleFiltersChange}
              />
            )}

            <div
              className="flex flex-col flex-1 min-h-0 max-h-full border border-basic-gray-light rounded-xl bg-white p-5"
              style={{ minWidth: 0 }}
            >
              <div className="flex-shrink-0">
                <MyFarmHeader
                  onToggleFilters={toggleFilters}
                  showFilters={showFilters}
                  onSortChange={handleSortChange}
                  currentSort={sortState}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                />
              </div>

              <TotalActiveArea farmItems={farmItems} />

              <div className="flex-1 min-h-0 max-h-full overflow-hidden">
                <div className="h-full overflow-auto">
                  <MyFarmList
                    onZoomToFarm={handleZoomToFarm}
                    activeFilters={activeFilters}
                    sortState={sortState}
                    searchQuery={searchQuery}
                    onRequestLocationChange={requestLocationChange}
                    pendingLocationFarmId={pendingLocationFarmId}
                    onCancelLocationSelection={cancelLocationSelection}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mapSize > 0 && (
        <MyFarmMap
          showFilters={showFilters}
          farmItems={farmItems}
          selectedFarmId={selectedFarmId}
          onZoomToFarm={handleZoomToFarm}
          locationSelectionFarmId={pendingLocationFarmId}
          onLocationSelected={confirmLocationSelection}
          onCancelLocationSelection={cancelLocationSelection}
          showSceneTimeline={showSceneTimeline}
        />
      )}

      <MapToggleButton
        mapSize={mapSize}
        showFilters={showFilters}
        onMapSizeChange={setMapSize}
      />
    </div>
  );
}
