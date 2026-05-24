'use client';
import React, { useMemo, useEffect, useRef } from 'react';
import { useGetClients } from '@@agrosphere/shared';
import { transformClientsForCreateTask } from '@/utils/transform-clients-for-create-task';
import { useCreateTaskForm } from './hooks/use-create-task-form';
import { useCreateTaskSubmit } from './hooks/use-create-task-submit';
import { useFarmsSelection } from './hooks/use-farms-selection';
import { useMapSize } from './hooks/use-map-size';
import { transformClientsToFormFarms } from './utils/transform-farms';
import { CreateTaskLayout } from './components/create-task-layout';
import { Client } from './types';

export function CreateTask() {
  const {
    data: clientsResponse,
    isLoading: isLoadingClients,
    error: clientsError,
  } = useGetClients();

  const {
    values,
    handleChange,
    isFormValid: isFormFieldsValid,
  } = useCreateTaskForm();
  const { submitTask, cancel, isSubmitting } = useCreateTaskSubmit();
  const { mapSize, handleMapSizeChange } = useMapSize();

  const clients = useMemo(() => {
    if (!clientsResponse?.data) {
      return [];
    }
    return transformClientsForCreateTask(clientsResponse.data) as Client[];
  }, [clientsResponse]);

  const formFarms = useMemo(() => {
    return transformClientsToFormFarms(clients);
  }, [clients]);

  const {
    selectedFarms,
    selectedClientFarms,
    handleFarmsChange,
    resetFarms,
    isFarmsSelectionValid,
  } = useFarmsSelection(formFarms, values.client);

  const prevClientRef = useRef<string>('');
  useEffect(() => {
    if (
      values.client &&
      prevClientRef.current &&
      prevClientRef.current !== values.client
    ) {
      resetFarms();
    }
    prevClientRef.current = values.client;
  }, [values.client, resetFarms]);

  const isFormValid = isFormFieldsValid && isFarmsSelectionValid;
  const isLoading = isLoadingClients;
  const isDisabled = isLoadingClients || !!clientsError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSave = async () => {
    try {
      await submitTask(values, selectedFarms);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleZoomToFarm = (farmId: string) => {
    console.log('Zoom to farm:', farmId);
  };

  if (isLoadingClients) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading...</div>
      </div>
    );
  }

  if (clientsError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Error loading clients. Please try again later.</div>
      </div>
    );
  }

  return (
    <CreateTaskLayout
      mapSize={mapSize}
      formValues={values}
      selectedFarms={selectedFarms}
      selectedClientFarms={selectedClientFarms}
      clients={clients}
      selectedClientId={values.client}
      onChange={handleChange}
      onFarmsChange={handleFarmsChange}
      onSubmit={handleSubmit}
      onSave={handleSave}
      onCancel={cancel}
      onMapSizeChange={handleMapSizeChange}
      onZoomToFarm={handleZoomToFarm}
      isLoading={isLoading}
      isDisabled={isDisabled}
      isFormValid={isFormValid}
      isSubmitting={isSubmitting}
      allowSave={isFormValid}
    />
  );
}
