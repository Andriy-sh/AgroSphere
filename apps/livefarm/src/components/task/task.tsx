'use client';
import {
  TaskDetail,
  ActivityLog,
  ActivityGroupData,
  FarmMap,
  CreateTaskClient,
  getSamplePathsByTaskId,
  Zone,
  FarmMarker,
  SamplePath,
  useTaskDetails,
  useUpdateTask,
  usePatchTask,
  useDeleteTask,
  MapZone,
} from '@@agrosphere/shared';

type TaskDetailsLocal = {
  id: string;
  organisation_name: string;
  organisation_id: number;
  assigned_to_organisation: number | null;
  farmer_name: string;
  task_type: string;
  assigned_to: number;
  task_creator: number;
  farmer_organisation_id: number;
  farms: string;
  lab: string;
  no_of_samples: number;
  farmer_address: string;
  soil_sampler: string | null;
  farmteam_task_number: string;
  id_number: number;
  task_has_not_started_test: boolean;
  task_has_unmatched_samples: boolean;
  task_has_tests_without_lab_result: boolean;
  date: string;
  complete_by: string | null;
  status: string;
  tests: unknown[];
  created_by: number;
  issues_approve_by: number | null;
  reporting_status: string | null;
  combine_task_report: number;
  combine_soil_analysis_report: number;
  advisor: string;
  taskZones?: Record<string, string[]>;
};

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Sample } from '@@agrosphere/shared';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMapStore } from '@/stores/use-map-store';
import { TaskSampleData } from '@/components/task/task-edit-sample';
import { LabSendUpdate } from '@/components/task/lab-send-update';
import { LabImport } from '@/components/task/lab-import';
import { TaskSampleTable } from '@/components/task/task-sample-table';

interface TaskProps {
  taskId: string;
  clientsData?: CreateTaskClient[];
  selectedClient?: CreateTaskClient;
}

