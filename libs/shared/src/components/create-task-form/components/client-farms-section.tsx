import React, { useMemo, useState } from 'react';
import { UserSelect } from '../../user-select/user-select';
import { FarmsSection } from './farms-section';
import { CreateTaskFormValues, Farm } from '../types';
import { useInfiniteGetClients } from '../../../api/hooks/clients/useClientsQueries';
import {
  Client,
  ClientsResponse,
} from '../../../api/services/clients/client-types';
import { useDebounce } from '../../../hooks/use-debounce';

interface ClientFarmsSectionProps {
  values: CreateTaskFormValues;
  onChange: (field: keyof CreateTaskFormValues, value: string) => void;
  farms: Farm[];
  selectedFarms: Record<string, string[]>;
  onFarmsChange: (farmId: string, selectedFields: string[]) => void;
  isTaskTypeSelected: boolean;
  isDisabled?: boolean;
  onZoomToFarm?: (farmId: string) => void;
  resetExpanded?: boolean;
}

export const ClientFarmsSection: React.FC<ClientFarmsSectionProps> = ({
  values,
  onChange,
  farms,
  selectedFarms,
  onFarmsChange,
  isTaskTypeSelected,
  isDisabled,
  onZoomToFarm,
  resetExpanded,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteGetClients(
      debouncedSearchTerm ? { search: debouncedSearchTerm } : undefined,
      {
        perPage: 20,
        enabled: isTaskTypeSelected && !isDisabled,
      }
    );

  const clientsOptions = useMemo(() => {
    if (!data?.pages) return [];

    const allClients: Client[] = data.pages.flatMap(
      (page: ClientsResponse) => page.data
    );

    return allClients.map((client) => {
      const label = client.business_name || client.full_name || '';
      const initials = label
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        value: client.id,
        label,
        initials,
      };
    });
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div
      className={`${isDisabled ? 'bg-transparent' : 'bg-white'}`}
      style={{
        opacity: isTaskTypeSelected ? 1 : 0.5,
        pointerEvents: isTaskTypeSelected ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-basic-green text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold text-lg">
          1
        </span>
        <span
          className={`font-semibold text-lg ${
            isDisabled ? 'text-basic-gray' : 'text-black'
          }`}
        >
          Client & Farms
        </span>
      </div>
      <div className="mb-4">
        <label
          className={`block font-normal text-sm mb-1 ${
            isDisabled ? 'text-basic-gray' : 'text-gray-700'
          }`}
        >
          Client <span className="text-red-500">*</span>
        </label>
        <UserSelect
          options={clientsOptions}
          value={values.client}
          onChange={(value) => onChange('client', value)}
          placeholder="Select client"
          avatarClassName="!w-5 !h-5 rounded-sm w-full !text-xs"
          triggerClassName="h-9 bg-[#EEF0F629]"
          disabled={isDisabled || isLoading}
          width="dynamic"
          onLoadMore={handleLoadMore}
          hasMore={hasNextPage ?? false}
          isLoadingMore={isFetchingNextPage}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
        />
      </div>
      {values.client &&
        (() => {
          const clientFarms = farms.filter(
            (farm) => farm.clientId === values.client
          );

          if (clientFarms.length === 0) {
            return (
              <div
                className={`mb-4 p-2 rounded-lg ${
                  isDisabled && 'bg-transparent'
                }`}
              >
                <p
                  className={`text-sm ${
                    isDisabled ? 'text-basic-gray' : 'text-gray-600'
                  }`}
                >
                  There are no available farms for the selected client.
                </p>
              </div>
            );
          }

          return (
            <FarmsSection
              farms={clientFarms}
              selectedFarms={selectedFarms}
              onFarmsChange={onFarmsChange}
              isTaskTypeSelected={isTaskTypeSelected}
              isDisabled={isDisabled}
              onZoomToFarm={onZoomToFarm}
              resetExpanded={resetExpanded}
            />
          );
        })()}
    </div>
  );
};
