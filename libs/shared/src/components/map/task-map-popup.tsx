'use client';
import React from 'react';
import { TaskDetails } from '../../types/task';
import { TasksLayer } from './layers/tasks-layer';
import { Map } from './map';

interface TaskMapPopupProps {
  isOpen: boolean;
  task: TaskDetails | null;
  position: { top: number; left: number };
  isVisible: boolean;
  onClose: () => void;
}

export const TaskMapPopup: React.FC<TaskMapPopupProps> = ({
  isOpen,
  task,
  position,
  isVisible,
  onClose,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div
      data-popup="map-popup"
      className="fixed z-[9999] pointer-events-none transition-opacity duration-300"
      style={{
        ...position,
        opacity: isVisible ? 1 : 0.3,
      }}
    >
      <div
        className="w-[410px] h-[550px] bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full">
          <Map
            className="w-full h-full"
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialCenter={
              task?.latitude && task?.longitude
                ? [task.longitude, task.latitude]
                : [-74.006, 40.7128]
            }
            initialZoom={task?.latitude && task?.longitude ? 14 : 10}
            showMapboxControls={false}
            showSearch={true}
            showLayerSelector={false}
          >
            {task && (
              <TasksLayer
                tasks={
                  task
                    ? [
                        {
                          id: task.id,
                          longitude:
                            task.longitude ||
                            -74.006 + (Math.random() - 0.5) * 0.1,
                          latitude:
                            task.latitude ||
                            40.7128 + (Math.random() - 0.5) * 0.1,
                          title: task.task_type || 'Unknown Task',
                          status: task.status,
                          farmer_name: task.farmer_name,
                          task_type: task.task_type || undefined,
                          farmteam_task_number: task.id,
                          complete_by: task.complete_by || undefined,
                          no_of_samples: task.no_of_samples,
                          lab: task.lab,
                          advisor: task.advisor,
                        },
                      ]
                    : []
                }
                onTaskClick={(task) => {
                  return;
                }}
                visible={true}
              />
            )}
          </Map>
        </div>
      </div>
    </div>
  );
};