export function Task({
  taskId,
  clientsData,
  selectedClient: initialSelectedClient,
}: TaskProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams?.get('from');

  const {
    taskDetails,
    loading: taskLoading,
    getTaskDetails,
  } = useTaskDetails();

  const { deleteTask } = useDeleteTask();
  const { updateTask: updateTaskAPI } = useUpdateTask();
  const { patchTask } = usePatchTask();

  const combinedClientsData = useMemo(() => {
    const clients: CreateTaskClient[] = [];

    if (taskDetails?.task?.farmer) {
      const apiClient: CreateTaskClient = {
        id: taskDetails.task.farmer.id,
        name: taskDetails.task.farmer.name,
        email: '',
        phone: '',
        address: '',
        farms: [],
      };
      clients.push(apiClient);
    }

    if (clientsData) {
      clientsData.forEach((client) => {
        if (!clients.find((c) => c.id === client.id)) {
          clients.push(client);
        }
      });
    }

    return clients;
  }, [taskDetails?.task?.farmer, clientsData]);

  const [selectedClient, setSelectedClient] = useState<
    CreateTaskClient | undefined
  >(initialSelectedClient);

  const convertTestsToSamples = useMemo(() => {
    if (!taskDetails?.task?.tests) return [];

    return taskDetails.task.tests.map((test, index: number) => ({
      id: test.id,
      sampleId: test.sampleId || '',
      testType: test.codes?.[0] || '',
      farm: taskDetails.task.farmer?.name || '',
      parcelId: test.parcelId || '',
      zoneId: test.zoneId || '',
      parcel: test.parcel || '',
      zone: test.zone || '',
      lpisId: test.lpisId || '',
      labOrderId: test.labOrderId || '',
      latitude: test.latitude || '',
      longitude: test.longitude || '',
    }));
  }, [taskDetails?.task?.tests, taskDetails?.task?.farmer]);

  const convertLabTestsToSamples = useMemo(() => {
    if (!taskDetails?.lab_tests) return [];

    return taskDetails.lab_tests.map((labTest, index: number) => ({
      id: labTest.id.toString(),
      sampleId: `G${labTest.id}`,
      testType: labTest.name || '',
      farm: '',
      parcelId: '',
      zoneId: '',
      parcel: '',
      zone: '',
      lpisId: '',
      labOrderId: '',
      latitude: '',
      longitude: '',
    }));
  }, [taskDetails?.lab_tests]);

  const [samplePaths, setSamplePaths] = useState<SamplePath[]>([]);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isLabSendUpdateOpen, setIsLabSendUpdateOpen] = useState(false);
  const [isLabImportOpen, setIsLabImportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);

  const hasCalledApi = useRef(false);
  const currentTaskIdRef = useRef<string | null>(null);
  const { mapSize, setMapSize, validateAndSetMapSize } = useMapStore();

  useEffect(() => {
    validateAndSetMapSize(mapSize, false);
  }, [mapSize, validateAndSetMapSize]);

  useEffect(() => {
    if (mapSize === 0) {
      setMapSize(40);
    }
  }, [mapSize, setMapSize]);

  useEffect(() => {
    if (currentTaskIdRef.current !== taskId) {
      hasCalledApi.current = false;
      currentTaskIdRef.current = taskId;
    }

    if (taskId && !hasCalledApi.current && !taskLoading) {
      hasCalledApi.current = true;
      getTaskDetails(taskId);
    }
  }, [taskId, taskLoading, getTaskDetails]);

  useEffect(() => {
    if (initialSelectedClient) {
      setSelectedClient(initialSelectedClient);
    } else if (taskDetails?.task?.farmer) {
      const apiClient: CreateTaskClient = {
        id: taskDetails.task.farmer.id,
        name: taskDetails.task.farmer.name,
        email: '',
        phone: '',
        address: '',
        farms: [],
      };
      setSelectedClient(apiClient);
    }
  }, [initialSelectedClient, taskDetails?.task?.farmer]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoCoords({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn('Geolocation not supported');
    }
  }, []);

  useEffect(() => {
    if (taskDetails?.task?.id) {
      const paths = getSamplePathsByTaskId(taskDetails.task.id);
      setSamplePaths(paths);
    } else {
      setSamplePaths([]);
    }
  }, [taskDetails?.task?.id]);

  useEffect(() => {
    const clientId = selectedClient?.id || '';

    const parseDate = (dateString: string): Date | null => {
      try {
        let date: Date;

        if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
          date = new Date(dateString);
        } else if (
          dateString.includes('-') &&
          dateString.split('-').length === 3
        ) {
          const parts = dateString.split('-');
          if (parts[2].length <= 4 && !parts[2].includes('T')) {
            const [day, month, year] = parts;
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            date = new Date(dateString);
          }
        } else if (dateString.includes('/')) {
          const [day, month, year] = dateString.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          date = new Date(dateString);
        }

        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    let validatedCompleteBy = taskDetails?.task?.complete_by || '';
    if (taskDetails?.task?.active_date && taskDetails?.task?.complete_by) {
      const startDate = parseDate(taskDetails.task.active_date);
      const completeDate = parseDate(taskDetails.task.complete_by);

      if (startDate && completeDate) {
        if (completeDate < startDate) {
          validatedCompleteBy = '';
        }
      }
    }

    const newInitialFormValues = {
      lab: taskDetails?.task?.lab || '',
      client: clientId,
      taskType:
        taskDetails?.task?.task_type?.toLowerCase().replace(' ', '_') ||
        'soil_sampling',
      assignedTo:
        taskDetails?.task?.assigned_to_organisation?.id?.toString() || '',
      assignedUser:
        taskDetails?.task?.assigned_to_user?.[0]?.id?.toString() || '',
      priority: taskDetails?.task?.priority || 'normal',
      startAfter: taskDetails?.task?.active_date || '',
      completeBy: validatedCompleteBy,
      description: taskDetails?.task?.notes || '',
    };

    setInitialFormValues(newInitialFormValues);
    setFormValues(newInitialFormValues);

    const newInitialSelectedFarms = {};
    setInitialSelectedFarms(newInitialSelectedFarms);
    setSelectedFarms(newInitialSelectedFarms);
  }, [
    taskDetails?.task?.task_type,
    taskDetails?.task?.priority,
    taskDetails?.task?.active_date,
    taskDetails?.task?.complete_by,
    taskDetails?.task?.notes,
    taskDetails?.task?.assigned_to_organisation?.id,
    taskDetails?.task?.assigned_to_user,
    taskDetails?.task?.lab,
    selectedClient?.id,
  ]);

  const [formValues, setFormValues] = useState(() => {
    const clientId = selectedClient?.id || '';

    return {
      lab: taskDetails?.task?.lab || '',
      client: clientId,
      taskType:
        taskDetails?.task?.task_type?.toLowerCase().replace(' ', '_') ||
        'soil_sampling',
      assignedTo:
        taskDetails?.task?.assigned_to_organisation?.id?.toString() || '',
      assignedUser:
        taskDetails?.task?.assigned_to_user?.[0]?.id?.toString() || '',
      priority: taskDetails?.task?.priority || 'normal',
      startAfter: taskDetails?.task?.active_date || '',
      completeBy: taskDetails?.task?.complete_by || '',
      description: taskDetails?.task?.notes || '',
    };
  });

  const [initialFormValues, setInitialFormValues] = useState(() => {
    const clientId = selectedClient?.id || '';

    return {
      lab: taskDetails?.task?.lab || '',
      client: clientId,
      taskType:
        taskDetails?.task?.task_type?.toLowerCase().replace(' ', '_') ||
        'soil_sampling',
      assignedTo:
        taskDetails?.task?.assigned_to_organisation?.id?.toString() || '',
      assignedUser:
        taskDetails?.task?.assigned_to_user?.[0]?.id?.toString() || '',
      priority: taskDetails?.task?.priority || 'normal',
      startAfter: taskDetails?.task?.active_date || '',
      completeBy: taskDetails?.task?.complete_by || '',
      description: taskDetails?.task?.notes || '',
    };
  });

  const [selectedFarms, setSelectedFarms] = useState<Record<string, string[]>>(
    () => {
      // if (taskDetails?.task?.taskZones) {
      //   return taskDetails.task.taskZones;
      // }

      const farms = selectedClient?.farms || [];
      if (farms.length === 0) {
        return {};
      }

      if (farms.length >= 2) {
        const firstFarm = farms[0];

        const result: Record<string, string[]> = {};

        if (
          firstFarm.fields.length > 0 &&
          firstFarm.fields[0].zones.length > 0
        ) {
          const farmId =
            firstFarm.name === 'Main Farm' ? 'UkLWZg9DAJ' : firstFarm.id;
          result[farmId] = [firstFarm.fields[0].zones[0].id];
        }

        return result;
      }
      return {};
    }
  );

  const [initialSelectedFarms, setInitialSelectedFarms] = useState<
    Record<string, string[]>
  >(() => {
    // if (taskDetails?.task?.taskZones) {
    //   return taskDetails.task.taskZones;
    // }

    const farms = selectedClient?.farms || [];
    if (farms.length === 0) {
      return {};
    }

    if (farms.length >= 2) {
      const firstFarm = farms[0];

      const result: Record<string, string[]> = {};

      if (firstFarm.fields.length > 0 && firstFarm.fields[0].zones.length > 0) {
        const farmId =
          firstFarm.name === 'Main Farm' ? 'UkLWZg9DAJ' : firstFarm.id;
        result[farmId] = [firstFarm.fields[0].zones[0].id];
      }

      return result;
    }
    return {};
  });
  const zoomToFarmRef = useRef<((farmId: string) => void) | null>(null);
  const zoomToClientRef = useRef<((clientId: string) => void) | null>(null);
  const zoomToSampleRef = useRef<((sample: Sample) => void) | null>(null);

  useEffect(() => {
    if (selectedClient && formValues.client !== selectedClient.id) {
      setFormValues((prev) => ({
        ...prev,
        client: selectedClient.id,
      }));
    }
  }, [selectedClient, formValues.client]);
  const breadcrumbItems = useMemo(() => {
    if (from === 'lab') {
      return [
        { label: 'Lab orders', href: '/lab' },
        { label: 'All tasks', href: '/tasks' },
        { label: 'Task details' },
      ];
    }
    return [{ label: 'All tasks', href: '/tasks' }, { label: 'Task details' }];
  }, [from]);

  const tabItemsData = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'samples', label: 'Samples' },
      // { id: 'activity-log', label: 'Activity' },
    ],
    []
  );

  const mockCurrentUser = useMemo(
    () => ({
      name: '',
      avatarSrc: '',
    }),
    []
  );

  const [activityLogData, setActivityLogData] = useState<ActivityGroupData[]>(
    []
  );
  const [editingComment, setEditingComment] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [taskStatus, setTaskStatus] = useState('in_progress');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (taskDetails?.task?.status) {
      setTaskStatus(taskDetails.task.status);
    }
  }, [taskDetails?.task?.status]);

  const handleEditTask = (taskId: string) => {
    return;
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      router.push('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskComplete = (taskId: string, completedDate: Date) => {
    setTaskStatus('completed');
  };

  const handleTaskUpdate = (
    taskId: string,
    updatedData: Partial<TaskDetailsLocal>
  ) => {
    if (updatedData.status) {
      setTaskStatus(updatedData.status);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await patchTask(taskId, {
        status: newStatus as
          | 'complete'
          | 'in_progress'
          | 'cancelled'
          | 'not_started',
      });
      setTaskStatus(newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    setActiveTab(tabId);
  };

  const handleFormChange = useCallback(
    (field: string, value: string) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === 'client') {
        const newSelectedClient = combinedClientsData.find(
          (client) => client.id === value
        );
        if (newSelectedClient) {
          setSelectedClient(newSelectedClient);
          setSelectedFarms({});
        }
      }
    },
    [combinedClientsData]
  );

  const handleFarmsChange = (farmId: string, selectedFields: string[]) => {
    setSelectedFarms((prev) => ({
      ...prev,
      [farmId]: selectedFields,
    }));
  };

  const handleUpdateSample = (
    sampleId: string,
    updatedData: TaskSampleData
  ) => {
    setSamples((prevSamples) =>
      prevSamples.map((sample) =>
        sample.sampleId === sampleId
          ? {
              ...sample,
              sampleId: updatedData.sampleId,
              testType: updatedData.testType,
              farm: updatedData.farm,
              parcel: updatedData.parcel,
              zone: updatedData.zone,
              parcelId: updatedData.parcel,
              zoneId: updatedData.zone,
              lpisId: updatedData.lpisId,
              latitude: updatedData.latitude,
              longitude: updatedData.longitude,
            }
          : sample
      )
    );
  };

  const handleDeleteSample = (sampleId: string) => {
    setSamples((prevSamples) =>
      prevSamples.filter((sample) => sample.sampleId !== sampleId)
    );
  };

  const handleSendToLab = () => {
    setIsLabSendUpdateOpen(true);
  };

  const handleConfirmSendToLab = () => {
    setIsLabSendUpdateOpen(false);
  };

  const handleCancelLabOrder = () => {
    return;
  };

  const handleCreateCSV = () => {
    return;
  };

  const handleDownloadCSV = () => {
    return;
  };

  const handleImport = () => {
    setIsLabImportOpen(true);
  };

  const handleSaveImport = () => {
    return;
  };

  const handleSaveAndImport = () => {
    return;
  };

  const handleAddNewComment = (commentText: string) => {
    const newActivity = {
      id: `comment-${Date.now()}`,
      user: mockCurrentUser,
      timestamp: new Date(),
      type: 'comment' as const,
      commentData: {
        id: `comment-${Date.now()}`,
        user: mockCurrentUser,
        timestamp: new Date(),
        commentText: commentText,
        reactions: {
          thumbsUp: 0,
          heart: 0,
        },
        emojiReactions: {},
        userEmojiReactions: {},
      },
    };

    setActivityLogData((prev) => {
      const newGroups = [...prev];
      if (newGroups.length > 0) {
        newGroups[0] = {
          ...newGroups[0],
          activities: [newActivity, ...newGroups[0].activities],
        };
      } else {
        newGroups.push({
          title: 'Today',
          activities: [newActivity],
        });
      }
      return newGroups;
    });
  };

  const handleUpdateComment = (commentId: string, newText: string) => {
    setActivityLogData((prev) => {
      return prev.map((group) => ({
        ...group,
        activities: group.activities.map((activity) => {
          if (
            activity.type === 'comment' &&
            activity.commentData?.id === commentId
          ) {
            return {
              ...activity,
              commentData: {
                ...activity.commentData,
                commentText: newText,
              },
            };
          }
          return activity;
        }),
      }));
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setActivityLogData((prev) => {
      return prev.map((group) => ({
        ...group,
        activities: group.activities.filter((activity) => {
          if (activity.type === 'comment') {
            return activity.commentData?.id !== commentId;
          }
          return true;
        }),
      }));
    });
  };

  const handleAddReaction = (
    commentId: string,
    reactionType: 'thumbsUp' | 'heart'
  ) => {
    setActivityLogData((prev) => {
      return prev.map((group) => ({
        ...group,
        activities: group.activities.map((activity) => {
          if (
            activity.type === 'comment' &&
            activity.commentData?.id === commentId
          ) {
            return {
              ...activity,
              commentData: {
                ...activity.commentData,
                reactions: {
                  thumbsUp: activity.commentData.reactions?.thumbsUp || 0,
                  heart: activity.commentData.reactions?.heart || 0,
                  [reactionType]:
                    (activity.commentData.reactions?.[reactionType] || 0) + 1,
                },
              },
            };
          }
          return activity;
        }),
      }));
    });
  };

  const handleEmojiSelect = (commentId: string, emoji: string) => {
    setActivityLogData((prev) => {
      return prev.map((group) => ({
        ...group,
        activities: group.activities.map((activity) => {
          if (
            activity.type === 'comment' &&
            activity.commentData?.id === commentId
          ) {
            const currentEmojiReactions =
              activity.commentData.emojiReactions || {};
            const currentUserReactions =
              activity.commentData.userEmojiReactions || {};
            const currentCount = currentEmojiReactions[emoji] || 0;
            const hasUserReacted = currentUserReactions[emoji] || false;

            const newUserReactions = {
              ...currentUserReactions,
              [emoji]: !hasUserReacted,
            };

            const newCount = hasUserReacted
              ? currentCount - 1
              : currentCount + 1;

            const newEmojiReactions = { ...currentEmojiReactions };
            if (newCount > 0) {
              newEmojiReactions[emoji] = newCount;
            } else {
              delete newEmojiReactions[emoji];
            }

            const shouldClearSelectedEmoji =
              hasUserReacted &&
              newCount === 0 &&
              activity.commentData.selectedEmoji === emoji;

            return {
              ...activity,
              commentData: {
                ...activity.commentData,
                selectedEmoji: shouldClearSelectedEmoji ? undefined : emoji,
                emojiReactions: newEmojiReactions,
                userEmojiReactions: newUserReactions,
              },
            };
          }
          return activity;
        }),
      }));
    });
  };

  const handleStartEdit = (commentId: string, commentText: string) => {
    if (!commentId) {
      setEditingComment(null);
      return;
    }

    setEditingComment({ id: commentId, text: commentText });
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  const handleCancelEditMode = () => {
    setFormValues(initialFormValues);
    setSelectedFarms(initialSelectedFarms);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const farms = Object.entries(selectedFarms).map(([farmId, fieldIds]) => ({
        hashid: farmId,
      }));

      const updateData = {
        lab: parseInt(formValues.lab) || undefined,
        priority: formValues.priority || 'normal',
        active_date: formValues.startAfter,
        complete_by: formValues.completeBy,
        note: formValues.description,
        farms: farms,
        status: 'in_progress',
      };

      await updateTaskAPI(taskId, updateData);

      setInitialFormValues(formValues);
      setInitialSelectedFarms(selectedFarms);
    } catch (error) {
      console.error('Failed to save task changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'samples':
        return (
          <TaskSampleTable
            samples={
              convertLabTestsToSamples.length > 0
                ? convertLabTestsToSamples
                : convertTestsToSamples
            }
            onDeleteSample={handleDeleteSample}
            onUpdateSample={handleUpdateSample}
            taskId={taskId}
            onSampleClick={handleSampleTableClick}
            selectedSample={selectedSample}
            geoCoords={geoCoords}
            isTaskCompleted={taskStatus === 'completed'}
            farms={farmsForEdit}
            zones={zonesForEdit}
          />
        );

      case 'activity-log':
        return (
          <ActivityLog
            activityGroups={activityLogData}
            currentUser={mockCurrentUser}
            onAddNewComment={handleAddNewComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            onAddReaction={handleAddReaction}
            onEmojiSelect={handleEmojiSelect}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            editingComment={editingComment}
          />
        );
      default:
        return null;
    }
  };

  const handleZoomToFarm = (farmId: string) => {
    if (zoomToFarmRef.current) {
      zoomToFarmRef.current(farmId);
    }
  };

  const handleMapSizeChange = useCallback(
    (size: number) => {
      setMapSize(size);
    },
    [setMapSize]
  );

  const handleSamplePathClick = useCallback(
    (samplePath: SamplePath) => {
      const sample = samples.find((s) => s.sampleId === samplePath.sampleId);
      if (sample) {
        setSelectedSample(sample);
      }
    },
    [samples]
  );

  const handleSampleTableClick = (sample: Sample) => {
    setSelectedSample(sample);

    if (zoomToSampleRef.current) {
      zoomToSampleRef.current(sample);
    }
  };

  const farmsForEdit = useMemo(() => {
    if (!selectedClient) return [];

    return selectedClient.farms.map((farm) => ({
      id: farm.id,
      longitude: farm.longitude,
      latitude: farm.latitude,
      title: farm.name,
      name: farm.name,
      client_name: selectedClient.name,
      address: farm.address,
      size: farm.size,
      crop_type: farm.cropType,
      last_visit: '2024-12-01',
      status: 'active' as const,
      color: '#29b54c',
      clientId: selectedClient.id,
      visible: true,
    }));
  }, [selectedClient]);

  const zonesForEdit = useMemo(() => {
    if (!selectedClient) return [];

    const zones: MapZone[] = [];
    selectedClient.farms.forEach((farm) => {
      farm.fields.forEach((field) => {
        field.zones.forEach((zone) => {
          zones.push({
            id: zone.id,
            name: zone.name,
            cropType: 'Mixed Crops',
            clientId: selectedClient.id,
            farmId: farm.id,
            farmName: farm.name,
            parcelName: field.name,
            fillColor: '#FFFFFF12',
            borderColor: '#FFFFFF',
            fillOpacity: 0.1,
            borderWidth: 1,
            visible: true,
            area: 12.5,
            coordinates: zone.coordinates as [number, number][][][],
            zIndex: 5,
          });
        });
      });
    });

    return zones;
  }, [selectedClient]);

  const StableMap = useMemo(() => {
    if (!selectedClient) return null;

    const showSamplePaths = activeTab === 'samples';

    return (
      <FarmMap
        clients={combinedClientsData}
        selectedClientId={selectedClient.id}
        selectedFarms={selectedFarms}
        onZoomToFarmRef={zoomToFarmRef}
        onZoomToClientRef={zoomToClientRef}
        onZoomToSampleRef={zoomToSampleRef}
        onFarmClick={(farm: FarmMarker) => {
          return;
        }}
        onZoneClick={(zone: Zone) => {
          return;
        }}
        samplePaths={samplePaths}
        onSamplePathClick={handleSamplePathClick}
        showSamplePaths={showSamplePaths}
        showSizeControls={true}
        panelSide="left"
        initialMapSize={mapSize}
        onMapSizeChange={handleMapSizeChange}
        isTaskDetail={true}
        layerVisibility={{
          farmLocations: true,
          farmParcels: true,
          farmZones: true,
          showTasks: false,
        }}
        key="task-detail-map"
      />
    );
  }, [
    selectedClient,
    combinedClientsData,
    selectedFarms,
    zoomToFarmRef,
    zoomToClientRef,
    zoomToSampleRef,
    samplePaths,
    activeTab,
    handleSamplePathClick,
    mapSize,
    handleMapSizeChange,
  ]);

  if (!selectedClient && taskDetails) {
    const fallbackClient: CreateTaskClient = {
      id: taskDetails.task?.id || 'unknown',
      name: taskDetails.task?.farmer?.name || '',
      email: '',
      phone: '',
      address: '',
      farms: [],
    };
    setSelectedClient(fallbackClient);
  }

  return (
    <>
      <div className="flex flex-row w-full h-full max-h-full overflow-hidden gap-2">
        {mapSize === 40 && (
          <div className="flex flex-col flex-1 min-h-0 max-h-full rounded-xl border border-basic-gray-light">
            <div
              className="flex flex-col flex-1 min-h-0 max-h-full rounded-xl bg-white"
              data-list-container
            >
              <TaskDetail
                taskId={taskId}
                taskData={taskDetails}
                breadcrumbItems={breadcrumbItems}
                tabItemsData={tabItemsData}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onTaskComplete={handleTaskComplete}
                onTaskUpdate={handleTaskUpdate}
                onStatusChange={handleStatusChange}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                formValues={formValues}
                selectedFarms={selectedFarms}
                onFormChange={handleFormChange}
                onFarmsChange={handleFarmsChange}
                showTaskTypeDropdown={false}
                clientsData={clientsData}
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
                editingComment={editingComment}
                onCancelEditMode={handleCancelEditMode}
                onSaveChanges={handleSaveChanges}
                sendLaterAlsoSaves={true}
                isSaving={isSaving}
                labs={taskDetails?.labs || []}
              >
                {renderTabContent()}
              </TaskDetail>
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
              {StableMap}
            </div>
          </div>
        )}
      </div>

      <LabSendUpdate
        isOpen={isLabSendUpdateOpen}
        onClose={() => setIsLabSendUpdateOpen(false)}
        onConfirm={handleConfirmSendToLab}
      />

      <LabImport
        isOpen={isLabImportOpen}
        onClose={() => setIsLabImportOpen(false)}
        onSave={handleSaveImport}
        onSaveAndImport={handleSaveAndImport}
      />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
