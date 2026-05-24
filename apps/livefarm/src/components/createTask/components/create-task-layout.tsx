import React, { useRef } from 'react';
import {
  Breadcrumbs,
  CreateTaskForm,
  FarmMap,
  FormFarm,
} from '@@agrosphere/shared';
import { Client } from '../types';
import { taskTypes, organizations, priorities, labs } from '../constants';

type CreateTaskFormValues = {
  lab: string;
  client: string;
  taskType: string;
  assignedTo: string;
  assignedUser: string;
  priority: string;
  startAfter: string;
  completeBy: string;
  description: string;
};

interface CreateTaskLayoutProps {
  mapSize: number;
  formValues: CreateTaskFormValues;
  selectedFarms: Record<string, string[]>;
  selectedClientFarms: FormFarm[];
  clients: Client[];
  selectedClientId: string;
  onChange: (field: keyof CreateTaskFormValues, value: string) => void;
  onFarmsChange: (farmId: string, selectedFields: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSave: () => void;
  onCancel: () => void;
  onMapSizeChange: (size: number) => void;
  onZoomToFarm: (farmId: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
  isFormValid: boolean;
  isSubmitting: boolean;
  allowSave: boolean;
}

export function CreateTaskLayout({
  mapSize,
  formValues,
  selectedFarms,
  selectedClientFarms,
  clients,
  selectedClientId,
  onChange,
  onFarmsChange,
  onSubmit,
  onSave,
  onCancel,
  onMapSizeChange,
  onZoomToFarm,
  isLoading,
  isDisabled,
  isFormValid,
  isSubmitting,
  allowSave,
}: CreateTaskLayoutProps) {
  const zoomToFarmRef = useRef<((farmId: string) => void) | null>(null);
  const attachedFiles: File[] = [];

  const handleAttachFiles = () => {
    return;
  };

  return (
    <div className="flex flex-col w-full h-full max-h-full overflow-hidden">
      <div className="flex flex-row flex-1 min-h-0 max-h-full overflow-hidden gap-2">
        {mapSize === 40 && (
          <div className="flex flex-col flex-1 min-h-0 max-h-full rounded-xl border border-basic-gray-light">
            <div className="flex flex-col flex-1 min-h-0 max-h-full bg-white rounded-xl">
              <Breadcrumbs
                items={[
                  { label: 'All tasks', href: '/tasks' },
                  { label: 'Create task' },
                ]}
                separator={
                  <span className="material-symbols-outlined text-base align-middle">
                    chevron_right
                  </span>
                }
                className="p-5 border-b-1 border border-[#EEF0F6]"
              />
              <div
                className="flex-1 min-h-0 max-h-full bg-white rounded-lg shadow-sm overflow-y-auto"
                data-list-container
              >
                <CreateTaskForm
                  taskTypes={taskTypes}
                  organizations={organizations}
                  priorities={priorities}
                  farms={selectedClientFarms}
                  selectedFarms={selectedFarms}
                  onFarmsChange={onFarmsChange}
                  values={formValues}
                  onChange={onChange}
                  onSubmit={onSubmit}
                  onAttachFiles={handleAttachFiles}
                  attachedFiles={attachedFiles}
                  isLoading={isLoading}
                  isDisabled={isDisabled}
                  labs={labs}
                  onZoomToFarm={onZoomToFarm}
                  showActionButtons={true}
                  onCancel={onCancel}
                  onSave={onSave}
                  isFormValid={isFormValid}
                  isSubmitting={isSubmitting}
                  allowSave={allowSave}
                  isEditing={false}
                />
              </div>
            </div>
          </div>
        )}

        {(mapSize === 40 || mapSize === 100) && (
          <div
            className={`${
              mapSize === 100 ? 'w-full h-full' : 'flex-shrink-0'
            } rounded-xl overflow-hidden`}
            style={{
              width: mapSize === 40 ? '40%' : mapSize === 100 ? '100%' : 'auto',
              minWidth: mapSize === 40 ? '40vw' : 'auto',
            }}
          >
            <div className="w-full h-full bg-white rounded-xl shadow-sm overflow-hidden">
              <FarmMap
                clients={clients}
                selectedClientId={selectedClientId}
                selectedFarms={selectedFarms}
                onZoomToFarmRef={zoomToFarmRef}
                onFarmClick={(farm) => {
                  // Handle farm click
                }}
                onZoneClick={(zone) => {
                  // Handle zone click
                }}
                showSizeControls={true}
                panelSide="left"
                initialMapSize={mapSize}
                onMapSizeChange={onMapSizeChange}
                isTaskDetail={true}
                key="create-task-map"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
