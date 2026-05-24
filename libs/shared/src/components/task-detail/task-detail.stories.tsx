import React, { useState } from 'react';
import { TaskDetail } from './task-detail';
import { TaskDetails } from '../../types/task';
import { mockClients, type Client } from '../../mock/mock-clients';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TaskDetail> = {
  title: 'Components/TaskDetail',
  component: TaskDetail,
};
export default meta;

type Story = StoryObj<typeof TaskDetail>;

const testTaskData: TaskDetails = {
  id: '123',
  organisation_name: 'AgroOrg',
  organisation_id: 1,
  assigned_to_organisation: 2,
  farmer_name: 'Marvin McKinney',
  assigned_to: 3,
  task_creator: 4,
  farmer_organisation_id: 5,
  farms: 'Marvin Home Farm',
  lab: 'AgriTech Laboratories',
  no_of_samples: 15,
  farmer_address: '123 Main St',
  soil_sampler: 'Jane Smith',
  farmteam_task_number: 'FT-456',
  id_number: 789,
  task_has_not_started_test: false,
  task_has_unmatched_samples: false,
  task_has_tests_without_lab_result: false,
  date: '2024-05-01',
  complete_by: '2024-05-10',
  status: 'In Progress',
  tests: [],
  created_by: 1,
  issues_approve_by: null,
  reporting_status: 'All good',
  combine_task_report: 0,
  combine_soil_analysis_report: 0,
  advisor: 'Dr. Green',
  task_type: 'Soil Analysis',
  labInfo: {
    labNumber: 'LO-2024-001',
    sentDate: '2024-07-26',
    receivedDate: '2024-07-28',
    status: 'testing',
    labName: 'AgriTech Laboratories',
    clientName: 'Marvin McKinney',
    farmName: 'Marvin Home Farm',
    samplesCount: 15,
    type: 'Soil',
    estimatedCompletionDate: '2024-08-05',
    priority: 'normal',
    contactPerson: 'Dr. Sarah Johnson',
    contactPhone: '+1 (555) 123-4567',
    contactEmail: 'sarah.johnson@agritech.com',
    notes: 'Standard soil analysis with pH, N-P-K, and organic matter testing',
  },
  labOrderNumber: 'LO-2024-001',
  labSentDate: '2024-07-26',
  labReceivedDate: '2024-07-28',
  labStatus: 'testing',
  labType: 'Soil',
  labPriority: 'normal',
  labContactPerson: 'Dr. Sarah Johnson',
  labContactPhone: '+1 (555) 123-4567',
  labContactEmail: 'sarah.johnson@agritech.com',
  labNotes: 'Standard soil analysis with pH, N-P-K, and organic matter testing',
  labEstimatedCompletion: '2024-08-05',
};

const testBreadcrumbItems = [
  { label: 'All Tasks', href: '/tasks' },
  { label: 'Task details' },
];

const testTabItemsData = [
  { id: 'overview', label: 'Overview' },
  { id: 'files', label: 'Files', count: 2 },
  { id: 'comments', label: 'Comments', count: 5 },
];

const mockCurrentUser = {
  name: 'John Doe',
  avatarSrc: undefined,
  avatarInitials: 'JD',
};

const TaskDetailStory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [formValues, setFormValues] = useState({
    lab: testTaskData.lab || '',
    client: 'marvin_mckinney',
    taskType: testTaskData.task_type || 'soil_sampling',
    assignedTo: 'org_1',
    assignedUser: 'user_1',
    priority: 'normal',
    startAfter: testTaskData.date || '',
    completeBy: testTaskData.complete_by || '',
    description: testTaskData.reporting_status || '',
  });
  const [selectedFarms, setSelectedFarms] = useState<Record<string, string[]>>(
    {}
  );

  const selectedClient =
    mockClients.find(
      (client: Client) => client.name === testTaskData.farmer_name
    ) || mockClients[0];

  const handleFormChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFarmsChange = (farmId: string, selectedFields: string[]) => {
    setSelectedFarms((prev) => ({
      ...prev,
      [farmId]: selectedFields,
    }));
  };

  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId);
  };

  const handleTaskComplete = (taskId: string, completedDate: Date) => {
    console.log('Complete task:', taskId, completedDate);
  };

  const handleTaskUpdate = (
    taskId: string,
    updatedData: Partial<TaskDetails>
  ) => {
    console.log('Update task:', taskId, updatedData);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleZoomToFarm = (farmId: string) => {
    console.log('Zoom to farm:', farmId);
  };

  const handleSendToLab = () => {
    console.log('Send to lab');
  };

  const handleCancelLabOrder = () => {
    console.log('Cancel lab order');
  };

  const handleCreateCSV = () => {
    console.log('Create CSV');
  };

  const handleDownloadCSV = () => {
    console.log('Download CSV');
  };

  const handleImport = () => {
    console.log('Import');
  };

  const handleAddNewComment = (commentText: string) => {
    console.log('Add comment:', commentText);
  };

  const handleUpdateComment = (commentId: string, newText: string) => {
    console.log('Update comment:', commentId, newText);
  };

  const handleStartEdit = (commentId: string, commentText: string) => {
    console.log('Start edit comment:', commentId, commentText);
  };

  const handleCancelEdit = () => {
    console.log('Cancel edit comment');
  };

  const handleCancelEditMode = () => {
    console.log('Cancel edit mode');
  };

  const handleSaveChanges = () => {
    console.log('Save changes');
  };

  return (
    <TaskDetail
      taskData={testTaskData}
      breadcrumbItems={testBreadcrumbItems}
      tabItemsData={testTabItemsData}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onTaskComplete={handleTaskComplete}
      onTaskUpdate={handleTaskUpdate}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      formValues={formValues}
      selectedFarms={selectedFarms}
      onFormChange={handleFormChange}
      onFarmsChange={handleFarmsChange}
      showTaskTypeDropdown={false}
      clientsData={mockClients}
      selectedClient={selectedClient}
      onZoomToFarm={handleZoomToFarm}
      onSendToLab={handleSendToLab}
      onCancelLabOrder={handleCancelLabOrder}
      onCreateCSV={handleCreateCSV}
      onDownloadCSV={handleDownloadCSV}
      onImport={handleImport}
      currentUser={mockCurrentUser}
      onAddNewComment={handleAddNewComment}
      onUpdateComment={handleUpdateComment}
      onStartCommentEdit={handleStartEdit}
      onCancelCommentEdit={handleCancelEdit}
      editingComment={null}
      onCancelEditMode={handleCancelEditMode}
      onSaveChanges={handleSaveChanges}
      sendLaterAlsoSaves={true}
      resetExpanded={false}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Tab Content</h3>
        <p>This is the content for the {activeTab} tab.</p>
      </div>
    </TaskDetail>
  );
};

export const Default: Story = {
  render: () => <TaskDetailStory />,
};
