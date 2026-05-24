'use client';
import React, { useEffect, useState } from 'react';
import { TaskTypeDropdown } from '../select/select';
import { ClientFarmsSection, DetailsSection } from './components';
import { Button } from '../button/button';
import { CreateTaskFormProps } from './types';

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  taskTypes,
  organizations,
  priorities,
  labs,
  values,
  onChange,
  onSubmit,
  isLoading,
  isDisabled,
  farms,
  selectedFarms,
  onFarmsChange,
  attachedFiles,
  showTaskTypeDropdown = true,
  onZoomToFarm,
  resetExpanded,
  showActionButtons = false,
  onCancel,
  onSave,
  isFormValid = false,
  isSubmitting = false,
  selectedLab,
  selectedStartAfter,
  selectedCompleteBy,
  selectedOrganization,
  selectedUser,
  selectedPriority,
  allowSave = false,
  isEditing = false,
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>(attachedFiles || []);
  const isTaskTypeSelected = showTaskTypeDropdown ? !!values.taskType : true;
  const isClientSelected = !!values.client;
  const hasSelectedFarms =
    Object.keys(selectedFarms).length > 0 &&
    Object.values(selectedFarms).some((fields) => fields.length > 0);

  useEffect(() => {
    if (Object.keys(selectedFarms).length > 0) {
      Object.keys(selectedFarms).forEach((farmId) => {
        const farm = farms.find((f) => f.id === farmId);
        if (
          farm &&
          farm.clientId !== values.client &&
          selectedFarms[farmId]?.length
        ) {
          onFarmsChange(farmId, []);
        }
      });
    }
  }, [values.client, farms, selectedFarms, onFarmsChange]);

  return (
    <div className={`flex flex-col h-full ${isEditing ? 'relative' : ''}`}>
      <form
        className={`rounded-b-2xl px-8 pb-8 pt-2 flex flex-col gap-4 relative flex-1 ${
          isDisabled ? 'bg-transparent' : 'bg-white'
        } ${isEditing ? 'pb-20' : ''}`}
        onSubmit={onSubmit}
      >
        {showTaskTypeDropdown && (
          <div className="flex flex-col items-start relative">
            <TaskTypeDropdown
              options={taskTypes}
              value={values.taskType}
              onChange={(value) => onChange('taskType', value)}
              disabled={isDisabled}
            />
          </div>
        )}

        <ClientFarmsSection
          values={values}
          onChange={onChange}
          farms={farms}
          selectedFarms={selectedFarms}
          onFarmsChange={onFarmsChange}
          isTaskTypeSelected={isTaskTypeSelected}
          isDisabled={isDisabled}
          onZoomToFarm={onZoomToFarm}
          resetExpanded={resetExpanded}
        />

        <DetailsSection
          values={values}
          onChange={onChange}
          labs={labs}
          priorities={priorities}
          organizations={organizations}
          isTaskTypeSelected={isTaskTypeSelected}
          isClientSelected={isClientSelected}
          hasSelectedFarms={hasSelectedFarms}
          isDisabled={isDisabled}
          localFiles={localFiles}
          onFilesChange={(files) => {
            setLocalFiles(files);
          }}
          selectedLab={selectedLab}
          selectedStartAfter={selectedStartAfter}
          selectedCompleteBy={selectedCompleteBy}
          selectedOrganization={selectedOrganization}
          selectedUser={selectedUser}
          selectedPriority={selectedPriority}
        />
      </form>

      {showActionButtons && (
        <div
          className={`${
            isEditing ? 'bottom-5' : 'bottom-0'
          } bg-white py-4 border-t sticky border-basic-white`}
        >
          <div className="flex gap-4 px-5">
            <Button
              variant="cancel"
              size="md"
              type="button"
              className="flex-1"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="complete"
              size="md"
              type="button"
              className="flex-1"
              onClick={onSave}
              disabled={(!isFormValid && !allowSave) || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
