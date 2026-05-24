import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CreateTaskForm } from './create-task-form';
import { CreateTaskFormValues } from './types';
import { mockClients, type Client } from '../../mock/mock-clients';
import { Button } from '../button/button';

const meta: Meta<typeof CreateTaskForm> = {
  title: 'Forms/CreateTaskForm',
  component: CreateTaskForm,
};

export default meta;

type Story = StoryObj<typeof CreateTaskForm>;

const getClientFarms = (clientId: string) => {
  const client = mockClients.find((c: Client) => c.id === clientId);
  if (client) {
    return client.farms.map((farm: any) => ({
      id: farm.id,
      name: farm.name,
      area: farm.size,
      clientId: client.id,
      fields: farm.fields.map((field: any) => ({
        value: field.id,
        label: field.name,
        area: field.area,
        children: field.zones.map((zone: any) => ({
          value: zone.id,
          label: zone.name,
          area: field.area / field.zones.length,
        })),
      })),
      selectedFields: [],
      remainingCount: 0,
      total: farm.fields.reduce(
        (total: number, field: any) => total + field.zones.length,
        0
      ),
      isActive: true,
    }));
  }
  return [];
};

const mockTaskTypes = [
  { value: 'spraying', label: 'Spraying' },
  { value: 'irrigation', label: 'Irrigation' },
];

const mockOrganizations = [
  { value: 'org-1', label: 'AgriTech Team' },
  { value: 'org-2', label: 'FarmOps Crew' },
];

const mockPriorities = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const mockLabs = [
  { value: 'lab-1', label: 'Lab A' },
  { value: 'lab-2', label: 'Lab B' },
];

const initialValues: CreateTaskFormValues = {
  lab: '',
  client: '',
  taskType: '',
  assignedTo: '',
  assignedUser: '',
  priority: '',
  startAfter: '2024-05-10',
  completeBy: '2024-05-10',
  description: '',
};

const CreateTaskFormStory: React.FC = () => {
  const [values, setValues] = useState<CreateTaskFormValues>(initialValues);
  const [selectedFarms, setSelectedFarms] = useState<Record<string, string[]>>(
    {}
  );
  const [currentFarms, setCurrentFarms] = useState<any[]>([]);
  const [attachedFiles] = useState<File[]>([]);
  const [originalValues, setOriginalValues] =
    useState<CreateTaskFormValues>(initialValues);
  const [originalSelectedFarms, setOriginalSelectedFarms] = useState<
    Record<string, string[]>
  >({});

  const clientOptions = mockClients.map((client: Client) => ({
    value: client.id,
    label: client.name,
  }));

  const hasChanges = () => {
    const valuesChanged = Object.keys(values).some(
      (key) =>
        values[key as keyof CreateTaskFormValues] !==
        originalValues[key as keyof CreateTaskFormValues]
    );

    const farmsChanged =
      JSON.stringify(selectedFarms) !== JSON.stringify(originalSelectedFarms);

    return valuesChanged || farmsChanged;
  };

  const handleChange = (field: keyof CreateTaskFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (field === 'client') {
      setSelectedFarms({});
      setCurrentFarms(getClientFarms(value));
    }
  };

  const handleFarmsChange = (farmId: string, selectedFields: string[]) => {
    setSelectedFarms((prev) => ({
      ...prev,
      [farmId]: selectedFields,
    }));
  };

  const handleCancelEditMode = () => {
    setValues(originalValues);
    setSelectedFarms(originalSelectedFarms);
    setCurrentFarms(getClientFarms(originalValues.client));
  };

  const handleSaveChanges = () => {
    setOriginalValues(values);
    setOriginalSelectedFarms(selectedFarms);
    alert(
      `Changes saved:\n${JSON.stringify({ values, selectedFarms }, null, 2)}`
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <CreateTaskForm
          clients={clientOptions}
          taskTypes={mockTaskTypes}
          organizations={mockOrganizations}
          priorities={mockPriorities}
          labs={mockLabs}
          values={values}
          onChange={handleChange}
          onSubmit={(e) => {
            e.preventDefault();
            alert(
              `Submitted:\n${JSON.stringify(
                { values, selectedFarms },
                null,
                2
              )}`
            );
          }}
          farms={currentFarms}
          selectedFarms={selectedFarms}
          onFarmsChange={handleFarmsChange}
          attachedFiles={attachedFiles}
          isDisabled={false}
        />
      </div>

      {hasChanges() && (
        <div className="sticky bottom-0 bg-white py-4 border-t border-basic-white">
          <div className="flex gap-4 px-5">
            <Button
              variant="cancel"
              size="md"
              type="button"
              className="flex-1"
              onClick={handleCancelEditMode}
            >
              Cancel
            </Button>
            <Button
              variant="complete"
              size="md"
              type="button"
              className="flex-1"
              onClick={handleSaveChanges}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <CreateTaskFormStory />,
};
